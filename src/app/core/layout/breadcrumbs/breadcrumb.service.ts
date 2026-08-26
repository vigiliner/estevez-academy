import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ProductsService } from '../../../features/products/data/products.service';
import { Breadcrumb } from '../../../shared/models/breadcrumb.model';
import { SidebarService } from '../sidebar/sidebar.service';

interface RouteBreadcrumbData {
  readonly breadcrumb?: string;
  readonly breadcrumbParam?: string;
}

const HOME_CRUMB: Breadcrumb = { label: 'Academy', routerLink: ['/'] };

function toRouterLink(segments: readonly string[]): string[] {
  return segments.length ? ['/' + segments[0], ...segments.slice(1)] : ['/'];
}

/**
 * Builds the breadcrumb trail from two sources: the matched route tree (`data.breadcrumb` /
 * `data.breadcrumbParam` on each route config) for page-level crumbs, and the sidebar's active
 * scroll-spy fragment for the section/subsection levels — since those are anchors within a page,
 * not separate routes. Neither source is hand-written per page, so new products or doc sections
 * pick up breadcrumbs automatically.
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly sidebarService = inject(SidebarService);
  private readonly productsService = inject(ProductsService);

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)),
    { initialValue: null },
  );

  private readonly routeCrumbs = computed<Breadcrumb[]>(() => {
    this.navigationEnd();
    return this.buildRouteCrumbs(this.router.routerState.snapshot.root, []);
  });

  private readonly sectionCrumbs = computed<Breadcrumb[]>(() => {
    const fragment = this.sidebarService.activeFragment();
    if (!fragment) {
      return [];
    }
    for (const group of this.sidebarService.items()) {
      const child = group.children?.find((item) => item.fragment === fragment);
      if (child && group.children?.length) {
        const [firstChild] = group.children;
        return [
          { label: group.label, routerLink: firstChild.routerLink, fragment: firstChild.fragment },
          { label: child.label, routerLink: child.routerLink, fragment: child.fragment },
        ];
      }
    }
    return [];
  });

  readonly visible = computed(() => this.routeCrumbs().length > 0);

  readonly crumbs = computed<Breadcrumb[]>(() => {
    const route = this.routeCrumbs();
    const section = this.sectionCrumbs();
    const lastRouteLabel = route[route.length - 1]?.label;
    const filteredSection = section.length && section[0].label === lastRouteLabel ? section.slice(1) : section;
    return [HOME_CRUMB, ...route, ...filteredSection];
  });

  private buildRouteCrumbs(snapshot: ActivatedRouteSnapshot, parentPath: readonly string[]): Breadcrumb[] {
    const accumulatedPath = [...parentPath, ...snapshot.url.map((segment) => segment.path)];
    // `snapshot.data` merges in the parent's data under `paramsInheritanceStrategy: 'always'`, which
    // would re-add the parent's crumb on every childless route. `routeConfig.data` is this route's own.
    const data = (snapshot.routeConfig?.data ?? {}) as RouteBreadcrumbData;
    const crumbs: Breadcrumb[] = [];

    if (data.breadcrumb) {
      crumbs.push({ label: data.breadcrumb, routerLink: toRouterLink(accumulatedPath) });
    } else if (data.breadcrumbParam) {
      const paramValue = snapshot.paramMap.get(data.breadcrumbParam);
      const label = (paramValue && this.productsService.findBySlug(paramValue)?.name) ?? paramValue;
      if (label) {
        crumbs.push({ label, routerLink: toRouterLink(accumulatedPath) });
      }
    }

    for (const child of snapshot.children) {
      crumbs.push(...this.buildRouteCrumbs(child, accumulatedPath));
    }

    return crumbs;
  }
}
