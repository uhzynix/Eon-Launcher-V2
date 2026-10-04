using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

static class BuildArchive
{
    private const string BuildPageUrl = "https://fortforge.co.uk/download/895e2220-bf49-4ea4-a8db-a52ff699af73/build?brand=eon";
    private const string ArchivePattern = @"https://dl\.fortforge\.co\.uk/t/[^""']+\?[^""']*download=1[^""']*";
    private const int ReportIntervalMilliseconds = 100;
    private const int BufferSize = 81920;

    private static readonly HttpClient Client = new HttpClient { Timeout = Timeout.InfiniteTimeSpan };

    public static async Task Download(string Partial, string FileName, CancellationToken Token)
    {
        string Url = await ResolveUrl(Token);
        long Existing = File.Exists(Partial) ? new FileInfo(Partial).Length : 0;

        using HttpRequestMessage Request = new HttpRequestMessage(HttpMethod.Get, Url);

        if (Existing > 0)
            Request.Headers.Range = new RangeHeaderValue(Existing, null);

        using HttpResponseMessage Response = await Client.SendAsync(Request, HttpCompletionOption.ResponseHeadersRead, Token);
        Response.EnsureSuccessStatusCode();

        bool Resumed = Existing > 0 && Response.StatusCode == HttpStatusCode.PartialContent;
        long Downloaded = Resumed ? Existing : 0;
        long Total = (Response.Content.Headers.ContentLength ?? 0) + Downloaded;

        using FileStream Output = new FileStream(Partial, Resumed ? FileMode.Append : FileMode.Create, FileAccess.Write, FileShare.None);
        using Stream Content = await Response.Content.ReadAsStreamAsync(Token);

        byte[] Buffer = new byte[BufferSize];
        Stopwatch Clock = Stopwatch.StartNew();
        long Reported = 0;

        while (true)
        {
            while (BuildDownloadState.Paused)
            {
                BuildDownloadState.Report(Downloaded, Total, 0, 0, "paused", FileName);
                await Task.Delay(BuildDownloadState.PausePollMilliseconds, Token);
            }

            int Read = await Content.ReadAsync(Buffer, Token);

            if (Read == 0)
                break;

            await Output.WriteAsync(Buffer.AsMemory(0, Read), Token);
            Downloaded += Read;

            if (Clock.ElapsedMilliseconds - Reported < ReportIntervalMilliseconds)
                continue;

            Reported = Clock.ElapsedMilliseconds;
            BuildDownloadState.Report(Downloaded, Total, 0, 0, "downloading", FileName);
        }

        BuildDownloadState.Report(Downloaded, Total, 0, 0, "downloading", FileName);
    }

    private static async Task<string> ResolveUrl(CancellationToken Token)
    {
        using HttpResponseMessage Response = await Client.GetAsync(BuildPageUrl, Token);
        Response.EnsureSuccessStatusCode();

        string Page = await Response.Content.ReadAsStringAsync(Token);
        Match Found = Regex.Match(Page, ArchivePattern);

        if (!Found.Success)
            throw new InvalidOperationException("The build download page did not provide a valid ZIP URL.");

        return Found.Value.Replace("&amp;", "&");
    }
}
