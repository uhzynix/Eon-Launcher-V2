using System;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using WinRT.Interop;

class FolderPickerService
{
    private const uint PickFolders = 0x00000020;
    private const uint ForceFileSystem = 0x00000040;
    private const uint FileSystemPath = 0x80058000;

    public static Task<string> Pick(string Title)
    {
        return Task.FromResult(Show(Title));
    }

    private static string Show(string Title)
    {
        IFileDialog Dialog = (IFileDialog)new FileOpenDialogInstance();

        try
        {
            Dialog.GetOptions(out uint Options);
            Dialog.SetOptions(Options | PickFolders | ForceFileSystem);
            Dialog.SetTitle(Title);
            Dialog.SetOkButtonLabel(Title);

            if (Dialog.Show(WindowNative.GetWindowHandle(GlobalSettings.Windows)) != 0)
                return null;

            Dialog.GetResult(out IShellItem Item);
            Item.GetDisplayName(FileSystemPath, out string Path);

            return Path;
        }
        catch
        {
            return null;
        }
        finally
        {
            Marshal.ReleaseComObject(Dialog);
        }
    }
}
