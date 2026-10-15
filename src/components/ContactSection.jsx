import React, { useState } from 'react';
import { Mail, Check, Send, ArrowUpRight, Copy } from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  NotionIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon
} from './Icons';
import { soundFX } from '../utils/audio';

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/Sushmitha-Dasari',
    icon: GithubIcon,
    ariaLabel: 'Visit GitHub Profile (Sushmitha-Dasari)',
    hoverClass: 'hover:bg-[#18181B] hover:text-white hover:border-[#18181B]'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sushmitha-dasari-237a42284/',
    icon: LinkedinIcon,
    ariaLabel: 'Visit LinkedIn Profile (sushmitha-dasari)',
    hoverClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]'
  },
  {
    name: 'Notion',
    url: 'https://notion.so',
    icon: NotionIcon,
    ariaLabel: 'Visit Notion Workspace',
    hoverClass: 'hover:bg-[#2F3437] hover:text-white hover:border-[#2F3437]'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/srii_tech_',
    icon: InstagramIcon,
    ariaLabel: 'Visit Instagram Profile (@srii_tech_)',
    hoverClass: 'hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCB045] hover:text-white hover:border-transparent'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: YoutubeIcon,
    ariaLabel: 'Visit YouTube Channel',
    hoverClass: 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]'
  },
  {
    name: 'X (Twitter)',
    url: 'https://x.com',
    icon: TwitterIcon,
    ariaLabel: 'Visit X (formerly Twitter) Profile',
    hoverClass: 'hover:bg-[#000000] hover:text-white hover:border-black'
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com',
    icon: FacebookIcon,
    ariaLabel: 'Visit Facebook Profile',
    hoverClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]'
  }
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const email = 'sushmitadasari17@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    soundFX.playSparkle();
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFX.playShutter();
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-28">
      <div className="bg-white rounded-3xl p-8 sm:p-14 md:p-18 border border-[#E7E2D8] shadow-xl shadow-stone-900/5 relative overflow-hidden">
        {/* Soft background ambient light */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4D6D]/8 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2D8] text-[#18181B] text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
          06 ✦ Contact
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Giant Display Typography matching Reel t=16.1s */}
          <div className="lg:col-span-7">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#18181B] tracking-tight font-['Outfit',sans-serif] leading-[1.08] mb-6">
              Let's build<br />
              something<br />
              <span className="text-[#FF4D6D]">meaningful</span>.
            </h2>

            <p className="text-stone-600 text-sm sm:text-base max-w-md font-normal leading-relaxed mb-8">
              Have a role, a project, or a question about my work? Email is the quickest way to reach me.
            </p>

            {/* Huge Hot Pink Email Pill CTA matching Reel t=16.5s */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#FF4D6D] hover:bg-[#E03554] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-pink-600/30 transition-all duration-200 active:scale-95 group"
              >
                <Mail className="w-4 h-4" />
                <span>{email}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="p-3.5 rounded-full bg-[#FAF8F5] hover:bg-stone-200 text-stone-700 border border-[#E7E2D8] transition-colors cursor-pointer"
                title="Copy Email"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Social Channels matching Reel & Hero Section */}
            <div className="space-y-3.5 pt-6 border-t border-[#ECE7DF]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-stone-500 uppercase tracking-wider font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" />
                  Connect Directly
                </div>
                <span className="text-[11px] font-mono text-stone-400">
                  7 Channels
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.ariaLabel}
                      title={item.name}
                      onClick={() => soundFX.playSparkle()}
                      className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF8F5] text-stone-700 border border-[#E7E2D8] text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${item.hoverClass}`}
                    >
                      <Icon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Box */}
          <div className="lg:col-span-5 bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E4DFD5]">
            <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-[#18181B] mb-1">
              Send a Quick Note
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Replies typically dispatched within 24 hours.
            </p>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center animate-in zoom-in-95">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-600">
                  <Check className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm">Message Sent!</div>
                <div className="text-xs text-emerald-700 mt-1">Thank you for reaching out, Sushmitha will respond shortly!</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="contact-name" className="block text-[11px] font-mono font-bold text-stone-600 mb-1">NAME</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5CB] bg-white focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-[11px] font-mono font-bold text-stone-600 mb-1">EMAIL</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="alex@enterprise.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5CB] bg-white focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[11px] font-mono font-bold text-stone-600 mb-1">MESSAGE</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Tell me about your idea, role, or challenge..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5CB] bg-white focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 text-xs outline-none transition-all text-[#18181B] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#18181B] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
