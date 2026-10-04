using System;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

class UserSettings
{
    private static readonly string RootDirectory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), $"Project {ProjectDefinitions.Name}");

    private static readonly string SaveFile = Path.Combine(RootDirectory, "Config.json");

    public static void SaveSettings()
    {
        AppConfig Saved = GlobalSettings.Options;

        if (!Saved.RememberMe)
        {
            Saved = Saved.Clone();
            Saved.Password = string.Empty;
        }

        var Json = JsonConvert.SerializeObject(Saved, Formatting.Indented);
        Directory.CreateDirectory(RootDirectory);
        File.WriteAllText(SaveFile, Json);
    }

    public static void LoadSettings()
    {
        if (File.Exists(SaveFile))
        {
            var Json = File.ReadAllText(SaveFile);
            GlobalSettings.Options = IsValidJson(Json) ? JsonConvert.DeserializeObject<AppConfig>(Json) : GetDefaultConfig();
            return;
        }

        GlobalSettings.Options = GetDefaultConfig();
        SaveSettings();
    }

    public static void EnsureLoaded()
    {
        if (GlobalSettings.Options == null)
            LoadSettings();
    }

    public static void ApplySettings(JObject Config)
    {
        EnsureLoaded();
        JsonConvert.PopulateObject(Config.ToString(), GlobalSettings.Options);
        SaveSettings();
    }

    public static void SignOut()
    {
        EnsureLoaded();
        GlobalSettings.Options.Password = string.Empty;
        SaveSettings();
    }

    private static bool IsValidJson(string Json)
    {
        if (string.IsNullOrWhiteSpace(Json))
            return false;

        Json = Json.Trim();
        return (Json.StartsWith("{") && Json.EndsWith("}")) || (Json.StartsWith("[") && Json.EndsWith("]"));
    }

    private static AppConfig GetDefaultConfig()
    {
        return new AppConfig
        {
            Username = string.Empty,
            Email = string.Empty,
            Password = string.Empty,
            FortnitePath = string.Empty,
            IsSoundEnabled = false,
            IsBubbleBuildsEnabled = false,
            RedirectProtected = false,
            SkinUrl = string.Empty,
            IsLiquidGlassEnabled = true,
            MinimizeOnLaunch = false,
            KeepOnTopOnLaunch = false,
            Theme = string.Empty,
            RememberMe = true,
        };
    }
}