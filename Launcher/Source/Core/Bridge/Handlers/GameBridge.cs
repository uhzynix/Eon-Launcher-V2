using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

static class GameBridge
{
    public static async Task<bool> DownloadRequiredFiles(JObject Args)
    {
        ApplyGameSettings(Args);
        await RequiredFilesDownloader.Download();
        return true;
    }

    public static async Task<bool> CheckIntegrity(JObject Args)
    {
        ApplyGameSettings(Args);
        return await Mods.CheckForCorruption() == Mods.EPlayStatus.Playable;
    }

    public static async Task<bool> LaunchGame(JObject Args)
    {
        ApplyGameSettings(Args);
        await Processes.ForceCloseFortnite();
        await Fortnite.Launch();
        return true;
    }

    public static bool UninstallGame(string Path)
    {
        if (string.IsNullOrWhiteSpace(Path) || !Directory.Exists(Path))
            throw new InvalidOperationException("Could not find the Fortnite Version at the specified location.");

        Directory.Delete(Path, true);
        UserSettings.EnsureLoaded();

        if (!string.Equals(GlobalSettings.Options.FortnitePath, Path, StringComparison.OrdinalIgnoreCase))
            return true;

        GlobalSettings.Options.FortnitePath = string.Empty;
        UserSettings.SaveSettings();
        return true;
    }

    private static void ApplyGameSettings(JObject Args)
    {
        UserSettings.EnsureLoaded();

        string Path = Args.Value<string>("Path") ?? string.Empty;
        if (!string.IsNullOrWhiteSpace(Path))
            GlobalSettings.Options.FortnitePath = Path;

        if (Args.TryGetValue("BubbleBuilds", out JToken BubbleBuilds))
            GlobalSettings.Options.IsBubbleBuildsEnabled = BubbleBuilds.Value<bool>();

        if (Args.TryGetValue("Email", out JToken Email))
            GlobalSettings.Options.Email = Email.Value<string>() ?? string.Empty;

        if (Args.TryGetValue("Password", out JToken Password))
            GlobalSettings.Options.Password = Password.Value<string>() ?? string.Empty;

        UserSettings.SaveSettings();
    }
}
