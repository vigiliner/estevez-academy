# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Contexto del Proyecto

**Estevez Academy** es el sitio interno de documentación (base de conocimiento) de los productos de Estevez ERP. No es el producto en sí — es la plataforma donde se publica documentación funcional, técnica y manuales de usuario por rol (con capturas de pantalla) de cada producto de la empresa.

## Producto documentado: Vigiliner

Actualmente es el único producto documentado en la Academy. Es una plataforma SaaS de rastreo GPS de flotillas vehiculares, multi-tenant (multi-empresa), con mapa en tiempo real, comandos remotos a dispositivos GPS (ej. Queclink GV55W) y control de acceso por rol: Super Administrador (cross-tenant), Admin de empresa, Monitorista, Cliente (solo visualización).

Módulos de Vigiliner: Dashboard, Mapa General/Global, Unidades, Conductores (internos/externos), Usuarios, Geocercas, Incidencias, Alertas, Reportes (velocidad y detención, historial de comandos), más un panel Super Admin (Empresas, dispositivos GPS, inventario SIM, Configuración/catálogos). Un usuario o unidad puede asociarse a más de una empresa (multi-empresa / empresa operadora).

Estado MVP de Vigiliner (a la fecha del último relevamiento):
- Completo: auth, dashboard, mapa, unidades, conductores, usuarios/roles, geocercas (editor de polígonos), incidencias/alertas, reportes, panel super admin.
- Parcial: soporte multi-empresa y empresa operadora (recién incorporado).

## Comandos

- `npm start` / `npx ng serve` — servidor de desarrollo (`http://localhost:4200`, recarga en caliente).
- `npm run build` — build de producción a `dist/estevez-academy` (el deploy de CI usa `--base-href /estevez-academy/`, ver `.github/workflows/deploy.yml`).
- `npm test` / `npx ng test` — corre toda la suite con Vitest (vía `@angular/build:unit-test`). Sin TTY corre una sola vez; en una terminal interactiva queda en watch mode por defecto.
- `npx ng test --include src/app/app.spec.ts` — corre un solo archivo de test (`--include` acepta glob o ruta de archivo).
- `npx ng test --filter "<regex>"` — corre solo los tests/suites cuyo nombre matchee el patrón.
- No hay ESLint configurado. Formateo con Prettier (`npx prettier --write .`); config en `.prettierrc` (100 cols, comillas simples, parser `angular` para `.html`).
- No hay e2e configurado.

## Arquitectura de la Academy (esta app)

- Angular 21, standalone components + signals, Tailwind CSS 4, Vitest para unit tests (sin e2e configurado).
- Sin librería de estado externa — todo con signals/computed nativos.
- El contenido (docs, manuales) está **hardcodeado** en TypeScript (`src/app/features/products/data/products.service.ts`), no viene de un backend/API.
- Deploy a GitHub Pages vía GitHub Actions (`.github/workflows/deploy.yml`), en push a `main`.
- Estructura de `src/app/`:
  - `core/layout`: shell de la app (`shell.ts`), header, footer, sidebar (`sidebar.service.ts`, dinámico por ruta) y breadcrumbs.
  - `core/routing`: `MainContentViewportScroller` — el shell usa `<main id="main-content">` como único contenedor con scroll (header/sidebar/footer quedan fijos), así que reemplaza el `ViewportScroller` por defecto de Angular (que scrollea `window`) para que el scroll-a-anchor y la restauración de posición apunten a ese contenedor. Si un anchor/fragment no scrollea, es la primera sospecha.
  - `core/search`: búsqueda cliente-side sobre el contenido de docs/manuales (`search.service.ts`).
  - `features/home`: landing con listado de productos.
  - `features/products`: listado, detalle (docs funcional/técnica) y manual por rol (`product-manual`, lazy-loaded). Las rutas de detalle/manual viven bajo `:slug` como hijas (`products.routes.ts`), con `data: { breadcrumb }` / `data: { breadcrumbParam }` para alimentar el breadcrumb (ver abajo).
  - `shared`: componentes UI reutilizables, modelos, pipes, utils.
