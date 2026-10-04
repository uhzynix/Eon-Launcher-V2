using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

static class LoginBridge
{
    public static async Task<ApiResponse> CheckLogin(JObject Args)
    {
        UserSettings.EnsureLoaded();

        string Email = Args.Value<string>("Email") ?? string.Empty;
        string Password = Args.Value<string>("Password") ?? string.Empty;
        GlobalSettings.Options.RememberMe = Args.Value<bool>("RememberMe");

        ApiResponse Response = await Authenticator.CheckLogin(Email, Password);
        string Status = Response.Status ?? string.Empty;

        if (Status.Equals(VerifyLoginStatus.Success.ToString(), StringComparison.OrdinalIgnoreCase))
        {
            GlobalSettings.Options.Email = Email;
            GlobalSettings.Options.Password = Password;
            UserSettings.SaveSettings();
        }

        if (Status.Equals(VerifyLoginStatus.Outdated.ToString(), StringComparison.OrdinalIgnoreCase))
            _ = DialogService.ShowSimpleDialog($"Your launcher is out of date. Download the latest version from [here]({ProjectDefinitions.DownloadLauncherURL}) to continue playing.", "Launcher Outdated", "warning");

        if (Status.Equals(VerifyLoginStatus.Banned.ToString(), StringComparison.OrdinalIgnoreCase))
            _ = DialogService.ShowSimpleDialog("This account has been banned. Contact support if you believe this is a mistake.", "Account Banned");

        return Response;
    }
}
