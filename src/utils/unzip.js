// Minimal ZIP reader for the /getProducts response.
// Supports "stored" (0) and "deflate" (8) entries, which covers Python's
// zipfile with ZIP_STORED / ZIP_DEFLATED. Uses the browser's native
// DecompressionStream, so no extra dependency is needed.

const MIME = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  webp: 'image/webp', gif: 'image/gif', avif: 'image/avif',
};

export const mimeFor = (name) => MIME[name.split('.').pop().toLowerCase()] || 'application/octet-stream';

async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Returns [{ name, blob }] for every file entry in the archive. */
export async function unzip(buffer) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder();

  // Locate the End Of Central Directory record (scan backwards past any comment).
  let eocd = -1;
  for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Arhivă ZIP invalidă');

  const count = view.getUint16(eocd + 10, true);
  let ptr = view.getUint32(eocd + 16, true);
  const entries = [];

  for (let n = 0; n < count; n++) {
    if (view.getUint32(ptr, true) !== 0x02014b50) throw new Error('Arhivă ZIP coruptă');
    const method     = view.getUint16(ptr + 10, true);
    const compSize   = view.getUint32(ptr + 20, true);
    const nameLen    = view.getUint16(ptr + 28, true);
    const extraLen   = view.getUint16(ptr + 30, true);
    const commentLen = view.getUint16(ptr + 32, true);
    const localOff   = view.getUint32(ptr + 42, true);
    const name = decoder.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));
    ptr += 46 + nameLen + extraLen + commentLen;

    if (name.endsWith('/')) continue; // directory

    const dataStart = localOff + 30 + view.getUint16(localOff + 26, true) + view.getUint16(localOff + 28, true);
    const raw = bytes.subarray(dataStart, dataStart + compSize);

    let data;
    if (method === 0) data = raw;
    else if (method === 8) data = await inflateRaw(raw);
    else throw new Error(`Metodă de compresie nesuportată (${method})`);

    entries.push({ name: name.split('/').pop(), blob: new Blob([data], { type: mimeFor(name) }) });
  }

  return entries;
}
