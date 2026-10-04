// Colour maths — hex conversions + WCAG contrast, ported from the prototype.

export const hexToRgb = (h: string) => ({
  r: parseInt(h.slice(1, 3), 16),
  g: parseInt(h.slice(3, 5), 16),
  b: parseInt(h.slice(5, 7), 16),
});

export const rgbStr = (h: string) => {
  const { r, g, b } = hexToRgb(h);
  return `rgb(${r} ${g} ${b})`;
};

export function hslStr(h: string) {
  let { r, g, b } = hexToRgb(h);
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  let hue = 0;
  let s = 0;
  const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    hue = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    hue /= 6;
  }
  return `hsl(${Math.round(hue * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

export const relLum = (h: string) => {
  const { r, g, b } = hexToRgb(h);
  return [r, g, b]
    .map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    })
    .reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
};

export const contrast = (a: string, b: string) => {
  const l1 = relLum(a);
  const l2 = relLum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

export const bestInk = (h: string) => (contrast(h, "#FFFFFF") >= contrast(h, "#111111") ? "#FFFFFF" : "#111111");

export const grade = (r: number): { label: string; pass: boolean } =>
  r >= 7 ? { label: "AAA", pass: true } : r >= 4.5 ? { label: "AA", pass: true } : { label: "Fail", pass: false };
