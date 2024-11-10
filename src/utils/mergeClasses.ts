export function mergeClasses(
  ...classNames: (string | undefined | null | 0 | false)[]
): string {
  return classNames.filter(Boolean).join(' ');
}
