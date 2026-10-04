using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

class DownloadService
{
    private const string ProgressEvent = "auxiliary-download-progress";
    private const int ReportIntervalMilliseconds = 100;
    private const int BufferSize = 81920;

    private static readonly HttpClient Client = new HttpClient(new HttpClientHandler
    {
        MaxConnectionsPerServer = int.MaxValue
    })
    { Timeout = System.Threading.Timeout.InfiniteTimeSpan };

    public static async Task File(string URL, string FilePath, string FileName)
    {
        try
        {
            using HttpResponseMessage Response = await Client.GetAsync(URL, HttpCompletionOption.ResponseHeadersRead);
            Response.EnsureSuccessStatusCode();

            long Total = Response.Content.Headers.ContentLength ?? 0;
            long Downloaded = 0;

            using Stream Content = await Response.Content.ReadAsStreamAsync();
            using FileStream Output = new FileStream(Path.Combine(FilePath, FileName), FileMode.Create, FileAccess.Write, FileShare.None);

            byte[] Buffer = new byte[BufferSize];
            Stopwatch Clock = Stopwatch.StartNew();
            long Reported = 0;

            while (true)
            {
                int Read = await Content.ReadAsync(Buffer);

                if (Read == 0)
                    break;

                await Output.WriteAsync(Buffer.AsMemory(0, Read));
                Downloaded += Read;

                if (Clock.ElapsedMilliseconds - Reported < ReportIntervalMilliseconds)
                    continue;

                Reported = Clock.ElapsedMilliseconds;
                Report(FileName, Downloaded, Total);
            }

            Report(FileName, Downloaded, Total);
        }
        catch (Exception Error)
        {
            await ShowError(Error, FilePath, FileName);
        }
    }

    private static void Report(string FileName, long Downloaded, long Total)
    {
        Bridge.Emit(ProgressEvent, new { Downloaded, Total, ExtractedFiles = 0, TotalFiles = 0, Status = "downloading", FileName, Message = Text.DownloadMessage });
    }

    private static string FormatSize(long Bytes)
    {
        const long KB = 1024;
        const long MB = KB * 1024;
        const long GB = MB * 1024;

        if (Bytes < KB) return $"{Bytes} B";
        if (Bytes < MB) return $"{Bytes / (double)KB:F2} KB";
        if (Bytes < GB) return $"{Bytes / (double)MB:F2} MB";
        return $"{Bytes / (double)GB:F2} GB";
    }

    private static async Task ShowError(Exception Error, string FilePath, string FileName)
    {
        string Message = $"Error: {Error.Message}\nPath: {FilePath}\nFile: {FileName}\nFailed to install required files. Please check your internet connection and try again.";
        await DialogService.ShowSimpleDialog(Message, "Error");
    }
}
