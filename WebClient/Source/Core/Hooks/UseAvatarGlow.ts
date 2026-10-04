import { useEffect, useState } from "react";
import { Invoke } from "../Bridge/Bridge";
import { ReadDominantColor } from "../Services/DominantColor";

interface ImagePayload {
  Data: string;
  Mime: string;
}

export interface AvatarGlow {
  Source: string;
  Color: string | null;
}

export function UseAvatarGlow(SkinUrl: string): AvatarGlow {
  const [Source, SetSource] = useState("");
  const [Color, SetColor] = useState<string | null>(null);

  useEffect(() => {
    if (!SkinUrl) return;
    let Disposed = false;

    void Invoke<ImagePayload | null>("FetchImage", { Url: SkinUrl })
      .then((Payload) => {
        if (Disposed || !Payload) return;

        const DataUrl = `data:${Payload.Mime};base64,${Payload.Data}`;
        SetSource(DataUrl);

        const Loader = new Image();
        Loader.onload = () => {
          const Value = ReadDominantColor(Loader);
          if (!Disposed && Value) SetColor(Value);
        };
        Loader.src = DataUrl;
      })
      .catch(() => {});

    return () => {
      Disposed = true;
    };
  }, [SkinUrl]);

  return { Source, Color };
}
