import { IsSuccessStatus } from "../Configuration/LoginMessages";
import { CheckLogin } from "../../Content/API/Authentication/LoginEndpoint";
import type { Account } from "../Configuration/AccountSettings";

export interface AutoLoginResult {
  Signed: boolean;
  Notice: string;
  Email?: string;
  Username?: string;
  SkinUrl?: string;
}

export async function TryAutoLogin(Loaded: Account): Promise<AutoLoginResult | null> {
  if (!Loaded.Email || !Loaded.Password) return null;

  try {
    const Response = await CheckLogin(Loaded.Email, Loaded.Password, Loaded.RememberMe);

    if (!IsSuccessStatus(Response.Status)) {
      return { Signed: false, Notice: Response.Status ?? "Error" };
    }

    return {
      Signed: true,
      Notice: "",
      Email: Response.Email ?? Loaded.Email,
      Username: Response.Username,
      SkinUrl: Response.Skin,
    };
  } catch {
    return { Signed: false, Notice: "Error" };
  }
}
