export interface BuildDownloadProgress {
  Downloaded: number;
  Total: number;
  ExtractedFiles?: number;
  TotalFiles?: number;
  Status: "preparing" | "downloading" | "paused" | "extracting" | "complete" | "cancelled";
  FileName: string;
  Message?: string;
}

export interface DownloadNotificationProps {
  Progress: BuildDownloadProgress;
  Speed: number;
  OnPause: () => void;
  OnResume: () => void;
  OnCancel: () => void;
  IsAuxiliary?: boolean;
}

export interface DownloadSummary {
  Percent: number;
  PercentLabel: string;
  StatusLabel: string;
  ProgressLabel: string;
  SizeLabel: string;
  SpeedLabel: string;
  FilesLabel: string;
  IsDownloading: boolean;
}