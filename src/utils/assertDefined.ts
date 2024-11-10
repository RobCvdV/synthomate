import { Exception } from "../types/Exception";

export function assertDefined<T>(
  value: T | undefined | null,
  where = "unknown",
): asserts value is T {
  if (value === undefined || value === null) {
    const description = `Value should be defined: ${where}`;
    throw Exception.IsNotValid.because(description);
  }
}
