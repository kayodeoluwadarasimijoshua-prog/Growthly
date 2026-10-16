import { vi } from "vitest";
// Next enforces this boundary in real builds. Pure/node tests need a server marker stub.
vi.mock("server-only", () => ({}));
