import React, { useState } from 'react';
import { Sparkles, Code2, Server, Globe, Cpu, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';
import { soundFX } from '../utils/audio';

const SKILL_DATA = {
  Java: {
    category: 'Languages',
    title: 'Java',
    level: '95%',
    tag: 'Primary Core Language',
    points: [
      'Primary language for Data Structures, Algorithms, and enterprise backends.',
      'Extensive experience with Object-Oriented Design Principles (SOLID) and Design Patterns.',
      'Multithreaded concurrent systems, JVM memory profiling, and garbage collection tuning.',
      'Oracle Certified Foundation Associate & HackerRank 5-Star Problem Solver.'
    ]
  },
  Python: {
    category: 'Languages',
    title: 'Python',
    level: '92%',
    tag: 'AI / ML & Microservices',
    points: [
      'FastAPI & Flask RESTful microservice development.',
      'Data preprocessing with NumPy, Pandas, and Scikit-Learn.',
      'LangChain & Hugging Face transformer integration for document intelligence.',
      'Asynchronous task scheduling and automated compliance ingestion pipelines.'
    ]
  },
  'C': {
    category: 'Languages',
    title: 'C',
    level: '88%',
    tag: 'Systems Programming',
    points: [
      'Low-level memory management with malloc/free and pointer arithmetic.',
      'Data structure implementations from scratch (Linked Lists, Binary Trees, Hash Maps).',
      'Operating system fundamentals, system calls, and Unix process management.'
    ]
  },
  'C++': {
    category: 'Languages',
    title: 'C++',
    level: '90%',
    tag: 'Competitive Programming',
    points: [
      'STL containers (vector, map, set, priority_queue) and algorithm optimizations.',
      'Object-Oriented programming with templates and RAII memory safety.',
      'High-speed competitive programming on LeetCode (387+) and GeeksforGeeks (382+).'
    ]
  },
  React: {
    category: 'Frontend',
    title: 'React 19',
    level: '96%',
    tag: 'Modern UI & Shaders',
    points: [
      'React 19 Server Components, Actions, and optimistic UI transitions.',
      'High-framerate 60–120 FPS cursor kinematics, rAF animation loops, and canvas graphics.',
      'State management, custom hooks, and zero-runtime CSS tokens.'
    ]
  },
  HTML: {
    category: 'Frontend',
    title: 'HTML5 Semantic',
    level: '98%',
    tag: 'Web Standards',
    points: [
      'Accessible semantic structure (WAI-ARIA, landmarks, screen-reader compliance).',
      'Modern web capabilities: Canvas 2D, Web Audio API, and WebGL context setup.'
    ]
  },
  CSS: {
    category: 'Frontend',
    title: 'CSS3 & Glassmorphism',
    level: '96%',
    tag: 'Design Engineering',
    points: [
      'Complex 3D transforms (`perspective`, `rotateY`, `translate3d`).',
      'GPU hardware acceleration, smoothstep cubic Hermite easing, and sub-pixel antialiasing.'
    ]
  },
  JavaScript: {
    category: 'Frontend',
    title: 'Modern JavaScript (ES6+)',
    level: '96%',
    tag: 'Full-Stack Core',
    points: [
      'Asynchronous event loop, Promises, Async/Await, and Web Workers.',
      'DOM performance tuning, passive event listeners, and layout thrashing elimination.'
    ]
  },
  'Tailwind CSS': {
    category: 'Frontend',
    title: 'Tailwind CSS v4',
    level: '98%',
    tag: 'Design Systems',
    points: [
      'Zero-runtime design tokens and modern theme directives.',
      'Responsive mobile-first grid systems, fluid typography, and dark mode palette.'
    ]
  },
  'Node.js': {
    category: 'Backend',
    title: 'Node.js',
    level: '92%',
    tag: 'Event-Driven Server',
    points: [
      'High-throughput asynchronous non-blocking event-driven architectures.',
      'Express.js and Fastify API gateways with JWT authentication and rate limiting.',
      'Streams, Buffers, and WebSockets for real-time telemetry pipelines.'
    ]
  },
  'PostgreSQL': {
    category: 'Backend',
    title: 'PostgreSQL',
    level: '94%',
    tag: 'Relational Database',
    points: [
      'ACID transactional guarantees with row-level locks and isolation levels.',
      'Complex joins, CTEs, JSONB document querying, and b-tree indexing strategies.',
      'Schema migrations and connection pooling with pgBouncer.'
    ]
  },
  'AWS': {
    category: 'Cloud & DevOps',
    title: 'Amazon Web Services',
    level: '88%',
    tag: 'Cloud Infrastructure',
    points: [
      'EC2, S3, RDS PostgreSQL, IAM security roles, and CloudFront CDN.',
      'AWS Bedrock LLM foundation model integrations.',
      'Serverless Lambda functions and API Gateway orchestration.'
    ]
  },
  'Docker': {
    category: 'Cloud & DevOps',
    title: 'Docker',
    level: '90%',
    tag: 'Containerization',
    points: [
      'Multi-stage Dockerfile builds for minimal production image footprint.',
      'Docker Compose orchestration for multi-container microservice stacks.',
      'Consistent reproducible development environments across machines.'
    ]
  },
  'Git': {
    category: 'Cloud & DevOps',
    title: 'Git & GitHub',
    level: '95%',
    tag: 'Version Control',
    points: [
      'Branching strategies, interactive rebasing, merge conflicts resolution.',
      'GitHub Actions CI/CD pipelines for automated testing and deployment.'
    ]
  }
};

const CATEGORIES = [
  {
    name: 'Languages',
    skills: ['Java', 'Python', 'C', 'C++']
  },
  {
    name: 'Frontend',
    skills: ['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS']
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'PostgreSQL']
  },
  {
    name: 'Tools & Cloud',
    skills: ['AWS', 'Docker', 'Git']
  }
];

