export function ToPascal(Value: string): string {
  if (!Value) return "";

  const Trimmed = Value.trim();
  return Trimmed.charAt(0).toUpperCase() + Trimmed.slice(1).toLowerCase();
}
