import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export async function checkForUpdates(): Promise<void> {
  try {
    const update = await check();

    if (!update) {
      console.log("No update available.");
      return;
    }

    console.log(`Update available: ${update.version}`);

    await update.downloadAndInstall();

    console.log("Update installed. Restarting application...");

    await relaunch();
  } catch (error) {
    console.error("Failed to check for updates:", error);
  }
}