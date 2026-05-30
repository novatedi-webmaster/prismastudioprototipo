import type {
  ContentModule,
  Page,
  Section,
  LayoutPreset,
  PublicTheme,
  Asset,
  Work,
  MarketplaceItem,
  License,
  User
} from '../types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Antonio Carballo',
  email: 'antonio.carballo@art.es'
};

export const mockLicense: License = {
  status: 'active',
  plan: 'Prisma Soberano Pro',
  renewsAt: '2027-01-15'
};

// Generar ~60 assets (imágenes de esculturas, herramientas, materiales, bocetos)
export const mockAssets: Asset[] = [
  { id: 'asset-1', name: 'Maternidad_bronce_frontal.jpg', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80', category: 'Esculturas', sizeBytes: 2450000 },
  { id: 'asset-2', name: 'Estudio_torso_marmol.jpg', url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop&q=80', category: 'Esculturas', sizeBytes: 3100000 },
  { id: 'asset-3', name: 'Veta_marmol_carrara.jpg', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80', category: 'Materiales', sizeBytes: 1800000 },
  { id: 'asset-4', name: 'Taller_herramientas_cincel.jpg', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80', category: 'Taller', sizeBytes: 1500000 },
  { id: 'asset-5', name: 'Boceto_silueta_carboncillo.jpg', url: 'https://images.unsplash.com/photo-1576016770956-debb63d900ee?w=800&auto=format&fit=crop&q=80', category: 'Bocetos', sizeBytes: 920000 },
  { id: 'asset-6', name: 'Exposicion_galeria_madrid.jpg', url: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=800&auto=format&fit=crop&q=80', category: 'Exposiciones', sizeBytes: 4200000 },
  { id: 'asset-7', name: 'Escultura_madera_olivo.jpg', url: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&auto=format&fit=crop&q=80', category: 'Esculturas', sizeBytes: 2150000 },
  { id: 'asset-8', name: 'Antonio_tallando_marmol.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80', category: 'Taller', sizeBytes: 2800000 },
  { id: 'asset-9', name: 'Prensa_el_pais_recorte.jpg', url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80', category: 'Prensa', sizeBytes: 1100000 },
  { id: 'asset-10', name: 'Bronce_fundicion_crisol.jpg', url: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=800&auto=format&fit=crop&q=80', category: 'Taller', sizeBytes: 3400000 },
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `asset-gen-${i + 11}`,
    name: `obra_generada_${i + 1}.jpg`,
    url: `https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&auto=format&fit=crop&q=80&sig=${i}`,
    category: i % 4 === 0 ? 'Esculturas' : i % 4 === 1 ? 'Materiales' : i % 4 === 2 ? 'Taller' : 'Bocetos',
    sizeBytes: Math.floor(1000000 + (i * 27500))
  }))
];

// Obras (171 obras para Antonio Carballo)
const categories = ['Bronce', 'Mármol', 'Madera', 'Esculturas de Piedra', 'Modelados'];
const materialsList = [
  'Bronce fundido a la cera perdida',
  'Mármol blanco de Carrara tallado a mano',
  'Madera de olivo centenario pulido',
  'Piedra caliza de Almería',
  'Terracota policromada',
  'Hierro forjado y resina'
];
const dimensionsList = [
  '85 x 45 x 30 cm',
  '120 x 60 x 50 cm',
  '45 x 20 x 20 cm',
  '210 x 90 x 90 cm',
  '65 x 30 x 25 cm',
  '160 x 80 x 70 cm'
];

export const mockWorks: Work[] = [
  {
    id: 'work-1',
    title: 'Maternidad II',
    category: 'Bronce',
    year: 2021,
    materials: 'Bronce fundido a la cera perdida con pátina verde',
    dimensions: '85 x 45 x 30 cm',
    priceCents: 1250000,
    images: [mockAssets[0]!.url, mockAssets[9]!.url],
    featured: true
  },
  {
    id: 'work-2',
    title: 'Torso de Carrara',
    category: 'Mármol',
    year: 2022,
    materials: 'Mármol blanco de Carrara tallado a cincel',
    dimensions: '120 x 60 x 50 cm',
    priceCents: 2400000,
    images: [mockAssets[1]!.url, mockAssets[2]!.url],
    featured: true
  },
  {
    id: 'work-3',
    title: 'Silueta del Viento',
    category: 'Madera',
    year: 2020,
    materials: 'Madera de olivo centenario y base de acero',
    dimensions: '160 x 40 x 40 cm',
    priceCents: 850000,
    images: [mockAssets[6]!.url],
    featured: true
  },
  {
    id: 'work-4',
    title: 'Éxtasis y Reposo',
    category: 'Modelados',
    year: 2023,
    materials: 'Terracota policromada con pigmentos naturales',
    dimensions: '65 x 35 x 30 cm',
    priceCents: 520000,
    images: [mockAssets[4]!.url],
    featured: false
  },
  {
    id: 'work-5',
    title: 'Génesis de la Piedra',
    category: 'Esculturas de Piedra',
    year: 2019,
    materials: 'Piedra caliza de Almería tallada',
    dimensions: '190 x 80 x 80 cm',
    priceCents: 1500000,
    images: [mockAssets[1]!.url],
    featured: true
  },
  ...Array.from({ length: 166 }, (_, i) => {
    const idx = i + 6;
    const cat = categories[i % categories.length]!;
    const year = 2010 + (i % 15);
    const price = 300000 + (i * 12500);
    const title = `${cat} - Estudio nº ${idx}`;
    return {
      id: `work-${idx}`,
      title,
      category: cat,
      year,
      materials: materialsList[i % materialsList.length]!,
      dimensions: dimensionsList[i % dimensionsList.length]!,
      priceCents: price,
      images: [mockAssets[Math.min(9, i % mockAssets.length)]!.url],
      featured: i % 25 === 0
    };
  })
];

// Presets de visualización por tipo de sección (layout presets)
export const mockLayoutPresets: LayoutPreset[] = [
  // Presets para Hero
  { id: 'hero-split', sectionType: 'hero', name: 'Layout Dividido (Split)', description: 'Título a la izquierda e imagen de gran formato a la derecha con fondo limpio.' },
  { id: 'hero-centered', sectionType: 'hero', name: 'Layout Centrado', description: 'Título centrado con imagen gigante de fondo y overlay semitransparente.' },
  { id: 'hero-minimal', sectionType: 'hero', name: 'Layout Minimalista Extremo', description: 'Sin imagen de fondo, tipografía masiva con espaciado amplio y botón sutil.' },
  // Presets para Galería/Obras
  { id: 'gallery-grid', sectionType: 'gallery', name: 'Cuadrícula de 3 Columnas', description: 'Diseño clásico geométrico y equilibrado para obras de arte.' },
  { id: 'gallery-masonry', sectionType: 'gallery', name: 'Muro Masonry Orgánico', description: 'Disposición libre con alturas variables. Ideal para piezas de diferentes proporciones.' },
  { id: 'gallery-editorial', sectionType: 'gallery', name: 'Listado Editorial', description: 'Fila por obra con datos técnicos visibles a la izquierda y fotos asimétricas.' },
  // Presets para Sobre Mí
  { id: 'about-classic', sectionType: 'about', name: 'Biografía con Firma', description: 'Texto explicativo ancho con foto retrato a la izquierda y firma manuscrita abajo.' },
  { id: 'about-asymmetric', sectionType: 'about', name: 'Mosaico de Taller', description: 'Texto alternando con un díptico de fotos del proceso creativo en el estudio.' },
  // Presets para Exposiciones
  { id: 'exhibitions-timeline', sectionType: 'exhibitions', name: 'Línea de Tiempo Vertical', description: 'Fechas marcadas a la izquierda y tarjetas descriptivas en orden cronológico.' },
  { id: 'exhibitions-cards', sectionType: 'exhibitions', name: 'Tarjetas de Museos', description: 'Cuadrícula elegante destacando el nombre de la institución y ubicación.' }
];

// 24 Módulos de Contenido (Módulos de datos puros que edita el usuario)
export const mockContentModules: ContentModule[] = [
  {
    key: 'cabecera',
    label: 'Cabecera de Navegación',
    order: 1,
    fields: [
      { key: 'brand', label: 'Nombre Comercial / Firma', type: 'text', value: 'Antonio Carballo' },
      { key: 'link1', label: 'Enlace 1', type: 'text', value: 'Inicio' },
      { key: 'link2', label: 'Enlace 2', type: 'text', value: 'Sobre Mí' },
      { key: 'link3', label: 'Enlace 3', type: 'text', value: 'El Portfolio' },
      { key: 'link4', label: 'Enlace 4', type: 'text', value: 'Exposiciones' },
      { key: 'link5', label: 'Enlace 5', type: 'text', value: 'Contacto' },
      { key: 'show_logo', label: 'Mostrar logotipo en lugar de texto', type: 'boolean', value: false }
    ]
  },
  {
    key: 'hero',
    label: 'Portada de Inicio (Hero)',
    order: 2,
    fields: [
      { key: 'title', label: 'Título Principal', type: 'text', value: 'Antonio Carballo' },
      { key: 'subtitle', label: 'Subtítulo Profesional', type: 'textarea', value: 'Escultor de la materia y el vacío. Obras contemporáneas en bronce, mármol y madera centenaria talladas con calma.' },
      { key: 'cta_text', label: 'Texto Botón Principal', type: 'text', value: 'Explorar Esculturas' },
      { key: 'cta_url', label: 'Enlace Botón Principal', type: 'url', value: '#obras' },
      { key: 'bg_image', label: 'Imagen de Fondo / Principal', type: 'image', value: mockAssets[0]!.url },
      { key: 'show_stats', label: 'Mostrar pequeño contador destacado', type: 'boolean', value: true }
    ]
  },
  {
    key: 'biografia',
    label: 'Sobre Mí / Biografía',
    order: 3,
    fields: [
      { key: 'section_title', label: 'Título Sección', type: 'text', value: 'La huella del cincel' },
      { key: 'paragraph1', label: 'Primer Párrafo', type: 'textarea', value: 'Nacido en Jaén en 1964, mi relación con la escultura comenzó en el taller de mi abuelo carpintero. La madera y la piedra siempre me hablaron de forma directa, pidiéndome rescatar las figuras ocultas en su interior.' },
      { key: 'paragraph2', label: 'Segundo Párrafo', type: 'textarea', value: 'Hoy en día, desde mi estudio en la sierra de Madrid, exploro la dualidad de la fuerza bruta frente a la fragilidad de la línea. Cada obra es un diálogo pausado que puede durar meses o años, respetando el ritmo biológico del material.' },
      { key: 'author_photo', label: 'Foto de Antonio Carballo', type: 'image', value: mockAssets[7]!.url },
      { key: 'signature_text', label: 'Texto de Firma', type: 'text', value: 'A. Carballo, Escultor' }
    ]
  },
  {
    key: 'obras_destacadas',
    label: 'Sección Obras Destacadas',
    order: 4,
    fields: [
      { key: 'title', label: 'Título Sección', type: 'text', value: 'Piezas Emblemáticas' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', value: 'Una selección de esculturas galardonadas en colecciones privadas e instituciones públicas.' },
      { key: 'max_items', label: 'Número de obras a mostrar', type: 'number', value: 4 }
    ]
  },
  {
    key: 'galeria_obras',
    label: 'Catálogo de Esculturas',
    order: 5,
    fields: [
      { key: 'title', label: 'Título Catálogo', type: 'text', value: 'Colección Completa' },
      { key: 'show_filters', label: 'Permitir filtrar por material', type: 'boolean', value: true },
      { key: 'show_prices', label: 'Mostrar precios a coleccionistas interesados', type: 'boolean', value: false },
      { key: 'inquiry_text', label: 'Texto botón de consulta', type: 'text', value: 'Consultar Disponibilidad' }
    ]
  },
  {
    key: 'exposiciones',
    label: 'Exposiciones y Galerías',
    order: 6,
    fields: [
      { key: 'title', label: 'Título Sección', type: 'text', value: 'Exposiciones Recientes' },
      { key: 'subtitle', label: 'Subtítulo Informativo', type: 'textarea', value: 'Puntos de encuentro donde experimentar la volumetría y las texturas en el espacio real.' }
    ],
    items: [
      { id: 'exp-1', title: 'Silencio y Materia', place: 'Galería Marlborough, Madrid', date: 'Mayo - Julio 2025', active: true },
      { id: 'exp-2', title: 'Formas del Olivo', place: 'Museo de Arte Contemporáneo, Jaén', date: 'Enero 2025', active: false },
      { id: 'exp-3', title: 'Bienal Internacional de Escultura', place: 'Jardines de las Esculturas, Barcelona', date: 'Octubre 2024', active: false }
    ]
  },
  {
    key: 'cronologia',
    label: 'Cronología y Trayectoria',
    order: 7,
    fields: [
      { key: 'title', label: 'Título', type: 'text', value: 'Cronología Profesional' },
      { key: 'start_year', label: 'Año de Inicio de Carrera', type: 'number', value: 1988 }
    ],
    items: [
      { year: '1988', milestone: 'Graduación en la Escuela de Bellas Artes de San Fernando, Madrid.' },
      { year: '1995', milestone: 'Primer Premio Nacional de Escultura en Bronce.' },
      { year: '2005', milestone: 'Traslado del taller a la Sierra de Guadarrama, buscando el contacto con la piedra pura.' },
      { year: '2018', milestone: 'Monografía publicada por la Editorial del Círculo de Bellas Artes.' }
    ]
  },
  {
    key: 'filosofia',
    label: 'Filosofía Artística',
    order: 8,
    fields: [
      { key: 'quote', label: 'Cita Destacada', type: 'textarea', value: '"El escultor no impone su voluntad sobre el bloque; simplemente retira con delicadeza la parte sobrante que le impide respirar."' },
      { key: 'concept_title', label: 'Título del concepto', type: 'text', value: 'El respeto al alma de la piedra' },
      { key: 'concept_desc', label: 'Explicación', type: 'textarea', value: 'No utilizo robots de desbaste ni técnicas automatizadas. Todo el proceso es artesanal, utilizando cincel, maza y lijas de agua de grano fino para conseguir una textura orgánica al tacto.' }
    ]
  },
  {
    key: 'prensa',
    label: 'Prensa y Publicaciones',
    order: 9,
    fields: [
      { key: 'title', label: 'Sección de Prensa', type: 'text', value: 'Menciones y Críticas' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', value: 'Lo que dicen los críticos de arte y los medios impresos sobre la obra de Antonio Carballo.' }
    ],
    items: [
      { id: 'press-1', media: 'El País Semanal', headline: 'La majestuosidad del silencio tallada en bronce por Antonio Carballo', date: 'Marzo 2024', link: 'https://elpais.com' },
      { id: 'press-2', media: 'Descubrir el Arte', headline: 'Antonio Carballo: el escultor que susurra al mármol de Carrara', date: 'Julio 2023', link: 'https://descubrirelarte.es' }
    ]
  },
  {
    key: 'premios',
    label: 'Premios y Reconocimientos',
    order: 10,
    fields: [
      { key: 'title', label: 'Título', type: 'text', value: 'Distinciones' }
    ],
    items: [
      { year: '2022', prize: 'Medalla de Oro de las Bellas Artes de Andalucía' },
      { year: '2014', prize: 'Premio Ciudad de Alcalá de Escultura Monumental' }
    ]
  },
  {
    key: 'testimonios',
    label: 'Testimonios de Coleccionistas',
    order: 11,
    fields: [
      { key: 'title', label: 'Título', type: 'text', value: 'Palabras de Coleccionistas' }
    ],
    items: [
      { author: 'Helena van der Veen', role: 'Coleccionista Privada (Ámsterdam)', text: 'Adquirir la pieza "Maternidad I" cambió la energía de nuestro salón. La calidez del bronce pulido atrae todas las miradas.' },
      { author: 'Dr. Francisco Segura', role: 'Fundación Segura-Art', text: 'El rigor técnico y la coherencia poética de Antonio Carballo lo convierten en una de las firmas más sólidas de la escultura nacional actual.' }
    ]
  },
  {
    key: 'taller',
    label: 'El Taller / El Proceso',
    order: 12,
    fields: [
      { key: 'title', label: 'Título Sección', type: 'text', value: 'El Santuario de la Sierra' },
      { key: 'description', label: 'Explicación del Estudio', type: 'textarea', value: 'Mi estudio es un antiguo pajar de piedra reconvertido en Guadarrama. Está abierto a coleccionistas bajo cita previa, donde pueden ver los bloques de piedra en bruto, los sacos de arcilla húmeda y respirar el aroma a madera de cedro recién desbastada.' },
      { key: 'studio_image', label: 'Imagen del Taller', type: 'image', value: mockAssets[3]!.url }
    ]
  },
  {
    key: 'proyectos',
    label: 'Próximos Proyectos',
    order: 13,
    fields: [
      { key: 'title', label: 'Título', type: 'text', value: 'En Preparación' },
      { key: 'desc', label: 'Descripción de futuros hitos', type: 'textarea', value: 'Actualmente trabajando en un conjunto escultórico monumental para el Parque de la Escultura de Oporto, tallado enteramente en granito gallego.' }
    ]
  },
  {
    key: 'contacto',
    label: 'Formulario de Contacto',
    order: 14,
    fields: [
      { key: 'title', label: 'Título del Bloque', type: 'text', value: 'Iniciar una Conversación' },
      { key: 'subtitle', label: 'Subtítulo de contacto', type: 'textarea', value: 'Si estás interesado en una obra de la colección, en encargar una comisión personalizada o en visitar el taller de la sierra, escribe con total libertad.' },
      { key: 'email_destination', label: 'Email donde recibirás los mensajes', type: 'email', value: 'antonio.carballo@art.es' },
      { key: 'show_phone', label: 'Mostrar número de teléfono de contacto', type: 'boolean', value: true },
      { key: 'phone_number', label: 'Teléfono', type: 'tel', value: '+34 612 345 678' }
    ]
  },
  {
    key: 'ubicacion',
    label: 'Ubicación y Mapa',
    order: 15,
    fields: [
      { key: 'title', label: 'Ubicación', type: 'text', value: 'Estudio y Exposición' },
      { key: 'address', label: 'Dirección Completa', type: 'text', value: 'Camino del Cincel, 14, Cercedilla, Madrid, España' },
      { key: 'google_maps_link', label: 'Enlace Google Maps', type: 'url', value: 'https://maps.google.com' }
    ]
  },
  {
    key: 'redes_sociales',
    label: 'Redes Sociales',
    order: 16,
    fields: [
      { key: 'instagram', label: 'Enlace Instagram', type: 'url', value: 'https://instagram.com/antoniocarballo_sculptor' },
      { key: 'youtube', label: 'Enlace Canal de YouTube', type: 'url', value: 'https://youtube.com' },
      { key: 'pinterest', label: 'Enlace Pinterest', type: 'url', value: 'https://pinterest.com' }
    ]
  },
  {
    key: 'newsletter',
    label: 'Boletín de Coleccionistas',
    order: 17,
    fields: [
      { key: 'title', label: 'Título Boletín', type: 'text', value: 'Cuaderno del Taller' },
      { key: 'placeholder', label: 'Marcador de posición del Email', type: 'text', value: 'Escribe tu correo electrónico...' },
      { key: 'benefit', label: 'Texto de incentivo', type: 'textarea', value: 'Suscríbete para recibir notificaciones exclusivas de nuevas piezas antes de publicarlas en la web.' }
    ]
  },
  {
    key: 'footer',
    label: 'Pie de Página (Footer)',
    order: 18,
    fields: [
      { key: 'copyright', label: 'Texto de Derechos Reservados', type: 'text', value: '© 2026 Antonio Carballo. Todos los derechos reservados.' },
      { key: 'credit', label: 'Crédito de la Web', type: 'text', value: 'Creado artesanalmente con PrismaEditor.' }
    ]
  },
  {
    key: 'privacidad',
    label: 'Política de Privacidad',
    order: 19,
    fields: [
      { key: 'title', label: 'Título', type: 'text', value: 'Política de Privacidad' },
      { key: 'content', label: 'Texto Legal', type: 'textarea', value: 'En cumplimiento del RGPD, los datos que envíe a través de los formularios de este sitio web solo se utilizarán para resolver su consulta y no serán vendidos a terceros.' }
    ]
  },
  {
    key: 'cookies',
    label: 'Aviso de Cookies (Banner)',
    order: 20,
    fields: [
      { key: 'message', label: 'Mensaje de Cookies', type: 'textarea', value: 'Este sitio web utiliza cookies básicas para garantizar su experiencia estética y analizar visitas de forma anónima.' },
      { key: 'button_accept', label: 'Texto Botón Aceptar', type: 'text', value: 'Aceptar de Acuerdo' }
    ]
  },
  {
    key: 'whatsapp',
    label: 'Burbuja de WhatsApp',
    order: 21,
    fields: [
      { key: 'enabled', label: 'Habilitar burbuja flotante', type: 'boolean', value: true },
      { key: 'number', label: 'Número de Teléfono (con prefijo)', type: 'tel', value: '34612345678' },
      { key: 'initial_message', label: 'Mensaje inicial predefinido', type: 'text', value: 'Hola Antonio, me gustaría consultar sobre una de tus esculturas.' }
    ]
  },
  {
    key: 'faq',
    label: 'Preguntas Frecuentes (FAQ)',
    order: 22,
    fields: [
      { key: 'title', label: 'Título Preguntas', type: 'text', value: 'Preguntas para Coleccionistas' }
    ],
    items: [
      { q: '¿Se realizan envíos internacionales?', a: 'Sí, todas las obras de gran formato se envían en cajas de madera hechas a medida, aseguradas a todo riesgo con transportistas especializados en arte.' },
      { q: '¿Puedo encargar una escultura a medida?', a: 'Sí, acepto encargos específicos en mármol o bronce. Primero elaboro un boceto de arcilla y, tras aprobación, procedo a tallar el bloque.' }
    ]
  },
  {
    key: 'comisiones',
    label: 'Comisiones y Encargos',
    order: 23,
    fields: [
      { key: 'title', label: 'Comisiones de Arte', type: 'text', value: 'Encargos Privados y Públicos' },
      { key: 'explanation', label: 'Explicación de Comisiones', type: 'textarea', value: 'Trabajo mano a mano con arquitectos, interioristas y familias para dotar de alma a espacios específicos. El proceso de encargo es transparente y documentado paso a paso.' }
    ]
  },
  {
    key: 'horarios',
    label: 'Horario de Visitas',
    order: 24,
    fields: [
      { key: 'title', label: 'Horarios de Atención', type: 'text', value: 'Cita en el Estudio' },
      { key: 'hours_details', label: 'Texto de Horarios', type: 'textarea', value: 'De lunes a viernes de 10:00 a 14:00 y de 16:00 a 19:00. Sábados bajo cita exclusiva de coleccionistas. Imprescindible solicitar pase previo.' }
    ]
  }
];

// 6 Páginas del sitio público de Antonio Carballo
export const mockPages: Page[] = [
  { id: 'page-1', type: 'inicio', name: 'Inicio', visible: true, order: 1, sectionIds: ['sec-hero', 'sec-about', 'sec-featured', 'sec-exhibitions', 'sec-contact'] },
  { id: 'page-2', type: 'sobre-mi', name: 'Sobre Mí', visible: true, order: 2, sectionIds: ['sec-about', 'sec-timeline', 'sec-studio', 'sec-awards'] },
  { id: 'page-3', type: 'obras', name: 'Las Obras', visible: true, order: 3, sectionIds: ['sec-gallery', 'sec-comissions', 'sec-faq'] },
  { id: 'page-4', type: 'exposiciones', name: 'Exposiciones', visible: true, order: 4, sectionIds: ['sec-exhibitions', 'sec-timeline'] },
  { id: 'page-5', type: 'prensa', name: 'Prensa', visible: true, order: 5, sectionIds: ['sec-press', 'sec-testimonials'] },
  { id: 'page-6', type: 'contacto', name: 'Contacto', visible: true, order: 6, sectionIds: ['sec-contact', 'sec-hours', 'sec-whatsapp'] }
];

// Secciones activas que componen las páginas y mapean a los módulos
export const mockSections: Section[] = [
  { id: 'sec-hero', type: 'hero', category: 'Portada', label: 'Portada Principal', moduleKey: 'hero', active: true, order: 1, presetId: 'hero-split' },
  { id: 'sec-about', type: 'about', category: 'Biografía', label: 'Sección Biográfica', moduleKey: 'biografia', active: true, order: 2, presetId: 'about-classic' },
  { id: 'sec-featured', type: 'gallery', category: 'Obras', label: 'Muestrario de Obras Destacadas', moduleKey: 'obras_destacadas', active: true, order: 3, presetId: 'gallery-grid' },
  { id: 'sec-exhibitions', type: 'exhibitions', category: 'Eventos', label: 'Listado de Exposiciones', moduleKey: 'exposiciones', active: true, order: 4, presetId: 'exhibitions-timeline' },
  { id: 'sec-contact', type: 'contact', category: 'Contacto', label: 'Formulario de Consulta', moduleKey: 'contacto', active: true, order: 5, presetId: 'hero-minimal' },
  { id: 'sec-timeline', type: 'timeline', category: 'Biografía', label: 'Trayectoria Temporal', moduleKey: 'cronologia', active: true, order: 6, presetId: 'exhibitions-timeline' },
  { id: 'sec-studio', type: 'studio', category: 'Proceso', label: 'Espacio de Trabajo (Taller)', moduleKey: 'taller', active: true, order: 7, presetId: 'about-asymmetric' },
  { id: 'sec-awards', type: 'awards', category: 'Biografía', label: 'Lista de Galardones', moduleKey: 'premios', active: true, order: 8, presetId: 'exhibitions-timeline' },
  { id: 'sec-gallery', type: 'gallery', category: 'Obras', label: 'Catálogo de Esculturas Interactivo', moduleKey: 'galeria_obras', active: true, order: 9, presetId: 'gallery-masonry' },
  { id: 'sec-comissions', type: 'comissions', category: 'Servicios', label: 'Apartado de Encargos Especiales', moduleKey: 'comisiones', active: true, order: 10, presetId: 'about-classic' },
  { id: 'sec-faq', type: 'faq', category: 'Soporte', label: 'Preguntas Frecuentes', moduleKey: 'faq', active: true, order: 11, presetId: 'exhibitions-timeline' },
  { id: 'sec-press', type: 'press', category: 'Prensa', label: 'Sección de Críticas', moduleKey: 'prensa', active: true, order: 12, presetId: 'exhibitions-cards' },
  { id: 'sec-testimonials', type: 'testimonials', category: 'Prensa', label: 'Testimonios de Compradores', moduleKey: 'testimonios', active: true, order: 13, presetId: 'exhibitions-timeline' },
  { id: 'sec-hours', type: 'hours', category: 'Contacto', label: 'Horarios de Visitas', moduleKey: 'horarios', active: true, order: 14, presetId: 'about-classic' },
  { id: 'sec-whatsapp', type: 'whatsapp', category: 'Soporte', label: 'Burbuja de WhatsApp Chat', moduleKey: 'whatsapp', active: true, order: 15, presetId: 'exhibitions-timeline' }
];

// 4 Themes Públicos de la Web del Cliente (con sus tokens y mapeos de layouts para el preview vivo)
export const mockThemes: PublicTheme[] = [
  {
    id: 'theme-1',
    name: 'Galería Minimal',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80',
    active: true,
    tokens: {
      bg: '#FAF9F6', // Off-white elegante
      fg: '#1A1A1A', // Carbón suave
      primary: '#2B2B2B', // Negro puro mate
      accent: '#9A847C', // Bronce apagado
      border: '#E5E4E2', // Gris piedra fino
      fontFamily: 'Geist, sans-serif',
      radius: '2px', // Bordes rectos tipo galería de arte
      spacing: 'relaxed'
    },
    presetMap: {
      'hero': 'hero-split',
      'gallery': 'gallery-grid',
      'about': 'about-classic',
      'exhibitions': 'exhibitions-timeline'
    }
  },
  {
    id: 'theme-2',
    name: 'Editorial Oscuro',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&auto=format&fit=crop&q=80',
    active: false,
    tokens: {
      bg: '#121212', // Negro absoluto aterciopelado
      fg: '#F5F5F5', // Blanco roto luminoso
      primary: '#E5A93B', // Oro de pátinas doradas
      accent: '#E5A93B',
      border: '#2C2C2C', // Carbón oscuro
      fontFamily: 'Georgia, serif', // Estilo revista de arte
      radius: '0px', // Cuadros perfectos sin redondear
      spacing: 'loose'
    },
    presetMap: {
      'hero': 'hero-centered',
      'gallery': 'gallery-masonry',
      'about': 'about-asymmetric',
      'exhibitions': 'exhibitions-cards'
    }
  },
  {
    id: 'theme-3',
    name: 'Cálido Clásico',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&auto=format&fit=crop&q=80',
    active: false,
    tokens: {
      bg: '#FDFBF7', // Crema de piedra caliza
      fg: '#2C2523', // Marrón arcilla oscuro
      primary: '#855147', // Terracota cálido de ladrillo
      accent: '#C29B8B', // Arcilla clara
      border: '#EAE1D9', // Gris arenoso
      fontFamily: 'Playfair Display, serif',
      radius: '16px', // Redondeado orgánico tipo madera pulida
      spacing: 'normal'
    },
    presetMap: {
      'hero': 'hero-split',
      'gallery': 'gallery-editorial',
      'about': 'about-classic',
      'exhibitions': 'exhibitions-timeline'
    }
  },
  {
    id: 'theme-4',
    name: 'Moderno Claro',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=80',
    active: false,
    tokens: {
      bg: '#FFFFFF', // Blanco puro nórdico
      fg: '#09090B', // Zinc oscuro
      primary: '#3F8EFC', // Azul cyan moderno (luz eléctrica de taller)
      accent: '#22C55E', // Verde de bronce pulido nuevo
      border: '#F4F4F5', // Zinc claro
      fontFamily: 'Geist Mono, monospace', // Industrial y sobrio
      radius: '8px', // Redondeado tecnológico
      spacing: 'compact'
    },
    presetMap: {
      'hero': 'hero-minimal',
      'gallery': 'gallery-grid',
      'about': 'about-asymmetric',
      'exhibitions': 'exhibitions-cards'
    }
  }
];

// Marketplace Items (~12 ítems: mezcla de secciones, themes y módulos)
export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'mkt-1',
    kind: 'theme',
    name: 'Brutalista Cemento',
    description: 'Theme de altísimo contraste con tipografía sobredimensionada, bordes de 2px negros e inspiración en la arquitectura brutalista y monumentos de hormigón.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&auto=format&fit=crop&q=80',
    version: '1.2.0',
    state: 'available'
  },
  {
    id: 'mkt-2',
    kind: 'section',
    name: 'Visor de Modelo 3D (Sección)',
    description: 'Inserta modelos 3D interactivos (.gltf/.glb) de tus esculturas con rotación de 360 grados, iluminación personalizable y zoom táctil en la web pública.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
    version: '1.0.4',
    state: 'available'
  },
  {
    id: 'mkt-3',
    kind: 'module',
    name: 'Módulo de Reserva de Visita Autorizada',
    description: 'Permite a coleccionistas elegir fecha y hora para visitas privadas al taller de forma autónoma. Se integra con Google Calendar y envía confirmaciones.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80',
    version: '2.1.0',
    state: 'available'
  },
  {
    id: 'mkt-4',
    kind: 'theme',
    name: 'Editorial Oscuro',
    description: 'Elegante y misterioso, resalta la volumetría de las esculturas con iluminaciones rasantes simuladas e importante peso de fuentes tipográficas con serifas.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&auto=format&fit=crop&q=80',
    version: '2.0.1',
    state: 'installed'
  },
  {
    id: 'mkt-5',
    kind: 'theme',
    name: 'Galería Minimal',
    description: 'El diseño por defecto que respeta la respiración de las obras. Espacio en blanco, pureza formal y diseño geométrico minimalista.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop&q=80',
    version: '1.5.0',
    state: 'installed'
  },
  {
    id: 'mkt-6',
    kind: 'section',
    name: 'Boceto Interactivo de Arcilla (Sección)',
    description: 'Sección que revela la comparativa antes/después mediante un slider deslizante entre el boceto en arcilla y el bronce definitivo.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576016770956-debb63d900ee?w=400&auto=format&fit=crop&q=80',
    version: '1.1.2',
    state: 'update'
  },
  {
    id: 'mkt-7',
    kind: 'module',
    name: 'Certificados de Autenticidad NFC / Blockchain',
    description: 'Registra de manera soberana tus esculturas mediante contratos criptográficos o chips físicos NFC. Los compradores pueden escanear la base de la escultura para validar su firma digital.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=400&auto=format&fit=crop&q=80',
    version: '1.0.0',
    state: 'available'
  },
  {
    id: 'mkt-8',
    kind: 'section',
    name: 'Carrusel de Críticas de Arte (Sección)',
    description: 'Muestra citas y análisis estéticos de revistas de arte especializadas de forma rotativa e inmersiva.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&auto=format&fit=crop&q=80',
    version: '1.3.0',
    state: 'installed'
  },
  {
    id: 'mkt-9',
    kind: 'module',
    name: 'Soporte WhatsApp Integrado Pro',
    description: 'Módulo flotante avanzado con avatar animado de Antonio y horario de atención inteligente para no molestar fuera de horas.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&auto=format&fit=crop&q=80',
    version: '1.2.1',
    state: 'installed'
  },
  {
    id: 'mkt-10',
    kind: 'theme',
    name: 'Cálido Clásico',
    description: 'Inspiración clásica con tonos terracota y lino, ideal para esculturas figurativas o modelados clásicos de arcilla.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&auto=format&fit=crop&q=80',
    version: '1.1.0',
    state: 'installed'
  },
  {
    id: 'mkt-11',
    kind: 'section',
    name: 'Mapa Inmersivo 3D del Estudio (Sección)',
    description: 'Inserta un mapa renderizado en tres dimensiones interactivo indicando los distintos talleres de fundición, forja y desbaste en piedra.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=80',
    version: '2.0.0',
    state: 'available'
  },
  {
    id: 'mkt-12',
    kind: 'module',
    name: 'Integración de Cobro con Stripe para Señales',
    description: 'Permite cobrar un depósito del 25% directamente en concepto de señal de encargo o reserva de obra con pasarela de pago segura de Stripe.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=400&auto=format&fit=crop&q=80',
    version: '1.4.1',
    state: 'update'
  }
];

// ========================================================
// NUEVOS DOMINIOS DE CONTENIDO (FASE 2)
// ========================================================

import type { Album, Category, PressLogo, PressArticle, BlogPost, SiteBranding } from '../types';

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Bronce', enabled: true, order: 1 },
  { id: 'cat-2', name: 'Mármol', enabled: true, order: 2 },
  { id: 'cat-3', name: 'Madera', enabled: true, order: 3 },
  { id: 'cat-4', name: 'Modelados', enabled: true, order: 4 },
  { id: 'cat-5', name: 'Piedra', enabled: false, order: 5 },
  { id: 'cat-6', name: 'Metales', enabled: true, order: 6 }
];

export const mockAlbums: Album[] = [
  {
    id: 'alb-1',
    name: 'Colección Antropológica',
    coverUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&auto=format&fit=crop&q=80',
    workIds: ['work-1', 'work-2']
  },
  {
    id: 'alb-2',
    name: 'Estudios Geométricos y Siluetas',
    coverUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80',
    workIds: ['work-3']
  },
  {
    id: 'alb-3',
    name: 'Modelados en Arcilla del Taller',
    coverUrl: 'https://images.unsplash.com/photo-1576016770956-debb63d900ee?w=600&auto=format&fit=crop&q=80',
    workIds: ['work-4']
  }
];

export const mockPressLogos: PressLogo[] = [
  { id: 'pl-1', name: 'El País', imageUrl: 'https://images.unsplash.com/photo-1622151834677-70f982c9adef?w=200&auto=format&fit=crop&q=80' },
  { id: 'pl-2', name: 'La Vanguardia', imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&auto=format&fit=crop&q=80' },
  { id: 'pl-3', name: 'Art Decó Magazine', imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&auto=format&fit=crop&q=80' },
  { id: 'pl-4', name: 'Masdearte', imageUrl: 'https://images.unsplash.com/photo-1588681664899-f142ff22ac16?w=200&auto=format&fit=crop&q=80' }
];

export const mockPressArticles: PressArticle[] = [
  {
    id: 'pa-1',
    mediaName: 'El País',
    title: 'Antonio Carballo: El susurro de la materia en el mármol moderno',
    date: '2025-11-14',
    externalUrl: 'https://elpais.com',
    excerpt: 'Una extensa reseña sobre la última exhibición del artista en Madrid, donde destaca su capacidad para transformar bloques colosales en pliegues casi orgánicos de apariencia vaporosa.',
    imageUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'pa-2',
    mediaName: 'Art Decó Magazine',
    title: 'La mística del bronce: Entrevista íntima en el taller del escultor',
    date: '2026-02-28',
    externalUrl: 'https://magazineartdeco.com',
    excerpt: 'Conversamos con Carballo sobre el proceso de fundición a la cera perdida y su obsesión por conseguir pátinas de oxidación únicas inspiradas en el mar Cantábrico.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80'
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'El proceso alquímico de la pátina en el bronce',
    slug: 'proceso-alquimico-patina-bronce',
    excerpt: 'Explicación detallada de cómo aplico calor, nitrato de cobre y ácidos orgánicos sobre la escultura en bronce para crear pátinas de un verde profundo eterno.',
    body: `# El proceso alquímico de la pátina en el bronce\n\nLa pátina no es simplemente una capa de pintura sobre el metal; es una **reacción química íntima** que altera la superficie misma de la escultura de bronce. En este artículo, compartiré los secretos técnicos y estéticos de mi proceso en el taller.\n\n## 1. La preparación de la superficie\nAntes de aplicar cualquier químico, el bronce debe estar completamente limpio. Uso granallado de microesferas de vidrio para eliminar cualquier residuo de la fundición.\n\n## 2. La aplicación por fuego (Pátina en caliente)\nUtilizo un soplete de propano para calentar el bronce a unos 120°C. Con un pincel de cerdas naturales, voy aplicando disoluciones salinas:\n- **Nitrato de cobre**: Produce el característico tono verde esmeralda o turquesa.\n- **Nitrato de hierro**: Genera marrones profundos, tierras y dorados antiguos.\n\n> *"La pátina es el paso del tiempo controlado por las manos del escultor."*\n\n## 3. El sellado con cera microcristalina\nUna vez conseguida la tonalidad exacta, detengo la reacción enfriando el metal y aplico una capa de cera microcristalina de grado de museo para proteger el color contra la humedad y el desgaste del tacto humano.\n\n¿Tienes dudas sobre cómo reaccionan otros metales? Deja tu comentario en la sección de consultas del taller.`,
    coverUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
    status: 'published',
    date: '2026-04-12',
    author: 'Antonio Carballo'
  },
  {
    id: 'post-2',
    title: 'La elección de la veta: Viaje a las canteras de Carrara',
    slug: 'eleccion-veta-canteras-carrara',
    excerpt: 'Mi bitácora de viaje a los Alpes Apuanos en busca del bloque de mármol perfecto para mi siguiente serie de torsos masculinos monumentales.',
    body: `# La elección de la veta: Viaje a las canteras de Carrara\n\nA menudo me preguntan dónde empieza una escultura en piedra. La respuesta es simple: empieza a cientos de metros de altura, rodeado del blanco cegador de las canteras de Carrara en Italia.\n\n## El mármol estatuario\nNo todos los bloques son iguales. Para la figura humana, busco el mármol *Statuario*, caracterizado por:\n1. Un grano extremadamente fino.\n2. Un color blanco marfil uniforme.\n3. Ausencia de microfisuras internas invisibles al ojo inexperto.\n\n## El golpe del mazo\nPara comprobar la salud de un bloque de 5 toneladas, realizo la **prueba del sonido**. Golpeo suavemente la piedra con un mazo de madera; si el bloque canta con un tono agudo y resonante, está sano. Si el sonido es sordo, esconde grietas internas que arruinarían meses de cincelado.`,
    coverUrl: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=800&auto=format&fit=crop&q=80',
    status: 'draft',
    date: '2026-05-20',
    author: 'Antonio Carballo'
  }
];

export const mockBranding: SiteBranding = {
  logoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=100&h=100&fit=crop',
  faviconUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=32&h=32&fit=crop',
  fontFamily: 'Geist Variable, sans-serif',
  primaryColor: '#10B981',
  bgColor: '#FAFAFA'
};
