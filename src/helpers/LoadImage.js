export default function(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymouse';
    img.onload = () => resolve(img);
    img.onerror = e => reject(e);
    img.src = src;
  });
}
