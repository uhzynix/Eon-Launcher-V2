using System;
using System.Diagnostics;
using System.Threading.Tasks;
class ExclusionManager
{
    public static async Task AddToExclusions(string Path, Action<bool> SetProtectionFlag)
    {
        try
        {
            SetProtectionFlag(true);
            UserSettings.SaveSettings();

            var PSI = new ProcessStartInfo("powershell.exe", $"-Command Add-MpPreference -ExclusionPath \"{Path}\"")
            {
                UseShellExecute = true,
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden,
                Verb = "runas" 
            };

            using var StartProcess = Process.Start(PSI);
            await StartProcess.WaitForExitAsync();
        }
        catch  
        {
            SetProtectionFlag(false);
            UserSettings.SaveSettings();
        }
    }
}