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

// Fake before/after demo pairs matching the 3 services exactly
export const DEMO_PAIRS = [
  {
    id: 'geometry',
    svcId: 'geometry',
    icon: '📐',
    label: 'Corecție Geometrică',
    shortLabel: 'Geometrie',
    price: '€8 / foto',
    beforeImg: '/demo/geometry.png',
    afterImg: '/demo/geometry.png',
    beforeStyle: {
      transform: 'perspective(900px) rotateY(-6.5deg) rotateX(4.5deg) scale(1.08) rotate(-1.5deg)',
      filter: 'contrast(0.95)',
    },
    afterStyle: {
      transform: 'none',
      filter: 'contrast(1.04)',
    },
    beforeBadges: [
      '❌ Distorsiune Perspectivă (-6.5°)',
      '❌ Linii Verticale Înclinat/Strâmbe',
      '❌ Orizont Ne-nivelat (-1.5°)',
    ],
    afterBadges: [
      '✓ Linii Verticale 90° Perfect Drept',
      '✓ Corecție Perspectivă Keystone (0.0°)',
      '✓ Nivel Orizont & Distorsiune Aliniată',
    ],
    desc: 'Corectăm milimetric pereții înclinați, liniile strâmbe ale ferestrelor și distorsiunea de perspectivă produsă de camerele de telefon.',
  },
  {
    id: 'nature',
    svcId: 'nature',
    icon: '🌤️',
    label: 'Transformare Natură',
    shortLabel: 'Natură',
    price: '€12 / foto',
    beforeImg: '/demo/nature.png',
    afterImg: '/demo/nature.png',
    beforeStyle: {
      filter: 'brightness(0.82) contrast(0.9) saturate(0.42) hue-rotate(15deg)',
    },
    afterStyle: {
      filter: 'brightness(1.08) contrast(1.05) saturate(1.3)',
    },
    beforeBadges: [
      '❌ Cer Înnorat / Gri Apăsător',
      '❌ Gazon & Iarbă Mată / Uscată',
      '❌ Ambient Plat - Fără Umbre Calde',
    ],
    afterBadges: [
      '✓ Cer Albastru Însorit (Sky Replacement)',
      '✓ Gazon & Copaci Verde Intens',
      '✓ Iluminare Exterioară Naturală',
    ],
    desc: 'Înlocuim cerul gri înnorat cu un cer senin de vară, intensificăm verdeața gazonului și oferim luminozitate naturală exterioară.',
  },
  {
    id: 'human',
    svcId: 'human',
    icon: '✏️',
    label: 'Editor Uman',
    shortLabel: 'Editor',
    price: '€20 / foto',
    beforeImg: '/demo/human.png',
    afterImg: '/demo/human.png',
    beforeStyle: {
      filter: 'sepia(0.28) hue-rotate(-22deg) contrast(1.18) brightness(0.85)',
    },
    afterStyle: {
      filter: 'brightness(1.04) contrast(1.02) saturate(1.1)',
    },
    beforeBadges: [
      '❌ Geamuri Arse (Alb Fără Vedere)',
      '❌ Dominantă Galbenă de Bec',
      '❌ Umbre Întunecate & Detalii Pierdute',
    ],
    afterBadges: [
      '✓ Vedere Geamuri Recuperată (HDR Window Pull)',
      '✓ Retuș Manual Cabluri & Detalii',
      '✓ Balanță de Alb & Luminozitate Naturală',
    ],
    desc: 'Un editor foto imobiliar profesionist preia poza ta și efectuează un retuș manual amănunțit: HDR window pull, eliminare cabluri și balanță perfectă de alb.',
  },
];

export const HOW_STEPS = [
  { num: '1', title: 'Încarci pozele', desc: 'Upload simplu, multiple poze acceptate simultan de pe telefon sau PC.' },
  { num: '2', title: 'Alegi serviciul', desc: 'Selectezi pentru fiecare poză: geometrie, natură sau editor uman.' },
  { num: '3', title: 'Plătești & aștepți', desc: 'Procesare rapidă 24-48h. Primești notificare pe email când sunt gata.' },
  { num: '4', title: 'Aprobi sau respingi', desc: 'Preview protejat cu like/dislike. O regenerare gratuită garantată.' },
];

