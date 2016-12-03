export default function canvasUrlFromImage(image) {
  const canvas = document.createElement('canvas');

  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');

  context.drawImage(image, 0, 0);

  return canvas.toDataURL("image/png");
}
