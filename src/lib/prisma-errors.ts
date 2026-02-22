export function isPrismaRuntimeDbError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name.includes("PrismaClient") ||
    error.message.includes("The table") ||
    error.message.includes("Prisma has detected that this project was built on Vercel") ||
    error.message.includes("Failed to open the database file")
  );
}
