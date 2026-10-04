using System.Threading;

static class BuildDownloadState
{
    private const string ProgressEvent = "build-download-progress";
    public const int PausePollMilliseconds = 250;

    public static CancellationTokenSource Cancellation;
    public static bool Running;
    public static bool Paused;

    public static void Pause()
    {
        Paused = true;
    }

    public static void Resume()
    {
        Paused = false;
    }

    public static void Cancel()
    {
        Paused = false;
        Cancellation?.Cancel();
    }

    public static void Report(long Downloaded, long Total, int ExtractedFiles, int TotalFiles, string Status, string FileName)
    {
        Bridge.Emit(ProgressEvent, new { Downloaded, Total, ExtractedFiles, TotalFiles, Status, FileName });
    }
}
