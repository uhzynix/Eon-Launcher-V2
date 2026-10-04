using System;
using System.Threading.Tasks;

static class InstallBridge
{
    public static async Task<object> PickAndValidateInstallFolder()
    {
        string Picked = await FolderPickerService.Pick("Select Folder");

        if (string.IsNullOrWhiteSpace(Picked))
            throw new InvalidOperationException("No folder was selected. Please select a valid installation folder.");

        foreach (string Extension in new[] { ".rar", ".zip", ".7z" })
        {
            if (Picked.EndsWith(Extension, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("The selected file appears to be compressed. Please extract it using a third party extraction tool.");
        }

        string Resolved = PathHelper.IsPathValid(Picked) ? Picked : PathHelper.FindValidInstallationPath(Picked);

        if (string.IsNullOrWhiteSpace(Resolved))
            throw new InvalidOperationException("The specified path must include both the 'FortniteGame' and 'Engine' folders.");

        UserSettings.EnsureLoaded();
        GlobalSettings.Options.FortnitePath = Resolved;
        UserSettings.SaveSettings();

        return new { Path = Resolved };
    }
}
