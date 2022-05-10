export function sortDependencies(
  dependencies: { [key: string]: string } | undefined,
) {
  if (!dependencies) {
    return;
  }

  return Object.entries(dependencies)
    .sort(([, v1], [, v2]) => +v2 - +v1)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}
