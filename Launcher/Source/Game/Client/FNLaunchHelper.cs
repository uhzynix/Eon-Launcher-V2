using System.IO;
using static GamePaths;

public enum LaunchInfoType { FileName, Arguments, WorkingDirectory, EAC, Anticheat, Fortnite }

class FNLaunchHelper
{
    private static bool IsFinalGameLaunch(string GamePath)
    {
        return GamePath.EndsWith(Executables.FortniteClient_Win64_Shipping.Process(false));
    }

    private static string GetInstallRoot(string GamePath)
    {
        return Path.GetDirectoryName(Path.GetDirectoryName(Path.GetDirectoryName(Path.GetDirectoryName(GamePath))));
    }

    private static string ResolveExecutable(string GamePath)
    {
        if (!IsFinalGameLaunch(GamePath))
        {
            return GamePath;
        }

        if (Definitions.bEnableEAC)
        {
            return $"{GetInstallRoot(GamePath)}\\{ProjectDefinitions.Name}_EAC.exe";
        }

        if (Definitions.bEnableAnticheat)
        {
            return $"{GetInstallRoot(GamePath)}\\{ProjectDefinitions.Anticheat}.exe";
        }

        return GamePath;
    }

    public static string GetDirectory(LaunchInfoType InfoType, string GamePath)
    {
        if (InfoType == LaunchInfoType.FileName)
        {
            return ResolveExecutable(GamePath);
        }

        if (InfoType == LaunchInfoType.WorkingDirectory)
        {
            if (IsFinalGameLaunch(GamePath))
            {
                return GetInstallRoot(GamePath);
            }

            return Path.GetDirectoryName(GamePath);
        }

        if (InfoType == LaunchInfoType.Arguments)
        {
            string CommonArgs = Definitions.bEnableAnticheat ? $"-GAME_PATH=\"{GamePath}\"" : "-epicapp=Fortnite -epicenv=Prod -epiclocale=en-us -epicportal -nobe -fromfl=eac -skippatchcheck -fltoken=3db3ba5dcbd2e16703f3978d -caldera=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiYmU5ZGE1YzJmYmVhNDQwN2IyZjQwZWJhYWQ4NTlhZDQiLCJnZW5lcmF0ZWQiOjE2Mzg3MTcyNzgsImNhbGRlcmFHdWlkIjoiMzgxMGI4NjMtMmE2NS00NDU3LTliNTgtNGRhYjNiNDgyYTg2IiwiYWNQcm92aWRlciI6IkVhc3lBbnRpQ2hlYXQiLCJub3RlcyI6IiIsImZhbGxiYWNrIjpmYWxzZX0.VAWQB67RTxhiWOxx7DBjnzDnXyyEnX7OljJm-j2d88G_WgwQ9wrE6lwMEHZHjBd1ISJdUO1UVUqkfLdU5nofBQ -AUTH_TYPE=epic";

            if (IsFinalGameLaunch(GamePath))
            {
                return $"-AUTH_LOGIN={GlobalSettings.Options.Email} -AUTH_PASSWORD={GlobalSettings.Options.Password} {CommonArgs}";
            }

        }

        return string.Empty;
    }
}