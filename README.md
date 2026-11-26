# ResuMeow — Backend V2

The default React UI uses local document extraction, a local SQLite master-resume store, and selectable AI generation providers. Dark mode and the approved layout are preserved. /design.html uses the same React app; /live.html is the older Gemini-only interface.

## Setup (Windows or macOS)

Use Node.js 22.13 or newer. Run `git switch resumeow-v2`, `git pull origin resumeow-v2`, then **`npm install`** (not npm ci for this update, because PDF.js was added and the existing lockfile needs regeneration). Run `npm run dev` and open http://127.0.0.1:3000.

Copy .env.example to .env.local if you do not already have that file. Keep credentials private. Select a provider in AI settings:

- Gemini: GEMINI_API_KEY and GEMINI_MODEL.
- OpenAI: OPENAI_API_KEY and OPENAI_MODEL (a Chat Completions model supporting JSON mode).
- Anthropic: ANTHROPIC_API_KEY and ANTHROPIC_MODEL (a Messages API model).
- Ollama: install Ollama from its official site, download a local model with `ollama pull qwen2.5:7b`, and ensure the service is running at http://127.0.0.1:11434. Set OLLAMA_MODEL if using another installed model. No cloud API key is needed.

AI_PROVIDER controls the initial selection; existing browser preferences take priority. Restart after editing .env.local. Health reports configuration, not live provider availability. Cloud providers require a remembered, provider-specific consent checkbox before sending generation data. Changing providers does not automatically grant consent.

## Processing and storage

PDF.js extracts text from ordinary PDFs locally (5 MB, 25 pages max). LaTeX uses a limited local parser without executing commands or reading external files. Plain text is read directly. Scanned or complex PDFs and custom LaTeX may require manual correction or OCR outside the app; review every line. No automatic cloud fallback.

Confirm reviewed text, then Save / replace master to store it at ~/.resumeow/master.sqlite (on Windows, %USERPROFILE%\.resumeow\master.sqlite). Load it for future applications; Delete saved master removes the row after a separate confirmation. Stored text is unencrypted; avoid shared computers. Saved application drafts still use browser localStorage and are separate from master storage. No server application-history database yet.

Generation sends reviewed data to the selected provider, or to local Ollama. No automatic provider fallback. Source-based edit validation and weighted match scoring remain in place. Review semantic accuracy. The score is an evidence estimate of the original resume, not an ATS score. LaTeX export uses a standard template and the preview is approximate; compile in Overleaf. Demos load fictional inputs only. No automatic email sending.

## Tests and deployment

`npm test` runs deterministic tests including provider fixtures and in-memory SQLite. `npm run build` builds all entry pages; `npm run start` serves the build. Actual PDF extraction, full browser and real provider requests need end-to-end testing after dependencies are installed. Run `npm audit` and review vulnerabilities before deployment. The existing lockfile must be regenerated with npm install; commit the resulting lockfile after reviewing it.

The server is loopback-only and rejects cross-origin API requests. Do not expose it publicly without authentication, HTTPS, appropriate storage protection, request quotas and privacy review. No server resume-content logging; cloud provider retention policies apply.

## API

GET /api/health — provider configuration, default provider and local extraction availability (no secrets).
GET /api/master — saved reviewed text or null.
POST /api/master — {action:"save",text,verified:true} or {action:"delete"}.
POST /api/extract — {format:"pdf"|"latex",data}; returns {text,warnings,reviewRequired,local}.
POST /api/generate — existing fields plus provider and cloudConsent; returns selected drafts, changes, recommendations and match analysis.
