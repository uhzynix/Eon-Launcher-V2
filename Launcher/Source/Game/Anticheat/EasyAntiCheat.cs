using System;
using System.IO;
using System.Diagnostics;
using System.IO.Compression;
using System.Threading.Tasks;

public enum EACOperation { Initialize, Installation }

class EAC
{
    private static string GamePath = GlobalSettings.Options.FortnitePath;

    public static async Task Execute(EACOperation Operation)
    {
        if (!Definitions.bEnableEAC)
            return;

        if (Operation == EACOperation.Initialize)
        {
            await InitializeComponent();
        }

        if (Operation == EACOperation.Installation)
        {
            await Anticheat.DeleteFiles();
            await DownloadFiles();
            await ExtractArchive();
        }
    }

    private static async Task DownloadFiles()
    {
        await DownloadService.File($"{Definitions.CDN_URL}/{ProjectDefinitions.Name}_EAC.exe", GamePath, $"{ProjectDefinitions.Name}_EAC.exe");
        await DownloadService.File($"{Definitions.CDN_URL}/EasyAntiCheat.zip", GamePath, "EasyAntiCheat.zip");
    }

    private static Task ExtractArchive()
    {
        ZipFile.ExtractToDirectory(Path.Combine(GamePath, "EasyAntiCheat.zip"), Path.Combine(GamePath, "EasyAntiCheat"));

        if (File.Exists(Path.Combine(GamePath, "EasyAntiCheat.zip")))
            File.Delete(Path.Combine(GamePath, "EasyAntiCheat.zip"));

        return Task.CompletedTask;
    }

    private static async Task InitializeComponent()
    {
        using var AntiCheat = new Process
        {
            StartInfo = new ProcessStartInfo(Path.Combine(GamePath, "EasyAntiCheat", "EasyAntiCheat_EOS_Setup.exe"))
            {
                Arguments = "install \"c557c546364948a39015f9b7106e36c0\"",
                UseShellExecute = false,
                WindowStyle = ProcessWindowStyle.Hidden
            }
        };

        AntiCheat.Start();
        await AntiCheat.WaitForExitAsync();
    }
}
