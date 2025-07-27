import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AppContainer from "../AppContainer";

describe("AppContainer", () => {
  it("should display logo", () => {
    const logo = "https://example.com/logo.png";
    render(<AppContainer logo={logo} name="Test" />);

    expect(screen.getByAltText("Test")).toHaveAttribute("src", logo);
  });

  it("should render children", () => {
    render(
      <AppContainer>
        <span>Test Child</span>
      </AppContainer>,
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
