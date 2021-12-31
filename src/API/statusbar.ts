import { StatusBar, Style } from "@capacitor/status-bar";

export async function setStatusBarStyle() {
  await StatusBar.setStyle({ style: Style.Light });
  await StatusBar.setOverlaysWebView({ overlay: true });
  await StatusBar.setBackgroundColor({ color: "transparent" });
}
