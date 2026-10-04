import { useEffect, useRef, useState } from "react";
import { Listen } from "../Bridge/Bridge";
import type { BuildDownloadProgress } from "../../UI/Controls/Downloads/DownloadNotification";

export interface AuxiliaryDownload {
  Progress: BuildDownloadProgress | null;
  IsActive: boolean;
  Begin: () => void;
  End: () => void;
}

export function UseAuxiliaryDownload(): AuxiliaryDownload {
  const [Progress, SetProgress] = useState<BuildDownloadProgress | null>(null);
  const [IsActive, SetIsActive] = useState(false);
  const Active = useRef(false);

  useEffect(() => {
    return Listen<BuildDownloadProgress>("auxiliary-download-progress", (Payload) => {
      if (!Active.current || Payload.Status === "complete") return;
      SetProgress(Payload);
    });
  }, []);

  function Begin() {
    Active.current = true;
    SetIsActive(true);
    SetProgress({ Downloaded: 0, Total: 0, Status: "preparing", FileName: "" });
  }

  function End() {
    Active.current = false;
    SetIsActive(false);
    SetProgress(null);
  }

  return { Progress, IsActive, Begin, End };
}
