using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

static class PlayerCountClient
{
    public static async Task<long> FetchPlayerCount()
    {
        using HttpResponseMessage Response = await HttpClientProvider.Client.GetAsync($"{Definitions.BaseURL}:2087/");
        Response.EnsureSuccessStatusCode();

        JObject Payload = JObject.Parse(await Response.Content.ReadAsStringAsync());
        JToken Amount = Payload.SelectToken("Clients.amount");

        if (Amount == null)
            throw new InvalidOperationException("Player count response was invalid");

        return Amount.Value<long>();
    }
}
