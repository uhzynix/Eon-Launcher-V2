using Microsoft.UI.Xaml;
using System;
using System.Threading;

namespace Eon
{
    public partial class App : Application
    {
        private Mutex MutexInstance;
        private MainWindow Launcher;

        public App()
        {
            try
            {
                InitializeComponent();
                EnsureSingleInstance();
                _ = Processes.ForceCloseFortnite();
            }
            catch (Exception Error)
            {
                MessageBox.Show($"Woah, there's an error: {Error.Message}");
            }
        }

        protected override void OnLaunched(LaunchActivatedEventArgs Arguments)
        {
            try
            {
                UserSettings.LoadSettings();

                Launcher = new MainWindow();
                Launcher.Activate();
                Launcher.AppWindow.Hide();
            }
            catch (Exception Error)
            {
                MessageBox.Show($"Report this error to a Moderator: {Error.Message}", "Error");
            }
        }

        private void EnsureSingleInstance()
        {
            MutexInstance = new Mutex(true, ProjectDefinitions.Name, out bool CreatedNew);

            if (CreatedNew)
            {
                MutexInstance.ReleaseMutex();
                return;
            }

            MessageBox.Show($"{ProjectDefinitions.Name} Launcher is already running. Please close it before opening a new instance.", "Already Running");
            Environment.Exit(1);
        }
    }
}
