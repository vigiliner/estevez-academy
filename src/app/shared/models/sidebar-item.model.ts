export type SidebarIcon = 'package' | 'book-open' | 'code' | 'users';

export interface SidebarItem {
  readonly label: string;
  readonly routerLink?: readonly string[];
  readonly fragment?: string;
  readonly icon?: SidebarIcon;
  readonly children?: readonly SidebarItem[];
}
