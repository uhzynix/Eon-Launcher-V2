import type { BuildDownloadProgress, DownloadSummary } from "../../Types/Downloads";

const Kilobyte = 1024;

export function FormatBytes(Bytes: number): string {
  if (Bytes < Kilobyte ** 2) return `${(Bytes / Kilobyte).toFixed(1)} KB`;
  if (Bytes < Kilobyte ** 3) return `${(Bytes / Kilobyte ** 2).toFixed(2)} MB`;
  return `${(Bytes / Kilobyte ** 3).toFixed(2)} GB`;
}

export function DownloadHeading(Progress: BuildDownloadProgress, Title: string): string {
  if (Progress.Message) return Progress.Message;
  if (Progress.Status === "extracting") return `Installing ${Title}`;
  if (Progress.Status === "complete") return `Installed ${Title}`;
  if (Progress.Status === "preparing" || !Progress.Total) return "Preparing Download";

  return `Downloading ${Title}`;
}

export function SummariseDownload(Progress: BuildDownloadProgress, Speed: number): DownloadSummary {
  const IsDownloading = Progress.Status === "downloading" || Progress.Status === "paused";
  const IsExtracting = Progress.Status === "extracting";
  const IsComplete = Progress.Status === "complete";

  const Extracted = IsExtracting ? Progress.ExtractedFiles ?? 0 : 0;
  const TotalFiles = IsExtracting ? Progress.TotalFiles ?? 0 : 1;

  const Percent = IsDownloading && Progress.Total
    ? Math.min(100, (Progress.Downloaded / Progress.Total) * 100)
    : IsExtracting && TotalFiles > 0
      ? Math.min(100, (Extracted / TotalFiles) * 100)
      : IsComplete
        ? 100
        : 0;

  const StatusLabel = Progress.Status === "paused"
    ? "Paused"
    : IsExtracting
      ? "Installing"
      : IsComplete
        ? "Complete"
        : "Downloading";

  const SizeLabel = IsExtracting ? "N/A" : `${FormatBytes(Progress.Downloaded)} / ${Progress.Total ? FormatBytes(Progress.Total) : "N/A"}`;

  return {
    Percent,
    PercentLabel: `${Percent.toFixed(2)}%`,
    StatusLabel,
    ProgressLabel: IsExtracting ? "Installing files:" : "Download progress:",
    SizeLabel,
    SpeedLabel: IsExtracting || IsComplete ? "N/A" : Speed > 0 ? `${FormatBytes(Speed)}/s` : "N/A",
    FilesLabel: IsExtracting ? `Files: ${Extracted} / ${TotalFiles}` : "Files: 1 / 1",
    IsDownloading,
  };
}