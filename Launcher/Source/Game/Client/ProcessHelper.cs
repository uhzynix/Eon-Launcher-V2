using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using static GamePaths;

class FNProc
{
    public static Task<Process> Launch(string GamePath)
    {
        Process Process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = FNLaunchHelper.GetDirectory(LaunchInfoType.FileName, GamePath),
                Arguments = FNLaunchHelper.GetDirectory(LaunchInfoType.Arguments, GamePath),
                UseShellExecute = false,
                CreateNoWindow = false,
                WorkingDirectory = FNLaunchHelper.GetDirectory(LaunchInfoType.WorkingDirectory, GamePath)
            }
        };

        Process.Start();

        if (!GamePath.Contains(Executables.FortniteClient_Win64_Shipping.Process(false)))
        {
            foreach (ProcessThread ProcessThread in Process.Threads)
            {
                var ThreadHandle = OpenThread(ThreadSuspendResume, false, ProcessThread.Id);
                if (ThreadHandle != IntPtr.Zero)
                {
                    SuspendThread(ThreadHandle);
                    CloseHandle(ThreadHandle);
                }
            }
        }

        if (GamePath.Contains(Executables.FortniteClient_Win64_Shipping.Process(false)))
        {
            _ = MonitorExit(Process);
        }

        return Task.FromResult(Process);
    }

    private static async Task MonitorExit(Process GameProcess)
    {
        await GameProcess.WaitForExitAsync();
        await Processes.ForceCloseFortnite();
    }

    private const int ThreadSuspendResume = 0x0002;

    [DllImport("kernel32.dll")]
    public static extern int SuspendThread(IntPtr ThreadHandle);

    [DllImport("kernel32.dll")]
    public static extern IntPtr OpenThread(int DesiredAccess, bool InheritHandle, int ThreadId);

    [DllImport("kernel32.dll")]
    public static extern bool CloseHandle(IntPtr Handle);
}