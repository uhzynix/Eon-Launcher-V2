import { Download, Gauge } from "lucide-react";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import type { BuildDownloadProgress, DownloadSummary } from "../../../Types/Downloads";

interface DownloadDetailsProps {
  Progress: BuildDownloadProgress;
  Summary: DownloadSummary;
  OnPause: () => void;
  OnResume: () => void;
  OnCancel: () => void;
}

export function DownloadDetails({ Progress, Summary, OnPause, OnResume, OnCancel }: DownloadDetailsProps) {
  const IsPaused = Progress.Status === "paused";

  return (
    <>
      <div className="download-notification-details">
        <div className="download-notification-stat">
          <Download size={22} strokeWidth={1.8} />
          <div>
            <span>Size</span>
            <strong>{Summary.SizeLabel}</strong>
          </div>
        </div>
        <div className="download-notification-stat">
          <Gauge size={22} strokeWidth={1.8} />
          <div>
            <span>Speed</span>
            <strong>{Summary.SpeedLabel}</strong>
          </div>
        </div>
      </div>
      <div className="download-notification-progress-footer">
        <div className="download-notification-progress-heading">
          <span>{Summary.ProgressLabel}</span>
          <strong>{Summary.PercentLabel}</strong>
        </div>
        <div className="download-notification-progress-track">
          <span style={{ width: `${Summary.Percent}%` }} />
        </div>
      </div>
      <div className="download-notification-footer">
        <span>{Summary.FilesLabel}</span>
        <div className="download-notification-actions">
          {Summary.IsDownloading && (
            <button type="button" className="download-notification-btn" onClick={() => { PlayClick(); IsPaused ? OnResume() : OnPause(); }}>
              {IsPaused ? "Resume" : "Pause"}
            </button>
          )}
          <button type="button" className="download-notification-btn download-notification-cancel" onClick={() => { PlayClick(); OnCancel(); }}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
