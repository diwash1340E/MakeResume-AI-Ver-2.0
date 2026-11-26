# ResuMeow

A local-first application workspace for tailoring resumes, drafting cover letters and requesting recommendations. The final React design is the default, now connected to the Express API. The earlier workspace remains at /live.html. Gemini is called only by the server.

## Setup

Use Node.js 22+ and npm.

1. Switch to the `resumeow-v2` branch.
2. Run `npm ci`.
3. Copy `.env.example` to `.env.local` and insert your own Gemini API key. Set GEMINI_MODEL to an available model if necessary. Never commit the key.
4. Run `npm run dev`, then visit http://127.0.0.1:3000.
5. Open the root URL, check the connection indicator, upload or paste a resume, verify extracted text, and generate.

`npm run build` builds the frontend. `npm run start` serves the built frontend and API. `npm test` tests deterministic backend logic without a key.

## Final React interface

The default UI and /design.html use the real API. Demos load fictional sample inputs only; generation still uses Gemini. Verify resume text before generation. Revert AI edits to restore original wording and regenerate LaTeX locally. Suggestions and missing requirements are review flags, not automatic skill additions or score boosts. The score reflects the original resume. Custom LaTeX preview is approximate; compile in Overleaf. Save stores the real generated package, resume text and drafts in browser localStorage after confirmation; delete entries on shared devices. Older demo saved entries are not loaded. Tone and recommendation details can regenerate the relevant draft.

## Behavior and limitations

- PDF and LaTeX text extraction use Gemini. Plain text is read in the browser. Review extracted text before generation; OCR and extraction can miss or misread facts.
- Resume tailoring proposes exact source edits. The backend rejects ambiguous, overlapping or unsupported-number edits, preserves the original around accepted edits, and reports actual before/after changes. Semantic claims still require human review.
- Export uses a standard LaTeX template, not the original layout. Page count, Unicode font support and compilation should be checked in Overleaf. Print / PDF invokes the browser print dialog rather than compiling LaTeX.
- Cover letters and recommendation request emails are drafts only. No automatic sending.
- Match score is an estimate of evidence for AI-identified requirements in the original resume, not an ATS score or hiring probability. 40/30/30 weights are normalized when categories have no requirements.
- Resume and job data are sent to Google Gemini only after confirmation. No server database or resume-content logging is implemented; explicit saves persist in browser localStorage. Provider retention/billing policies still apply. External font loading may contact Google Fonts.
- Backend binds to loopback and rejects cross-origin API requests. It has request size limits and basic throttling, but is not ready for a public multi-user deployment. Add authentication, HTTPS, per-user quota, secret management and a privacy review first.

## API

GET /api/health — local configuration status (does not verify API key).

POST /api/extract — JSON {format: "pdf"|"latex", data: base64 PDF or LaTeX source}; returns {text, reviewRequired}.

POST /api/generate — JSON {resumeText, jobDescription, company?, position?, notes?, mentor?, documents: ["resume","coverLetter","recommendation"]}; returns selected documents, exact edits, recommendations and match analysis.
