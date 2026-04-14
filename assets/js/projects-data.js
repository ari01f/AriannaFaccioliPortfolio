export const siteData = {
  owner: "Arianna Faccioli",
  label: "Interaction designer and creative technologist",
  bio: ` Arianna Faccioli (IT) is a creative technologist and multidisciplinary designer working across digital design, creative coding, and data visualization — examining how generative systems construct identities and narratives, mostly in Bologna, and often elsewhere.`,
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

function processBlocks(folder, blocks) {
  if (!blocks || !Array.isArray(blocks)) {
    return undefined;
  }

  return blocks.map((block) => {
    if (block.type === "media-full" && block.media) {
      return {
        ...block,
        media: withFolder(folder, block.media),
      };
    } else if (block.type === "two-column" && block.items) {
      return {
        ...block,
        items: block.items.map((item) => {
          if (item.type === "text") {
            return item;
          }
          return withFolder(folder, item);
        }),
      };
    }
    return block;
  });
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
    blocks = undefined,
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
    ...(blocks ? { blocks: processBlocks(folder, blocks) } : {}),
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
  return projects.map(({ slug, title, category, year, summary, subtitle, preview }) => ({
    slug,
    title,
    category,
    year,
    summary: summary || subtitle,
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
    title: "Prompted Identities",
    subtitle: "Exploring representational bias in text-to-image models",
    category: "AI | Data Visualization | Critical AI",
    year: "2026",
    role: "Interaction design, art direction, prototyping",
    description:
      "An interactive and informative platform based on a synthetic dataset of 4,000 images generated with Stable Diffusion. The project investigates how generative models construct visual identities across professions, revealing recurring patterns and biases embedded in training data. The project is publicly available on <a href=\"https://ari01f.github.io/Prompted-Identities/landing.html\" target=\"_blank\" rel=\"noreferrer\" class=\"clickable-link\">GitHub</a>, where its structure and methodology can be further explored.",

    links: [],
    preview: {
      type: "video",
      src: "filmati/preview.mov",
      alt: "Prompted Identities interface still",
    },
    media: [
      {
        type: "video",
        src: "filmati/similarity_x2.mov",
        alt: "Prompted Identities interface still",
        caption: "Through direct visualization, users can explore large-scale outputs, compare models, and navigate clusters generated via dimensionality reduction. The system integrates face analysis, object detection, and similarity mapping into an interactive interface designed to expose how AI systems visually encode identity.",
      },
      {
        type: "video",
        src: "workinprogress/screenrecord.mp4",
        alt: "Prompted Identities interaction demo",
        caption: "Interactive demonstration of the platform."
      },
    ],
    blocks: [
      {
        type: "media-full",
        media: {
          type: "video",
          src: "filmati/About_x2.mov",
          alt: "Prompted Identities interface still",
        }
      },
      {
        type: "caption",
        content: "The About section introduces the critical context of the project, focusing on large-scale datasets such as LAION-5B and the implications of their opacity. Through a scrolling-telling structure, the content unfolds progressively, making the relationship between data collection, classification, and generation more legible. Rather than a linear narrative, the section is layered: as the user scrolls, connections emerge between datasets, models, and representation, highlighting how identity is reduced to computable and often stereotyped categories."
      },
            {
        type: "media-full",
        media: {
          type: "video",
          src: "filmati/similarity_x2.mov",
          alt: "Prompted Identities interface still",
        }
      },
      {
        type: "caption",
        content: "Through direct visualization, users can explore large-scale outputs, compare models, and navigate clusters generated via dimensionality reduction. The system integrates face analysis, object detection, and similarity mapping into an interactive interface designed to expose how AI systems visually encode identity."
      },
      {
        type: "two-column",
        items: [
          {
            type: "video",
            src: "workinprogress/ANTEPRIMA.mp4",
            alt: "Prompted Identities detailed exploration"
          },
          {
            type: "video",
            src: "workinprogress/screenrecord.mp4",
            alt: "Prompted Identities interaction demo"
          },
        
        ]
      },
      {
        type: "caption",
        content: "The project incorporates a computational analysis layer applied to generated faces, using face analysis models to estimate attributes such as age, gender, and ethnicity. These parameters are aggregated and compared to identify recurring patterns and statistical distortions, making explicit the underlying logic through which generative systems infer and standardize identity."
      }
    ]
  }),
  createProject({
    folder: "02-Interspecie",
    slug: "interspecie",
    title: "Interspecie",
    subtitle: "Ecological coexistence through data visualization",
    category: "Data Visualization | Ecology | Website",
    year: "2025",
    role: "Concept, interaction design, spatial storytelling",
    summary:
      "Ecological coexistence through data visualization",
    description:
      "An interactive visualization platform based on iNaturalist observations from the Parco Regionale del Fiume Sile. The project reorganizes biodiversity data into spatial categories that merge natural and human-made environments, highlighting coexistence, adaptation, and ecological imbalance.The project is publicly available on <a href=\"https://ari01f.github.io/Interspecie_definitivo/intro.html\" target=\"_blank\" rel=\"noreferrer\" class=\"clickable-link\">GitHub</a>.",
    links: [],
    preview: {
      type: "video",
      src: "preview.mov",
      alt: "Interspecie preview",
    },
    media: [
      {
        type: "video",
        src: "preview.mov",
        alt: "Interspecie still",
        caption: "Data is parsed and reorganized into hybrid spatial categories combining ecological and anthropogenic elements. The system includes clustering logic based on taxonomy, origin, and conservation status, and a scroll-driven structure that progressively reveals environmental layers. Each observation is linked to geolocation and hierarchical biological metadata.",
      },
      {
        type:"video",
        src:"scrolling_x2.mov",
        alt: "Interspecie scrolling demo",
        caption: "Users navigate a layered system that progressively reveals environmental strata and species distribution, integrating clustering and filtering to explore biological classifications, endangered species, and invasive dynamics."
      },
      
    ],
     blocks: [
      {
        type: "media-full",
        media: {
          type: "video",
          src: "preview.mov",
          alt: "Prompted Identities interface still",
        }
      },
      {
        type: "caption",
        content: "Data is parsed and reorganized into hybrid spatial categories combining ecological and anthropogenic elements. The system includes clustering logic based on taxonomy, origin, and conservation status, and a scroll-driven structure that progressively reveals environmental layers. Each observation is linked to geolocation and hierarchical biological metadata."
      },
            {
        type: "media-full",
        media: {
          type: "video",
          src: "scrolling_x2.mov",
          alt: "Prompted Identities interface still",
        }
      },
      {
        type: "caption",
        content: "Users navigate a layered system that progressively reveals environmental strata and species distribution, integrating clustering and filtering to explore biological classifications, endangered species, and invasive dynamics."
      },
      {
        type: "two-column",
        items: [
          {
            type: "image",
            src: "home.png",
            alt: "Interspecie homepage"
          },
          {
            type: "image",
            src: "2.jpg",
            alt: "Interspecie filtering system"
          }
        ]
      }
    ]
  }),
  createProject({
    folder: "03-Hemstacks",
    slug: "hemstacks",
    title: "Hemispherical Stacks",
    subtitle: "Speculative scenario visualization platform",
    category: "Digital experience",
    year: "2025",
    role: "AI | Visual design | Shader",
    summary:
      "A system-oriented interface project balancing informational complexity with clarity and pace.",
    description:
      "Hemispherical Stacks is a scenario fiction project developed in collaboration with <a href=\"https://gigadesignstudio.com/projects/antikythera-hemispherical-stacks\" target=\"_blank\" rel=\"noreferrer\" class=\"clickable-link\">Giga</a> during my internship experience, for <a href=\"https://journal.antikythera.org\" target=\"_blank\" rel=\"noreferrer\" class=\"clickable-link\">Antikythera</a>, an editorial initiative by MIT Press. The project reworks theoretical and research-based content not in the form of articles, but through explorable spaces: scenographic environments that translate the dynamics of contemporary computation and their geopolitical implications into an interactive and visual form.",
    links: [],
    preview: {
      type: "video",
      src: "09357ad327523e37963714fd834273ad.mov",
      alt: "Hemstacks preview image",
    },
    media: [
      {
        type: "video",
        src: "f165baedc12a49ef5537e64511e5e17e.mp4",
        alt: "Hemstacks interface view",
        caption: "The project constructs speculative dioramas derived from research texts and articles published on the Antikythera platform.",
      },
      {
        type: "image",
        src: "original_2e464e39921b0251e652f37387e6cf07.png",
        alt: "Hemstacks supporting still",
        caption: "Supporting still."
      },
    ],
    blocks: [
      {
        type: "media-full",
        media: {
          type: "video",
          src: "f165baedc12a49ef5537e64511e5e17e.mp4",
          alt: "Hemstacks interface view",
        }
      },
      {
        type: "caption",
        content: "The project constructs speculative dioramas derived from research texts and articles published on the Antikythera platform. Rather than illustrating concepts, the system translates extracted theoretical elements into spatial compositions through an iterative prompting process. Infrastructure, extraction, and computation are treated as spatial components, generating environments that function as constructed scenarios rather than representations."
      },
      {
        type: "media-full",
        media: {
          type: "image",
          src: "original_1980e37e90f766fcaf83854fb6aa7217.png",
          alt: "Hemstacks scenario visualization",
        }
      },
      {
        type: "media-full",
        media: {
          type: "image",
          src: "original_37ff6ac79ecf99113c41271e24bc0f7d.png",
          alt: "Hemstacks environment detail",
        }
      },
      {
        type: "media-full",
        media: {
          type: "image",
          src: "original_6556c6ca3810e6309101f71cd714b71a.png",
          alt: "Hemstacks spatial composition",
        }
      },
      {
        type:"caption",
        content:"The images are transformed into three-dimensional spaces using depth maps generated with ComfyUI. Interaction is driven by a shader that combines depth, luminance, and cursor position, reconstructing each scene as a responsive field rather than a static image. Visibility is partial and dynamic: elements emerge locally through interaction and recede outside the focal area."
      }
    ]
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
      type: "video",
      src: "preview.mov",
      alt: "Radici preview video",
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
      type: "video",
      src: "theremin.mp4",
      alt: "Theremin900 preview video",
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
      type: "video",
      src: "preview.mp4",
      alt: "Admirari Silva preview video",
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
      type: "video",
      src: "teaser_finale_2.mp4",
      alt: "Displace Input preview video",
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
