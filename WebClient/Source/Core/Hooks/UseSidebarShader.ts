import { useEffect, type RefObject } from "react";
import { CreateShaderProgram } from "../Services/SidebarShader";

const Quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

export function UseSidebarShader(CanvasRef: RefObject<HTMLCanvasElement | null>): void {
  useEffect(() => {
    const Canvas = CanvasRef.current;
    const Context = Canvas?.getContext("webgl", { alpha: true, antialias: false });
    if (!Canvas || !Context) return;

    const Program = CreateShaderProgram(Context);
    const Buffer = Context.createBuffer();
    if (!Program || !Buffer) return;

    Context.bindBuffer(Context.ARRAY_BUFFER, Buffer);
    Context.bufferData(Context.ARRAY_BUFFER, Quad, Context.STATIC_DRAW);

    const Position = Context.getAttribLocation(Program, "position");
    const Time = Context.getUniformLocation(Program, "time");
    const Resolution = Context.getUniformLocation(Program, "resolution");
    let Frame = 0;

    function Render(Now: number) {
      if (!Canvas || !Context) return;

      const Bounds = Canvas.getBoundingClientRect();
      Canvas.width = Math.max(1, Math.round(Bounds.width * devicePixelRatio));
      Canvas.height = Math.max(1, Math.round(Bounds.height * devicePixelRatio));
      Context.viewport(0, 0, Canvas.width, Canvas.height);

      Context.useProgram(Program);
      Context.bindBuffer(Context.ARRAY_BUFFER, Buffer);
      Context.enableVertexAttribArray(Position);
      Context.vertexAttribPointer(Position, 2, Context.FLOAT, false, 0, 0);
      Context.uniform1f(Time, Now * 0.001);
      Context.uniform2f(Resolution, Canvas.width, Canvas.height);
      Context.drawArrays(Context.TRIANGLE_STRIP, 0, 4);

      Frame = requestAnimationFrame(Render);
    }

    Frame = requestAnimationFrame(Render);
    return () => cancelAnimationFrame(Frame);
  }, []);
}
