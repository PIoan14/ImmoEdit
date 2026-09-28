/**
 * ServiceDecor – themed background illustration for each service card.
 * Purely decorative: sits behind the card content, stroke color comes from CSS (currentColor).
 */
function GeometryDecor() {
  return (
    <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* blueprint grid */}
      <g strokeWidth="0.6" opacity="0.5">
        {[20, 50, 80, 110, 140, 170, 200, 230].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" />)}
        {[20, 50, 80, 110, 140, 170].map(y => <line key={`h${y}`} x1="0" y1={y} x2="240" y2={y} />)}
      </g>
      {/* perspective box (building in 2-point perspective) */}
      <g strokeWidth="1.6">
        <path d="M110 60 L110 170 M110 60 L60 80 L60 155 L110 170 L180 150 L180 78 Z" />
        <path d="M60 80 L110 60 L180 78" strokeDasharray="0" />
        <path d="M75 100 L95 94 L95 120 L75 125 Z M125 95 L160 88 L160 115 L125 121 Z" strokeWidth="1.1" />
      </g>
      {/* vanishing lines */}
      <g strokeWidth="0.8" strokeDasharray="4 4" opacity="0.8">
        <line x1="110" y1="60" x2="10" y2="120" />
        <line x1="110" y1="170" x2="10" y2="120" />
        <line x1="180" y1="78" x2="236" y2="118" />
        <line x1="180" y1="150" x2="236" y2="118" />
      </g>
      {/* protractor arc + angle */}
      <g strokeWidth="1.2">
        <path d="M150 190 A40 40 0 0 1 230 190" />
        <line x1="190" y1="190" x2="190" y2="150" />
        <line x1="190" y1="190" x2="220" y2="162" />
        {[0, 1, 2, 3, 4, 5, 6].map(i => {
          const a = Math.PI - (i * Math.PI) / 6;
          return <line key={i} x1={190 + 40 * Math.cos(a)} y1={190 - 40 * Math.sin(a)} x2={190 + 34 * Math.cos(a)} y2={190 - 34 * Math.sin(a)} />;
        })}
      </g>
      {/* set-square */}
      <path d="M20 190 L20 140 L70 190 Z M30 180 L30 164 L46 180 Z" strokeWidth="1.3" />
      {/* dimension line */}
      <g strokeWidth="1">
        <line x1="60" y1="38" x2="180" y2="38" />
        <line x1="60" y1="32" x2="60" y2="44" />
        <line x1="180" y1="32" x2="180" y2="44" />
        <path d="M66 35 L60 38 L66 41 M174 35 L180 38 L174 41" />
      </g>
      <text x="112" y="31" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace">90.0°</text>
    </svg>
  );
}

function NatureDecor() {
  return (
    <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* sun + rays */}
      <circle cx="190" cy="45" r="18" strokeWidth="1.6" />
      <g strokeWidth="1.3">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i * Math.PI) / 5;
          return <line key={i} x1={190 + 25 * Math.cos(a)} y1={45 + 25 * Math.sin(a)} x2={190 + 33 * Math.cos(a)} y2={45 + 33 * Math.sin(a)} />;
        })}
      </g>
      {/* clouds */}
      <path d="M40 50 a12 12 0 0 1 22 -6 a14 14 0 0 1 26 6 a9 9 0 0 1 0 18 h-48 a9 9 0 0 1 0 -18 Z" strokeWidth="1.3" />
      <path d="M120 28 a8 8 0 0 1 15 -4 a10 10 0 0 1 18 4 a6 6 0 0 1 0 12 h-33 a6 6 0 0 1 0 -12 Z" strokeWidth="1.1" />
      {/* birds */}
      <path d="M100 70 q5 -5 10 0 q5 -5 10 0 M130 58 q4 -4 8 0 q4 -4 8 0" strokeWidth="1.1" />
      {/* hills */}
      <path d="M0 150 C40 118 80 118 120 140 C160 162 200 120 240 128" strokeWidth="1.6" />
      <path d="M0 175 C50 150 110 160 150 172 C190 184 215 160 240 165" strokeWidth="1.3" />
      {/* pine trees */}
      <g strokeWidth="1.4">
        <path d="M40 150 L40 160 M28 150 L40 118 L52 150 Z M31 140 L49 140 M34 130 L46 130" />
        <path d="M62 142 L62 150 M53 142 L62 116 L71 142 Z" />
      </g>
      {/* round tree */}
      <g strokeWidth="1.4">
        <circle cx="200" cy="112" r="16" />
        <path d="M200 128 L200 150 M200 138 L192 130 M200 134 L207 127" />
      </g>
      {/* grass tufts */}
      <g strokeWidth="1.1">
        <path d="M100 185 l3 -10 l3 10 l3 -8 l3 8" />
        <path d="M160 192 l3 -9 l3 9 l3 -7 l3 7" />
        <path d="M20 192 l2 -7 l2 7 l2 -6 l2 6" />
      </g>
      {/* leaf */}
      <path d="M140 100 C150 84 172 84 176 90 C170 104 152 108 140 100 Z M140 100 L168 90" strokeWidth="1.2" />
    </svg>
  );
}

