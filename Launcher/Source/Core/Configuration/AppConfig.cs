class AppConfig
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string FortnitePath { get; set; }
    public string SkinUrl { get; set; }
    public string Theme { get; set; }

    public bool IsSoundEnabled { get; set; }
    public bool IsBubbleBuildsEnabled { get; set; }
    public bool IsLiquidGlassEnabled { get; set; } = true;
    public bool MinimizeOnLaunch { get; set; }
    public bool KeepOnTopOnLaunch { get; set; }
    public bool RedirectProtected { get; set; }
    public bool AnticheatProtected { get; set; }
    public bool RememberMe { get; set; } = true;

    public AppConfig Clone()
    {
        return (AppConfig)MemberwiseClone();
    }
}
