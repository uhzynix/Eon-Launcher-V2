using System.IO;
using System.Threading.Tasks;

public enum AnticheatOperation { Installation }

class Anticheat
{
    private static string GamePath = GlobalSettings.Options.FortnitePath;

    public static async Task Execute(AnticheatOperation Operation)
    {
        if (!Definitions.bEnableAnticheat)
            return;

        if (Operation == AnticheatOperation.Installation)
        {
            await DeleteFiles();
        }
    }

    public static Task DeleteFiles()
    {
        if (Directory.Exists(Path.Combine(GamePath, "EasyAntiCheat")))
            Directory.Delete(Path.Combine(GamePath, "EasyAntiCheat"), true);

        if (File.Exists(Path.Combine(GamePath, $"{ProjectDefinitions.Name}_EAC.exe")))
            File.Delete(Path.Combine(GamePath, $"{ProjectDefinitions.Name}_EAC.exe"));

        if (File.Exists(Path.Combine(GamePath, $"{ProjectDefinitions.Anticheat}.exe")))
            File.Delete(Path.Combine(GamePath, $"{ProjectDefinitions.Anticheat}.exe"));

        return Task.CompletedTask;
    }
}
