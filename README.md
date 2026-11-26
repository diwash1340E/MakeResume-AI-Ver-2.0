# ResuMeow — Gemini-only local application

## Setup
Use Node.js 22.13 or newer. On the resumeow-v2 branch, run npm install (the PDF.js addition requires refreshing the older lockfile), then npm run dev. Open http://127.0.0.1:3000. The React layout defaults to dark mode.

Create .env.local from .env.example and fill in GEMINI_API_KEY privately using Google AI Studio. GEMINI_MODEL defaults to gemini-3.8-flash and can be changed to an available model. Restart the server. AI settings shows key configuration; Test Gemini connection performs a small structured-output request without sending personal data (may consume quota). The key is read only server-side and .env.local is ignored by Git. Never use a VITE_ prefix for secrets. Do not paste the key into ChatGPT, source code or GitHub.

## Workflow
Upload a text-based PDF or LaTeX file, or paste plain text. PDF.js and a limited LaTeX parser work locally; scanned PDFs may need external OCR and custom commands may require manual correction. Review and confirm extracted text. Save / replace master stores reviewed text in SQLite at ~/.resumeow/master.sqlite; load/delete it in the master panel. Saved application drafts are stored separately in browser localStorage. These stores are unencrypted, intended for single-user development. Supabase, cloud database credentials, authentication and remote persistence are deliberately deferred. No migration or Supabase endpoint is configured.

Enable the remembered Gemini consent in AI settings before generation. Paste a job posting, select documents, set tone/intensity, and generate. Gemini returns schema-constrained JSON; backend checks source-grounded edits, scores original-resume evidence, and creates LaTeX. Review all facts and drafts. Flags do not automatically add skills or raise scores. The LaTeX preview is approximate; verify compilation in Overleaf. No automatic sending or publishing.

## API
GET /api/health — configuration only, no secrets.
POST /api/gemini/test — {} performs a small live JSON generation test, no personal data.
GET /api/master — reviewed local master or null.
POST /api/master — {action:"save",text,verified:true} or {action:"delete"}.
POST /api/extract — {format:"pdf"|"latex",data}, local extraction and warnings.
POST /api/generate — reviewed resumeText, jobDescription, optional metadata, documents and cloudConsent:true. Gemini only. Old clients may pass provider:"gemini".

## Testing and publishing
npm test — deterministic tests, mocked Gemini transport and SQLite fixture.
npm run build — build frontend.
npm run start — serve production build on loopback only.
npm audit — review dependencies; do not use audit fix --force blindly.
Real PDF, browser, build, SQLite and live Gemini testing require the local runtime/dependencies/key. No public deployment is performed. Before public hosting, add authentication, user isolation, secure storage, quotas and HTTPS. Keep the backend local-only until those are in place. See docs/LOCAL_LLAMA.md for a standalone local-model experiment, not an active ResuMeow provider.
