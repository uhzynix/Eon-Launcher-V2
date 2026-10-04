import type { ReactNode } from "react";
import { Frame } from "../../Controls/Shell/Frame";
import { Sidebar } from "../../Controls/Shell/Sidebar";
import { AmbientBackground } from "../../Controls/Shell/AmbientBackground";
import { DownloadNotification } from "../../Controls/Downloads/DownloadNotification";
import { ShellContent } from "./ShellContent";
import type { PageId } from "../../../Core/Configuration/PageDefinitions";
import type { PageHistory } from "../../../Core/Hooks/UsePageHistory";
import type { AuxiliaryDownload } from "../../../Core/Hooks/UseAuxiliaryDownload";

interface ShellLayoutProps {
  History: PageHistory;
  Username: string;
  SkinUrl: string;
  PlayerCount: number | null;
  Auxiliary: AuxiliaryDownload;
  OnLogout: () => void;
  children: ReactNode;
}

export function ShellLayout(Props: ShellLayoutProps) {
  const { History, Auxiliary } = Props;
  const IsPlayPage: boolean = History.ActivePage === ("play" as PageId);

  return (
    <>
      {IsPlayPage && <div className="home-trailer-shadow" aria-hidden="true" />}
      <AmbientBackground />
      <Frame
        ActivePage={History.ActivePage}
        OnNavigate={History.Navigate}
        OnLogout={Props.OnLogout}
        CanGoBack={History.CanGoBack}
        CanGoForward={History.CanGoForward}
        OnGoBack={History.GoBack}
        OnGoForward={History.GoForward}
        Username={Props.Username}
        SkinUrl={Props.SkinUrl}
        PlayerCount={Props.PlayerCount}
      />
      {Auxiliary.Progress && (
        <DownloadNotification
          IsAuxiliary
          Progress={Auxiliary.Progress}
          Speed={0}
          OnPause={() => {}}
          OnResume={() => {}}
          OnCancel={Auxiliary.End}
        />
      )}
      <div className="workspace">
        <Sidebar ActivePage={History.ActivePage} OnNavigate={History.Navigate} />
        <ShellContent ActivePage={History.ActivePage}>{Props.children}</ShellContent>
      </div>
    </>
  );
}
