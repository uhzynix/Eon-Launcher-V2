using System.Diagnostics;
using System.Threading.Tasks;
using static GamePaths;

class Processes
{
    public static void Kill(string ProcessName)
    {
        Process[] Processes = Process.GetProcessesByName(ProcessName);
        foreach (Process Process in Processes)
        {
            Process.Kill();
        }
    }

    public static bool IsFortniteRunning()
    {
        return Process.GetProcessesByName(Executables.FortniteClient_Win64_Shipping.ProcessName()).Length > 0
            || Process.GetProcessesByName(Executables.FortniteClient_Win64_Shipping_EAC.ProcessName()).Length > 0
            || Process.GetProcessesByName(Executables.FortniteClient_Win64_Shipping_BE.ProcessName()).Length > 0;
    }

    public static Task ForceCloseFortnite()
    {
        Kill(Executables.FortniteLauncher.ProcessName());
        Kill(Executables.FortniteClient_Win64_Shipping_BE.ProcessName());
        Kill(Executables.FortniteClient_Win64_Shipping_EAC.ProcessName());
        Kill(Executables.FortniteClient_Win64_Shipping.ProcessName());

        Kill(ProjectDefinitions.Anticheat);
        Kill($"{ProjectDefinitions.Name}_EAC");

        Kill("FModel");
        Kill("Easy Anti-Cheat Bootstrapper");
        Kill("Easy Anti-Cheat launcher");
        Kill("EpicGamesLauncher");
        Kill("CrashReportClient");

        return Task.CompletedTask;
    }
}
