import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkForUpdates() {
  const update = await check();

  if (update) {
    console.log("Update available:", update.version);

    await update.downloadAndInstall();

    await relaunch();
  }
}