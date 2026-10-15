/**
 * Search Catalog for Global Command Palette (Cmd+K)
 * Covers all portfolio sections, featured projects, and core skillsets.
 */

export const SEARCH_ITEMS = [
  // --- SECTIONS (9 items) ---
  {
    id: 'sec-hero',
    title: 'Home / Hero',
    category: 'Sections',
    targetId: 'hero',
    badge: 'Section',
    description: 'Interactive 2.5D cursor-tracking character hero with photo capture & physics',
    keywords: 'hero home top header cursor tracking 2.5d avatar camera photo atul kant verma'
  },
  {
    id: 'sec-about',
    title: 'About / Who I Am',
    category: 'Sections',
    targetId: 'about',
    badge: 'Section',
    description: 'Personal narrative, accounting background & ADCA education in Daltonganj, Jharkhand',
    keywords: 'about me story education who i am background biography adca infocity daltonganj biodata bio-data qualifications vision competencies career objective'
  },
  {
    id: 'sec-skills',
    title: 'Skills & Technologies',
    category: 'Sections',
    targetId: 'skills',
    badge: 'Section',
    description: 'Categorized accounting, tax, software engineering & cloud technical stacks',
    keywords: 'skills tech languages frontend backend tools stack proficiency accounting tally'
  },
  {
    id: 'sec-experience',
    title: 'Journey & Experience',
    category: 'Sections',
    targetId: 'experience',
    badge: 'Section',
    description: 'Work history across GST filing, Tally accounting, DAY-NULM MIS, and Smart Card operations',
    keywords: 'experience work jobs career history timeline trajectory roles gst tally mis smart card'
  },
  {
    id: 'sec-projects',
    title: 'Selected Work / Projects',
    category: 'Sections',
    targetId: 'projects',
    badge: 'Section',
    description: 'Curated engineering case studies, interactive compliance engine & state machine',
    keywords: 'projects work case studies policyguard payment gateway state machine chromacanvas aetheria'
  },
  {
    id: 'sec-achievements',
    title: 'Milestones & Certifications',
    category: 'Sections',
    targetId: 'achievements',
    badge: 'Section',
    description: 'Professional records, 4+ yrs Tally accounting, 3+ yrs Tax filing & ADCA certification',
    keywords: 'achievements milestones records certifications tally gst tax smart card adca'
  },
  {
    id: 'sec-gallery',
    title: 'Polaroid Studio / Gallery',
    category: 'Sections',
    targetId: 'gallery',
    badge: 'Section',
    description: 'Camera roll memories, snapshot cards & interactive stickers studio',
    keywords: 'gallery polaroid photos camera roll memories snapshots studio pictures camera'
  },
  {
    id: 'sec-playground',
    title: 'Physics Lab / Cursor Tuner',
    category: 'Sections',
    targetId: 'playground',
    badge: 'Section',
    description: 'Real-time cursor kinematics, particle speed & spring physics tuner playground',
    keywords: 'lab playground physics tuner butterfly speed trail scale controls kinematics'
  },
  {
    id: 'sec-contact',
    title: 'Get In Touch / Contact',
    category: 'Sections',
    targetId: 'contact',
    badge: 'Section',
    description: 'Direct inquiry form, email & Daltonganj location',
    keywords: 'contact get in touch email atulravi2015@gmail.com location message hire form inquiry address'
  },

  // --- FEATURED PROJECTS (4 items) ---
  {
    id: 'proj-policyguard',
    title: 'PolicyGuard AI / Compliance Engine',
    category: 'Projects',
    targetId: 'projects',
    badge: '01 Flagship',
    description: 'Enterprise regulatory compliance & audit verification engine with live scanner',
    keywords: 'policyguard ai regulatory compliance audit engine nlp tax gst verification claude'
  },
  {
    id: 'proj-payment',
    title: 'Payment Gateway / State Machine',
    category: 'Projects',
    targetId: 'projects',
    badge: '02 Flagship',
    description: 'Distributed transaction architecture with interactive state machine & idempotency',
    keywords: 'payment gateway state machine idempotency transactions stripe tally financial inventory'
  },
  {
    id: 'proj-chroma',
    title: 'ChromaCanvas Studio',
    category: 'Projects',
    targetId: 'projects',
    badge: '03 Creative Tech',
    description: 'GPU-accelerated WebGL shader & 250k particle playground with audio reactivity',
    keywords: 'chromacanvas webgl three.js glsl shaders particles audio reactive canvas'
  },
  {
    id: 'proj-aetheria',
    title: 'Aetheria Design System',
    category: 'Projects',
    targetId: 'projects',
    badge: '04 Design System',
    description: 'High-performance minimalist component library with Tailwind v4 & spring physics',
    keywords: 'aetheria design system radix ui components tailwind framer motion tokens'
  },

  // --- SKILLS & TOOLS (14 items) ---
  {
    id: 'skill-tally',
    title: 'Tally ERP & Tally Prime',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Accounting',
    description: 'Comprehensive financial accounting, inventory vouchers & balance sheet management',
    keywords: 'tally prime erp accounting vouchers balance sheet ledgers finance inventory'
  },
  {
    id: 'skill-gst',
    title: 'GST E-Filing & Compliance',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Taxation',
    description: 'GST compliance, reconciliation, GSTR-1/3B filing & regulatory audit advisory',
    keywords: 'gst e-filing returns reconciliation compliance tax gstr-1 gstr-3b'
  },
  {
    id: 'skill-itr',
    title: 'Income Tax E-Filing & Audit',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Taxation',
    description: 'ITR-1 to ITR-4 filing, tax computations, deduction optimization & client advisory',
    keywords: 'income tax itr e-filing computation returns audit deduction advisory'
  },
  {
    id: 'skill-excel',
    title: 'Advanced MS Excel & MIS',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Productivity',
    description: 'VLOOKUP, XLOOKUP, Pivot Tables, MIS trainee analytics & DAY-NULM reporting',
    keywords: 'excel ms office word powerpoint mis reporting analytics vlookup pivot'
  },
  {
    id: 'skill-react',
    title: 'React 19',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Frontend (96%)',
    description: 'Modern UI, Server Actions, concurrent rendering & 120 FPS cursor kinematics',
    keywords: 'react react19 frontend hooks jsx web components virtual dom'
  },
  {
    id: 'skill-python',
    title: 'Python',
    category: 'Skills',
    targetId: 'skills',
    badge: 'AI & Backend (92%)',
    description: 'FastAPI microservices, LangChain, Document Intelligence & data pipelines',
    keywords: 'python fastapi ml ai langchain pandas microservices scripts'
  },
  {
    id: 'skill-java',
    title: 'Java',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Languages (95%)',
    description: 'OOP, multithreading, concurrent architectures & JVM performance tuning',
    keywords: 'java oop backend dsa algorithms spring jvm multithreading'
  },
  {
    id: 'skill-cpp',
    title: 'C / C++',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Languages (90%)',
    description: 'Systems programming, STL containers, low-level memory & competitive coding',
    keywords: 'c c++ stl memory systems competitive programming pointers algorithms'
  },
  {
    id: 'skill-tailwind',
    title: 'Tailwind CSS v4',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Frontend (98%)',
    description: 'Zero-runtime design tokens, responsive layouts, glassmorphism & modern styling',
    keywords: 'tailwind css styling responsive design tokens glassmorphism css3'
  },
  {
    id: 'skill-node',
    title: 'Node.js',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Backend (92%)',
    description: 'Event-driven server microservices, Express, WebSockets & streaming data',
    keywords: 'node nodejs backend express server api event loop rest'
  },
  {
    id: 'skill-postgres',
    title: 'PostgreSQL',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Backend (94%)',
    description: 'ACID relational database, row-level locks, b-tree indexing & query planning',
    keywords: 'postgresql postgres sql db database acid relational indexing'
  },
  {
    id: 'skill-aws',
    title: 'AWS & Cloud',
    category: 'Skills',
    targetId: 'skills',
    badge: 'Cloud (88%)',
    description: 'EC2, S3, RDS PostgreSQL & AWS Bedrock foundation model integrations',
    keywords: 'aws cloud amazon bedrock s3 ec2 devops lambda serverless'
  },
  {
    id: 'skill-docker',
    title: 'Docker',
    category: 'Skills',
    targetId: 'skills',
    badge: 'DevOps (90%)',
    description: 'Multi-stage container builds & Docker Compose microservices orchestration',
    keywords: 'docker containers devops compose images virtualization orchestration'
  },
  {
    id: 'skill-git',
    title: 'Git & GitHub',
    category: 'Skills',
    targetId: 'skills',
    badge: 'DevOps (95%)',
    description: 'Version control, interactive rebasing & GitHub Actions CI/CD workflows',
    keywords: 'git github actions version control vcs ci cd workflow repository'
  }
];
