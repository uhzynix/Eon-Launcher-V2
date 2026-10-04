using System.IO;
using System.Threading.Tasks;

class PakChunk
{
    private static string GamePath = $"{GlobalSettings.Options.FortnitePath}\\FortniteGame\\Content\\Paks\\";
    public static async Task EonPak()
    {
        if (!Directory.Exists(GamePath))
        {
            await DialogService.ShowSimpleDialog(string.Empty, "Corrupted Data Detected");
            return;
        }

        foreach (var Mods in Directory.GetFiles(GamePath, $"*{ProjectDefinitions.Name}*"))
            File.Delete(Mods);

       await DownloadService.File($"{Definitions.CDN_URL}/{ProjectDefinitions.Name}Mods.ucas", GamePath, $"pakchunk{ProjectDefinitions.Name}-WindowsClient_p.ucas");
       await DownloadService.File($"{Definitions.CDN_URL}/{ProjectDefinitions.Name}Mods.utoc", GamePath, $"pakchunk{ProjectDefinitions.Name}-WindowsClient_p.utoc");
       await DownloadService.File($"{Definitions.CDN_URL}/S17_Univeral.pak", GamePath, $"pakchunk{ProjectDefinitions.Name}-WindowsClient_p.pak");
       await DownloadService.File($"{Definitions.CDN_URL}/S17_Univeral.sig", GamePath, $"pakchunk{ProjectDefinitions.Name}-WindowsClient_p.sig");
    }

    public static async Task BubbleBuilds()
    {
        if (!Directory.Exists(GamePath))
        {
            await DialogService.ShowSimpleDialog(string.Empty, "Corrupted Data Detected");
            return;
        }

        foreach (var Mods in Directory.GetFiles(GamePath, "*LowMesh*"))
            File.Delete(Mods);

        if (GlobalSettings.Options.IsBubbleBuildsEnabled)
        {
            await DownloadService.File($"{Definitions.CDN_URL}/LowMesh.ucas", GamePath, "pakchunkLowMesh-WindowsClient_p.ucas");
            await DownloadService.File($"{Definitions.CDN_URL}/LowMesh.utoc", GamePath, "pakchunkLowMesh-WindowsClient_p.utoc");
            await DownloadService.File($"{Definitions.CDN_URL}/S17_Univeral.pak", GamePath, "pakchunkLowMesh-WindowsClient_p.pak");
            await DownloadService.File($"{Definitions.CDN_URL}/S17_Univeral.sig", GamePath, "pakchunkLowMesh-WindowsClient_p.sig");
        }
    }
}
