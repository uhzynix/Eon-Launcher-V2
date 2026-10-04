import { useEffect } from "react";
import { ShowWindow } from "../Bridge/Bridge";

export function UseWindowReveal() {
  useEffect(() => {
    document.getElementById("boot")?.remove();
    void ShowWindow();
  }, []);
}
