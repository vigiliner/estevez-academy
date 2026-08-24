const TOP_OFFSET_PX = 96;
const BOTTOM_EPSILON_PX = 1;

/**
 * Watches `sectionIds` (in document order) inside `#main-content` and reports which one is
 * "active" — the last section whose heading has scrolled past a line near the top of the
 * container. Falls back to the first section while above it, and to the last section once
 * scrolled to the bottom (so it activates even when it doesn't have room to reach the line).
 * Used to keep the sidebar highlighted on the section the user is reading.
 */
export function observeActiveSection(
  document: Document,
  sectionIds: readonly string[],
  onActiveChange: (id: string) => void,
  onCleanup: (cleanupFn: () => void) => void,
): void {
  const root = document.getElementById('main-content');
  if (!root) {
    return;
  }

  const elements = sectionIds
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => element !== null);

  if (!elements.length) {
    return;
  }

  let scheduled = false;

  const computeActive = (): void => {
    scheduled = false;

    const scrollTop = root.scrollTop;
    const canScroll = root.scrollHeight > root.clientHeight + BOTTOM_EPSILON_PX;
    const atBottom = canScroll && scrollTop + root.clientHeight >= root.scrollHeight - BOTTOM_EPSILON_PX;
    if (atBottom) {
      onActiveChange(elements[elements.length - 1].id);
      return;
    }

    const rootTop = root.getBoundingClientRect().top;
    const threshold = scrollTop + TOP_OFFSET_PX;

    let activeId = elements[0].id;
    for (const element of elements) {
      const elementTop = element.getBoundingClientRect().top - rootTop + scrollTop;
      if (elementTop > threshold) {
        break;
      }
      activeId = element.id;
    }
    onActiveChange(activeId);
  };

  const onScroll = (): void => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(computeActive);
    }
  };

  root.addEventListener('scroll', onScroll, { passive: true });
  computeActive();

  onCleanup(() => root.removeEventListener('scroll', onScroll));
}
