import { TrailerSources } from "../../../Core/Configuration/Assets";

interface HomeTrailersProps {
  Visible: boolean;
  IsPlayPage: boolean;
  Active: number;
  OnEnded: (Index: number) => void;
}

export function HomeTrailers({ Visible, IsPlayPage, Active, OnEnded }: HomeTrailersProps) {
  if (!Visible) return null;

  return (
    <>
      {TrailerSources.map((Source, Index) => (
        <video
          key={Source}
          id={`home-trailer-${Index}`}
          className={`home-trailer${IsPlayPage ? " is-ready" : ""}${IsPlayPage && Active === Index ? " is-active" : ""}`}
          autoPlay
          muted
          loop={TrailerSources.length < 2}
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nofullscreen noremoteplayback noplaybackrate nodownload"
          preload="auto"
          aria-hidden="true"
          onEnded={() => OnEnded(Index)}
        >
          <source src={Source} type="video/mp4" />
        </video>
      ))}
    </>
  );
}

interface TrailerIndicatorProps {
  Active: number;
  OnSelect: (Index: number) => void;
}

export function TrailerIndicator({ Active, OnSelect }: TrailerIndicatorProps) {
  return (
    <div className="hero-trailer-indicator" aria-label="Choose trailer">
      {TrailerSources.map((Source, Index) => (
        <button
          key={Source}
          type="button"
          className={Active === Index ? "is-active" : undefined}
          aria-label={`Play trailer ${Index + 1}`}
          aria-current={Active === Index ? "true" : undefined}
          onClick={() => OnSelect(Index)}
        />
      ))}
    </div>
  );
}
