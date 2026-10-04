using System;
using System.Diagnostics;

static class UrlOpener
{
    public static void OpenUrl(string Url)
    {
        if (!Uri.TryCreate(Url, UriKind.Absolute, out Uri Target) || (Target.Scheme != Uri.UriSchemeHttp && Target.Scheme != Uri.UriSchemeHttps))
            return;

        Process.Start(new ProcessStartInfo(Target.AbsoluteUri) { UseShellExecute = true });
    }
}
