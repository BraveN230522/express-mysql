export const isHexColorRegex = (string: string) =>
  /^#[0-9A-F]{6}$/i.test(string) || /^#([0-9A-F]{3}){1,2}$/i.test(string)
