const MinimumAlpha = 128;

export function ReadDominantColor(Image: HTMLImageElement): string | null {
  const Canvas = document.createElement("canvas");
  Canvas.width = Image.naturalWidth || Image.width;
  Canvas.height = Image.naturalHeight || Image.height;

  const Context = Canvas.getContext("2d", { willReadFrequently: true });
  if (!Context || !Canvas.width || !Canvas.height) return null;

  try {
    Context.drawImage(Image, 0, 0);
    const Pixels = Context.getImageData(0, 0, Canvas.width, Canvas.height).data;

    let Red = 0;
    let Green = 0;
    let Blue = 0;
    let Count = 0;

    for (let Index = 0; Index < Pixels.length; Index += 4) {
      if (Pixels[Index + 3] <= MinimumAlpha) continue;

      Red += Pixels[Index];
      Green += Pixels[Index + 1];
      Blue += Pixels[Index + 2];
      Count += 1;
    }

    if (!Count) return null;

    return `rgb(${Math.floor(Red / Count)}, ${Math.floor(Green / Count)}, ${Math.floor(Blue / Count)})`;
  } catch {
    return null;
  }
}
