using System;
using DiscordRPC;
using System.Threading.Tasks;

class EonRPC
{
    private static readonly DiscordRpcClient Client = new("1547905441160368178");
    private static readonly DateTime StartTimestamp = DateTime.UtcNow;

    public static void Start()
    {
        if (Client.IsInitialized)
            return;

        Client.Initialize();

        _ = Task.Run(async () =>
        {
            while (true)
            {
                UpdatePresence();
                await Task.Delay(1000);
            }
        });
    }

    private static void UpdatePresence()
    {
        if (!Client.IsInitialized)
            return;

            Client.SetPresence(new RichPresence
            {
                Details = "An OG Fortnite Experience.",
                Timestamps = new Timestamps { Start = StartTimestamp },

                Assets = new Assets
                {
                    SmallImageKey = string.IsNullOrEmpty(GlobalSettings.Options.SkinUrl) ? "" : GlobalSettings.Options.SkinUrl,
                    SmallImageText = GlobalSettings.Options.Username,

                    LargeImageKey = "eon",
                    LargeImageText = "Logged In Launcher."
                },

                Buttons = new[]
                {
                    new Button { Label = "Join Discord", Url = ProjectDefinitions.Discord,
                }
            }
        });
    }
}
