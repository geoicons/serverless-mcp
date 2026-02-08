export function generate_composite_string(
  input: string,
  stack_name: string,
  separator: string = ""
): string {
  return input + separator + stack_name;
}

export function append_prefix(input: string, prefix: string): string {
  return prefix + "-" + input;
}