- Esta app en sí no tiene auth/roles — es contenido estático accesible a cualquier visitante (los roles descritos son los de Vigiliner, el producto documentado, no de la Academy).

### Principio recurrente: contenido primero, UI derivada

`products.service.ts` es la única fuente de verdad del contenido. Sidebar, búsqueda y breadcrumbs se **derivan** de ahí — agregar un producto o una sección nueva no requiere tocar ninguno de los tres:

- **Sidebar** (`features/products/data/product-sidebar.ts`): `buildProductSidebarItems(product)` arma los grupos (Documentación funcional / técnica / Manual de usuario) a partir de las secciones del producto. `SidebarService` (`core/layout/sidebar/sidebar.service.ts`) guarda esos items más el fragmento activo; `section-scroll-spy.ts` observa qué sección está en viewport (`IntersectionObserver`) y actualiza ese fragmento activo mientras se hace scroll.
- **Búsqueda** (`core/search/search.service.ts`): indexa reactivamente `productsService.allProducts()` en un `computed()` — no hay paso de build/reindex.
- **Breadcrumbs** (`core/layout/breadcrumbs/breadcrumb.service.ts`): combina dos fuentes reactivas, ninguna hardcodeada por página:
  1. El árbol de rutas activas, leyendo `routeConfig.data.breadcrumb` (label fijo) o `routeConfig.data.breadcrumbParam` (nombre de param a resolver contra `ProductsService`, p.ej. el slug del producto). Usa `routeConfig.data` (no `snapshot.data`) porque `paramsInheritanceStrategy: 'always'` (en `app.config.ts`) hace que `data` se herede a las rutas hijas, y usar `snapshot.data` duplicaría crumbs.
  2. El fragmento activo de `SidebarService` — agrega los niveles de sección/subsección mientras se hace scroll, sin que sean rutas propias.
  El componente (`breadcrumbs.ts`) además oculta la barra dinámicamente cuando el contenido ya no cabe en una sola línea (mide con `ResizeObserver` + listener de `window:resize`, comparando `offsetTop` de cada crumb), en vez de usar un breakpoint fijo.

### Theming (claro/oscuro)

La plataforma tiene un toggle de tema claro/oscuro global (icono en el navbar, siempre visible). Implementación:

- `core/theme/theme.service.ts` (`ThemeService`, `providedIn: 'root'`) es la única fuente de verdad del tema: signal `theme`, `toggle()`/`setTheme()`, persiste en `localStorage` y aplica la clase `dark` en `<html>` vía `effect()`.
- `shared/ui/theme-toggle/theme-toggle.ts` es el botón reutilizable — solo llama a `themeService.toggle()`, no mantiene estado propio.
- Los colores están centralizados como **CSS custom properties** en `src/styles.css` (bloque `@theme` + overrides en `.dark`), no como pares `clase dark:clase` repetidos por componente. Al escribir templates, usar las clases semánticas en vez de grises/azules crudos de Tailwind:
  - `bg-canvas` — fondo general de la app (fuera de tarjetas/paneles)
  - `bg-surface` / `bg-surface-alt` / `bg-surface-hover` — fondo de tarjetas, header, sidebar, dropdowns / paneles e inputs / hover de filas y botones
  - `border-border` / `border-border-subtle` — bordes por defecto / divisores sutiles
  - `text-heading` / `text-body` / `text-muted` / `text-subtle` / `text-faint` — jerarquía de texto, de más a menos prominente
  - `text-accent` / `bg-accent-muted` — links y estado activo / fondo de item activo
  - Los badges de estado (`product.model.ts`, `search.ts`) y el resaltado de búsqueda (`highlight.pipe.ts`) sí usan `dark:` explícito porque son colores semánticos por tipo (verde/ámbar/azul/morado), no neutros de la interfaz — y ya están centralizados en una única constante cada uno, así que no hace falta tokenizarlos.
  - Un componente nuevo que use estas clases semánticas ya soporta ambos temas automáticamente, sin necesitar `dark:` en el template.

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
