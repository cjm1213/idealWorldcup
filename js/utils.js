// 피셔-예이츠 셔플 (원본은 건드리지 않음)
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 이름으로 항상 같은 색이 나오도록 해시 → 색상
export function gradient(name) {
  let h = 7;
  for (const ch of name) h = (h * 31 + ch.codePointAt(0)) % 360;
  return `linear-gradient(150deg, hsl(${h} 55% 52%), hsl(${(h + 40) % 360} 60% 30%))`;
}

// 사진 경로 규칙: images/<테마id>/<이름>.<ext>
export function photoPath(theme, item) {
  if (item.img) return item.img;
  return `images/${theme.id}/${encodeURIComponent(item.name)}.${theme.ext || 'jpg'}`;
}

// 이미지가 실제로 있는지 확인 (없으면 false)
export function probeImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
