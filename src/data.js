// ─── Constants / Config ──────────────────────────────────────────────────────

export const SERVICES = [
  {
    id: 'geometry',
    icon: '📐',
    label: 'Corecție Geometrică',
    shortLabel: 'Geometrie',
    desc: 'Corectăm perspectiva, nivelul orizontului și distorsiunile de obiectiv – exact cum ar face un fotograf imobiliar profesionist.',
    price: 8,
    priceLabel: '€8 / foto',
    badge: 'popular',
    badgeText: 'Popular',
    cardClass: 'geom',
    features: ['Corecție perspectivă', 'Nivel orizont', 'Distorsiune obiectiv', 'Crop optimizat'],
  },
  {
    id: 'nature',
    icon: '🌤️',
    label: 'Transformare Natură',
    shortLabel: 'Natură',
    desc: 'Înlocuim cerul înnorat cu cer senin, adăugăm verdeață, îmbunătățim iluminarea exterioară – transformare completă a ambianței.',
    price: 12,
    priceLabel: '€12 / foto',
    badge: 'new',
    badgeText: 'Nou',
    cardClass: 'nature',
    features: ['Înlocuire cer', 'Echilibrare lumină', 'Verdea\u021b\u0103 îmbun\u0103t\u0103\u021bit\u0103', 'Tonuri naturale'],
  },
  {
    id: 'human',
    icon: '✏️',
    label: 'Editor Uman',
    shortLabel: 'Editor',
    desc: 'Poza ajunge direct la un editor profesionist care realizează retușul manual, cu atenție la fiecare detaliu al proprietății.',
    price: 20,
    priceLabel: '€20 / foto',
    badge: 'pro',
    badgeText: 'Pro',
    cardClass: 'human',
    features: ['Editor dedicat', 'Retuș complet manual', 'Consultare personalizată', 'Garanție satisfacție'],
  },
];

export const SVC_MAP = Object.fromEntries(SERVICES.map(s => [s.id, s]));

// Fake before/after demo pairs  
export const DEMO_PAIRS = [
  {
    id: 'living',
    label: 'Living Room – Corecție Geometrică',
    before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=820&q=70',
    after:  'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=820&q=70',
  },
  {
    id: 'exterior',
    label: 'Exterior – Transformare Cer',
    before: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=820&q=70',
    after:  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=820&q=70',
  },
  {
    id: 'bedroom',
    label: 'Dormitor – Editor Uman',
    before: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=820&q=70',
    after:  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=820&q=70',
  },
];

// Fake portfolio items for demo
export const DEMO_PORTFOLIO = [
  { id: 'p1', name: 'Ap. Herastrau – Living', svc: 'geometry',  before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60', after: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&q=60' },
  { id: 'p2', name: 'Vila Pipera – Exterior', svc: 'nature',    before: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=60', after: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=60' },
  { id: 'p3', name: 'Penthouse Floreasca',   svc: 'human',     before: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=60', after: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=60' },
  { id: 'p4', name: 'Casa Snagov – Dormitor',svc: 'geometry',  before: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&q=60', after: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=60' },
  { id: 'p5', name: 'Apartament Dorobanți',  svc: 'nature',    before: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=60', after: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=60' },
  { id: 'p6', name: 'Loft Victoriei – Bucătărie', svc: 'human', before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=60', after: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=400&q=60' },
];

export const HOW_STEPS = [
  { num: '1', title: 'Încarci pozele', desc: 'Upload simplu, multiple poze acceptate simultan de pe telefon sau PC.' },
  { num: '2', title: 'Alegi serviciul', desc: 'Selectezi pentru fiecare poză: geometrie, natură sau editor uman.' },
  { num: '3', title: 'Plătești & aștepți', desc: 'Procesare rapidă 24-48h. Primești notificare pe email când sunt gata.' },
  { num: '4', title: 'Aprobi sau respingi', desc: 'Preview protejat cu like/dislike. O regenerare gratuită garantată.' },
];
