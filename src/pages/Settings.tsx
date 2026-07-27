import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { PageHeader, Card, Button, Field, Input } from "../components/ui";
import type { SiteSettings } from "../types/content";

const defaults: SiteSettings = {
  tagline: "Windows & Linux Tutorials | Dual Boot | Virtual Machines",
  email: "contact@johnreslab.com",
  whatsapp: "",
  instagram: "https://www.instagram.com/johnreslabs/",
  facebook: "https://www.facebook.com/profile.php?id=61587748195421",
  youtube: "https://www.youtube.com/@JohnresLab",
};

export default function Settings() {
  const [form, setForm] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    getDoc(doc(db, "settings", "site")).then((snap) => {
      if (snap.exists()) setForm(snap.data() as SiteSettings);
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await setDoc(doc(db, "settings", "site"), form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p className="text-ink-muted text-sm">Loading…</p>;

  return (
    <div>
      <PageHeader title="Settings" description="Site-wide contact info and social links." />

      <Card className="max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Tagline">
            <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </Field>
          <Field label="Contact Email">
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="WhatsApp Link">
            <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="https://wa.me/..." />
          </Field>
          <Field label="Instagram URL">
            <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </Field>
          <Field label="Facebook URL">
            <Input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
          </Field>
          <Field label="YouTube URL">
            <Input value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} />
          </Field>
          <Button type="submit">{saved ? "Saved!" : "Save Settings"}</Button>
          <p className="text-xs text-ink-dim">
            Note: the public site currently reads these values from its own code (for reliability and speed). Wiring
            the public site to read live from here is a follow-up step — see the admin README.
          </p>
        </form>
      </Card>
    </div>
  );
}
