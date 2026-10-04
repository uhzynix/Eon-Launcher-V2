export const VertexSource = "attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}";

export const FragmentSource = "precision mediump float; uniform float time; uniform vec2 resolution; float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} void main(){vec2 uv=gl_FragCoord.xy/resolution; vec2 p=uv*3.0; float n=hash(floor(p+time*.08)); float wave=sin((uv.x+time*.025)*9.0+sin(uv.y*8.0+time*.4))*0.5+0.5; vec3 color=mix(vec3(.16,.12,.22),vec3(.32,.25,.42),wave*.22+n*.08); float edge=smoothstep(0.0,.18,uv.y)*smoothstep(1.0,.82,uv.y); gl_FragColor=vec4(color,edge*.34);}";

export function CompileShader(Context: WebGLRenderingContext, Type: number, Source: string): WebGLShader | null {
  const Shader = Context.createShader(Type);
  if (!Shader) return null;

  Context.shaderSource(Shader, Source);
  Context.compileShader(Shader);

  return Context.getShaderParameter(Shader, Context.COMPILE_STATUS) ? Shader : null;
}

export function CreateShaderProgram(Context: WebGLRenderingContext): WebGLProgram | null {
  const Vertex = CompileShader(Context, Context.VERTEX_SHADER, VertexSource);
  const Fragment = CompileShader(Context, Context.FRAGMENT_SHADER, FragmentSource);
  if (!Vertex || !Fragment) return null;

  const Program = Context.createProgram();
  if (!Program) return null;

  Context.attachShader(Program, Vertex);
  Context.attachShader(Program, Fragment);
  Context.linkProgram(Program);

  return Context.getProgramParameter(Program, Context.LINK_STATUS) ? Program : null;
}
