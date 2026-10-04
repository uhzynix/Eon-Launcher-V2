using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

class DialogService
{
    private const string RequestEvent = "dialog-request";

    private static readonly SemaphoreSlim DialogLock = new(1, 1);
    private static readonly ConcurrentDictionary<int, TaskCompletionSource<bool>> Pending = new();

    private static int NextId;

    public static async Task ShowSimpleDialog(string Content, string Title, string Kind = "error")
    {
        if (!Bridge.IsReady)
            return;

        await Processes.ForceCloseFortnite();
        await Show(Title, ProcessCustomErrors(Content, Title), false, Kind);
    }

    public static async Task<bool> YesOrNoDialog(string Content, string Title, string Kind = "confirm")
    {
        if (!Bridge.IsReady)
            return false;

        await Processes.ForceCloseFortnite();
        return await Show(Title, Content, true, Kind);
    }

    public static void Resolve(int Id, bool Confirmed)
    {
        if (Pending.TryRemove(Id, out TaskCompletionSource<bool> Completion))
            Completion.TrySetResult(Confirmed);
    }

    private static async Task<bool> Show(string Title, string Content, bool IsYesNo, string Kind)
    {
        await DialogLock.WaitAsync();
        try
        {
            int Id = Interlocked.Increment(ref NextId);
            TaskCompletionSource<bool> Completion = new(TaskCreationOptions.RunContinuationsAsynchronously);
            Pending[Id] = Completion;

            Bridge.Emit(RequestEvent, new { Id, Title, Content, IsYesNo, Kind });

            return await Completion.Task;
        }
        finally
        {
            DialogLock.Release();
        }
    }

    private static string ProcessCustomErrors(string Content, string Title)
    {
        if (Content.Contains("EasyAntiCheat"))
            return $"Easy Anti-Cheat needs to be reinstalled. Go to {GlobalSettings.Options.FortnitePath} and delete the EasyAntiCheat folder and {ProjectDefinitions.Name}_EAC.exe file, then restart the launcher.";

        if (Content.Contains("because it is being used by another process"))
            return $"Fortnite is already running. Close it and try again. If the issue persists, restart your computer.";

        if (Title.Contains("Corrupted Data Detected"))
            return $"Your game files are corrupted. Download [Fortnite {ProjectDefinitions.Build}]({ProjectDefinitions.DownloadBuildURL}), extract it, and set the path in the launcher.";

        if (Content.Contains("SSL"))
            return "Connection issue detected. Download and enable CloudFlare WARP from https://one.one.one.one/ to continue.";

        return Content;
    }
}
