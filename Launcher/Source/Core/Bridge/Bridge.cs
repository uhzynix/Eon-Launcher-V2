using System;
using System.Threading.Tasks;
using Microsoft.UI.Xaml.Controls;
using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

internal static class Bridge
{
    private static WebView2 Host;

    public static bool IsReady { get; private set; }

    public static async Task Attach(WebView2 View)
    {
        Host = View;

        BridgePaths.UseLocalUserDataFolder();
        await View.EnsureCoreWebView2Async();

        CoreWebView2 Core = View.CoreWebView2;
        Core.Settings.AreDefaultContextMenusEnabled = false;
        Core.Settings.AreDevToolsEnabled = false;
        Core.Settings.AreBrowserAcceleratorKeysEnabled = false;
        Core.Settings.IsStatusBarEnabled = false;
        Core.Settings.IsZoomControlEnabled = false;
        Core.Settings.IsSwipeNavigationEnabled = false;

        Core.WebMessageReceived += OnWebMessageReceived;
        Core.NewWindowRequested += OnNewWindowRequested;

        await Core.AddScriptToExecuteOnDocumentCreatedAsync(BridgePaths.ReadScript());

        Core.SetVirtualHostNameToFolderMapping(BridgePaths.VirtualHost, BridgePaths.WebRoot(), CoreWebView2HostResourceAccessKind.Allow);
        Core.Navigate(BridgePaths.StartUrl());

        IsReady = true;
    }

    public static void Shutdown()
    {
        try
        {
            Host?.Close();
        }
        catch
        {
        }
    }

    public static void Emit(string Event, object Payload)
    {
        Post(new { Event, Payload });
    }

    private static async void OnWebMessageReceived(CoreWebView2 Sender, CoreWebView2WebMessageReceivedEventArgs Arguments)
    {
        JObject Message = JObject.Parse(Arguments.WebMessageAsJson);
        int Id = Message.Value<int>("Id");
        string Method = Message.Value<string>("Method") ?? string.Empty;
        JObject Args = Message["Args"] as JObject ?? new JObject();

        try
        {
            object Result = await BridgeMethods.Invoke(Method, Args);
            Post(new { Id, Ok = true, Result });
        }
        catch (Exception Error)
        {
            Post(new { Id, Ok = false, Error = Error.Message });
        }
    }

    private static void OnNewWindowRequested(CoreWebView2 Sender, CoreWebView2NewWindowRequestedEventArgs Arguments)
    {
        Arguments.Handled = true;
        UrlOpener.OpenUrl(Arguments.Uri);
    }

    private static void Post(object Payload)
    {
        Host.DispatcherQueue.TryEnqueue(() => Host.CoreWebView2.PostWebMessageAsJson(JsonConvert.SerializeObject(Payload)));
    }
}
