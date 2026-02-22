export function assertOwner(ownerId: string, resourceOwnerId: string): void {
  if (ownerId !== resourceOwnerId) {
    throw new Error("FORBIDDEN");
  }
}

export function publicOnlyVisibility(): { visibility: "PUBLIC" } {
  return { visibility: "PUBLIC" };
}
