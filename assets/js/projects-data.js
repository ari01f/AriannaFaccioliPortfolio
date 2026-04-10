export const siteData = {
  owner: "ARIANNA FACCIOLI",
  label: "Interaction designer and creative technologist",
  bio: `Arianna Faccioli is an Italian creative technologist and multidisciplinary designer based in Bologna. She works across digital design, creative coding, and data visualization, focusing on how generative systems construct imaginaries, identities, and narratives.
    She holds a degree in Industrial Design from the University of Bologna and a Master’s in Interaction & Experience Design from the University of the Republic of San Marino. Her practice combines technical experimentation with a critical approach, addressing the cultural and political dimensions of data-driven systems.
    Her work explores how data, space, and sensory experience can be articulated into narrative-driven interactions. Through projects spanning exhibit design, sound design, creative coding, and web-based visual systems, she develops ways to translate complex processes into accessible and engaging visual and spatial experiences.`,
  links: [
    { label: "Email", href: "mailto:hello@ariannafaccioli.com" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
};

function withFolder(folder, media) {
  return {
    ...media,
    src: `${folder}/${media.src}`,
    ...(media.poster ? { poster: `${folder}/${media.poster}` } : {}),
  };
}

function createProject(config) {
  const {
    folder,
    slug,
    title,
    subtitle = "",
    category,
    year,
    summary = "",
    description = "",
    preview,
    media,
  } = config;
  const project = {
    folder,
    slug,
    title,
    subtitle,
    category,
    year,
    summary,
    description,
    preview: withFolder(folder, preview),
    media: media.map((item) => withFolder(folder, item)),
  };

  const prefix = `${folder}/`;
  const allProjectMedia = [project.preview, ...project.media];

  for (const item of allProjectMedia) {
    if (!item.src.startsWith(prefix)) {
      throw new Error(`${project.slug} contains media outside its folder.`);
    }

    if (item.poster && !item.poster.startsWith(prefix)) {
      throw new Error(`${project.slug} contains poster media outside its folder.`);
    }
  }

  if (project.media.length < 2) {
    throw new Error(`${project.slug} must contain at least 2 media items.`);
  }

  return project;
}

export function getHomepageProjects() {
  return projects.map(({ slug, category, year, preview }) => ({
    slug,
    category,
    year,
    preview:
      preview.type === "image"
        ? {
            ...preview,
            alt: "",
          }
        : preview,
  }));
}

export const projects = [
  createProject({
    folder: "01-Prompted Identities",
    slug: "prompted-identities",
    title: "PROMPTED IDENTITIES",
    subtitle: "Exploring representational bias in text-to-image models",
    category: "AI | Data Visualization | Critical AI",
    year: "2026",
    role: "Interaction design, art direction, prototyping",
    description:
      "An interactive and informative platform based on a synthetic dataset of 4,000 images generated with Stable Diffusion. The project investigates how generative models construct visual identities across professions, revealing recurring patterns and biases embedded in training data.Through direct visualization, users can explore large-scale outputs, compare models, and navigate clusters generated via dimensionality reduction. The system integrates face analysis, object detection, and similarity mapping into an interactive interface designed to expose how AI systems visually encode identity.",

    links: [],
    preview: {
      type: "video",
      src: "filmati/similarity_x2.mov",
      alt: "Prompted Identities interface still",
    },
    media: [
      {
       type: "video",
      src: "filmati/similarity_x2.mov",
      alt: "Prompted Identities interface still",
      },
      {
        type: "video",
        src: "filmati/About.mov",
        poster: "images/Prompted-identities-about.png",
        alt: "Prompted Identities screen recording",
        caption: "Short recording of the interface behaviour.",
      },
      {
        type: "image",
        src: "images/Prompted-identities-similarity.png",
        alt: "Prompted Identities comparison view",
        caption: "Comparison and similarity view.",
      },
    ],
  }),
  createProject({
    folder: "02-Interspecie",
    slug: "interspecie",
    title: "Interspecie",
    subtitle: "Ecological coexistence through data visualization",
    category: "Speculative installation",
    year: "2025",
    role: "Concept, interaction design, spatial storytelling",
    summary:
      "A speculative installation structured around cohabitation, perception, and relational ecologies.",
    description:
      "An interactive visualization platform based on iNaturalist observations from the Parco Regionale del Fiume Sile. The project reorganizes biodiversity data into spatial categories that merge natural and human-made environments, highlighting coexistence, adaptation, and ecological imbalance. Users navigate a layered system that progressively reveals environmental strata and species distribution, integrating clustering and filtering to explore biological classifications, endangered species, and invasive dynamics.",
    credits: [
      "Project credits placeholder",
      "Institutional or production partners can be added here",
    ],
    links: [],
    preview: {
      type: "video",
      src: "preview.mov",
      alt: "Interspecie preview",
    },
    media: [
      {
        type: "image",
        src: "1.png",
        alt: "Interspecie still",
        caption: "Primary visual documentation.",
      },
      {
        type: "video",
        src: "video.mov",
        poster: "home.png",
        alt: "Interspecie video",
        caption: "Motion excerpt from the project.",
      },
      {
        type: "image",
        src: "6.jpg",
        alt: "Interspecie installation view",
        caption: "Secondary installation view.",
      },
    ],
  }),
  createProject({
    folder: "03-Hemstacks",
    slug: "hemstacks",
    title: "Hemstacks",
    subtitle: "Speculative scenario visualization platform",
    category: "Digital experience",
    year: "2025",
    role: "AI | Visual design | Shader",
    summary:
      "A system-oriented interface project balancing informational complexity with clarity and pace.",
    description:
      "The platform presents speculative scenarios as visual narratives, translating theoretical research into navigable, image-based environments.The work focuses on rendering scenario fiction through generative visual systems and structured layouts, allowing users to explore complex hypotheses as spatial and visual constructs rather than linear text.",
    links: [],
    preview: {
      type: "video",
      src: "09357ad327523e37963714fd834273ad.mov",
      alt: "Hemstacks preview image",
    },
    media: [
      {
        type: "video",
        src: "09357ad327523e37963714fd834273ad.mov",
        alt: "Hemstacks interface view",
        caption: "Key interface view.",
      },
      {
        type: "video",
        src: "f165baedc12a49ef5537e64511e5e17e.mp4",
        alt: "Hemstacks motion study",
        caption: "Prototype or motion study.",
      },
      {
        type: "image",
        src: "original_2e464e39921b0251e652f37387e6cf07.png",
        alt: "Hemstacks supporting still",
        caption: "Supporting still.",
      },
    ],
  }),
  createProject({
    folder: "04-Recall",
    slug: "recall",
    title: "Recall",
    subtitle: "Fragments, memory, and visual reconstruction",
    category: "Visual narrative",
    year: "2025",
    role: "Research, narrative design, visual composition",
    summary:
      "A project organized around memory, sequence, and the reconstruction of fragmented material.",
    description:
      "Replace this placeholder with a short editorial description of the concept, medium, and final form of the project.",
    credits: [
      "Project credits placeholder",
      "Production notes can be listed here",
    ],
    links: [],
    preview: {
      type: "image",
      src: "original_4acb7b4d90f234a99f9e31863fabf02e.jpg",
      alt: "Recall preview",
    },
    media: [
      {
        type: "image",
        src: "original_2796b02af6a170fcccbd5b1eb8845cd5.jpg",
        alt: "Recall still",
        caption: "Primary still.",
      },
      {
        type: "image",
        src: "original_a8645100df1f1e32dbd1da85be963689.gif",
        alt: "Recall motion fragment",
        caption: "Animated fragment.",
      },
      {
        type: "image",
        src: "original_dfbfccc49b0074f8f2b700b4ea80162b.jpg",
        alt: "Recall secondary still",
        caption: "Secondary still.",
      },
    ],
  }),
  createProject({
    folder: "05-Humuscene",
    slug: "humuscene",
    title: "Humuscene",
    subtitle: "Ecological imaginaries in simulated space",
    category: "Immersive worldbuilding",
    year: "2025",
    role: "Environment design, interaction concept, audiovisual direction",
    summary:
      "A multisensory environment staging ecological imaginaries through moving image and simulated space.",
    description:
      "This project page can later hold the conceptual frame, technical workflow, and the intended visitor trajectory through the work.",
    credits: [
      "Project credits placeholder",
      "Software pipeline or collaboration notes can be added here",
    ],
    links: [],
    preview: {
      type: "video",
      src: "intro_humuscene.mp4",
      alt: "Humuscene preview video",
    },
    media: [
      {
        type: "video",
        src: "Humus_Cene_Video.mp4",
        alt: "Humuscene documentation video",
        caption: "Primary documentation clip.",
      },
      {
        type: "video",
        src: "mappa_def2.mp4",
        alt: "Humuscene environment sequence",
        caption: "Environment sequence.",
      },
      {
        type: "image",
        src: "animazione_procedurale.gif",
        alt: "Humuscene procedural image",
        caption: "Procedural visual fragment.",
      },
    ],
  }),
  createProject({
    folder: "06-Dicor",
    slug: "dicor",
    title: "Dicor",
    subtitle: "Material surfaces translated into interface behaviour",
    category: "Material interface",
    year: "2025",
    role: "Interaction design, prototyping, visual system",
    summary:
      "An exploration of material language, surface, and digital translation through texture and motion.",
    description:
      "Use this text field for the final project summary and for describing the relationship between the tactile and digital dimensions of the work.",
    credits: [
      "Project credits placeholder",
      "Fabrication or technical support can be listed here",
    ],
    links: [],
    preview: {
      type: "video",
      src: "f1b3707b1e3682ebbc3a36f2ea25cd5a.mov",
      alt: "Dicor preview image",
    },
    media: [
      {
        type: "image",
        src: "original_81b074c6e9155dbba907415816b7e034.jpg",
        alt: "Dicor still",
        caption: "Primary still.",
      },
      {
        type: "video",
        src: "20db29042c2c61ef812dea94cc97cc9d.mp4",
        alt: "Dicor video",
        caption: "Prototype or installation footage.",
      },
      {
        type: "video",
        src: "9bba3515df0cb4d281fe63ff5cfd5315.mp4",
        alt: "Dicor supporting video",
        caption: "Supporting video excerpt.",
      },
    ],
  }),
  createProject({
    folder: "07-Radici",
    slug: "radici",
    title: "Radici",
    subtitle: "Touch, memory, and embodied presence",
    category: "Interactive installation",
    year: "2025",
    role: "Interaction concept, experience design, documentation",
    summary:
      "A project shaped around touch and memory within an interactive spatial environment.",
    description:
      "This space is reserved for a concise description of the concept, interaction model, and role of the installation environment.",
    credits: [
      "Project credits placeholder",
      "Venue or workshop support can be added here",
    ],
    links: [],
    preview: {
      type: "image",
      src: "DSC09068.jpg",
      alt: "Radici preview image",
    },
    media: [
      {
        type: "image",
        src: "DSCF2134.JPG",
        alt: "Radici still",
        caption: "Installation documentation.",
      },
      {
        type: "video",
        src: "REGISTRAZIONE TOUCH.mp4",
        alt: "Radici interaction recording",
        caption: "Touch interaction sequence.",
      },
      {
        type: "image",
        src: "DSC09106.jpg",
        alt: "Radici spatial still",
        caption: "Spatial context view.",
      },
    ],
  }),
  createProject({
    folder: "08-Theremin900",
    slug: "theremin900",
    title: "Theremin900",
    subtitle: "Gesture, electronics, and sonic experimentation",
    category: "Experimental instrument",
    year: "2024",
    role: "Interaction design, hardware experimentation, prototyping",
    summary:
      "An experimental instrument project exploring gesture, electronics, and performance.",
    description:
      "Use this area for a short description of the instrument logic, technical approach, and the behaviour of the prototype in use.",
    credits: [
      "Project credits placeholder",
      "Fabrication notes can be inserted here",
    ],
    links: [],
    preview: {
      type: "image",
      src: "DSCF1264_mod3.jpg",
      alt: "Theremin900 preview image",
    },
    media: [
      {
        type: "image",
        src: "DSCF1274.JPG",
        alt: "Theremin900 still",
        caption: "Studio still.",
      },
      {
        type: "video",
        src: "theremin.mp4",
        alt: "Theremin900 demo",
        caption: "Demo sequence.",
      },
      {
        type: "video",
        src: "theremin900.mp4",
        alt: "Theremin900 supporting clip",
        caption: "Supporting clip.",
      },
    ],
  }),
  createProject({
    folder: "09-Admirari_Silva",
    slug: "admirari-silva",
    title: "Admirari Silva",
    subtitle: "Atmosphere, pacing, and exhibition staging",
    category: "Exhibition experience",
    year: "2024",
    role: "Experience design, curation support, visual direction",
    summary:
      "An exhibition-focused project centered on atmosphere, staging, and visual pacing.",
    description:
      "This placeholder is intended for the final exhibition statement and the description of your role in shaping the visitor experience.",
    credits: [
      "Project credits placeholder",
      "Curatorial or institutional partners can be listed here",
    ],
    links: [],
    preview: {
      type: "image",
      src: "IMG_0501.jpg",
      alt: "Admirari Silva preview image",
    },
    media: [
      {
        type: "image",
        src: "DSC05720.jpg",
        alt: "Admirari Silva still",
        caption: "Exhibition context.",
      },
      {
        type: "video",
        src: "admirari silva intro.mp4",
        alt: "Admirari Silva video",
        caption: "Moving image excerpt.",
      },
      {
        type: "image",
        src: "DSC05731.jpg",
        alt: "Admirari Silva detail",
        caption: "Documentation detail.",
      },
    ],
  }),
  createProject({
    folder: "10-Displace_Input",
    slug: "displace-input",
    title: "Displace Input",
    subtitle: "Printed matter, motion, and exhibition graphics",
    category: "Editorial installation",
    year: "2024",
    role: "Art direction, publication system, motion assets",
    summary:
      "A project investigating displacement through posters, moving image, and exhibition graphics.",
    description:
      "Use this project page for the final concept text and to describe how the visual outputs move across print, motion, and installation.",
    credits: [
      "Project credits placeholder",
      "Production or print partners can be listed here",
    ],
    links: [],
    preview: {
      type: "image",
      src: "manifesti.jpg",
      alt: "Displace Input preview image",
    },
    media: [
      {
        type: "image",
        src: "manifesti2.jpg",
        alt: "Displace Input posters",
        caption: "Poster system.",
      },
      {
        type: "video",
        src: "teaser_finale_2.mp4",
        alt: "Displace Input teaser",
        caption: "Teaser clip.",
      },
      {
        type: "image",
        src: "scanner_exhibit-01_3.gif",
        alt: "Displace Input animated detail",
        caption: "Animated exhibit detail.",
      },
    ],
  }),
];

export const visualExperiments = [
  {
    slug: "experiment-01",
    title: "Experiment 01",
    src: "assets/visual-experiments/experiment-01.svg",
    alt: "Black and white geometric visual experiment number one",
  },
  {
    slug: "experiment-02",
    title: "Experiment 02",
    src: "assets/visual-experiments/experiment-02.svg",
    alt: "Black and white geometric visual experiment number two",
  },
  {
    slug: "experiment-03",
    title: "Experiment 03",
    src: "assets/visual-experiments/experiment-03.svg",
    alt: "Black and white geometric visual experiment number three",
  },
  {
    slug: "experiment-04",
    title: "Experiment 04",
    src: "assets/visual-experiments/experiment-04.svg",
    alt: "Black and white geometric visual experiment number four",
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
