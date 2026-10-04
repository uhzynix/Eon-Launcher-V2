import { ToPascal } from "../Services/TextCase";

const SuccessStatuses = ["Success", "Donator"];

const StatusMessages: Record<string, string> = {
  Banned: "This account has been banned. Contact support if you believe this is a mistake.",
  Deny: "This account does not have access yet. Eon is currently in early access.",
  Invalid: "Incorrect email or password. Please try again.",
  Outdated: "Your launcher is out of date. Please download the latest version to continue.",
  Error: "Something went wrong while signing in. Please try again in a moment.",
};

export function MessageForStatus(Status: string): string {
  if (!Status) return "";
  return StatusMessages[ToPascal(Status)] ?? Status;
}

export function IsSuccessStatus(Status: string): boolean {
  return SuccessStatuses.includes(ToPascal(Status ?? ""));
}
