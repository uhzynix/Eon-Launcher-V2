using System;
using System.Runtime.InteropServices;

[ComImport, Guid("DC1C5A9C-E88A-4DDE-A5A1-60F82A20AEF7")]
class FileOpenDialogInstance
{
}

[ComImport, Guid("42F85136-DB7E-439C-85F1-E4075D135FC8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IFileDialog
{
    [PreserveSig]
    int Show(IntPtr Parent);

    void SetFileTypes();
    void SetFileTypeIndex();
    void GetFileTypeIndex();
    void Advise();
    void Unadvise();
    void SetOptions(uint Options);
    void GetOptions(out uint Options);
    void SetDefaultFolder();
    void SetFolder();
    void GetFolder();
    void GetCurrentSelection();
    void SetFileName();
    void GetFileName();
    void SetTitle([MarshalAs(UnmanagedType.LPWStr)] string Title);
    void SetOkButtonLabel([MarshalAs(UnmanagedType.LPWStr)] string Label);
    void SetFileNameLabel();
    void GetResult(out IShellItem Item);
}

[ComImport, Guid("43826D1E-E718-42EE-BC55-A1E261C37BFE"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IShellItem
{
    void BindToHandler();
    void GetParent();
    void GetDisplayName(uint Kind, [MarshalAs(UnmanagedType.LPWStr)] out string Path);
    void GetAttributes();
    void Compare();
}
