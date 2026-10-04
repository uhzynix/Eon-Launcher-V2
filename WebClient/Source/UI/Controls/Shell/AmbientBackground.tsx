import { memo, useRef } from "react";
import { UseAmbientCanvas } from "../../../Core/Hooks/UseAmbientCanvas";

export const AmbientBackground = memo(function AmbientBackground() {
  const CanvasRef = useRef<HTMLCanvasElement>(null);

  UseAmbientCanvas(CanvasRef);

  return (
    <div className="ambient-background" aria-hidden="true">
      <canvas ref={CanvasRef} />
    </div>
  );
});
