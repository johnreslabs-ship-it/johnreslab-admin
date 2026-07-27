import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { PageHeader, Card, Button } from "../components/ui";

const COLLECTIONS = ["posts", "projects", "downloads", "categories", "subscribers", "featuredVideos"];

export default function Backup() {
  const [busy, setBusy] = useState(false);

  async function exportAll() {
    setBusy(true);
    try {
      const data: Record<string, unknown[]> = {};
      for (const name of COLLECTIONS) {
        const snap = await getDocs(collection(db, name));
        data[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `johnreslab-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader title="Backup / Export" description="Download a full JSON export of all your content." />
      <Card className="max-w-md">
        <p className="text-sm text-ink-muted mb-4">
          Exports posts, projects, downloads, categories, subscribers, and featured videos into a single JSON file —
          useful before making bulk changes, or as an off-site backup.
        </p>
        <Button onClick={exportAll} disabled={busy}>
          {busy ? "Exporting…" : "Export All Content"}
        </Button>
      </Card>
    </div>
  );
}
