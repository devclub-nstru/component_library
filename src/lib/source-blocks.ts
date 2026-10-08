export function extractSourceBlocks(
  source: string,
  pattern: RegExp,
  expectedCount: number,
): string {
  const blocks = source.match(pattern) ?? [];

  if (blocks.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} source blocks, found ${blocks.length}`,
    );
  }

  return blocks.join("\n\n");
}
