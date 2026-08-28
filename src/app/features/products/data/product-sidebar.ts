import { Product } from '../../../shared/models/product.model';
import { SidebarItem } from '../../../shared/models/sidebar-item.model';
import { slugify } from '../../../shared/utils/slugify';

export function docSectionId(prefix: string, title: string): string {
  return `${prefix}-${slugify(title)}`;
}

export function buildProductListSidebarItems(products: readonly Product[]): SidebarItem[] {
  return products
    .filter((product) => product.status !== 'proximamente')
    .map((product) => ({
      label: product.name,
      routerLink: ['/productos', product.slug],
      icon: 'package',
    }));
}

export function buildProductSidebarItems(product: Product): SidebarItem[] {
  const detailLink = ['/productos', product.slug];
  const items: SidebarItem[] = [];

  if (product.functionalDoc.length) {
    items.push({
      label: 'Documentación funcional',
      icon: 'book-open',
      children: product.functionalDoc.map((section) => ({
        label: section.title,
        routerLink: detailLink,
        fragment: docSectionId('func', section.title),
      })),
    });
  }

  if (product.technicalDoc.length) {
    items.push({
      label: 'Documentación técnica',
      icon: 'code',
      children: product.technicalDoc.map((section) => ({
        label: section.title,
        routerLink: detailLink,
        fragment: docSectionId('tec', section.title),
      })),
    });
  }

  if (product.userManual.length) {
    const manualLink = [...detailLink, 'manual'];
    const children: SidebarItem[] = [{ label: 'Matriz de capacidades', routerLink: manualLink, fragment: 'resumen' }];

    if (product.manualCommonSteps?.length) {
      children.push(
        ...product.manualCommonSteps.map((step) => ({
          label: step.title,
          routerLink: manualLink,
          fragment: `comun-${slugify(step.title)}`,
        })),
      );
    }

    children.push(
      ...product.userManual.map((role) => ({
        label: role.name,
        routerLink: manualLink,
        fragment: `rol-${role.id}`,
      })),
    );

    if (product.manualGuides?.length) {
      children.push(
        ...product.manualGuides.map((guide) => ({
          label: guide.title,
          routerLink: manualLink,
          fragment: `guia-${guide.id}`,
        })),
      );
    }

    items.push({ label: 'Manual de usuario', icon: 'users', children });
  }

  return items;
}
