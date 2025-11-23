import { type Ref } from "vue";
import { findElementFromVueRef } from "@fkui/vue";

function _scroll(element: Element | undefined, options: ScrollToOptions): void {
    if (!element) {
        return;
    }
    element.scroll(options);
}

function _scrollIntoView(
    element: Element | undefined,
    options?: ScrollIntoViewOptions,
): void {
    if (!element) {
        return;
    }
    element.scrollIntoView(options);
}

export function scroll(
    vueRef: Ref<Element | undefined | null>,
    options: ScrollToOptions,
): void {
    _scroll(findElementFromVueRef(vueRef.value), options);
}

export function scrollElement(
    element: Element | undefined,
    options: ScrollToOptions,
): void {
    _scroll(element, options);
}

export function scrollToTop(vueRef: Ref<Element | undefined | null>): void {
    scrollElementToTop(findElementFromVueRef(vueRef.value));
}

export function scrollElementToTop(element: Element | undefined): void {
    _scroll(element, { top: 0 });
}

export function scrollElementIntoView(element: Element | undefined): void {
    _scrollIntoView(element, {
        behavior: "smooth",
        block: "end",
        inline: "nearest",
    });
}

export function decodeHtmlEntities(input: string): string {
    const parser = new DOMParser();
    return parser.parseFromString(input, "text/html").body.textContent;
}

/**
 * Determines whether a given HTML element is vertically scrollable.
 *
 * An element is considered scrollable if:
 * - Its `scrollHeight` exceeds its `clientHeight` (i.e., it has overflow content).
 * - Its computed `overflowY` or `overflow` style is set to `"auto"` or `"scroll"`.
 * - It is visible (`display` is not `"none"` and `visibility` is not `"hidden"`).
 *
 * @param el - The HTMLElement to evaluate for vertical scrollability.
 * @returns `true` if the element is scrollable vertically; otherwise, `false`.
 */
export function isScrollable(el: HTMLElement): boolean {
    const style = getComputedStyle(el);
    const overflowY = style.overflowY;
    const overflow = style.overflow;
    const hasContent = el.scrollHeight > el.clientHeight;

    const scrollableY =
        ["auto", "scroll"].includes(overflowY) ||
        ["auto", "scroll"].includes(overflow);
    const isVisible = style.display !== "none" && style.visibility !== "hidden";

    return hasContent && scrollableY && isVisible;
}

/**
 * Recursively searches for the first vertically scrollable descendant of a given HTMLElement.
 *
 * The search starts from the provided root element and traverses its children using
 * breadth-first search (BFS) to find the shallowest scrollable element.
 *
 * Scrollability is determined using the `isScrollable` helper function.
 *
 * @param el - The root HTMLElement from which to begin the search.
 * @returns The first scrollable HTMLElement found, or `null` if none are scrollable.
 */
export function findFirstScrollableElement(
    el: HTMLElement,
): HTMLElement | null {
    const queue: HTMLElement[] = [el];

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }

        if (isScrollable(current)) {
            return current;
        }

        for (const child of Array.from(current.children)) {
            if (child instanceof HTMLElement) {
                queue.push(child);
            }
        }
    }

    return null;
}
