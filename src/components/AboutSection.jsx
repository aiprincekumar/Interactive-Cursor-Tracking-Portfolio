import React from 'react';
import { MapPin, GraduationCap, Terminal } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-[#E7E2D8] shadow-xl shadow-stone-900/5 relative overflow-hidden">
        {/* Soft subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D6D]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Pill Badge - Reel style */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
          01 ✦ About
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#18181B] tracking-tight font-['Outfit',sans-serif] leading-none">
              Who I am
            </h2>
            <div className="w-12 h-1 bg-[#FF4D6D] rounded-full mt-6" />
            <p className="text-stone-500 text-xs sm:text-sm mt-4 font-mono font-medium">
              Sushmita Tiwari • Creative Engineer
            </p>
          </div>

          {/* Right Column: Editorial Narrative matching Reel t=8.5s */}
          <div className="lg:col-span-8 space-y-6">
            <p className="text-base sm:text-lg md:text-xl text-[#18181B] font-medium leading-relaxed font-['Outfit',sans-serif]">
              I'm a full-stack developer and AI &amp; ML undergraduate. Spent a year training as a full-stack developer at <strong className="text-[#FF4D6D] font-bold">Technical Hub</strong>.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              I care most about the parts of software people rarely see: a payment that can only ever be processing, success or failed; tenants that can never read each other's data; a whole stack that comes up with one command.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
              Lately I've been putting language models to work on real documents—building compliance verification pipelines, document intelligence engines, and interactive high-framerate web applications.
            </p>

            {/* Quote banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border-l-4 border-[#FF4D6D] border-y border-r border-[#ECE7DF] text-xs sm:text-sm italic text-stone-700">
              "When your cursor isn't merely an arrow, but a living butterfly that characters observe and capture, the web becomes a playground."
            </div>

            {/* Metadata Grid matching Reel t=8.5s */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#ECE7DF]">
              {/* Location */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF]">
                <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF4D6D]" /> Location
                </div>
                <div className="text-sm font-bold text-[#18181B]">
                  Bhimavaram, Andhra Pradesh
                </div>
              </div>

              {/* Education */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF]">
                <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#FF4D6D]" /> Education
                </div>
                <div className="text-sm font-bold text-[#18181B] leading-tight">
                  B.Tech in AI &amp; ML
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Aditya Engineering College
                </div>
              </div>

              {/* Core Focus */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF]">
                <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
                  <Terminal className="w-3.5 h-3.5 text-[#FF4D6D]" /> Core Focus
                </div>
                <div className="text-sm font-bold text-[#18181B] leading-tight">
                  Applied NLP &amp; Systems
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  Full-stack Architecture
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience & Career Milestones (Target for Navbar Experience link) */}
        <div className="mt-12 pt-10 border-t border-[#ECE7DF]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl font-extrabold text-[#18181B] font-['Outfit',sans-serif]">
              Journey &amp; Experience
            </h3>
            <span className="text-xs font-mono font-bold text-[#FF4D6D] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#FFD1DC]">
              2022 — 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] hover:border-[#18181B]/20 transition-all shadow-2xs">
              <span className="text-[11px] font-mono font-bold text-[#FF4D6D]">2024 — PRESENT</span>
              <h4 className="font-bold text-[#18181B] text-base mt-1">Lead Creative Developer</h4>
              <p className="text-xs text-stone-500 font-medium">Independent &amp; Studio Works</p>
              <p className="text-xs text-stone-600 mt-2 font-normal leading-relaxed">
                Architecting cinematic high-framerate web applications, 2.5D cursor kinematics, and AI compliance dashboards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] hover:border-[#18181B]/20 transition-all shadow-2xs">
              <span className="text-[11px] font-mono font-bold text-stone-500">2023 — 2024</span>
              <h4 className="font-bold text-[#18181B] text-base mt-1">AI Systems Engineer</h4>
              <p className="text-xs text-stone-500 font-medium">Enterprise Legal &amp; FinTech</p>
              <p className="text-xs text-stone-600 mt-2 font-normal leading-relaxed">
                Engineered vector graph retrieval pipelines, sub-second latency inference gates, and compliance telemetry.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF] hover:border-[#18181B]/20 transition-all shadow-2xs">
              <span className="text-[11px] font-mono font-bold text-stone-500">2022 — 2023</span>
              <h4 className="font-bold text-[#18181B] text-base mt-1">Creative Coding &amp; WebGL</h4>
              <p className="text-xs text-stone-500 font-medium">Frontend Innovations</p>
              <p className="text-xs text-stone-600 mt-2 font-normal leading-relaxed">
                Prototyped GLSL fragment shader art, GPU particle simulations, and accessibility-first motion tokens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
