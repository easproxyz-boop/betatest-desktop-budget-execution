import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export type DownloadProgress = {
  downloaded: number;
  total: number | null;
};

/**
 * Tumitingin lang kung may bagong version. HINDI nag-iinstall.
 * Returns the Update object kung meron, null kung wala.
 */
export async function checkForUpdates(): Promise<Update | null> {
  try {
    const update = await check();

    if (!update) {
      console.log("No update available.");
      return null;
    }

    console.log(`Update available: ${update.version}`);
    return update;
  } catch (error) {
    console.error("Failed to check for updates:", error);
    return null;
  }
}

/**
 * Dina-download at ini-install ang update, tapos nire-relaunch ang app.
 */
export async function installUpdate(
  update: Update,
  onProgress?: (progress: DownloadProgress) => void,
): Promise<void> {
  let downloaded = 0;
  let total: number | null = null;

  await update.downloadAndInstall((event) => {
    switch (event.event) {
      case "Started":
        total = event.data.contentLength ?? null;
        onProgress?.({ downloaded, total });
        break;
      case "Progress":
        downloaded += event.data.chunkLength;
        onProgress?.({ downloaded, total });
        break;
      case "Finished":
        onProgress?.({ downloaded: total ?? downloaded, total });
        break;
    }
  });

  await relaunch();
}