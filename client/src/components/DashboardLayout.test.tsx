import { describe, it, expect } from "vitest";
import { adjustSidebarWidthForKey } from "./DashboardLayout";

describe("DashboardLayout keyboard resizing", () => {
  it("increments and decrements within bounds", () => {
    expect(adjustSidebarWidthForKey(280, "ArrowRight")).toBe(290);
    expect(adjustSidebarWidthForKey(280, "ArrowLeft")).toBe(270);
  });

  it("clamps at configured limits", () => {
    expect(adjustSidebarWidthForKey(200, "ArrowLeft")).toBe(200);
    expect(adjustSidebarWidthForKey(480, "ArrowRight")).toBe(480);
  });

  it("ignores unrelated keys", () => {
    expect(adjustSidebarWidthForKey(320, "Enter")).toBe(320);
  });
});
