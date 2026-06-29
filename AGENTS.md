# Project Overview
This repository contains the codebase for the "Psytrance Is My Religion" application. It serves as a community platform and interactive toolset. The primary goal is to maintain a highly responsive, audio-friendly user experience.

# Tech Stack
- **Frontend:**
# Frontend # Tech Stack & Tooling
- **Framework:** Angular (v22+)
- **Language:** TypeScript (Strict Mode)
- **Styling:** SCSS / Tailwind CSS
- **State & Reactivity:** Angular Signals (exclusive)
- **Testing:** Vitest (Do NOT use Karma/Jasmine)
- **UI & Accessibility:** Angular ARIA

# Architectural Rules
Our application follows the modern, boilerplate-free Angular architecture. Do not use legacy patterns.
1. **Zoneless:** The app uses `provideZonelessChangeDetection()`. Do not include, import, or rely on `zone.js`. Do not use `NgZone` or `setTimeout` hacks to trigger change detection.
2. **Standalone by Default:** All components, pipes, and directives must be `standalone: true`. **Never generate or modify an `NgModule`.**
3. **Change Detection:** Do not set `ChangeDetectionStrategy` explicitly; `OnPush` is the default in our version.

# Reactivity & State Conventions
1. **Data Fetching:** Use the stable `resource()` and `httpResource()` APIs for asynchronous state and data fetching. Do not use RxJS for basic HTTP requests.
2. **Local State:** Use Angular Signals (`signal`, `computed`, `effect`, `linkedSignal`) exclusively for synchronous UI state. 
3. **Form Management:** Use **Signal Forms** (from `@angular/forms/signals`). Do NOT use the legacy RxJS `ReactiveFormsModule` (`FormGroup`, `FormControl`). Use declarative signal form validation (e.g., `required()`, `disabled()`).

# Dependency Injection
1. **Services:** Use the new `@Service()` decorator for all new services instead of `@Injectable({ providedIn: 'root' })`. 
2. **Component Injection:** Always use the `inject()` function for dependencies inside components instead of constructor injection.
3. **Lazy Loading Services:** Use `injectAsync()` when a heavy service is only needed conditionally.

# AI Boundaries & Formatting
- **File Naming:** Adhere to the Angular CLI conventions (e.g., `feature-name.component.ts`).
- **Control Flow:** Use the built-in control flow syntax (`@if`, `@for`, `@switch`) in all templates. Do NOT use legacy structural directives (`*ngIf`, `*ngFor`).
- **Dependencies:** Do not introduce third-party libraries for state managenent
- **E2E Testing:** Do NOT write, modify, or run E2E tests. If the user asks for E2E testing, instruct them to switch to the `@test-agent` which utilizes Playwright.
