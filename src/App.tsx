import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Alert from "@mui/joy/Alert";
import Table from "@mui/joy/Table";
import "./App.css";

import { checkForUpdates } from "./updates/index.ts"


import { insertTestRecord, getTestRecords } from "./api/test.ts";
import type { ErrorResponse, TestRecordPayload, TestRecord } from "./types/api.ts";

type SubmitStatus =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

function App() {
  const [form, setForm] = useState<TestRecordPayload>({
    dt_firstname: "",
    dt_middlename: "",
    dt_lastname: "",
    dt_session: "",
  });
  const [status, setStatus] = useState<SubmitStatus>({ type: "idle" });
  const [loading, setLoading] = useState(false);

  const [records, setRecords] = useState<TestRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  async function fetchRecords() {
    setRecordsLoading(true);
    try {
      const { data } = await getTestRecords();
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records", err);
    } finally {
      setRecordsLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  function handleChange(field: keyof TestRecordPayload) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "idle" });

    try {
      const { data } = await insertTestRecord(form);

      setStatus({ type: "success", message: `${data.message} (id: ${data.insertId})` });
      setForm({ dt_firstname: "", dt_middlename: "", dt_lastname: "", dt_session: "" });
      fetchRecords(); // refresh the table after a successful insert
    } catch (err) {
      const axiosErr = err as AxiosError<ErrorResponse>;

      if (axiosErr.response) {
        setStatus({
          type: "error",
          message: axiosErr.response.data?.message ?? "Something went wrong",
        });
      } else if (axiosErr.request) {
        setStatus({ type: "error", message: "Could not reach the server" });
      } else {
        setStatus({ type: "error", message: axiosErr.message });
      }
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
  checkForUpdates();
}, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
        padding: "2rem 1rem",
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: 400,
          p: 4,
          borderRadius: "md",
          boxShadow: "md",
        }}
      >
        <Typography level="h3" sx={{ mb: 2 }}>
          New Test Record --Updated By Erwin Aquino sept. 24, 2026
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>First name</FormLabel>
              <Input
                value={form.dt_firstname}
                onChange={handleChange("dt_firstname")}
                placeholder="Juan"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Middle name</FormLabel>
              <Input
                value={form.dt_middlename}
                onChange={handleChange("dt_middlename")}
                placeholder="Santos"
              />
            </FormControl>

            <FormControl required>
              <FormLabel>Last name</FormLabel>
              <Input
                value={form.dt_lastname}
                onChange={handleChange("dt_lastname")}
                placeholder="Dela Cruz"
              />
            </FormControl>

            <FormControl required>
              <FormLabel>Session</FormLabel>
              <Input
                value={form.dt_session}
                onChange={handleChange("dt_session")}
                placeholder="2026-2027"
              />
            </FormControl>

            {status.type === "success" && (
              <Alert color="success" variant="soft">
                {status.message}
              </Alert>
            )}
            {status.type === "error" && (
              <Alert color="danger" variant="soft">
                {status.message}
              </Alert>
            )}

            <Button type="submit" loading={loading} fullWidth>
              Submit
            </Button>
          </Stack>
        </form>
      </Sheet>

      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 800,
          p: 3,
          borderRadius: "md",
          boxShadow: "md",
        }}
      >
        <Typography level="h4" sx={{ mb: 2 }}>
          Test Records
        </Typography>

        <Table borderAxis="bothBetween" stripe="odd">
          <thead>
            <tr>
              <th>No.</th>
              <th>First name</th>
              <th>Middle name</th>
              <th>Last name</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            {recordsLoading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No records yet
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.dt_no}>
                  <td>{record.dt_no}</td>
                  <td>{record.dt_firstname}</td>
                  <td>{record.dt_middlename}</td>
                  <td>{record.dt_lastname}</td>
                  <td>{record.dt_session}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
    </main>
  );
}

export default App;