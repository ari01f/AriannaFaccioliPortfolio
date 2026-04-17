export const siteData = {
  owner: "Arianna Faccioli",
  label: "Interaction designer and creative technologist",
  bio: ` <u>Arianna Faccioli</u> is a multidisciplinary designer based in Bologna. She works across <u>digital design</u>, <u>creative coding</u>, and <u>data visualization</u>, focusing on how generative systems construct imaginaries, identities, and narratives.
She holds a degree in Industrial Design from the University of Bologna and a Master’s in Interaction Design from the University of the Republic of San Marino.<br> Her practice combines technical experimentation with a critical approach, addressing the cultural and political dimensions of data-driven systems.
Her work explores how data, space, and sensory experience can be articulated into narrative-driven interactions. Through projects spanning exhibit design, sound design, creative coding, and web-based visual systems, she develops ways to translate complex processes into accessible and engaging visual and spatial experiences.`,
  links: [
    { label: "Email", href: "mailto:arianna.facciolif01@gmail.com" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
};

function withFolder(folder, media) {
  if (!media) {
    return media;
  }

  return {
    ...media,
    ...(media.src ? { src: `${folder}/${media.src}` } : {}),
    ...(media.poster ? { poster: `${folder}/${media.poster}` } : {}),
    ...(media.mobileSrc ? { mobileSrc: `${folder}/${media.mobileSrc}` } : {}),
  };
}

function processBlocks(folder, blocks) {
  if (!blocks || !Array.isArray(blocks)) {
    return undefined;
  }

  return blocks.map((block) => {
    if (block.type === "media-full" && block.media) {
      if (block.media.type === "html") {
        return {
          type: "html",
          content: block.media.content,
        };
      }

      return {
        ...block,
        media: withFolder(folder, block.media),
      };
    } else if (block.type === "two-column" && block.items) {
      return {
        ...block,
        items: block.items.map((item) => {
          if (item.type === "text" || item.type === "html") {
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
    media = [],
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

  if (!project.blocks && project.media.length < 2) {
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
      src: "filmati/similarity_x2_light.mp4",
      alt: "Prompted Identities preview",
    },
    media: [
      {
        type: "video",
        src: "filmati/similarity_x2.mp4",
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
          src: "filmati/About_x2.mp4",
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
          src: "filmati/similarity_x2.mp4",
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
            mobileSrc: "workinprogress/ANTEPRIMA_mobile.mp4",
            alt: "Prompted Identities detailed exploration"
          },
          {
            type: "video",
            src: "workinprogress/screenrecord.mp4",
            mobileSrc: "workinprogress/SDXL_mobile.mp4",
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
      src: "preview.mp4",
      alt: "Interspecie preview",
    },
    media: [
      {
        type: "video",
        src: "preview.mp4",
        alt: "Interspecie still",
        caption: "Data is parsed and reorganized into hybrid spatial categories combining ecological and anthropogenic elements. The system includes clustering logic based on taxonomy, origin, and conservation status, and a scroll-driven structure that progressively reveals environmental layers. Each observation is linked to geolocation and hierarchical biological metadata.",
      },
      {
        type:"video",
        src:"scrolling_x2.mp4",
        alt: "Interspecie scrolling demo",
        caption: "Users navigate a layered system that progressively reveals environmental strata and species distribution, integrating clustering and filtering to explore biological classifications, endangered species, and invasive dynamics."
      },
      
    ],
     blocks: [
      {
        type: "media-full",
        media: {
          type: "html",
          content: "<div style=\"padding:57.53% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/1183790980?autoplay=1&amp;muted=1&amp;loop=1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" title=\"preview\"></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"></script>",
          alt: "Interspecie preview",
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
          src: "scrolling_x2.mp4",
          alt: "Prompted Identities interface still",
        }
      },
      {
        type: "caption",
        content: "Users navigate a layered system that progressively reveals environmental strata and species distribution, integrating clustering and filtering to explore biological classifications, endangered species, and invasive dynamics."
      },
      
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
      "Speculative scenario visualization platform",
    description:
      "Hemispherical Stacks is a scenario fiction project developed in collaboration with <a href=\"https://gigadesignstudio.com/projects/antikythera-hemispherical-stacks\" target=\"_blank\" rel=\"noreferrer\" class=\"clickable-link\">Giga</a> during my internship experience, for <a href=\"https://journal.antikythera.org\" target=\"_blank\" rel=\"noreferrer\" class=\"clickable-link\">Antikythera</a>, an editorial initiative by MIT Press. The project reworks theoretical and research-based content not in the form of articles, but through explorable spaces: scenographic environments that translate the dynamics of contemporary computation and their geopolitical implications into an interactive and visual form.",
    links: [],
    preview: {
      type: "video",
      src: "09357ad327523e37963714fd834273ad.mp4",
      alt: "Hemispherical Stacks preview",
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
        src: "original_2e464e39921b0251e652f37387e6cf07.jpeg",
        alt: "Hemstacks supporting still",
        caption: "Supporting still."
      },
    ],
    blocks: [
      {
        type: "media-full",
        media: {
          type: "video",
          src:"f165baedc12a49ef5537e64511e5e17e.mp4",
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
          src: "original_f5859062c54863fcc941d448bdeedba6.png",
          alt: "Hemstacks scenario visualization",
        }
      },
      {
        type: "media-full",
        media: {
          type: "image",
          src: "original_a9be37a5a32592853a3ff2fb5c8a3153.png",
          alt: "Hemstacks environment detail",
        }
      },
      {
        type: "media-full",
        media: {
          type: "image",
          src: "original_042b11871e6036e6350a6bb6c718c36b.png",
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
    subtitle: "Audio-reactive visual system for live performance",
    category: "Creative Coding | Audiovisual | Real-time",
    year: "2025",
    role: "Research, narrative design, visual composition",
    summary:
      "Audio-reactive visual system for live performance",
    description:
      "A real-time visual system developed in TouchDesigner during my internship experience at Giga. The system analyzes audio input from Recall’s .WAV format and generates dynamic visuals through an autopilot mode, while also allowing manual intervention for live performance control.",
    credits: [
      "Project credits placeholder",
      "Production notes can be listed here",
    ],
    links: [],
    preview: {
      type: "image",
      src: "original_2796b02af6a170fcccbd5b1eb8845cd5.jpg",
      alt: "Recall preview",
    },
    media: [
      {
        type: "image",
        src: "original_64aec07566dace4ed04986edc499d27c.jpg",
        alt: "Recall still",
        caption: "The project combines generative graphics with sound analysis, creating a flexible system that adapts to both automated and performative contexts.",
      },
      {
        type: "video",
        src: "original_a8645100df1f1e32dbd1da85be963689.mp4",
        alt: "Recall motion fragment",
        caption: "Animated fragment.",
      },
      {
        type: "video",
        src: "original_b5b32d15930e27d9560a554ddc228686.mp4",
        alt: "Recall secondary still",
        caption: "Secondary still.",
      },
    ],
    blocks: [
      {
        type: "media-full",
        media: {
          type: "image",
          src: "original_2796b02af6a170fcccbd5b1eb8845cd5.jpg",
          alt: "Recall still",
        }
      },
      {
        type: "caption",
        content: "The project combines generative graphics with sound analysis, creating a flexible system that adapts to both automated and performative contexts."
      },
      {
        type: "media-full",
        media: {
          type: "video",
          src: "original_a8645100df1f1e32dbd1da85be963689.mp4",
          alt: "The visual engine is based on processed video backgrounds that are deliberately degraded through pixelation and synthesis techniques. This transformation reduces the source footage into abstract geometric structures, which are then recomposed and blended according to the rhythm and intensity of the audio input.",
        }
      },
      {
        type: "caption",
        content: "The visual engine is based on processed video backgrounds that are deliberately degraded through pixelation and synthesis techniques. This transformation reduces the source footage into abstract geometric structures, which are then recomposed and blended according to the rhythm and intensity of the audio input.."
      },
      {
        type: "media-full",
        media: {
          type: "image",
          src: "original_bcade867e664b3cdb9876c55323a44ad.jpg",
          alt: "Recall secondary still",
        }
      },
      {
        type:"image",
        src:"original_d8a30b1a8fbaf4f933483303a9fcc9a5.mp4",
      },
    
    
    ]
  }),
  createProject({
    folder: "05-Humuscene",
    slug: "humuscene",
    title: "Humuscene",
    subtitle: "Speculative VR data environment based on photogrammetry",
    category: "Speculative Design | VR | Point cloud",
    year: "2025",
    role: "Speculative Design | VR | Point cloud",
    summary:
      "A multisensory environment staging ecological imaginaries through moving image and simulated space.",
    description:
      "A speculative 3D data visualization experienced in VR, exploring long-term environmental transformations under climate change.",
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
        src: "mappa_def2.mp4",
        alt: "Humuscene environment sequence",
        caption: "Environment sequence.",
      },
      {
        type: "image",
        src: "animazione_procedurale.mp4",
        alt: "Humuscene procedural image",
        caption: "Procedural visual fragment.",
      },
    ],
    blocks: [
      {
        type: "html",
        content: "<div style=\"padding:56.25% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/1076702543?autoplay=1&amp;muted=1&amp;loop=1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" title=\"Humuscene\"></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"><\/script>"
      },
      {
        type: "caption",
        content: "Built from a photogrammetric scan of the Monastery of Santa Chiara, the project transforms a real-world point cloud into a stratified, evolving environment shaped by decay, growth, and synthetic matter. The experience uses immersive interaction to make speculative data perceptible, shifting from abstract information to embodied exploration."
      },
      {
        type: "two-column",
        items: [
          {
            type: "image",
            src: "cloud_compare-1.png",
            alt: "Humuscene procedural animation",
            caption: "Procedural animation fragment."
          },
          {
            type: "video",
            src: "animazione_procedurale_1.mp4",
            alt: "Humuscene procedural animation 2",
            caption: "Procedural animation fragment."
          }, 
            ]
      },
      {
        type: "caption",
        content: "The project begins with a photogrammetric scan of the site captured using Webinar, generating a detailed point cloud that is cleaned and processed to form the base environment. The dataset is then imported into Blender, where the space is structured into three temporal scenarios (2150, 2500, 3000).Each environment is developed through procedural animation systems that simulate the growth of fungi and invasive species, designed to be adaptable across different spatial contexts. Atmospheric effects are integrated to reinforce depth and immersion, combining realistic rendering with speculative visual cues derived from post-apocalyptic environments."
      }
    ]
  }),
  createProject({
    folder: "06-Dicor",
    slug: "dicor",
    title: "Dicor- Spirito Libro",
    subtitle: "Interactive mini-game for event and book launch",
    category: "Game design | Interaction design | Creative coding",
    year: "2025",
    role: "Game design | Interaction design | Creative coding",
    summary:
      "Interactive mini-game for event and book launch",
    description:
      "A small interactive video game developed at Giga Design Studio for Dicor, designed for the presentation event and launch of the book Spirito Libro. The project translates the publication’s identity into a playable format, creating a simple but engaging interaction that supports the event experience and audience participation.",
    credits: [
      "Project credits placeholder",
      "Fabrication or technical support can be listed here",
    ],
    links: [],
    preview: {
      type: "video",
      src: "f1b3707b1e3682ebbc3a36f2ea25cd5a.mp4",
      alt: "Dicor preview image",
    },
    media: [
      {
        type: "video",
        src: "f1b3707b1e3682ebbc3a36f2ea25cd5a.mp4",
        alt: "Dicor still",
      },
      {
        type: "video",
        src: "20db29042c2c61ef812dea94cc97cc9d.mp4",
        alt: "Dicor video",
        caption: "Prototype or installation footage.",
      },
      {
        type: "video",
        src: "b05a77a3c24333a4d7760d6cdd5e07f6.mp4",
        alt: "Dicor supporting video",
        caption: "Supporting video excerpt.",
      },
      {
        type:"image",
        src:"original_05b6e010f6076514f3f91f7369f1e9eb.jpg",
      },
   ]
    
      },
  ),
  createProject({
    folder: "07-Radici",
    slug: "radici",
    title: "Radici",
    subtitle: "Generative scenography for theater",
    category: "AI | Creative Coding | Real Time visuals",
    year: "2025",
    role: "Interaction concept, experience design, documentation",
    summary:
      "A generative visual installation for the performance Elena by Euripides. The project simulates organic growth through fractal and coral-like structures, creating a dynamic stage environment.",
    description:
      "A generative visual installation for the performance Elena by Euripides. The project simulates organic growth through fractal and coral-like structures, creating a dynamic stage environment.",
    links: [],
    preview: {
      type: "video",
      src: "preview.mp4",
      alt: "Radici preview video",
    },
    blocks: [
      {
        type: "html",
        content: "<div style=\"padding:56.25% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/1095380945?autoplay=1&amp;muted=1&amp;loop=1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" title=\"scenografia3\"></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"><\/script>"
      },
      {
        type: "media-full",
        media: {
          type: "image",
          src: "DSC00889.JPG",
          alt: "Radici still",
        }
      },
      {
        type: "caption",
        content: "The system integrates AI-generated imagery from StreamDiffusion within a real-time pipeline in TouchDesigner, where custom procedural simulations control the growth of fractal and coral-like structures. A live input layer is introduced through Tagtool, enabling real-time drawing synchronized with performers. The setup allows continuous interaction between generative processes and stage action, maintaining a responsive and evolving visual system."
      },
      {
        type: "media-full",
        media: { 
          type: "image",
          src: "DSC08915.jpg",
          alt: "Radici spatial still",
        }
        },
        {
        type: "media-full",
        media: {
          type: "image",
          src: "DSCF2315.JPG",
          alt: "Radici spatial still",
        }
      }
      
    ],
  }),
  createProject({
    folder: "08-Theremin900",
    slug: "theremin900",
    title: "Theremin900",
    subtitle: "Gesture-controlled audiovisual instrument",
    category: "Interaction Design | Audiovisual | Creative Coding",
    year: "2024",
    role: "Interaction design, hardware experimentation, prototyping",
    summary:
      "An experimental instrument project exploring gesture, electronics, and performance.",
    description:
      "An interactive installation that translates hand movements into sound and visuals using Leap Motion. The system generates and modulates sine waves in real time, linking spatial gestures to frequency, amplitude, and visual output. The project explores the relationship between body, sound, and digital matter through a responsive audiovisual interface.",
    links: [],
    preview: {
      type: "video",
      src: "theremin900.mp4",
      alt: "Theremin900 preview",
    },
    blocks: [
      {
        type: "media-full",
        media: {
          type: "html",
          content: "<div style=\"padding:56.25% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/1084000750?autoplay=1&amp;muted=1&amp;loop=1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" title=\"theremin 900\"></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"></script>"
        }
      },
      {
        type: "media-full",
        media: {
          type: "html",
          content:""
        }
      },
      {
        type: "media-full",
        media: {
          type: "video",
          src:"theremin900TD.mp4"
        }
      },
      {
        type: "caption",
        content: "The system uses a Leap Motion sensor to track hand movements, translating them into sound and visual output. The interface allows for real-time modulation of sine waves, creating a responsive audiovisual experience that explores the relationship between gesture, sound, and digital matter."
      },
      {
        type: "two-column", 
        items: [
          {
            type: "video",
            src: "theremin1.mp4",
            alt: "Theremin900 interaction demo",
          },
          {
            type: "video",
            src: "theremin2.mp4",
            alt: "Theremin900 performance footage",
          }
        ]
      }, 
    ]
  }),
  createProject({
    folder: "09-Admirari_Silva",
    slug: "admirari-silva",
    title: "Admirari Silva",
    subtitle: "Immersive soundscape in a natural environment",
    category: "Installation | Sound Art | Interaction design",
    year: "2024",
    role: "Experience design, curation support, visual direction",
    summary:
      "Immersive soundscape in a natural environment",
    description:
      "An environmental installation set in the forest of Scardavilla, combining spatial audio and projection mapping. Visitors navigate the space through sound, interacting with an evolving sonic system that responds to movement.The project creates a layered dialogue between landscape, history, and digital media, culminating in a collective performative experience.",
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
    blocks: [
      {
        type: "media-full",
        media: {
          type: "html",
          content: "<div style=\"padding:56.25% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/1083109260?autoplay=1&amp;muted=1&amp;loop=1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" title=\"Admirari Silva\"></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"></script>"
        }
      },
      {
        type:"caption",
        content:"The installation combines spatial audio with projection mapping to create an immersive environment. Visitors navigate the space through sound, interacting with an evolving sonic system that responds to movement. The project creates a layered dialogue between landscape, history, and digital media, culminating in a collective performative experience."
      },
      {
        type: "two-column",
        items: [
          {
            type: "video",
            src: "EXATR1.mp4",
          },
          {
            type: "video",
            src:"EXATR2.mp4",
            alt: "Admirari Silva documentation image",
          }
        ]
      
      },
      {
        type: "caption",
        content: "The exhibit Admirari Silva was presented alongside other projects from the course as part of the exhibition Geografie Rizomatiche e Liminali at EXATR. The exhibition explored how design can reactivate abandoned spaces in the Romagna region, using site-specific interventions to reinterpret their spatial and cultural potential."
      }

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
      "A project exploring the relationship between natural environments and digital manipulation. Starting from on-site photographic surveys, images are processed through UV mapping and displacement techniques in TouchDesigner.The work reflects on how digital systems reinterpret physical landscapes, creating altered visual states that question perception and representation.",

    links: [],
    preview: {
      type: "video",
      src: "teaser_finale_2.mp4",
      alt: "Displace Input preview",
    },
blocks: [
      {
        type: "media-full",
        media: {
          type: "html",
          content: "<div style=\"padding:56.25% 0 0 0;position:relative;\"><iframe src=\"https://player.vimeo.com/video/1010658953?autoplay=1&amp;muted=1&amp;loop=1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" style=\"position:absolute;top:0;left:0;width:100%;height:100%;\" title=\"Displace input 01 - VISUAL IDENTITY\"></iframe></div><script src=\"https://player.vimeo.com/api/player.js\"></script>"
        }
      },
      {
        type:"caption",
        content:"The installation combines spatial audio with projection mapping to create an immersive environment. Visitors navigate the space through sound, interacting with an evolving sonic system that responds to movement. The project creates a layered dialogue between landscape, history, and digital media, culminating in a collective performative experience."
      },
      {
        type: "two-column",
        items: [
          {
            type: "image",
            src: "manifesti2.jpg",
          },
          {
            type: "image",
            src:"manifesti3.jpg",
            
          }
        ]
      },
      {
        type: "media-full",
        media: {
          type: "image",
          src: "BIG-Milano_Dropcity42-3-1.jpg",
          alt: "Displace Input documentation image",
        }
      },
      {
        type:"media-full",
        media: {
          type: "image",
          src: "BIG-Milano_Dropcity42-8.jpeg",
          alt: "Displace Input documentation image",
        }
      },
      {
        type: "caption",
        content: "The project was part of the 2024 International Biennial of Graphics in Milan, presented within Dropcity’s expo D/STANZE – Forms, Relations, Approximations. The exhibition explored the concept of distance as a fluid, dynamic element, taking shape through multiple forms, relationships, and interpretations.",
      }

    ],
  }),
];

export const visualExperiments = [
  {
    slug: "experiment-01",
    title: "Critical coding cookbook",
    src: "Esperimenti/Critical_coding_cookbook.jpeg",
    alt: "Critical coding cookbook visual experiment",
    href:"https://criticalcode.recipes"
  },
  {
    slug: "experiment-02",
    title: "Morphing landscapes",
    src: "Esperimenti/AI_morphing.mp4",
    alt: "Morphing landscapes visual experiment",
    href:"https://d2w9rnfcy7mm78.cloudfront.net/1972759/original_c8e03c976884489bc98ee1854f33f782.gif?1522428860?bc=1"
  },
  {
    slug: "experiment-03",
    title: "Composite Process",
    src: "Esperimenti/composite_process.mp4",
    alt: "Composite Process visual experiment",
  },
  {
    slug: "experiment-04",
    title: "Cool Spreadsheet- Wilderness Land",
    src: "Esperimenti/Wild.png",
    alt: "Wild visual experiment",
    href:"https://wilderness.land"
  },
  {
    slug: "experiment-05",
    title: "https://coffee.youngjo.com",
    src: "Esperimenti/coffe.png",
    alt: "Coffee sequences visual experiment",
    href:"https://coffee.youngjo.com"
  },
  {
    slug: "experiment-06",
    title: "Archival counciousness",
    src: "Esperimenti/Archival.png",
    alt: "Archival counciousness",
    href: "https://www.archivalconsciousness.org/?fbclid=PAZXh0bgNhZW0CMTEAAacSmGmKUl2f9ZgafqhBNLs3Kk_E2bP3qnDb5DPf5KkPQbOufwhH6DJYAdBL0A_aem_t7Nm59EhwEiwAJqQYRl_DQ"
  },
  {
    slug: "experiment-07",
    title: "Pygmalionproject",
    src: "Esperimenti/pygmalionproject.png",
    alt: "pygmalionproject",
    href:"https://pygmalionproject.online/C15"
  },
  {
    slug:"direct technique",
    title:"Direct visualization techniques ",
    src:"Esperimenti/directvix.png",
    alt:"Direct technique visual experiment",
    href:"https://ahnp.ub.uni-heidelberg.de/journals/dah/article/view/33529/27217"
  },
  {
    slug:"experiment-08",
    title:"Moss",
    src:"Esperimenti/moss.png",
  },
  {
    slug:"experiment-09",
    title:"Moss",
    src:"Esperimenti/microgreens.png",
  },
  {
    slug:"experiment-10",
    title:"We Built This City On",
    src:"Esperimenti/We Built This City On.png",
    href:"https://everynoise.com/cities.html"
  },
  {
    slug:"python-visualization",
    title:"Python visualization",
    src:"Esperimenti/output2.mp4",
    alt:"Python visualization experiment",
    href:"https://example.com/python-visualization"
  },
  {
    slug:"experiment-12",
    title:"Touchdesigner experiments",
    src:"Esperimenti/output.mp4",
    alt:"Touchdesigner experiments visual experiment",
  },
  {
    slug:"experiment-13",
    title:"Crows sunbathing",
    src:"Esperimenti/crows.png",
    alt:"Data visualization experiment",
    href:"https://www.inaturalist.org/observations?place_id=any&subview=map&taxon_id=any"
  },
  {
    slug:"experiment-14",
    title:"AI & conflicts",
    src:"Esperimenti/Ai.png",
    alt:"AI & conflicts visual book cover",
    href:"https://www.krisispublishing.com/prodotto/ai-conflicts-02/"
  },
  {
    slug:"experiment-15",
    title:"CYBERFEMINISM INDEX",
    src:"Esperimenti/mindyseu.png",
    alt:"AI & conflicts visual book cover",
    href:"https://cyberfeminismindex.com/"
  },
  {
    slug:"experiment-16",
    title:"Critical field guide to AI",
    src:"Esperimenti/knowing_machines.png",
    alt:"Critical field guide to AI",
    href:"https://knowingmachines.org/critical-field-guide"

  }
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
