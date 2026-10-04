using System;
using System.IO;
using System.Text;

class BuildValidator
{
    private const int ChunkSize = 1024 * 1024;

    public static bool IsInstalled(string Path)
    {
        if (string.IsNullOrWhiteSpace(Path))
            return false;

        string Executable = System.IO.Path.Combine(Path, "FortniteGame", "Binaries", "Win64", "FortniteClient-Win64-Shipping.exe");

        return File.Exists(Executable) && File.Exists(SplashPath(Path)) && HasSupportedVersion(Executable);
    }

    public static object ReadSplash(string Path)
    {
        if (string.IsNullOrWhiteSpace(Path) || !File.Exists(SplashPath(Path)))
            return null;

        return new { Data = Convert.ToBase64String(File.ReadAllBytes(SplashPath(Path))), Mime = "image/bmp" };
    }

    private static string SplashPath(string Path)
    {
        return System.IO.Path.Combine(Path, "FortniteGame", "Content", "Splash", "Splash.bmp");
    }

    private static bool HasSupportedVersion(string Executable)
    {
        string Signature = $"++Fortnite+Release-{ProjectDefinitions.Build}-CL-";
        byte[] Ascii = Encoding.ASCII.GetBytes(Signature);
        byte[] Unicode = Encoding.Unicode.GetBytes(Signature);
        int Overlap = Math.Max(Ascii.Length, Unicode.Length) - 1;

        using FileStream Stream = File.OpenRead(Executable);
        byte[] Window = new byte[Overlap + ChunkSize];
        int Carried = 0;

        while (true)
        {
            int Read = Stream.Read(Window, Carried, Window.Length - Carried);

            if (Read == 0)
                return false;

            Span<byte> Filled = Window.AsSpan(0, Carried + Read);

            if (Filled.IndexOf(Ascii) >= 0 || Filled.IndexOf(Unicode) >= 0)
                return true;

            Carried = Math.Min(Overlap, Filled.Length);
            Filled.Slice(Filled.Length - Carried).CopyTo(Window);
        }
    }
}
