export type ContactPosition = { x: number; y: number };
export const CONTACT_SIZE = 56;
export const CONTACT_MARGIN = 16;
export const CONTACT_POSITION_KEY = "growthly_whatsapp_position";

export function clampContactPosition(
  position: ContactPosition,
  width: number,
  height: number,
  bottomBoundary = height,
): ContactPosition {
  const maxX = Math.max(CONTACT_MARGIN, width - CONTACT_SIZE - CONTACT_MARGIN);
  const maxY = Math.max(
    CONTACT_MARGIN,
    Math.min(height, bottomBoundary) - CONTACT_SIZE - CONTACT_MARGIN,
  );
  return {
    x: Math.min(
      maxX,
      Math.max(CONTACT_MARGIN, Number.isFinite(position.x) ? position.x : maxX),
    ),
    y: Math.min(
      maxY,
      Math.max(CONTACT_MARGIN, Number.isFinite(position.y) ? position.y : maxY),
    ),
  };
}

export function readContactPosition(
  value: string | null,
): ContactPosition | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed?.x === "number" &&
      Number.isFinite(parsed.x) &&
      typeof parsed?.y === "number" &&
      Number.isFinite(parsed.y)
      ? { x: parsed.x, y: parsed.y }
      : null;
  } catch {
    return null;
  }
}