function HumanDecor() {
  return (
    <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* crop marks framing a photo */}
      <g strokeWidth="1.6">
        <path d="M60 40 L60 60 M60 40 L80 40" />
        <path d="M200 40 L220 40 M220 40 L220 60" />
        <path d="M60 150 L60 170 L80 170" />
        <path d="M220 150 L220 170 L200 170" />
      </g>
      {/* window inside the frame (HDR window pull) */}
      <g strokeWidth="1.2">
        <rect x="120" y="70" width="60" height="70" rx="2" />
        <line x1="150" y1="70" x2="150" y2="140" />
        <line x1="120" y1="105" x2="180" y2="105" />
      </g>
      {/* pencil */}
      <g strokeWidth="1.5">
        <path d="M30 185 L40 160 L110 90 L125 105 L55 175 Z" />
        <path d="M30 185 L36 170 L45 179 Z" />
        <line x1="100" y1="100" x2="115" y2="115" />
      </g>
      {/* brush stroke / freehand retouch */}
      <path d="M90 60 C105 45 120 72 135 55 C148 42 160 60 172 50" strokeWidth="2.2" opacity="0.8" />
      {/* retouch brush circle */}
      <g strokeWidth="1.2">
        <circle cx="200" cy="120" r="14" strokeDasharray="3 3" />
        <line x1="200" y1="114" x2="200" y2="126" />
        <line x1="194" y1="120" x2="206" y2="120" />
      </g>
      {/* sparkles */}
      <g strokeWidth="1.3">
        <path d="M100 150 L100 166 M92 158 L108 158" />
        <path d="M190 18 L190 30 M184 24 L196 24" />
        <path d="M30 70 L30 80 M25 75 L35 75" />
      </g>
      {/* colour sliders */}
      <g strokeWidth="1.2">
        <line x1="140" y1="182" x2="220" y2="182" />
        <circle cx="175" cy="182" r="4" />
        <line x1="140" y1="194" x2="220" y2="194" />
        <circle cx="200" cy="194" r="4" />
      </g>
    </svg>
  );
}

const DECORS = { geometry: GeometryDecor, nature: NatureDecor, human: HumanDecor };

export default function ServiceDecor({ svcId }) {
  const Decor = DECORS[svcId];
  if (!Decor) return null;
  return (
    <div className={`svc-decor svc-decor-${svcId}`} aria-hidden="true">
      <Decor />
    </div>
  );
}

/**
 * SectionDecor – the same illustrations scattered faintly across a section's background.
 * `layout` mirrors the placement so consecutive sections don't look identical.
 */
const SECTION_PIECES = {
  a: [
    { svcId: 'geometry', pos: 'tl' },
    { svcId: 'nature',   pos: 'mr' },
    { svcId: 'human',    pos: 'bl' },
  ],
  b: [
    { svcId: 'nature',   pos: 'tr' },
    { svcId: 'geometry', pos: 'ml' },
    { svcId: 'human',    pos: 'br' },
  ],
};

export function SectionDecor({ layout = 'a' }) {
  return (
    <div className="section-decor" aria-hidden="true">
      {SECTION_PIECES[layout].map(({ svcId, pos }) => {
        const Decor = DECORS[svcId];
        return (
          <div key={svcId} className={`section-decor-piece pos-${pos} svc-decor-${svcId}`}>
            <Decor />
          </div>
        );
      })}
    </div>
  );
}
