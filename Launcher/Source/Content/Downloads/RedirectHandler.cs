using System.IO;
using System.Threading.Tasks;
class RedirectHandler
{
    private static string GamePath = GlobalSettings.Options.FortnitePath;
    public static async Task DownloadFile()
    {
        if (Definitions.bEnableAnticheat)
        {
            await DownloadAnticheat();
            return;
        }

        if (!GlobalSettings.Options.RedirectProtected)
        {
            bool Question = await DialogService.YesOrNoDialog($"We've noticed that {ProjectDefinitions.Name} isn't excluded. This could prevent it from loading in the game. Would you like to add it to the exclusion list?", "Exclusion Warning", "error");
            if (Question)
                await ExclusionManager.AddToExclusions($"{GamePath}\\Engine\\Binaries\\ThirdParty\\NVIDIA\\NVaftermath\\Win64\\GFSDK_Aftermath_Lib.x64.dll", Value => GlobalSettings.Options.RedirectProtected = Value);
        }

        string Path = $"{GamePath}\\Engine\\Binaries\\ThirdParty\\NVIDIA\\NVaftermath\\Win64\\";
        if (!Directory.Exists(Path))
        {
            await DialogService.ShowSimpleDialog($"It appears that your build is corrupted and the Redirect folder cannot be located. Please re-download Chapter {ProjectDefinitions.Chapter} Season {ProjectDefinitions.Season} ({ProjectDefinitions.Build}) to resolve this issue.", "Failed to Download Redirect");
            return;
        }

        await DownloadService.File($"{Definitions.CDN_URL}/GFSDK_Aftermath_Lib.x64.dll", Path, "GFSDK_Aftermath_Lib.x64.dll");
    }

    private static async Task DownloadAnticheat()
    {
        if (!GlobalSettings.Options.AnticheatProtected)
        {
            bool Question = await DialogService.YesOrNoDialog($"We've noticed that {ProjectDefinitions.Anticheat} isn't excluded. This could prevent it from loading in the game. Would you like to add it to the exclusion list?", "Exclusion Warning", "error");
            if (Question)
                await ExclusionManager.AddToExclusions($"{GamePath}\\{ProjectDefinitions.Anticheat}.exe", Value => GlobalSettings.Options.AnticheatProtected = Value);
        }

        if (!Directory.Exists(GamePath))
        {
            await DialogService.ShowSimpleDialog($"It appears that your build is corrupted and Fortnite cannot be located. Please re-download Chapter {ProjectDefinitions.Chapter} Season {ProjectDefinitions.Season} ({ProjectDefinitions.Build}) to resolve this issue.", "Failed to Download Anticheat");
            return;
        }

        await DownloadService.File($"{Definitions.AC_CDN_URL}/{ProjectDefinitions.Anticheat}.exe", GamePath, $"{ProjectDefinitions.Anticheat}.exe");
    }
}
