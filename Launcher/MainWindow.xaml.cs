using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Microsoft.UI.Dispatching;
using Microsoft.UI.Windowing;
using WinUIEx;

namespace Eon
{
    public sealed partial class MainWindow : WindowEx
    {
        private const int ShutdownTimeout = 1500;

        public MainWindow()
        {
            GlobalSettings.Windows = this;

            InitializeComponent();
            ConfigureWindow();

            Closed += OnClosed;

            _ = Bridge.Attach(WebHost);
            ScheduleFallbackShow();
        }

        private void OnClosed(object Sender, Microsoft.UI.Xaml.WindowEventArgs Arguments)
        {
            ForceExitAfterTimeout();
            Bridge.Shutdown();
            Terminate();
        }

        private static void Terminate()
        {
            Process.GetCurrentProcess().Kill();
        }

        private static void ForceExitAfterTimeout()
        {
            _ = Task.Run(async () =>
            {
                await Task.Delay(ShutdownTimeout);
                Terminate();
            });
        }

        private void ScheduleFallbackShow()
        {
            DispatcherQueueTimer Timer = DispatcherQueue.CreateTimer();
            Timer.Interval = TimeSpan.FromSeconds(12);
            Timer.IsRepeating = false;
            Timer.Tick += (Sender, Arguments) =>
            {
                if (!AppWindow.IsVisible)
                    WindowService.Show();
            };
            Timer.Start();
        }

        private void ApplyIcon()
        {
            string Icon = Path.Combine(AppContext.BaseDirectory, "Content", "Web", "Content", "Texture", "Branding", $"{ProjectDefinitions.Name}.ico");

            if (File.Exists(Icon))
                this.SetIcon(Icon);
        }

        private void ConfigureWindow()
        {
            Title = $"{ProjectDefinitions.Name} Launcher";

            ApplyIcon();
            this.SetWindowSize(1280, 900);
            this.CenterOnScreen();

            IsTitleBarVisible = false;
            IsMaximizable = false;
            IsResizable = false;

            if (AppWindow.Presenter is OverlappedPresenter Presenter)
            {
                Presenter.SetBorderAndTitleBar(false, false);
                Presenter.IsResizable = false;
                Presenter.IsMaximizable = false;
            }

            WindowService.RemoveBorder();
        }
    }
}
