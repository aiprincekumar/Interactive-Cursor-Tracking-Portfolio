# Task Dispatch: Survey Explorer — Engine & Knowledge Architecture

## Mission
Investigate the data models, portfolio items, catalog items, skills, experience positions, FAQs, role/audience contexts, and design the 8-layer (Layers A–H) deterministic search & retrieval engine per R1 and R3 in ORIGINAL_REQUEST.md.

- **Authoritative Request**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md`
- **Working Directory**: `c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_engine`
- **Investigation Scope**:
  1. Inspect `src/data/` (projects, skills, experience, FAQs, services, pricing, resume data) to identify exact counts and structures (83+ catalog items, 9 case studies, 37 skills, 10 experience positions, 40 bilingual FAQs, quotation services).
  2. Map out Layer A (16 core intents: roles, projects, skills, experience, services, achievements, recruiter info, client info, marriage bio, contact, availability, navigation, filter toggles, suggestions, ambiguous queries).
  3. Map out Layer B (synonym & phrase dictionary for English, Hindi, Hinglish, technical aliases, typos).
  4. Design Layer C (weighted local search index with exact, prefix, fuzzy scoring).
  5. Design Layer D & E (Audience & Role filtering with dynamic relaxation on zero results).
  6. Design Layer F (authoritative FAQ matcher with zero hallucination).
  7. Design Layer G & H (disambiguation chips & truthful fallback).
  8. Ensure 100% offline-friendly execution with zero external network requests.
- **Deliverables**:
  - `BRIEFING.md`, `progress.md`, and complete `handoff.md` with concrete specifications, file locations, and contract signatures.


## 2026-10-23T05:00:30Z
From: d9b94e64-c3ce-47b0-9eeb-923492665270
Priority: MESSAGE_PRIORITY_HIGH

You are explorer_survey_engine. Your role is Engine Survey Explorer.
Working directory: c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_engine

Read the authoritative requirements at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\ORIGINAL_REQUEST.md
and your dispatch instructions at:
c:\Users\Atul Verma\Desktop\AI Document\Interactive Cursor-Tracking Portfolio\.agents\teamwork\explorer_survey_engine\DISPATCH.md

Your task is to survey the data taxonomy, portfolio items, catalog items, skills, experience positions, FAQs, role/audience contexts, and design the 8-layer (Layers A–H) deterministic search & retrieval engine per R1 and R3.
You are read-only: do NOT modify any source code files. Write only to your working directory.
Create BRIEFING.md and progress.md immediately, then produce a comprehensive handoff.md detailing:
1. Exact counts and schema of existing catalog data, case studies, skills, experience, FAQs, and quotation services.
2. Complete specification of Layer A (16 core intents).
3. Complete specification of Layer B (Synonym & phrase dictionary covering English, Hindi, Hinglish, technical aliases, typos).
4. Weighted search index algorithm (Layer C).
5. Audience and role filtering rules and dynamic relaxation logic (Layers D & E).
6. Authoritative FAQ matching (Layer F).
7. Disambiguation chips and truthful fallback strategy (Layers G & H).
8. Proposed module file path and exported API contracts.
When finished, send a message to parent with your handoff summary.
