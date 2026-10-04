using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

class Mods
{
    public enum EPlayStatus { Corrupted, Playable }

    private static readonly string[] Extensions = { ".pak", ".sig", ".ucas", ".utoc" };

    public static async Task<EPlayStatus> CheckForCorruption()
    {
        try
        {
            string GamePath = GlobalSettings.Options.FortnitePath;
            string ContentPath = Path.Combine(GamePath, "FortniteGame", "Content", "Paks");

                if (!Directory.Exists(ContentPath))
                {
                    await DialogService.ShowSimpleDialog(string.Empty, "Corrupted Data Detected");
                    return EPlayStatus.Corrupted;
                }

                if (!await CheckForUnexpectedFiles(ContentPath))
                    return EPlayStatus.Corrupted;

                if (!CheckForMissingFiles(ContentPath))
                {
                    await DialogService.ShowSimpleDialog(string.Empty, "Corrupted Data Detected");
                    return EPlayStatus.Corrupted;
                }

            return EPlayStatus.Playable;
        }
        catch (Exception Error)
        {
            await DialogService.ShowSimpleDialog(Error.ToString(), "CheckForCorruption");
            return EPlayStatus.Corrupted;
        }
    }

    private static async Task<bool> CheckForUnexpectedFiles(string ContentPath)
    {
        var AllowedFiles = GetAllowedContentFiles();
        var ActualFiles = Directory.GetFiles(ContentPath).Select(Path.GetFileName).Where(File => Extensions.Contains(Path.GetExtension(File), StringComparer.OrdinalIgnoreCase)).ToHashSet(StringComparer.OrdinalIgnoreCase);

        var UnexpectedFiles = ActualFiles.Where(File => !AllowedFiles.Contains(File)).ToList();

        if (!UnexpectedFiles.Any())
            return true;

        string FileList = string.Join("\n", UnexpectedFiles);
        bool ShouldRemove = await DialogService.YesOrNoDialog($"We found some files in your Fortnite installation that shouldn't be there:\n\n{FileList}\n\nWould you like us to remove them?", "Unrecognized Files Found");

        if (!ShouldRemove)
            return false;

        foreach (var FileName in UnexpectedFiles)
        {
            string FullPath = Path.Combine(ContentPath, FileName);
            if (File.Exists(FullPath))
                File.Delete(FullPath);
        }

        return true;
    }

    private static bool CheckForMissingFiles(string ContentPath)
    {
        var AllowedFiles = GetAllowedContentFiles();
        var ActualFiles = Directory.GetFiles(ContentPath).Select(Path.GetFileName).Where(File => Extensions.Contains(Path.GetExtension(File), StringComparer.OrdinalIgnoreCase)).ToHashSet(StringComparer.OrdinalIgnoreCase);

        var MissingFiles = AllowedFiles.Where(File => !ActualFiles.Contains(File)).ToList();

        return !MissingFiles.Any();
    }

    private static HashSet<string> GetAllowedContentFiles()
    {
        var ContentFiles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        ContentFiles.Add("global.ucas");
        ContentFiles.Add("global.utoc");

        foreach (var Extension in Extensions)
        {
            ContentFiles.Add($"pakChunkEarly-WindowsClient{Extension}");
        }

        foreach (var Extension in Extensions)
        {
            ContentFiles.Add($"pakchunk{ProjectDefinitions.Name}-WindowsClient_p{Extension}");

            if (GlobalSettings.Options.IsBubbleBuildsEnabled)
            {
                ContentFiles.Add($"pakchunkLowMesh-WindowsClient_p{Extension}");
            }
        }

        var MainChunkIds = new[] { "0", "2", "5", "7", "8", "9" };
        foreach (var ChunkId in MainChunkIds)
        {
            foreach (var Extension in Extensions)
            {
                ContentFiles.Add($"pakchunk{ChunkId}-WindowsClient{Extension}");
                ContentFiles.Add($"pakchunk{ChunkId}optional-WindowsClient{Extension}");
            }
        }

        foreach (var Extension in Extensions)
        {
            ContentFiles.Add($"pakchunk10-WindowsClient{Extension}");
            ContentFiles.Add($"pakchunk10optional-WindowsClient{Extension}");
        }

        for (int SubChunk = 1; SubChunk <= 29; SubChunk++)
        {
            foreach (var Extension in Extensions)
            {
                ContentFiles.Add($"pakchunk10_s{SubChunk}-WindowsClient{Extension}");
                ContentFiles.Add($"pakchunk10_s{SubChunk}optional-WindowsClient{Extension}");
            }
        }

        foreach (var Extension in Extensions)
        {
            ContentFiles.Add($"pakchunk11-WindowsClient{Extension}");
            ContentFiles.Add($"pakchunk11optional-WindowsClient{Extension}");
        }

        foreach (var Extension in Extensions)
        {
            ContentFiles.Add($"pakchunk11_s1-WindowsClient{Extension}");
            ContentFiles.Add($"pakchunk11_s1optional-WindowsClient{Extension}");
        }

        var HighChunkIds = new[]
        {
            "1000", "1001", "1002", "1003", "1004", "1005", "1006",
            "1007", "1008", "1009", "1010", "1011", "1012", "1013", "1014"
        };

        var OptionalHighChunkIds = new HashSet<string>
        {
            "1002", "1004", "1007", "1009", "1010", "1011", "1012", "1013", "1014"
        };

        foreach (var ChunkId in HighChunkIds)
        {
            foreach (var Extension in Extensions)
            {
                ContentFiles.Add($"pakchunk{ChunkId}-WindowsClient{Extension}");

                if (OptionalHighChunkIds.Contains(ChunkId))
                {
                    ContentFiles.Add($"pakchunk{ChunkId}optional-WindowsClient{Extension}");
                }
            }
        }

        return ContentFiles;
    }
}