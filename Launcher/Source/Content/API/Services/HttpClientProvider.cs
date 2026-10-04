using System.Net.Http;

static class HttpClientProvider
{
    public static readonly HttpClient Client = CreateClient();

    private static HttpClient CreateClient()
    {
        HttpClient Created = new HttpClient();
        Created.DefaultRequestHeaders.Add("User-Agent", $"{ProjectDefinitions.Name} Launcher/{Definitions.CurrentVersion}");

        return Created;
    }
}
