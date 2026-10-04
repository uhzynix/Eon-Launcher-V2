import { useEffect, useRef, type RefObject } from "react";
import { CreateShootingStar } from "../Services/Ambient/AmbientFactory";
import { CreateScene, ResizeScene } from "../Services/Ambient/AmbientScene";
import { DrawGlows } from "../Services/Ambient/DrawGlows";
import { DrawStars } from "../Services/Ambient/DrawStars";
import { DrawShootingStars } from "../Services/Ambient/DrawShootingStars";

const MaxFrameDelta = 80;
const PointerEasing = 0.09;

export function UseAmbientCanvas(CanvasRef: RefObject<HTMLCanvasElement | null>): void {
  const Scene = useRef(CreateScene());
  const Bounds = useRef<DOMRect | null>(null);
  const Frame = useRef<number | null>(null);

  useEffect(() => {
    const Canvas = CanvasRef.current;
    const Context = Canvas?.getContext("2d", { alpha: true });
    if (!Canvas || !Context) return;

    function Resize() {
      if (!Canvas) return;
      Bounds.current = Canvas.parentElement?.getBoundingClientRect() ?? null;
      ResizeScene(Scene.current, Canvas, Bounds.current);
    }

    function HandlePointerMove(Event: PointerEvent) {
      Scene.current.Mouse.TargetX = Event.clientX - (Bounds.current?.left ?? 0);
      Scene.current.Mouse.TargetY = Event.clientY - (Bounds.current?.top ?? 0);
    }

    let LastTime = performance.now();

    function Draw(Time: number) {
      Frame.current = requestAnimationFrame(Draw);
      if (!Canvas || !Context) return;

      const Current = Scene.current;
      const { Width, Height, DPR } = Current.Size;
      const Delta = Time - LastTime;
      LastTime = Time;

      if (Width <= 0 || Height <= 0 || Delta > MaxFrameDelta) return;

      Current.Mouse.X += (Current.Mouse.TargetX - Current.Mouse.X) * PointerEasing;
      Current.Mouse.Y += (Current.Mouse.TargetY - Current.Mouse.Y) * PointerEasing;

      Context.setTransform(1, 0, 0, 1, 0, 0);
      Context.clearRect(0, 0, Canvas.width, Canvas.height);
      Context.save();
      Context.scale(DPR, DPR);

      DrawGlows(Context, Current.Glows, Time);
      DrawStars(Context, Current.Stars, Time, Delta, Current.Mouse, Width, Height);

      if (Time > Current.NextShooting) {
        Current.Shooting.push(CreateShootingStar(Width, Height));
        Current.NextShooting = Time + 4000 + Math.random() * 6000;
      }

      Current.Shooting = DrawShootingStars(Context, Current.Shooting, Delta, Width, Height);
      Context.restore();
    }

    Resize();
    const SettleTimer = setTimeout(Resize, 60);
    const ThemeObserver = new MutationObserver(Resize);
    ThemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const SizeObserver = Canvas.parentElement ? new ResizeObserver(Resize) : null;
    SizeObserver?.observe(Canvas.parentElement as Element);

    window.addEventListener("resize", Resize);
    window.addEventListener("pointermove", HandlePointerMove);
    Frame.current = requestAnimationFrame(Draw);

    return () => {
      clearTimeout(SettleTimer);
      if (Frame.current) cancelAnimationFrame(Frame.current);
      window.removeEventListener("resize", Resize);
      window.removeEventListener("pointermove", HandlePointerMove);
      SizeObserver?.disconnect();
      ThemeObserver.disconnect();
    };
  }, []);
}
