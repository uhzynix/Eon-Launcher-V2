using System;
using System.Net.Http;
using System.Threading.Tasks;

static class RemotePageClient
{
    private static readonly string[] AllowedPages =
    {
        $"{Definitions.BaseURL}/Itemshop/",
        $"{Definitions.BaseURL}/leaderboard",
        $"{Definitions.BaseURL}/ServerStatus/",
        $"{Definitions.BaseURL}/api/"
    };

    public static async Task<string> FetchRemotePage(string Url)
    {
        if (Array.TrueForAll(AllowedPages, Allowed => !Url.StartsWith(Allowed, StringComparison.Ordinal)))
            throw new InvalidOperationException("Unsupported service URL");

        using HttpResponseMessage Response = await HttpClientProvider.Client.GetAsync(Url);
        Response.EnsureSuccessStatusCode();

        return await Response.Content.ReadAsStringAsync();
    }
}
