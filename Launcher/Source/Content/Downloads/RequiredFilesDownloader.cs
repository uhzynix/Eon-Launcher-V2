using System.Threading.Tasks;

class RequiredFilesDownloader
{
    public static async Task Download()
    {
        await EAC.Execute(EACOperation.Installation);
        await Anticheat.Execute(AnticheatOperation.Installation);

        await PakChunk.EonPak();
        await PakChunk.BubbleBuilds();

        await RedirectHandler.DownloadFile();
        await D3DCompilerCheck.DownloadFile();
    }
}
