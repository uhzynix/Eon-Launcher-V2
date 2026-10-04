import { SplashArt } from "../../../Core/Configuration/Assets";
import { UseSmoothSpeed } from "../../../Core/Hooks/UseSmoothSpeed";
import { SummariseDownload } from "../../../Core/Services/DownloadFormat";
import { DownloadDetails } from "./DownloadDetails";
import type { DownloadNotificationProps } from "../../../Types/Downloads";

export type { BuildDownloadProgress } from "../../../Types/Downloads";

const StaticCaption = "This may take a while depending on your internet speed.";

export function DownloadNotification({ Progress, Speed, OnPause, OnResume, OnCancel, IsAuxiliary = false }: DownloadNotificationProps) {
  const DisplayedSpeed = UseSmoothSpeed(Speed);
  const Summary = SummariseDownload(Progress, DisplayedSpeed);
  const IsPreparing = Progress.Status === "preparing" || !Progress.FileName;

  const Heading = IsPreparing ? "Preparing Download" : IsAuxiliary ? "Downloading Files" : "Downloading Fortnite";
  const Caption = IsPreparing || !IsAuxiliary ? StaticCaption : `${Progress.FileName} ${Summary.PercentLabel}`;

  if (IsAuxiliary) {
    return (
      <div className="download-notification download-notification-auxiliary" role="status" aria-live="polite">
        <div className="download-notification-info-bar">
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          <div>
            <strong>{Heading}</strong>
            <span>{Caption}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="download-notification" role="status" aria-live="polite">
      <div className="download-notification-cover">
        <img src={SplashArt} alt="" />
      </div>
      <div className="download-notification-body">
        <div className="download-notification-title">
          <strong>{Heading}</strong>
          <span>{Caption}</span>
        </div>
        <DownloadDetails Progress={Progress} Summary={Summary} OnPause={OnPause} OnResume={OnResume} OnCancel={OnCancel} />
      </div>
    </div>
  );
}
