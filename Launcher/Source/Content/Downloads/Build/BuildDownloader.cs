using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

static class BuildDownloader
{
    private static readonly string ArchiveName = $"++{ProjectDefinitions.Name}+Release-{ProjectDefinitions.Build}-CL-{ProjectDefinitions.ContentLevel}-Windows.zip";

    public static void Pause() => BuildDownloadState.Pause();

    public static void Resume() => BuildDownloadState.Resume();

    public static void Cancel() => BuildDownloadState.Cancel();

    public static async Task Download(string Destination)
    {
        if (BuildDownloadState.Running)
            throw new InvalidOperationException("A build download is already running.");

        BuildDownloadState.Running = true;
        BuildDownloadState.Paused = false;
        BuildDownloadState.Cancellation = new CancellationTokenSource();

        CancellationToken Token = BuildDownloadState.Cancellation.Token;
        string Archive = Path.Combine(Destination, ArchiveName);
        string Partial = $"{Archive}.part";

        try
        {
            Directory.CreateDirectory(Destination);
            await BuildArchive.Download(Partial, ArchiveName, Token);

            File.Move(Partial, Archive, true);
            await Task.Run(() => BuildExtractor.Extract(Destination, Archive, ArchiveName, Token), Token);
            File.Delete(Archive);
        }
        finally
        {
            BuildDownloadState.Cancellation.Dispose();
            BuildDownloadState.Cancellation = null;
            BuildDownloadState.Running = false;
        }
    }
}
