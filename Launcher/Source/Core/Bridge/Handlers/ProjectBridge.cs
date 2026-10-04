static class ProjectBridge
{
    public static object GetProjectInfo()
    {
        return new
        {
            ProjectDefinitions.Name,
            ProjectDefinitions.Chapter,
            ProjectDefinitions.Season,
            ProjectDefinitions.Build,
            ProjectDefinitions.ContentLevel,
            Definitions.CurrentVersion,
            ProjectDefinitions.Discord,
            ProjectDefinitions.TikTok,
            ProjectDefinitions.DonationsURL,
            ProjectDefinitions.SupportServerURL,
            ProjectDefinitions.CreateAccountURL,
            ProjectDefinitions.DownloadBuildURL,
            ProjectDefinitions.ServerStatusURL,
            ProjectDefinitions.PlaylistNamesURL,
            ProjectDefinitions.ItemShopURL,
            ProjectDefinitions.LeaderboardURL,
            ProjectDefinitions.GitHub_Juri,
            ProjectDefinitions.GitHub_Greenwood,
            ProjectDefinitions.GitHub_Zynix,
            ProjectDefinitions.GitHub_Abstract
        };
    }
}