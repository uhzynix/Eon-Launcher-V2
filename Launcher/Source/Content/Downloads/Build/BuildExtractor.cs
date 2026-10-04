using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Threading;

static class BuildExtractor
{
    private const int ReportIntervalMilliseconds = 100;

    public static void Extract(string Destination, string Archive, string FileName, CancellationToken Token)
    {
        using ZipArchive Package = ZipFile.OpenRead(Archive);

        string Root = Path.GetFullPath(Destination) + Path.DirectorySeparatorChar;
        int Total = Package.Entries.Count;
        int Extracted = 0;
        Stopwatch Clock = Stopwatch.StartNew();
        long Reported = 0;

        BuildDownloadState.Report(0, 0, 0, Total, "extracting", FileName);

        foreach (ZipArchiveEntry Entry in Package.Entries)
        {
            Token.ThrowIfCancellationRequested();

            string Target = Path.GetFullPath(Path.Combine(Root, Entry.FullName));

            if (!Target.StartsWith(Root, StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException($"The build archive contains an unsafe entry: {Entry.FullName}");

            Extracted += 1;

            if (string.IsNullOrEmpty(Entry.Name))
            {
                Directory.CreateDirectory(Target);
                continue;
            }

            Directory.CreateDirectory(Path.GetDirectoryName(Target));
            Entry.ExtractToFile(Target, true);

            if (Clock.ElapsedMilliseconds - Reported < ReportIntervalMilliseconds)
                continue;

            Reported = Clock.ElapsedMilliseconds;
            BuildDownloadState.Report(0, 0, Extracted, Total, "extracting", FileName);
        }

        BuildDownloadState.Report(0, 0, Total, Total, "complete", FileName);
    }
}
