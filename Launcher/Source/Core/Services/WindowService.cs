using System;
using System.Runtime.InteropServices;
using Microsoft.UI.Dispatching;
using Microsoft.UI.Windowing;
using Windows.Graphics;
using WinRT.Interop;

class WindowService
{
    private const int WindowStyleIndex = -16;
    private const int CaptionStyle = 0x00C00000;
    private const int ThickFrameStyle = 0x00040000;

    private const int NoSize = 0x0001;
    private const int NoMove = 0x0002;
    private const int NoZOrder = 0x0004;
    private const int FrameChanged = 0x0020;

    private const int CornerPreferenceAttribute = 33;
    private const int BorderColorAttribute = 34;
    private const int DoNotRound = 1;
    private const uint NoColor = 0xFFFFFFFE;

    private const int LeftButton = 0x01;
    private const int PressedMask = 0x8000;
    private const int DragIntervalMilliseconds = 8;

    private static DispatcherQueueTimer DragTimer;
    private static PointInt32 DragOrigin;
    private static CursorPoint DragCursorOrigin;

    public static void RemoveBorder()
    {
        IntPtr Window = Handle();

        int Corners = DoNotRound;
        DwmSetWindowAttribute(Window, CornerPreferenceAttribute, ref Corners, sizeof(int));

        uint Border = NoColor;
        DwmSetWindowAttribute(Window, BorderColorAttribute, ref Border, sizeof(uint));

        SetWindowLong(Window, WindowStyleIndex, GetWindowLong(Window, WindowStyleIndex) & ~(CaptionStyle | ThickFrameStyle));
        SetWindowPos(Window, IntPtr.Zero, 0, 0, 0, 0, NoMove | NoSize | NoZOrder | FrameChanged);
    }

    public static void Minimize()
    {
        EndDrag();
        Presenter()?.Minimize();
    }

    public static void Close()
    {
        EndDrag();
        GlobalSettings.Windows.AppWindow.Hide();
        GlobalSettings.Windows.Close();
    }

    public static void Show()
    {
        GlobalSettings.Windows.AppWindow.Show();
        SetForegroundWindow(Handle());
    }

    public static void BeginDrag()
    {
        if (!GetCursorPos(out CursorPoint Start))
            return;

        DragOrigin = GlobalSettings.Windows.AppWindow.Position;
        DragCursorOrigin = Start;

        DragTimer ??= CreateDragTimer();
        DragTimer.Start();
    }

    public static void EndDrag()
    {
        DragTimer?.Stop();
    }

    private static DispatcherQueueTimer CreateDragTimer()
    {
        DispatcherQueueTimer Timer = GlobalSettings.Windows.DispatcherQueue.CreateTimer();
        Timer.Interval = TimeSpan.FromMilliseconds(DragIntervalMilliseconds);
        Timer.Tick += (Sender, Arguments) => UpdateDrag();

        return Timer;
    }

    private static void UpdateDrag()
    {
        if ((GetAsyncKeyState(LeftButton) & PressedMask) == 0 || !GetCursorPos(out CursorPoint Current))
        {
            EndDrag();
            return;
        }

        GlobalSettings.Windows.AppWindow.Move(new PointInt32(
            DragOrigin.X + Current.X - DragCursorOrigin.X,
            DragOrigin.Y + Current.Y - DragCursorOrigin.Y));
    }

    private static IntPtr Handle()
    {
        return WindowNative.GetWindowHandle(GlobalSettings.Windows);
    }

    private static OverlappedPresenter Presenter()
    {
        return GlobalSettings.Windows.AppWindow.Presenter as OverlappedPresenter;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct CursorPoint
    {
        public int X;
        public int Y;
    }

    [DllImport("user32.dll")]
    private static extern bool SetForegroundWindow(IntPtr Window);

    [DllImport("user32.dll")]
    private static extern bool GetCursorPos(out CursorPoint Position);

    [DllImport("user32.dll")]
    private static extern short GetAsyncKeyState(int Key);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongW")]
    private static extern int GetWindowLong(IntPtr Window, int Index);

    [DllImport("user32.dll", EntryPoint = "SetWindowLongW")]
    private static extern int SetWindowLong(IntPtr Window, int Index, int Value);

    [DllImport("user32.dll")]
    private static extern bool SetWindowPos(IntPtr Window, IntPtr InsertAfter, int X, int Y, int Width, int Height, int Flags);

    [DllImport("dwmapi.dll")]
    private static extern int DwmSetWindowAttribute(IntPtr Window, int Attribute, ref int Value, int Size);

    [DllImport("dwmapi.dll")]
    private static extern int DwmSetWindowAttribute(IntPtr Window, int Attribute, ref uint Value, int Size);
}
