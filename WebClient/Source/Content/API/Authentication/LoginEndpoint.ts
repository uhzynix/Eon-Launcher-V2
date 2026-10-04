import { Invoke } from "../../../Core/Bridge/Bridge";

export interface LoginResponse {
  Status: string;
  Username?: string;
  Email?: string;
  Skin?: string;
}

export function CheckLogin(Email: string, Password: string, RememberMe: boolean): Promise<LoginResponse> {
  return Invoke<LoginResponse>("CheckLogin", { Email, Password, RememberMe });
}
