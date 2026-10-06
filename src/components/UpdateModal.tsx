import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import LinearProgress from "@mui/joy/LinearProgress";
import Alert from "@mui/joy/Alert";
import Stack from "@mui/joy/Stack";

import type { Update } from "@tauri-apps/plugin-updater";
import type { DownloadProgress } from "../updates";

type Props = {
  open: boolean;
  update: Update | null;
  installing: boolean;
  progress: DownloadProgress | null;
  error: string | null;
  onUpdate: () => void;
  onLater: () => void;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UpdateModal({
  open,
  update,
  installing,
  progress,
  error,
  onUpdate,
  onLater,
}: Props) {
  const percent =
    progress && progress.total
      ? Math.min(100, Math.round((progress.downloaded / progress.total) * 100))
      : null;

  return (
    <Modal
      open={open}
      // Bawal isara habang nag-iinstall
      onClose={() => {
        if (!installing) onLater();
      }}
    >
      <ModalDialog sx={{ width: 440, maxWidth: "90vw" }}>
        <DialogTitle>Update Available</DialogTitle>

        <DialogContent>
          <Stack spacing={1.5}>
            <Typography level="body-md">
              May bagong version na available:{" "}
              <b>v{update?.version}</b>
              {update?.currentVersion && (
                <> (current: v{update.currentVersion})</>
              )}
            </Typography>

            {update?.body && (
              <Typography
                level="body-sm"
                sx={{ whiteSpace: "pre-wrap", maxHeight: 160, overflow: "auto" }}
              >
                {update.body}
              </Typography>
            )}

            {installing && (
              <Stack spacing={0.5}>
                <LinearProgress
                  determinate={percent !== null}
                  value={percent ?? 0}
                />
                <Typography level="body-xs">
                  {percent !== null
                    ? `Downloading... ${percent}%`
                    : "Downloading..."}
                  {progress && progress.total
                    ? ` (${formatBytes(progress.downloaded)} / ${formatBytes(progress.total)})`
                    : progress
                      ? ` (${formatBytes(progress.downloaded)})`
                      : ""}
                </Typography>
                <Typography level="body-xs">
                  Mag-re-restart ang app pagkatapos mag-install.
                </Typography>
              </Stack>
            )}

            {error && (
              <Alert color="danger" variant="soft">
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onUpdate} loading={installing}>
            Update now
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={onLater}
            disabled={installing}
          >
            Later
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}