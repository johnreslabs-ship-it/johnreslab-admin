import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject, getMetadata } from "firebase/storage";
import { storage } from "../lib/firebase";
import { PageHeader, Card, Button, EmptyState } from "../components/ui";
import type { MediaFile } from "../types/content";

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  async function loadFiles() {
    setLoading(true);
    try {
      const folderRef = ref(storage, "media");
      const res = await listAll(folderRef);
      const items = await Promise.all(
        res.items.map(async (itemRef) => {
          const [url, meta] = await Promise.all([getDownloadURL(itemRef), getMetadata(itemRef)]);
          return {
            name: itemRef.name,
            url,
            fullPath: itemRef.fullPath,
            size: meta.size,
            contentType: meta.contentType ?? "unknown",
            uploadedAt: new Date(meta.timeCreated).getTime(),
          } as MediaFile;
        })
      );
      setFiles(items.sort((a, b) => b.uploadedAt - a.uploadedAt));
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (storage) loadFiles();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(fileList: FileList) {
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const path = `media/${Date.now()}-${file.name}`;
        await uploadBytes(ref(storage, path), file);
      }
      await loadFiles();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(fullPath: string) {
    if (!confirm("Delete this file? This can't be undone.")) return;
    await deleteObject(ref(storage, fullPath));
    await loadFiles();
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    });
  }

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload images, PDFs, and ZIP files. Copy a URL to use it in a blog post, download, or resume link."
        action={
          <label>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />
            <span className="px-4 py-2 rounded-lg bg-cyan text-abyss font-semibold text-sm hover:bg-cyan-bright transition-colors cursor-pointer inline-block">
              {uploading ? "Uploading…" : "Upload Files"}
            </span>
          </label>
        }
      />

      {loading && <p className="text-sm text-ink-muted">Loading…</p>}
      {!loading && files.length === 0 && <EmptyState message="No files uploaded yet." />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((f) => (
          <Card key={f.fullPath}>
            {f.contentType.startsWith("image/") ? (
              <img src={f.url} alt={f.name} className="w-full h-32 object-cover rounded-md mb-3" />
            ) : (
              <div className="w-full h-32 rounded-md mb-3 bg-navy border border-cyan-400/10 grid place-items-center text-ink-dim text-xs font-mono">
                {f.contentType}
              </div>
            )}
            <p className="text-sm text-ink truncate mb-1">{f.name}</p>
            <p className="text-xs text-ink-dim mb-3">{(f.size / 1024).toFixed(0)} KB</p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => copy(f.url)} className="flex-1 text-xs">
                {copiedUrl === f.url ? "Copied!" : "Copy URL"}
              </Button>
              <Button variant="danger" onClick={() => handleDelete(f.fullPath)} className="text-xs">
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
