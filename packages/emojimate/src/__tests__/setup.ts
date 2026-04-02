import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: () => {},
  },
});

Object.defineProperty(globalThis, "history", {
  value: {
    pushState: () => {},
  },
});

class ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [
        {
          target,
          contentRect: { height: 500, width: 500 } as DOMRectReadOnly,
          borderBoxSize: [{ blockSize: 500, inlineSize: 500 }],
          contentBoxSize: [{ blockSize: 500, inlineSize: 500 }],
          devicePixelContentBoxSize: [{ blockSize: 500, inlineSize: 500 }],
        },
      ],
      this
    );
  }

  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", { value: ResizeObserver });

