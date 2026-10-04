public enum VerifyLoginStatus { Success, Banned, Deny, Invalid, Error, Outdated, Donator }

public class ApiResponse
{
    public string Status { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Skin { get; set; }
}