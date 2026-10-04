using System;
using System.IO;

internal static class BridgePaths
{
    public const string VirtualHost = "eon.launcher";

    public static string WebRoot()
    {
        return Path.Combine(AppContext.BaseDirectory, "Content", "Web");
    }

    public static string ReadScript()
    {
        return File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Source", "Core", "Bridge", "Bridge.js"));
    }

    public static string StartUrl()
    {
        string DevelopmentUrl = Environment.GetEnvironmentVariable("EON_DEV_URL");
        return string.IsNullOrWhiteSpace(DevelopmentUrl) ? $"https://{VirtualHost}/index.html" : DevelopmentUrl;
    }

    public static void UseLocalUserDataFolder()
    {
        string Folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), $"Project {ProjectDefinitions.Name}", "WebView2");
        Directory.CreateDirectory(Folder);
        Environment.SetEnvironmentVariable("WEBVIEW2_USER_DATA_FOLDER", Folder);
    }
}
