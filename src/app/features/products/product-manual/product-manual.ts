import {
  ChangeDetectionStrategy,
  Component,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { observeActiveSection } from '../../../core/layout/sidebar/section-scroll-spy';
import { SidebarService } from '../../../core/layout/sidebar/sidebar.service';
import { SearchService } from '../../../core/search/search.service';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';
import type { ManualScreenshot } from '../../../shared/models/product.model';
import { ImageLightbox } from '../../../shared/ui/image-lightbox/image-lightbox';
import { ProductNotFound } from '../../../shared/ui/product-not-found/product-not-found';
import { ScreenshotBlock } from '../../../shared/ui/screenshot-block/screenshot-block';
import { slugify } from '../../../shared/utils/slugify';
import { buildProductSidebarItems } from '../data/product-sidebar';
import { ProductsService } from '../data/products.service';

@Component({
  selector: 'app-product-manual',
  imports: [RouterLink, HighlightPipe, ImageLightbox, ScreenshotBlock, ProductNotFound],
  templateUrl: './product-manual.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManual {
  private readonly productsService = inject(ProductsService);
  private readonly sidebarService = inject(SidebarService);
  private readonly document = inject(DOCUMENT);
  protected readonly searchService = inject(SearchService);

  readonly slug = input.required<string>();

  protected readonly product = computed(() => this.productsService.findBySlug(this.slug()));

  protected readonly allScreenshots = computed<readonly ManualScreenshot[]>(() => {
    const product = this.product();
    if (!product) {
      return [];
    }
    const commonShots = (product.manualCommonSteps ?? []).flatMap((step) => step.screenshots ?? []);
    const roleShots = product.userManual.flatMap((role) =>
      role.steps.flatMap((step) => step.screenshots ?? []),
    );
    const guideShots = (product.manualGuides ?? []).flatMap((guide) =>
      guide.steps.flatMap((step) => (step.screenshot ? [step.screenshot] : [])),
    );
    return [...commonShots, ...roleShots, ...guideShots];
  });

  protected readonly lightboxIndex = signal<number | null>(null);

  private readonly sectionIds = computed(() => {
    const product = this.product();
    if (!product) return [];
    const commonIds = (product.manualCommonSteps ?? []).map((step) => `comun-${slugify(step.title)}`);
    const roleIds = product.userManual.map((role) => `rol-${role.id}`);
    const guideIds = (product.manualGuides ?? []).map((guide) => `guia-${guide.id}`);
    return ['resumen', ...commonIds, ...roleIds, ...guideIds];
  });

  constructor() {
    effect(() => {
      const product = this.product();
      this.sidebarService.setItems(product ? buildProductSidebarItems(product) : [], product?.name);
    });

    afterRenderEffect((onCleanup) => {
      observeActiveSection(
        this.document,
        this.sectionIds(),
        (id) => this.sidebarService.setActiveFragment(id),
        onCleanup,
      );
    });
  }

  protected openLightbox(screenshot: ManualScreenshot): void {
    const index = this.allScreenshots().indexOf(screenshot);
    this.lightboxIndex.set(index === -1 ? 0 : index);
  }

  protected closeLightbox(): void {
    this.lightboxIndex.set(null);
  }

  protected commonAnchorId(title: string): string {
    return `comun-${slugify(title)}`;
  }
}
