import { describe, it, expect, vi } from "vitest";
import { handleDealKeyboardToggle, isDealToggleKey } from "./DealComparison";

describe("DealComparison keyboard interactions", () => {
  it("identifies Enter and Space as toggle keys", () => {
    expect(isDealToggleKey("Enter")).toBe(true);
    expect(isDealToggleKey(" ")).toBe(true);
    expect(isDealToggleKey("ArrowRight")).toBe(false);
  });

  it("invokes the toggle handler for supported keys", () => {
    const toggle = vi.fn();
    const preventDefault = vi.fn();

    handleDealKeyboardToggle({ key: "Enter", preventDefault }, toggle);
    handleDealKeyboardToggle({ key: " ", preventDefault }, toggle);
    handleDealKeyboardToggle({ key: "ArrowLeft", preventDefault }, toggle);

    expect(toggle).toHaveBeenCalledTimes(2);
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });
});
