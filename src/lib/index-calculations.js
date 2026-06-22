export const BLOCK_BYTES = 2 * 1024;
export const POINTER_BYTES = 16;
export const NODE_POINTER_BYTES = 12;
export const BPLUS_OCCUPATION = 0.69;
export const ANSWER_TOLERANCE = 0.01;

export function calculateTable(fields, amount) {
  const recordSize = fields.reduce((total, field) => total + field.size, 0);
  const blockFactor = Math.floor(BLOCK_BYTES / recordSize);
  const blocksAmount = Math.ceil(amount / blockFactor);
  const waste = BLOCK_BYTES - blockFactor * recordSize;

  return {
    amount,
    recordSize,
    blockFactor,
    blocksAmount,
    waste,
    size: blocksAmount * BLOCK_BYTES,
  };
}

export function calculateOrderedIndex(fields, amount) {
  const recordSize =
    fields.reduce((total, field) => total + field.size, 0) + POINTER_BYTES;
  const blockFactor = Math.floor(BLOCK_BYTES / recordSize);
  const blocksAmount = Math.ceil(amount / blockFactor);
  const waste = BLOCK_BYTES - blockFactor * recordSize;

  return {
    amount,
    recordSize,
    blockFactor,
    blocksAmount,
    waste,
    size: blocksAmount * BLOCK_BYTES,
    blocksToRetrieve: Math.ceil(Math.log2(blocksAmount)) + 1,
  };
}

function countStaticIndexBlocks(entries, blockFactor) {
  const currentLevel = Math.ceil(entries / blockFactor);
  if (currentLevel === 1) return 1;
  return currentLevel + countStaticIndexBlocks(currentLevel, blockFactor);
}

export function calculateStaticMultilevelIndex(fields, amount) {
  const recordSize =
    fields.reduce((total, field) => total + field.size, 0) + POINTER_BYTES;
  const blockFactor = Math.floor(BLOCK_BYTES / recordSize);

  return {
    amount,
    recordSize,
    blockFactor,
    blocksAmount: countStaticIndexBlocks(amount, blockFactor),
    size: countStaticIndexBlocks(amount, blockFactor) * BLOCK_BYTES,
    blocksToRetrieve:
      Math.ceil(Math.log(amount) / Math.log(blockFactor)) + 1,
  };
}

function countBplusInternalNodes(pointers, blockFactor) {
  const currentLevel = Math.ceil(pointers / blockFactor);
  if (currentLevel === 1) return 1;
  return currentLevel + countBplusInternalNodes(currentLevel, blockFactor);
}

export function calculateBplusIndex(field, amount) {
  const usableBlockBytes = BLOCK_BYTES - NODE_POINTER_BYTES;
  const indexNodeRecordSize = field.size + NODE_POINTER_BYTES;
  const treeOrder = Math.floor(usableBlockBytes / indexNodeRecordSize) + 1;
  const indexBlockFactor = Math.ceil((treeOrder - 1) * BPLUS_OCCUPATION);
  const height = Math.ceil(Math.log(amount) / Math.log(treeOrder));
  const leafRecordSize = field.size + POINTER_BYTES;
  const leafBlockFactor = Math.ceil(
    Math.floor(usableBlockBytes / leafRecordSize) * BPLUS_OCCUPATION,
  );
  const leafAmount = Math.ceil(amount / leafBlockFactor);
  const indexAmount = countBplusInternalNodes(leafAmount, indexBlockFactor);
  const blocksAmount = leafAmount + indexAmount;

  return {
    amount,
    height,
    blocksToRetrieve: height + 1,
    leafRecordSize,
    leafBlockFactor,
    leafAmount,
    indexNodeRecordSize,
    treeOrder,
    indexBlockFactor,
    indexAmount,
    blocksAmount,
    size: blocksAmount * BLOCK_BYTES,
  };
}

export function parseNumericAnswer(rawValue) {
  const normalized = String(rawValue ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  if (!normalized) return Number.NaN;
  return Number(normalized);
}

export function isWithinTolerance(answer, expected, tolerance = ANSWER_TOLERANCE) {
  const value = typeof answer === "number" ? answer : parseNumericAnswer(answer);
  if (!Number.isFinite(value) || !Number.isFinite(expected)) return false;
  if (expected === 0) return Math.abs(value) <= tolerance;
  return Math.abs(value - expected) <= Math.abs(expected) * tolerance;
}
