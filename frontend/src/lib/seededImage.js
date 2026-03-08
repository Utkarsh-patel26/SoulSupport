function hashSeed(seed = '') {
  let hash = 0;
  const value = String(seed || 'soulsupport');

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function getSeededPhotoUrl(seed = '', category = 'wellness', width = 900, height = 700) {
  const id = hashSeed(`${category}-${seed}`) % 1000;
  return `https://picsum.photos/seed/soulsupport-${category}-${id}/${width}/${height}`;
}

export function getSeededIllustrationUrl(seed = '', style = 'shapes') {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(`soulsupport-${seed}`)}`;
}

export function getSeededFallbackUrls(seed = '', category = 'wellness') {
  return [
    getSeededPhotoUrl(seed, category),
    getSeededIllustrationUrl(seed, 'shapes'),
    getSeededIllustrationUrl(`${seed}-alt`, 'identicon'),
  ];
}
