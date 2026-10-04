import { createPortal } from "react-dom";
import { PlayClick } from "../../../Core/Services/SoundEffects";

interface ConfirmModalProps {
  Title: string;
  Message: string;
  ConfirmLabel: string;
  IsPositive?: boolean;
  OnConfirm: () => void;
  OnCancel: () => void;
}

export function ConfirmModal({ Title, Message, ConfirmLabel, IsPositive = false, OnConfirm, OnCancel }: ConfirmModalProps) {
  return createPortal(
    <div className="logout-modal-backdrop" role="presentation" onMouseDown={OnCancel}>
      <section
        className="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onMouseDown={(Event) => Event.stopPropagation()}
      >
        <h2 id="confirm-modal-title">{Title}</h2>
        <p>{Message}</p>
        <div className="logout-modal-actions">
          <button className="secondary" onClick={() => { PlayClick(); OnCancel(); }}>Cancel</button>
          <button className={IsPositive ? "play-confirm-button" : "logout-confirm-button"} onClick={OnConfirm}>{ConfirmLabel}</button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
