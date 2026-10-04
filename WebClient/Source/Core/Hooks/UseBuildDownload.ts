import { useEffect, useRef, useState } from "react";
import { Invoke, Listen } from "../Bridge/Bridge";
import type { BuildDownloadProgress } from "../../UI/Controls/Downloads/DownloadNotification";

export interface BuildDownload {
  Progress: BuildDownloadProgress | null;
  Speed: number;
  CompletedFolder: string | null;
  Error: string | null;
  ClearCompletedFolder: () => void;
  ClearError: () => void;
  Start: (Folder: string, IsInstall: boolean) => void;
  Pause: () => void;
  Resume: () => void;
  Cancel: () => void;
}

export function UseBuildDownload(): BuildDownload {
  const [Progress, SetProgress] = useState<BuildDownloadProgress | null>(null);
  const [Speed, SetSpeed] = useState(0);
  const [CompletedFolder, SetCompletedFolder] = useState<string | null>(null);
  const [ErrorMessage, SetErrorMessage] = useState<string | null>(null);
  const IsActive = useRef(false);
  const Cancelling = useRef(false);
  const PendingFolder = useRef<string | null>(null);
  const LastSample = useRef<{ Bytes: number; Time: number } | null>(null);

  function Stop() {
    IsActive.current = false;
    PendingFolder.current = null;
    SetProgress(null);
    SetSpeed(0);
  }

  function Fail(Reason: unknown) {
    Stop();

    if (Cancelling.current) {
      Cancelling.current = false;
      return;
    }

    SetErrorMessage(Reason instanceof Error ? Reason.message : "The download failed. Please try again.");
  }

  useEffect(() => {
    return Listen<BuildDownloadProgress>("build-download-progress", (Payload) => {
      if (!IsActive.current) return;

      const Now = performance.now();
      const Previous = LastSample.current;
      if (Previous && Now > Previous.Time) {
        SetSpeed(Math.max(0, ((Payload.Downloaded - Previous.Bytes) / (Now - Previous.Time)) * 1000));
      }
      LastSample.current = { Bytes: Payload.Downloaded, Time: Now };

      if (Payload.Status === "complete") {
        if (PendingFolder.current) SetCompletedFolder(PendingFolder.current);
        Stop();
        return;
      }

      if (Payload.Status === "cancelled") {
        Stop();
        return;
      }

      SetProgress(Payload);
    });
  }, []);

  function Start(Folder: string, IsInstall: boolean) {
    if (!Folder) return;

    Cancelling.current = false;
    SetErrorMessage(null);
    PendingFolder.current = IsInstall ? Folder : null;
    LastSample.current = null;
    IsActive.current = true;
    SetSpeed(0);
    SetProgress({ Downloaded: 0, Total: 0, Status: "preparing", FileName: "" });

    void Invoke("DownloadBuild", { Path: Folder }).catch(Fail);
  }

  function Cancel() {
    Cancelling.current = true;
    Stop();
    void Invoke("CancelBuildDownload");
  }

  return {
    Progress,
    Speed,
    CompletedFolder,
    Error: ErrorMessage,
    ClearCompletedFolder: () => SetCompletedFolder(null),
    ClearError: () => SetErrorMessage(null),
    Start,
    Pause: () => void Invoke("PauseBuildDownload"),
    Resume: () => void Invoke("ResumeBuildDownload"),
    Cancel,
  };
}
