
# Contexto del Proyecto

**Estevez Academy** es el sitio interno de documentación (base de conocimiento) de los productos de Estevez ERP. No es el producto en sí — es la plataforma donde se publica documentación funcional, técnica y manuales de usuario por rol (con capturas de pantalla) de cada producto de la empresa.

## Producto documentado: Vigiliner

Actualmente es el único producto documentado en la Academy. Es una plataforma SaaS de rastreo GPS de flotillas vehiculares, multi-tenant (multi-empresa), con mapa en tiempo real, comandos remotos a dispositivos GPS (ej. Queclink GV55W) y control de acceso por rol: Super Administrador (cross-tenant), Admin de empresa, Monitorista, Cliente (solo visualización).

Módulos de Vigiliner: Dashboard, Mapa General/Global, Unidades, Conductores, Usuarios, Geocercas, Incidencias, Alertas, Reportes, más un panel Super Admin (Empresas, dispositivos GPS, inventario SIM).

Estado MVP de Vigiliner (a la fecha del último relevamiento):
- Completo: auth, dashboard, mapa, unidades, conductores, usuarios/roles, panel super admin.
- Parcial: Geocercas, Incidencias/Alertas (solo UI, sin datos de prueba).
- Pendiente: Reportes.

## Arquitectura de la Academy (esta app)

- Angular 21, standalone components + signals, Tailwind CSS 4, Vitest para unit tests (sin e2e configurado).
- Sin librería de estado externa — todo con signals/computed nativos.
- El contenido (docs, manuales) está **hardcodeado** en TypeScript (`src/app/features/products/data/products.service.ts`), no viene de un backend/API.
- Deploy a GitHub Pages vía GitHub Actions.
- Estructura de `src/app/`:
  - `core/layout`: shell de la app, header, footer, sidebar (`sidebar.service.ts`, dinámico por ruta).
  - `core/search`: búsqueda cliente-side sobre el contenido de docs/manuales (`search.service.ts`).
  - `features/home`: landing con listado de productos.
  - `features/products`: listado, detalle (docs funcional/técnica) y manual por rol (`product-manual`, lazy-loaded).
  - `shared`: componentes UI reutilizables, modelos, pipes, utils.
- Esta app en sí no tiene auth/roles — es contenido estático accesible a cualquier visitante (los roles descritos son los de Vigiliner, el producto documentado, no de la Academy).

Este proyecto no está documentado de forma general en ningún otro lado (el `README.md` es el boilerplate por defecto de Angular CLI), así que esta sección es la fuente de verdad para orientarse rápido.

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
