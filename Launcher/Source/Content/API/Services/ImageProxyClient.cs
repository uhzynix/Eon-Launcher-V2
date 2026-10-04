using System;
using System.Net.Http;
using System.Threading.Tasks;

static class ImageProxyClient
{
    public static async Task<object> FetchImage(string Url)
    {
        if (!Uri.TryCreate(Url, UriKind.Absolute, out Uri Target) || (Target.Scheme != Uri.UriSchemeHttp && Target.Scheme != Uri.UriSchemeHttps))
            return null;

        using HttpResponseMessage Response = await HttpClientProvider.Client.GetAsync(Target);

        if (!Response.IsSuccessStatusCode)
            return null;

        return new
        {
            Data = Convert.ToBase64String(await Response.Content.ReadAsByteArrayAsync()),
            Mime = Response.Content.Headers.ContentType?.MediaType ?? "image/png"
        };
    }
}
