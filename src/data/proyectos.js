/* =========================================================
   Contenido de los proyectos
   ---------------------------------------------------------
   Este es el único archivo que necesitas editar para cambiar
   los textos, las imágenes, el orden o los enlaces de las
   páginas de proyecto.

   Cada objeto del array es un proyecto. Las páginas de
   `proyectos/*.html` se rellenan con estos datos y el carrusel
   de la portada también los lee desde aquí.

   Rutas de imágenes: siempre desde la raíz del sitio, por
   ejemplo `assets/img/proyectos/mi-imagen.jpg`. La página del
   proyecto añade el prefijo `../` automáticamente.
   ========================================================= */

window.PROYECTOS = [
  {
    id: 'revista-la-mistica',
    order: '01',
    title: 'Revista La Mística',
    shortTitle: 'La Mística',
    titleMark: 'La Mística',
    category: 'Diseño editorial',
    type: 'Revista de taller · 66 páginas',
    year: '2025',
    cover: 'assets/img/proyectos/revista-la-mistica.webp',
    coverAlt: 'Portada ilustrada de la Revista La Mística: una figura de trenzas con los brazos alzados frente a un portal cósmico, con cintas amarillas y naranjas sobre fondo negro estrellado',
    coverLayout: 'portrait',
    book: {
      title: 'Hojear La Mística',
      label: 'Revista completa',
      note: '66 páginas + portada y contraportada',
      description: 'La edición completa, hoja por hoja. Arrastra, toca los lados del libro o usa las flechas para pasar las páginas.',
      pages: 68,
      folder: 'assets/img/proyectos/revista-la-mistica'
    },
    accent: '#bdf522',
    accentInk: '#141414',
    tagline: 'El misterio también se diseña.',
    summary: 'Revista de 66 páginas creada en el taller de énfasis en composición y tipografía. Cada artículo fue escrito por un miembro del taller y la diagramación completa es mía. El reto fue responder a la atemporalidad con composición, color, textura y contraste.',
    intro: [
      'La Mística salió del taller de énfasis en composición y tipografía. Cada artículo fue escrito por un miembro del taller y yo me encargué de reunir esos escritos y diagramar la revista completa. A cada estudiante se le asignó un problema de diagramación; el mío fue la atemporalidad.',
      'Antes de abrir InDesign me detuve a problematizar qué significa que algo sea atemporal. Nada resiste al tiempo fuera de su contexto, pero los diseños que perduran suelen compartir un uso sagaz de la composición, el color, la textura y el contraste. Con esos cuatro recursos construí un puente entre los símbolos que la cultura asocia al ocultismo y la época en la que vivimos.'
    ],
    facts: {
      role: 'Concepto editorial, diagramación, ilustración y producción',
      tools: 'InDesign · Illustrator · Clip Studio',
      duration: 'Taller de énfasis · 2025',
      context: 'Proyecto académico · UNAL'
    },
    sections: [
      {
        kicker: '01 / El reto',
        phase: 'El reto',
        title: 'Atemporal, pero con fecha',
        body: [
          'Analicé el desafío de la atemporalidad y lo problematicé. Lo que llamamos atemporal suele remitir a una parte del diseño de posguerra, como la Helvética; sin embargo, una creación que resiste a las modas y sobrevive en el tiempo no es ajena a su contexto: también participa de él. Las circunstancias históricas hacen que ciertas obras sobresalgan, pero los grandes diseños comparten un uso sagaz de la composición, el color, la textura y el contraste.',
          'Con esos cuatro recursos decidí que la revista fuera una conexión entre los elementos que la cultura asocia al ocultismo desde hace mucho tiempo y un reflejo de la época en la que vivimos. Lo oculto sería el tema; la composición, el color, la textura y el contraste, la manera de traerlo al presente.'
        ]
      },
      {
        kicker: '02 / La portada',
        phase: 'La portada',
        title: '¿Cómo se ve una mística hoy?',
        body: [
          'Empecé por lo gráfico con distintas propuestas de portada. Me interesaba usar la ilustración digital como puente entre la ilustración de los libros antiguos y esotéricos y la digitalidad que representa el presente.',
          'Opté por una ilustración que respondiera una pregunta: ¿cómo se ve una bruja o una mística actual? Para mí, las místicas de hoy son chicas jóvenes con una espiritualidad muy grande —desde el cristianismo hasta la astrología o el tarot— que visten a la moda, son divertidas, juveniles, usan redes sociales y viven ese aspecto de su vida de una forma no tradicional.'
        ]
      },
      {
        kicker: '03 / La retícula',
        phase: 'La retícula',
        title: 'Una cuadrícula en múltiplos de tres',
        body: [
          'Para la diagramación usé una cuadrícula que me permitiera experimentar de forma segura. La construí sobre múltiplos de 3 para coincidir con la temática de la revista. El fondo es normalmente blanco y las imágenes mantienen un estilo fotográfico que apela a esa idea moderna de atemporalidad.',
          'Ese fondo limpio convive con tipografías creativas para los títulos, una gótica moderna para las cornisas y una clásica y funcional desde hace siglos, la Baskerville, para lograr el balance que buscaba.'
        ]
      },
      {
        kicker: '04 / El ritmo',
        phase: 'El ritmo',
        title: 'Pausas que también cuentan',
        body: [
          'Al pasar las páginas encontré una forma de mantener una pausa y un ritmo formal relacionado con los textos de cada artículo sin perder mi esencia creativa ni las ganas de hacer las cosas de forma diferente, y sin recurrir a cajas de texto arriesgadas, sin disminuir la legibilidad ni afectar el blanco.',
          'Me gustó mucho ajustar los párrafos para crear ritmo y disrupción en la lectura, jugando con «lo oculto» para responder a la revista y al reto de la atemporalidad. Claro, desde mi punto de vista.'
        ]
      }
    ],
    gallery: [
      {
        src: 'assets/img/proyectos/revista-la-mistica.webp',
        alt: 'Portada ilustrada de la Revista La Mística',
        caption: 'Portada · Nº 01',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/revista-la-mistica/modelo-impreso.webp',
        alt: 'Modelo impreso de la revista abierto sobre una mesa de madera: doble página 40–41 con el artículo «Vómito de una realidad latinoamericana», la cita destacada en vino y el retrato de la modelo',
        caption: 'Modelo impreso · páginas 40–41',
        size: 'tall'
      },
      {
        src: 'assets/img/proyectos/revista-la-mistica/spread-30-31.webp',
        alt: 'Doble página 30 y 31: artículo sobre la cartografía del cuerpo en el imaginario místico, con figuras y esqueletos sobre un paisaje nocturno',
        caption: 'Páginas 30–31 · Cartografía del cuerpo',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/revista-la-mistica/spread-32-33.webp',
        alt: 'Doble página 32 y 33: texto sobre los tránsitos del qi junto a una fotografía de una figura atravesada por una diagonal de luz',
        caption: 'Páginas 32–33 · Tránsitos del qi',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/revista-la-mistica/spread-36-37.webp',
        alt: 'Doble página 36 y 37: retrato con estrellas superpuestas, el título Espejo invertido y un cúmulo de estrellas de colores',
        caption: 'Páginas 36–37 · Espejo',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/revista-la-mistica/spread-44-45.webp',
        alt: 'Doble página 44 y 45: especial de horóscopo sobre fondo naranja, con flores y títulos ondulados',
        caption: 'Páginas 44–45 · Horóscopo',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/revista-la-mistica/spread-50-51.webp',
        alt: 'Doble página 50 y 51: artículo sobre la energía de las plantas, con una mano que sostiene hierbas y flores',
        caption: 'Páginas 50–51 · Energía de las plantas',
        size: 'wide'
      }
    ],
    quote: {
      text: 'El misterio no está en lo que escondemos, sino en lo que dejamos imaginar.',
      source: 'Nota de proceso'
    }
  },

  {
    id: 'letterboxd-popcorn',
    order: '02',
    title: 'Letterboxd Popcorn',
    shortTitle: 'Popcorn',
    titleMark: 'Popcorn',
    category: 'Producto digital · UX/UI',
    type: 'Prototipo de mejora · sistema de diseño',
    year: '2025',
    cover: 'assets/img/proyectos/letterboxd-popcorn-portada.jpeg',
    coverAlt: 'Pantalla de inicio de Letterboxd Popcorn con la barra de navegación, la sección New from friends y carteles de películas.',
    coverLayout: 'portrait',
    accent: '#00D842',
    accentInk: '#141414',
    accentSecondary: '#FFB300',
    tagline: 'Un prototipo de mejora sobre la aplicación de Letterboxd.',
    summary: 'Popcorn es un prototipo de mejora sobre la aplicación de Letterboxd, hecho de forma grupal. Pasó por la identificación de los valores de la marca, el análisis de problemáticas, el desarrollo de un sistema de diseño con atomic design y tres tests de validación.',
    intro: [
      'Popcorn es un prototipo de mejora sobre la aplicación de Letterboxd. Fue hecho de forma grupal junto con Yonatan Morales, Stephannie Castro, Laura Ortiz, María Belén y Sebastián Barrera. El prototipo pasó por diferentes fases: primero se identificaron los distintos tipos de valores de la marca y cómo se manifiestan o no en la aplicación.',
      'Después analizamos las problemáticas, definimos el objetivo y pasamos al desarrollo con atomic design. No modificamos secciones como actividad o el buscador, el cual tenía problemas de UX más allá de los que tratamos, que respondían principalmente a UI.'
    ],
    facts: {
      role: 'Sistema de diseño, interacciones y pruebas',
      tools: 'Figma',
      duration: '2025 · proyecto grupal',
      context: 'Proyecto académico'
    },
    prototype: {
      title: 'Explora el prototipo',
      description: 'Prototipo interactivo del sistema de diseño de Popcorn en Figma. ¡Intenta ver reviews en KPop Demon Hunters desde el home!',
      href: 'https://www.figma.com/proto/zIQVwE7cLUmO7dDXthbaDg/Design-System-Letterboxd?node-id=362-498&starting-point-node-id=1155%3A1442',
      embed: 'https://embed.figma.com/proto/zIQVwE7cLUmO7dDXthbaDg?node-id=362-498&starting-point-node-id=1155%3A1442&embed-host=caro-creativa&scaling=fit-width',
      cta: 'Abrir en Figma'
    },
    sections: [
      {
        kicker: '01 / Problemáticas y objetivo',
        title: 'Problemáticas y objetivo',
        body: [
          'Analizamos cuatro problemáticas: falta de identidad visual, monotonía y poca jerarquía entre pantallas, acciones principales difíciles de encontrar e información confusa en estadísticas y menús. El objetivo fue crear un sistema de diseño amigable y confiable para Letterboxd, que facilitara interactuar con el catálogo y con la comunidad y que reflejara visualmente sus valores.'
        ]
      },
      {
        kicker: '02 / Atomic design',
        title: 'Atomic design',
        body: [
          'Con atomic design definimos átomos, moléculas y organismos. En los átomos trabajamos tipografías, paleta, íconos, grillas, botones e interacciones.',
          'En las moléculas creé tarjetas y bloques de reacciones, y me concentré en las interacciones: estrellas, me gusta, watched, add to watchlist, top tab bars y estados de botones. Finalmente aplicamos el sistema en el perfil y la ficha de película.'
        ]
      },
      {
        kicker: '03 / Tests y aprendizajes',
        title: 'Tests y aprendizajes',
        body: [
          'De estas experiencias aprendí a construir layouts con interacciones funcionales, cuidar el detalle, componer autolayouts y entender al público antes de dar un producto por definitivo.'
        ],
        stats: [
          { group: 'Valores', value: '+13%', label: 'Confianza' },
          { group: 'Valores', value: '+5%', label: 'Percepción de comunidad' },
          { group: 'Valores', value: '+8%', label: 'Percepción de organización' },
          { group: 'Navegación', value: '88%', label: 'Tareas completadas' },
          { group: 'Navegación', value: '50%', label: 'Experiencia positiva', note: '38% neutral · 12% negativa' },
          { group: 'Navegación', value: '38%', label: 'Facilidad positiva', note: '56% neutral · 6% negativa' },
          { group: 'Iconografía', value: '79%', label: 'Asertividad, comprensión, familiaridad e intuitividad general', wide: true }
        ]
      }
    ],
    gallery: [
      {
        src: 'assets/img/proyectos/letterboxd-popcorn-valores.jpeg',
        alt: 'Matriz de valores de la marca organizada en virtud, utilidad y deber: comunidad, ocio, variedad, conexión, organización, libertad de expresión y confianza.',
        caption: 'Valores analizados · virtud, utilidad y deber',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/letterboxd-popcorn-interacciones.webp',
        alt: 'Estados y variantes de interacción: watch, like, watchlist, calificación con estrellas, barra de navegación, tabs y buscador.',
        caption: 'Interacciones · componentes y estados',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/letterboxd-popcorn-proceso-figma.webp',
        alt: 'Proceso en Figma: páginas de tipografía, interacciones, moléculas y test de iconos, junto a las pantallas del prototipo.',
        caption: 'Proceso en Figma · sistema de diseño y pantallas',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/letterboxd-popcorn-confianza.jpeg',
        alt: 'Antes y después del perfil de Letterboxd. La confianza pasó de 3.8 a 4.3 sobre 5, un aumento del 13%.',
        caption: 'Test de confianza · perfil actual y rediseño (+13%)',
        size: 'wide'
      }
    ],
    quote: {
      text: 'Entender al público antes de sacar un producto definitivo.',
      source: 'Aprendizaje del proyecto'
    }
  },

  {
    id: 'cultura-unal',
    order: '03',
    title: 'Cultura UNAL',
    shortTitle: 'Cultura UNAL',
    titleMark: 'UNAL',
    category: 'Piezas para redes · Cultura',
    type: 'Piezas para redes sociales · Área de Cultura',
    year: '2026',
    cover: 'assets/img/proyectos/cultura-unal-portada.webp',
    coverAlt: 'Tres teléfonos con piezas de Cultura UNAL: Picnic Collage Sensible, Fotobordados para regalar y Ciclo de formación cultural',
    coverLayout: 'portrait',
    accent: '#fa51a2',
    accentInk: '#141414',
    tagline: 'Un año de piezas para la agenda cultural.',
    summary: 'Selección de piezas publicadas en las redes del Área de Cultura de la Universidad Nacional durante un año como estudiante auxiliar: carteles, collage e ilustración para eventos, convocatorias y programación.',
    intro: [
      'Estuve como estudiante auxiliar por un periodo aproximado de un año. En ese año aprendí cosas maravillosas, empezando por crear piezas para redes sociales. Quiero exponer algunas de las piezas publicadas, hechas por mí, que me han permitido incluso conocer mejor a mi alma mater y su maravillosa oferta cultural.',
      'Además, debido al área, se me permitió ser creativa al tiempo que comunicaba información de forma clara y llamativa, siguiendo guidelines y estructuras previas.'
    ],
    facts: {
      role: 'Estudiante auxiliar · Piezas para redes',
      tools: 'Illustrator · Photoshop · Canva · Gemini · ChatGPT',
      duration: '1 año',
      context: 'Área de Cultura · UNAL'
    },
    galleryLayout: 'posters',
    gallery: [
      {
        src: 'assets/img/proyectos/cultura-unal-90-dfun.webp',
        alt: 'Cartel de los 90 años del Grupo Institucional de Danzas Folclóricas: un 90 gigante en dorado sobre fondo negro, con bailarinas de polleras y el texto de la gala conmemorativa 1936-2026',
        caption: '90 años DFUN',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/cultura-unal-ciclo-gestion.webp',
        alt: 'Cartel rosa con recortes de estudiantes, nubes de medio tono y globos de texto: Ciclo de formación en gestión cultural, martes 27 de octubre, 6 PM',
        caption: 'Ciclo de formación cultural',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/cultura-unal-picnic.webp',
        alt: 'Collage floral con una foto antigua de una pareja de picnic: Picnic Collage sensible, 9 de junio, 2 PM, lugar IICA',
        caption: 'Picnic collage sensible',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/cultura-unal-horoscopo.webp',
        alt: 'Ilustración en papel recortado de un arlequín con máscara y sonaja, sobre fondo violeta y azul: Escorpio, el diablo o la diablesa carnavalera',
        caption: 'Horóscopo Carnavalero',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/cultura-unal-fotobordados.webp',
        alt: 'Cartel Fotobordados para regalar: una mujer mayor saca la lengua frente a bordados de colores, con un corazón bordado en fucsia y las fechas 10, 11 y 12 de junio',
        caption: 'Fotobordados',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/cultura-unal-muestras.webp',
        alt: 'Programación de las muestras finales de semilleros artísticos: fondo violeta con ondas lima y la lista de talleres con horarios del 13 de mayo',
        caption: 'Programación muestras finales de semilleros artísticos',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/cultura-unal-parchate.webp',
        alt: 'Cartel Párchate la U, sesión de salsa en vinilo: fondo azul texturado, un disco de vinilo naranja y un retrato recortado en verde y negro',
        caption: 'Párchate a la U sesión de salsa en vinilo',
        size: 'wide'
      }
    ],
    quote: {
      text: 'Comunicar información de forma clara y llamativa.',
      source: 'Sobre el encargo'
    }
  },

  {
    id: 'peak',
    order: '04',
    title: 'PĒAK',
    shortTitle: 'PĒAK',
    titleMark: '',
    category: 'Identidad visual',
    type: 'Uniformes médicos · Identidad',
    year: '2026',
    cover: 'assets/img/proyectos/peak.webp',
    coverAlt: 'Símbolo de PĒAK sobre fondo blanco: una letra A construida con planos grises que termina en un pico',
    coverLayout: 'portrait',
    accent: '#fe8616',
    accentInk: '#141414',
    tagline: 'Verse y sentirse profesionales de élite.',
    summary: 'PĒAK es una marca de uniformes médicos antifluidos que busca ser la opción inteligente para médicos y enfermeras que quieren verse y sentirse profesionales de élite, y que valoran la calidad y la durabilidad del material a un precio razonable.',
    intro: [
      'Peak es una marca de uniformes médicos antifluidos. Su propuesta es ser la opción inteligente a un precio razonable para médicos y enfermeras que valoran la calidad y la durabilidad del material, y que quieren verse y sentirse profesionales de élite.',
      'El encargo incluyó un logotipo, un monograma, un minimanual de marca y el diseño de las bolsas de envío. La historia del nombre —el pico más alto del electrocardiograma— guió la construcción del símbolo y la forma en que debía verse en cada aplicación.'
    ],
    facts: {
      role: 'Identidad visual, manual de marca y aplicaciones',
      tools: 'Illustrator',
      duration: '2026',
      context: 'Encargo de marca · Uniformes médicos'
    },
    sections: [
      {
        kicker: '01 / El origen',
        phase: 'El origen',
        title: 'El pico del electrocardiograma',
        body: [
          'El proceso de PĒAK empezó en conversaciones y acuerdos con el cliente, donde se definieron los entregables: un logotipo, un monograma, un minimanual de marca y el diseño de las bolsas de envío.',
          'En la primera sesión, el cliente contó que el nombre viene de la parte más alta del electrocardiograma y cómo quería que eso se viera en el logo. De ahí salieron las primeras decisiones sobre la forma.'
        ]
      },
      {
        kicker: '02 / Los borradores',
        phase: 'Exploración',
        title: 'De los bocetos a tres opciones',
        body: [
          'Después de varias conversaciones empezó la creación de borradores, que revisamos en conjunto; puedes verlos en la galería. De ese intercambio salieron tres opciones: las perfeccionamos y una quedó elegida.'
        ]
      },
      {
        kicker: '03 / El color',
        phase: 'La decisión',
        title: 'Blanco, negro y bordado',
        body: [
          'Con la opción elegida hice distintas pruebas de color, pero al probarlas noté que, por el contraste y porque el logo se va a bordar, era mejor trabajar únicamente con una versión blanca y una negra, sólidas y con degradados. Así el cliente puede decidir con claridad qué modo del logo usar.'
        ]
      },
      {
        kicker: '04 / El cierre',
        phase: 'Las aplicaciones',
        title: 'Un manual breve y una bolsa',
        body: [
          'Con eso claro desarrollé un minimanual que contemplaba cuestiones básicas: tipografías, áreas de reserva, usos de color y distorsiones no permitidas.',
          'Finalmente hice un diseño básico para la bolsa de envío, de acuerdo con los parámetros del impresor local.'
        ]
      }
    ],
    gallery: [
      {
        src: 'assets/img/proyectos/peak-bocetos.webp',
        alt: 'Lámina con dos propuestas de logotipo para PĒAK: la primera con la letra A en forma de pico y la segunda con el pico y una pierna descendente, marcadas como boceto no final',
        caption: 'Bocetos · dos propuestas',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/peak-color.webp',
        alt: 'Lámina de propuestas de color de PĒAK: versiones en blanco y negro, acentos verde, azul y rojo en el isotipo y el logotipo, y aplicaciones sobre fondo negro',
        caption: 'Propuestas de color',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/peak.webp',
        alt: 'Símbolo de PĒAK en grises sobre fondo blanco: la letra A construida con planos y un pico en la base',
        caption: 'Símbolo · versión en grises',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/peak-logos-negro.webp',
        alt: 'Lámina de marca: logotipo e isotipo de PĒAK en sus versiones negra degradada y negra sólida sobre fondo blanco',
        caption: 'Negras · sobre fondo blanco',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/peak-logos-blanco.webp',
        alt: 'Lámina de marca: logotipo e isotipo de PĒAK en sus versiones blanca degradada y blanca sólida sobre fondo negro',
        caption: 'Blancas · sobre fondo negro',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/peak-manual-p2.webp',
        alt: 'Página del mini manual de PĒAK titulada «construcción del logo»: el logotipo trazado sobre una retícula con las diagonales que construyen la letra A, y a la derecha una modelo con uniforme rosa y tenis beige de pie sobre un círculo verde',
        caption: 'Mini manual · construcción',
        size: 'wide',
        focus: '22% 50%'
      }
    ],
    quote: {
      text: 'La parte más alta del electrocardiograma.',
      source: 'El origen del nombre'
    }
  },

  {
    id: 'artropomakia',
    order: '05',
    title: 'Artropomakia',
    shortTitle: 'Artropomakia',
    titleMark: '',
    category: 'Identidad · Branding',
    type: 'Agencia de marca · Naming y brandbook',
    year: '2024',
    cover: 'assets/img/proyectos/artropomakia.webp',
    coverAlt: 'Portada de Artropomakia: una boca que grita entre mariposas, escarabajos y una libélula sobre fondos amarillos y rojos',
    coverLayout: 'portrait',
    accent: '#bdf522',
    accentInk: '#141414',
    tagline: 'Una agencia para los bichos raros.',
    summary: 'Proyecto de marca para una agencia dedicada a las tiendas de insectos disecados: naming, logo, brief, mapa conceptual y brandbook con un tono irreverente, mucho humor y una estética abiertamente confrontativa.',
    book: {
      title: 'Hojear el brandbook',
      label: 'Brandbook completo',
      note: 'Portada + 21 dobles páginas + contraportada',
      description: 'El brandbook de la agencia, hoja por hoja. Arrastra, toca los lados del libro o usa las flechas para pasar las páginas.',
      pages: 44,
      folder: 'assets/img/proyectos/artropomakia-brandbook',
      ratio: 2.223
    },
    intro: [
      'Artropomakia es un proyecto de marca realizado en las aulas: creamos una agencia para un nicho específico. Para esto escogí las tiendas de venta de insectos disecados. Quería que la marca se distanciara de los dos enfoques que existían en el mercado: el ornamental, caro y lujoso, y el natural, hippie y anticuado. Buscaba una agencia para un público atrevido e irreverente: moderna, llamativa, contracultural y hasta confrontativa, para quienes no temen destacar y ser diferentes.',
      'La misión de la agencia es: «En Artropomakia sabemos que es difícil salir de la normatividad y lanzarse a lo desconocido, a lo raro y al absurdo. Sin embargo, estamos al tanto de que hay muchos que requieren precisamente de estas características para representarse a sí mismos o a su marca. Es entonces cuando Artropomakia desea innovar y, a través de propuestas audaces, representar a las ideas y bichos raros que, según dicen, no deberían ver la luz del día».',
      {
        text: '¡Artropomakia quiere representar y exaltar lo feo, el mal gusto y lo ultra kitsch!',
        highlight: true
      }
    ],
    facts: {
      role: 'Concepto, naming, identidad visual y brandbook',
      tools: 'Illustrator',
      duration: '16 semanas · 2024',
      context: 'Proyecto académico · UNAL'
    },
    sections: [
      {
        kicker: '01 / Naming y logo',
        title: 'Un nombre que suena a bicho raro',
        body: [
          'El proceso inicia con el naming y el logo. Para el nombre decidí que se llamara Artropomakia: la unión de la palabra artrópodo con el término coloquial makia, para que sonara moderno y un poco disruptivo, y para lograr el objetivo de hacer ver genial algo tan rechazado como los bichos.',
          'El logo busca ser llamativo y funcionar como isologo, isotipo y logotipo. Es una mujer que grita, en referencia a la rebeldía y a las reacciones habituales frente a los bichos; «Artropomakia» está escrito en Montserrat para darle peso y distorsionado para aportarle los valores de la marca a la tipografía.'
        ]
      },
      {
        kicker: '02 / Brief y mapa conceptual',
        title: 'Un tono de voz muy propio',
        body: [
          'Después se hizo un brief y un mapa conceptual que explican los valores y la estética a manejar: condensan los valores, la misión, la visión, la paleta de colores, etc. Logré que la diagramación y el uso de imágenes enriquecieran y fortalecieran la marca, y que esta tuviera un tono de voz muy propio. Eso es algo que me enorgullece de este proyecto.'
        ]
      },
      {
        kicker: '03 / Brandbook',
        title: 'Un espacio para la insolencia',
        body: [
          'Posteriormente hice el brandbook completo de la marca, que va desde los valores y los demás temas expuestos en el brief hasta las áreas de protección, los usos correctos e incorrectos, los mockups, las orientaciones permitidas, los puntajes y las tipografías, etc.',
          'Este brandbook, al igual que el brief, busca expresar al máximo la diversión y la irreverencia, jugando con el sentido del humor y la ilegibilidad. ¡Un espacio para la insolencia y la creatividad!'
        ]
      }
    ],
    gallery: [
      {
        src: 'assets/img/proyectos/artropomakia.webp',
        alt: 'Portada del brief de Artropomakia: una boca que grita entre mariposas, escarabajos y una libélula sobre fondos amarillos y rojos',
        caption: 'Portada del brief',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/artropomakia-brief-04.webp',
        alt: 'Doble página inicial del brief: el logotipo Artropomakia girado sobre fondo magenta, la boca que grita, hormigas, un cangrejo y el saludo de la agencia',
        caption: 'Brief · doble página 4',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/artropomakia-brief-07.webp',
        alt: 'Doble página «Nuestro Branding»: tono de voz, target y tipos de branding, con un caracol, un personaje fresa y bandas amarillas y naranjas',
        caption: 'Brief · doble página 7',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/artropomakia-brief-10.webp',
        alt: 'Doble página del naming: un escarabajo ciervo, la boca que grita y la explicación del identificador sobre amarillo y rojo',
        caption: 'Brief · doble página 10',
        size: 'wide'
      },
      {
        src: 'assets/img/proyectos/artropomakia-mapa.webp',
        alt: 'Mapa conceptual circular de Artropomakia sobre fondo oscuro: al centro el logotipo y alrededor los sectores de contexto, paleta, tipografías, naming, personalidad, target y tono de voz, ilustrados con insectos',
        caption: 'Mapa conceptual · valores y estética',
        size: 'wide'
      }
    ],
    quote: {
      text: 'Un espacio para la insolencia y la creatividad.',
      source: 'Manifiesto de la agencia'
    }
  },



];
