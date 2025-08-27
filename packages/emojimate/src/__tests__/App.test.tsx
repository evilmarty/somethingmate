import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

const SEARCH =
  "?q=smile";
const URL = "http://localhost/";
const HREF = `${URL}${SEARCH}`;

let historySpy, clipboardSpy;

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("location", { search: SEARCH, href: HREF });
    historySpy = vi.spyOn(history, "pushState").mockImplementation(() => {});
    clipboardSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the app", () => {
    render(<App />);
    expect(screen.getByAltText("Emoji Mate")).toBeInTheDocument();
  });

  it("should update the url value when the query input changes", () => {
    const expectedQuery = "beach";
    render(<App />);
    const queryInput = screen.getByPlaceholderText("Query...", { selector: "#query" });
    expect(queryInput.value).toBe("smile");
    act(() => {
      fireEvent.change(queryInput, { target: { value: expectedQuery } });
      vi.advanceTimersByTime(1000);
    });
    expect(historySpy).toHaveBeenCalledWith(
      { query: expectedQuery },
      "",
      `${URL}?q=${encodeURIComponent(expectedQuery)}`,
    );
  });

  it("should copy the emoji when clicked", () => {
    render(<App />);
    const emojiButton = screen.getByTitle("slightly smiling face", {selector: "button"});
    act(() => {
      fireEvent.click(emojiButton);
    });
    expect(clipboardSpy).toHaveBeenCalledWith("🙂");
  });
});
