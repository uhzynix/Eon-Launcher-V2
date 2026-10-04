import { useState } from "react";
import { OpenUrl } from "../../../Core/Bridge/Bridge";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { BrandLogo } from "../../../Core/Configuration/Assets";
import { Project } from "../../../Core/Services/ProjectStore";
import { IsSuccessStatus, MessageForStatus } from "../../../Core/Configuration/LoginMessages";
import { CheckLogin } from "../../../Content/API/Authentication/LoginEndpoint";
import { Frame } from "../../Controls/Shell/Frame";
import { AmbientBackground } from "../../Controls/Shell/AmbientBackground";
import { LoginForm } from "./LoginForm";
import type { LoginScreenProps, MessageTone } from "../../../Types/Authentication";

export type { LoggedInAccount } from "../../../Types/Authentication";

export function LoginPage({ RememberMe, InitialStatus = "", OnLoggedIn }: LoginScreenProps) {
  const [Remember, SetRemember] = useState(RememberMe);
  const [Submitting, SetSubmitting] = useState(false);
  const [Message, SetMessage] = useState(MessageForStatus(InitialStatus));
  const [Tone, SetTone] = useState<MessageTone>(InitialStatus ? "error" : "info");

  function Fail(Text: string) {
    SetTone("error");
    SetMessage(Text);
    SetSubmitting(false);
  }

  async function Submit(Email: string, Password: string) {
    if (!Email || !Password) return Fail("Please enter both email and password.");
    if (!Email.includes("@")) return Fail("Please enter a valid email address.");

    SetSubmitting(true);
    SetTone("info");
    SetMessage("");

    try {
      const Response = await CheckLogin(Email, Password, Remember);

      if (!IsSuccessStatus(Response.Status)) return Fail(MessageForStatus(Response.Status));

      SetTone("success");
      OnLoggedIn({
        Email: Response.Email ?? Email,
        Password,
        Username: Response.Username ?? "Player",
        SkinUrl: Response.Skin ?? "",
        RememberMe: Remember,
      });
    } catch (Error) {
      Fail(String(Error));
    }
  }

  return (
    <main className="login-screen" onContextMenu={(Event) => Event.preventDefault()}>
      <Frame />
      <AmbientBackground />

      <section className="login-panel">
        <div className="login-box">
          <div className="logo-container">
            <div className="logo">
              <img src={BrandLogo} alt={Project().Name} />
            </div>
            <h1 className="welcome-text">{Project().Name}</h1>
            <p className="subtitle">Sign in to access your account</p>
          </div>

          <LoginForm Remember={Remember} Submitting={Submitting} OnRememberChange={SetRemember} OnSubmit={(Email, Password) => void Submit(Email, Password)} />

          {Message && <p className={`form-message ${Tone}`}>{Message}</p>}

          <div className="signup-container">
            Don&apos;t have an account?{" "}
            <button type="button" className="signup-link" onClick={() => { PlayClick(); void OpenUrl(Project().CreateAccountURL); }}>
              Sign up
            </button>
          </div>
        </div>
      </section>

      <div className="login-art">
        <div className="art-copy">
          <strong>Alien Invasion.</strong>
          <span>They&rsquo;ve been watching the skies for you. The signal&rsquo;s back, the island&rsquo;s calling, and it&rsquo;s time to come home.</span>
        </div>
      </div>
    </main>
  );
}
