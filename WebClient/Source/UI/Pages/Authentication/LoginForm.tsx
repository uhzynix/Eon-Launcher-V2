import { useState, type FormEvent } from "react";
import { OpenUrl } from "../../../Core/Bridge/Bridge";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { Project } from "../../../Core/Services/ProjectStore";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "../../Controls/Icons/LoginIcons";

interface LoginFormProps {
  Remember: boolean;
  Submitting: boolean;
  OnRememberChange: (Value: boolean) => void;
  OnSubmit: (Email: string, Password: string) => void;
}

export function LoginForm({ Remember, Submitting, OnRememberChange, OnSubmit }: LoginFormProps) {
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [ShowPassword, SetShowPassword] = useState(false);

  function Submit(Event: FormEvent) {
    Event.preventDefault();
    PlayClick();
    OnSubmit(Email, Password);
  }

  return (
    <form onSubmit={Submit} autoComplete="off">
      <div className="form-group">
        <label className="form-label" htmlFor="EmailInput">Email Address</label>
        <div className="input-wrapper">
          <MailIcon />
          <input type="email" id="EmailInput" placeholder="Enter your email" autoComplete="off" value={Email} onChange={(Event) => SetEmail(Event.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="PasswordInput">Password</label>
        <div className="input-wrapper">
          <LockIcon />
          <input
            type={ShowPassword ? "text" : "password"}
            id="PasswordInput"
            placeholder="Password"
            autoComplete="off"
            value={Password}
            onChange={(Event) => SetPassword(Event.target.value)}
          />
          <button
            type="button"
            className="password-toggle"
            tabIndex={-1}
            onClick={(Event) => {
              Event.preventDefault();
              Event.stopPropagation();
              SetShowPassword((Value) => !Value);
            }}
          >
            {ShowPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <div className="remember-forgot">
        <label className="remember-me">
          <input type="checkbox" checked={Remember} onChange={(Event) => { PlayClick(); OnRememberChange(Event.target.checked); }} />
          <span>Remember me</span>
        </label>
        <button type="button" className="forgot-link" onClick={() => { PlayClick(); void OpenUrl(Project().SupportServerURL); }}>
          Forgot Password?
        </button>
      </div>

      <button className="login-button" type="submit" disabled={Submitting}>
        {Submitting ? <span className="spinner" /> : "Sign In"}
      </button>
    </form>
  );
}
