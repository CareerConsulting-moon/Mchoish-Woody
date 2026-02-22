import { describe, expect, it } from "vitest";
import { assertOwner, publicOnlyVisibility } from "./guards";

describe("assertOwner", () => {
  it("throws when owner does not match", () => {
    expect(() => assertOwner("owner-1", "owner-2")).toThrow("FORBIDDEN");
  });

  it("passes when owner matches", () => {
    expect(() => assertOwner("owner-1", "owner-1")).not.toThrow();
  });
});

describe("publicOnlyVisibility", () => {
  it("returns public filter", () => {
    expect(publicOnlyVisibility()).toEqual({ visibility: "PUBLIC" });
  });
});
