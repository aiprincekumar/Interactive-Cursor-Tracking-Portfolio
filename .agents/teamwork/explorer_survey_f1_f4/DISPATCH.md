# Task Dispatch: Explorer Survey F1 & F4

## Identity & Role
You are Explorer Survey F1 & F4 (teamwork_preview_explorer).
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_f1_f4

## Mission
Investigate the codebase for:
- **Feature 1: Interactive Project Cost & Service Fee Quotation Estimator**
  - Look at `Navbar.jsx`, `ContactSection.jsx`, and where contact triggers/form exist.
  - Check how CTA cards are structured in ContactSection and shortcut in Navbar.
  - Check how form pre-filling can work smoothly (scrolling to form, updating form state/fields).
  - Check pricing logic: 3 domain tracks (Accounting & Tax Advisory, MIS & Data Operations, AI & Web Engineering), sliders/toggles for monthly invoice volume (50 to 2,000+), delivery turnaround (Standard vs Express), engagement type (One-Time vs Retainer), dynamic ₹ ranges, deliverables list.
  - Check WhatsApp link format (`https://wa.me/...`).
  - Accessibility: focus trap, Esc key.
- **Feature 4: Digital Business Card & Downloadable vCard**
  - Look at ContactSection Direct Channel tab.
  - Check Atul's contact details in existing data files.
  - RFC 6350 compliant `.vcf` generation with MIME type `text/vcard`.
  - Check how to render high-contrast digital card modal and scannable SVG QR code (pure React SVG without broken dependencies).

## Deliverables
Write report with verified file paths, code snippets, proposed component architecture to:
`c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_f1_f4\handoff.md`.


## 2026-10-21T12:04:01Z
[Message] timestamp=2026-10-21T12:04:01Z sender=2b2281c0-ba3c-4920-aab7-1e5511c9dff1 priority=MESSAGE_PRIORITY_HIGH
Content: You are Explorer Survey F1 & F4.
Your working directory is `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_f1_f4`.
Read `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md` (header `## 2026-10-21T11:58:45Z`) and your dispatch file `.agents/teamwork/explorer_survey_f1_f4/DISPATCH.md`.
Survey the existing codebase thoroughly for:
1. Feature 1: Interactive Quotation Estimator
   - Inspect `src/components/Navbar.jsx` (or `.tsx`), `src/components/ContactSection.jsx` (or `.tsx`), contact forms, and modal patterns.
   - Inspect how CTA cards and navbar shortcuts should be wired.
   - Inspect how form pre-fill (smooth scroll to form, setting form values) can be achieved reliably.
   - Define quotation calculation formulas, tiers (Accounting & Tax, MIS & Data, AI & Web), sliders (50 to 2000+ invoices), delivery turnaround (standard vs express), engagement type (one-time vs retainer).
   - Formulate WhatsApp URL schema.
2. Feature 4: Digital Business Card & Downloadable vCard
   - Inspect ContactSection Direct Channel tab.
   - Locate Atul's authoritative contact details.
   - Design RFC 6350 standard .vcf generator with `text/vcard` MIME type.
   - Design high-contrast digital card modal with dynamic scannable SVG QR code without bulky external dependencies.
Write your complete analysis and architecture plan to `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_f1_f4\handoff.md` and send a message back to caller when done.