export default function SkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState('Java');
  const activeData = SKILL_DATA[selectedSkill] || SKILL_DATA['Java'];

  return (
    <section id="skills" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Section Pill Badge - Reel style */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
        02 ✦ Skills
      </div>

      {/* Heading matching Reel t=9.5s: "What I work with" */}
      <div className="mb-14">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif]">
          What I work with
        </h2>
        <p className="mt-3 text-stone-600 text-sm md:text-base max-w-xl font-normal leading-relaxed">
          Hover or tap any technology to inspect architectural focus, certifications, and production applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Categorized Pill Matrix matching Reel t=9.5s */}
        <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E2D8] shadow-md shadow-stone-900/5">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="space-y-2.5 pb-5 border-b border-[#ECE7DF] last:border-b-0 last:pb-0">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] font-mono">
                {cat.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => {
                  const isSelected = selectedSkill === skill;
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        setSelectedSkill(skill);
                        soundFX.playFocusBeep();
                      }}
                      onMouseEnter={() => {
                        setSelectedSkill(skill);
                      }}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-[#18181B] text-white shadow-md shadow-black/15 scale-105 border border-black'
                          : 'bg-[#FAF8F5] text-stone-700 hover:text-[#18181B] hover:bg-[#F2ECE4] border border-[#E7E2D8]'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Active Skill Detailed Card matching Reel t=9.5s (Dark Charcoal Card) */}
        <div className="lg:col-span-5 bg-[#18181B] text-white p-7 sm:p-9 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden transition-all duration-300">
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF4D6D]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
            <span className="text-xs uppercase tracking-widest font-mono text-[#FF4D6D] font-bold">
              {activeData.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-[10px] font-mono text-stone-300">
              Proficiency: {activeData.level}
            </span>
          </div>

          <h3 className="text-3xl font-extrabold font-['Outfit',sans-serif] tracking-tight text-white mb-1">
            {activeData.title}
          </h3>
          <p className="text-xs text-stone-400 font-medium mb-6">
            {activeData.tag}
          </p>

          {/* Points */}
          <div className="space-y-3 mb-6">
            {activeData.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
                <span className="text-[#FF4D6D] shrink-0 mt-0.5">✦</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Proficiency progress bar */}
          <div className="pt-4 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2 font-mono">
              <span>MASTERY METRIC</span>
              <span className="text-white font-bold">{activeData.level}</span>
            </div>
            <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#FFA4B6] rounded-full transition-all duration-500"
                style={{ width: activeData.level }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
