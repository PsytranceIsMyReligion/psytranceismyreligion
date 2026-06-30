# Project Guidelines: Angular 9

## Project Overview

This project is built on **Angular 9**. AI agents must adhere to the conventions of this version and avoid newer features (e.g., Standalone components, Signals, `inject()`) unless explicitly requested.

## Package Manager & Commands

- **Package Manager:** `npm` (Use `npm` for all operations).
- **Start Dev Server:** `npm start`
- **Build:** `npm run build`
- **Test:** `npm test`
- **Lint:** `npm run lint`

## Angular 9 Architecture & Best Practices

- **Modules (NgModules):** Angular 9 relies on `NgModules`. Every component, directive, and pipe must be declared in a module. Ensure new components are imported into the appropriate feature module.
- **Lazy Loading:** Use `loadChildren` with the string-based syntax:
  `{ path: 'feature', loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule) }`
- **Dependency Injection:** Use the `@Injectable({ providedIn: 'root' })` decorator for services to ensure tree-shaking.
- **State Management:** Use RxJS `BehaviorSubject` or `ReplaySubject` for state. Avoid complex store libraries unless they are already in `package.json`.
- **Component Logic:**
  - Keep components thin. Move business logic into Services.
  - Use `OnPush` change detection strategy where performance is critical.
  - Always use `trackBy` in `*ngFor` loops to prevent unnecessary DOM re-rendering.
- **Observables:**
  - Always clean up subscriptions. Use the `async` pipe in templates whenever possible.
  - If manual subscription is required, use `takeUntil` with a `destroy$` subject.

## Coding Standards

- **Strict Typing:** Avoid `any`. Use interfaces for all data models.
- **Naming Conventions:**
  - Files: `feature.component.ts`, `feature.service.ts`, `feature.module.ts`.
  - Class Names: PascalCase.
  - Method/Variable Names: lowerCamelCase.
- **Styling:** Use SCSS. Keep styles encapsulated by using `ViewEncapsulation.Emulated` (default).

## AI Agent Instructions

1. **Context Check:** Always assume the environment is Node 12-14 compatible. Do not suggest modern ES2022 features unless polyfilled.
2. **Library Compatibility:** If suggesting third-party libraries, check that they were compatible with Angular 9 (e.g., RxJS 6.x).
3. **No Standalone Components:** Do not use the `standalone: true` flag.
4. **Code Structure:** If asked to generate a new feature, provide the `component`, `module`, and `routing` files as a single coherent set.
5. **Efficiency:** If the code becomes complex, favor splitting into smaller, single-responsibility components.

## Troubleshooting

- If a build error occurs, check `tsconfig.json` for strict mode settings (if enabled).
- If you see `ExpressionChangedAfterItHasBeenCheckedError`, review the use of asynchronous data binding in lifecycle hooks (`ngAfterViewInit`).
