using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

internal static class BridgeMethods
{
    public static async Task<object> Invoke(string Method, JObject Args)
    {
        switch (Method)
        {
            case "CheckLogin": return await LoginBridge.CheckLogin(Args);
            case "GetProjectInfo": return ProjectBridge.GetProjectInfo();
            case "LoadSettings": UserSettings.LoadSettings(); return GlobalSettings.Options;
            case "SaveSettings": UserSettings.ApplySettings(Args["Config"] as JObject ?? new JObject()); return true;
            case "SignOut": UserSettings.SignOut(); return true;
            case "DownloadRequiredFiles": return await GameBridge.DownloadRequiredFiles(Args);
            case "CheckIntegrity": return await GameBridge.CheckIntegrity(Args);
            case "LaunchGame": return await GameBridge.LaunchGame(Args);
            case "IsGameRunning": return Processes.IsFortniteRunning();
            case "StopGame": await Processes.ForceCloseFortnite(); return true;
            case "UninstallGame": return GameBridge.UninstallGame(Args.Value<string>("Path") ?? string.Empty);
            case "PickBuildInstallFolder": return await FolderPickerService.Pick("Choose Build Install Folder");
            case "PickAndValidateInstallFolder": return await InstallBridge.PickAndValidateInstallFolder();
            case "IsBuildInstalled": return BuildValidator.IsInstalled(Args.Value<string>("Path") ?? string.Empty);
            case "GetBuildSplash": return BuildValidator.ReadSplash(Args.Value<string>("Path") ?? string.Empty);
            case "DownloadBuild": await BuildDownloader.Download(Args.Value<string>("Path") ?? string.Empty); return true;
            case "PauseBuildDownload": BuildDownloader.Pause(); return true;
            case "ResumeBuildDownload": BuildDownloader.Resume(); return true;
            case "CancelBuildDownload": BuildDownloader.Cancel(); return true;
            case "OpenUrl": UrlOpener.OpenUrl(Args.Value<string>("Url") ?? string.Empty); return true;
            case "FetchRemotePage": return await RemotePageClient.FetchRemotePage(Args.Value<string>("Url") ?? string.Empty);
            case "FetchImage": return await ImageProxyClient.FetchImage(Args.Value<string>("Url") ?? string.Empty);
            case "FetchPlayerCount": return await PlayerCountClient.FetchPlayerCount();
            case "ResolveDialog": DialogService.Resolve(Args.Value<int>("Id"), Args.Value<bool>("Confirmed")); return true;
            case "MinimizeWindow": WindowService.Minimize(); return true;
            case "CloseWindow": WindowService.Close(); return true;
            case "ShowWindow": WindowService.Show(); return true;
            case "BeginDrag": WindowService.BeginDrag(); return true;
            case "EndDrag": WindowService.EndDrag(); return true;
            default: throw new InvalidOperationException($"Unknown bridge method: {Method}");
        }
    }
}
