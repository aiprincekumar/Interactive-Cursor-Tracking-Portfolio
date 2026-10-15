import React, { useState } from 'react';
import { Briefcase, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFX } from '../utils/audio';

const EXPERIENCES = [
  {
    id: 'exp-01',
    period: '2024 — PRESENT',
    status: 'Current Role',
    role: 'Lead Creative Developer',
    company: 'Independent & Studio Works',
    location: 'Remote / Hybrid',
    description: 'Architecting cinematic high-framerate web applications, 2.5D cursor kinematics, and AI compliance dashboards.',
    deliverables: [
      'Engineered multi-variant interactive cursor physics with spring kinematics at 120 FPS',
      'Designed accessible zero-runtime design token system and responsive layout engine',
      'Integrated procedural Web Audio synthesis for instantaneous tactile haptics'
    ],
    techStack: ['React 19', 'WebGL', 'Tailwind CSS', 'GLSL', 'Web Audio API', 'TypeScript'],
    accentColor: '#FF4D6D',
    activeHighlight: true
  },
  {
    id: 'exp-02',
    period: '2023 — 2024',
    status: 'Enterprise Systems',
    role: 'AI Systems Engineer',
    company: 'Enterprise Legal & FinTech',
    location: 'Production Systems',
    description: 'Engineered vector graph retrieval pipelines, sub-second latency inference gates, and compliance telemetry.',
    deliverables: [
      'Built automated legal verification pipelines handling multimodal document intelligence',
      'Optimized vector search inference latency down from 1.4s to under 180ms',
      'Engineered ACID-compliant audit logging and state-machine transaction safety'
    ],
    techStack: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Vector Search', 'PostgreSQL'],
    accentColor: '#8B5CF6',
    activeHighlight: false
  },
  {
    id: 'exp-03',
    period: '2022 — 2023',
    status: 'Foundations & R&D',
    role: 'Creative Coding & WebGL',
    company: 'Frontend Innovations',
    location: 'Aditya & Labs',
    description: 'Prototyped GLSL fragment shader art, GPU particle simulations, and accessibility-first motion tokens.',
    deliverables: [
      'Constructed GPU-accelerated particle canvas supporting 250k real-time simulated nodes',
      'Programmed custom GLSL fragment shaders for procedural noise and fluid dynamics',
      'Trained in full-stack enterprise engineering and algorithms at Technical Hub'
    ],
    techStack: ['JavaScript', 'Three.js', 'GLSL Shaders', 'Node.js', 'Canvas API', 'Java'],
    accentColor: '#3B82F6',
    activeHighlight: false
  }
];

export default function ExperienceSection() {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (id) => {
    setActiveCard(id === activeCard ? null : id);
    soundFX.playPop();
  };

  return (
    <section id="experience" className="py-24 px-4 md:px-8 max-w-6xl mx-auto scroll-mt-28">
      <div className="bg-white rounded-3xl border border-[#E7E2D8] p-8 md:p-12 shadow-xl shadow-stone-900/5 relative overflow-hidden">
        {/* Soft subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D6D]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
          03 ✦ Experience
        </div>

        {/* Header with Title, Period Pill, and Coral Accent Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif]">
              Journey &amp; Experience
            </h2>
            <div className="w-12 h-1 bg-[#FF4D6D] rounded-full mt-4" />
            <p className="mt-3 text-stone-600 text-sm md:text-base max-w-xl font-normal leading-relaxed">
              Production engineering milestones bridging interactive frontend mechanics with high-assurance AI backend systems.
            </p>
          </div>

          {/* Subtitle / Period Pill Badge */}
          <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-2.5 rounded-2xl border border-[#ECE7DF] shadow-2xs self-start md:self-end">
            <Calendar className="w-4 h-4 text-[#FF4D6D]" />
            <span className="text-xs sm:text-sm font-mono font-bold text-[#18181B]">
              2022 — 2026 • 4 Years of Creative Engineering
            </span>
          </div>
        </div>

        {/* Interactive Milestone Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {EXPERIENCES.map((exp) => {
            const isSelected = activeCard === exp.id;
            return (
              <div
                key={exp.id}
                onClick={() => handleCardClick(exp.id)}
                className={`group cursor-pointer rounded-2xl p-6 sm:p-7 border transition-all duration-300 relative flex flex-col justify-between hover:-translate-y-1 hover:border-[#FF4D6D]/30 hover:shadow-lg hover:shadow-[#FF4D6D]/5 ${
                  isSelected
                    ? 'bg-[#FAF8F5] border-[#FF4D6D] ring-2 ring-[#FF4D6D]/10 shadow-md'
                    : 'bg-[#FAF8F5]/80 border-[#ECE7DF]'
                }`}
              >
                <div>
                  {/* Top Bar with Period and Status Node */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                        exp.activeHighlight
                          ? 'text-[#FF4D6D] bg-[#FFF0F3] border-[#FFD1DC]'
                          : 'text-stone-600 bg-white border-[#ECE7DF]'
                      }`}
                    >
                      {exp.period}
                    </span>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 font-medium">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: exp.accentColor }}
                      />
                      {exp.status}
                    </div>
                  </div>

                  {/* Role Title and Company */}
                  <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-[#18181B] font-['Outfit',sans-serif] group-hover:text-[#FF4D6D] transition-colors flex items-center gap-2">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mt-1">
                      <Briefcase className="w-3.5 h-3.5 text-stone-400" />
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  {/* Bullet Deliverables */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-[#ECE7DF]">
                    {exp.deliverables.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-stone-700 font-medium leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-4 border-t border-[#ECE7DF]">
                  <div className="flex flex-wrap gap-1.5">
                    {exp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-[#E7E2D8] text-stone-700 shadow-2xs group-hover:border-[#FF4D6D]/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corner Indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-4 h-4 text-[#FF4D6D]/60" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
