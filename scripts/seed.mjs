// One-time script to seed Firestore with the content that currently lives as static
// data in the public site (src/data/*.ts), so the admin panel and public site start
// in sync instead of empty.
//
// Usage:
//   1. Make sure .env has your Firebase config (see .env.example).
//   2. Add SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to .env — credentials of the
//      first admin user you created in Firebase Console → Authentication → Users.
//   3. Run: node scripts/seed.mjs
//
// Safe to run more than once — it will create duplicate documents if run twice,
// so only run it once against a fresh project.

import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
  console.error(
    "Missing config. Make sure .env has your Firebase config plus SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD."
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const categories = [
  { name: "Linux", type: "blog" },
  { name: "Windows", type: "blog" },
  { name: "Networking", type: "blog" },
  { name: "VirtualBox", type: "blog" },
  { name: "VMware", type: "blog" },
  { name: "How-To", type: "blog" },
  { name: "Cheat Sheets", type: "download" },
  { name: "Scripts", type: "download" },
  { name: "Documentation", type: "download" },
  { name: "Network Diagrams", type: "download" },
];

const posts = [
  {
    title: "How to Fix GRUB After a Windows Update Overwrites It",
    slug: "fix-grub-after-windows-update",
    category: "Linux",
    tags: ["GRUB", "Dual Boot", "Windows"],
    excerpt:
      "Windows updates sometimes overwrite the bootloader on dual-boot machines. Here's the safe way to restore GRUB without losing either OS.",
    content:
      "Windows updates occasionally rewrite the Windows Boot Manager over GRUB, which leaves your Linux install unreachable at boot. Boot from a live USB, mount your Linux partition, chroot in, then run grub-install and update-grub to restore it.",
    status: "published",
  },
  {
    title: "VirtualBox vs VMware Workstation: Which Should You Use in 2026?",
    slug: "virtualbox-vs-vmware-2026",
    category: "VirtualBox",
    tags: ["VirtualBox", "VMware", "Virtual Machines"],
    excerpt:
      "Both are free for personal use now. Here's how performance, snapshots, and guest OS support actually compare for tutorial and testing workloads.",
    content:
      "VirtualBox is free, open-source, and the lowest-friction starting point. VMware Workstation Pro has better 3D acceleration and snapshot handling for heavier workloads, and is now also free for personal use.",
    status: "published",
  },
  {
    title: "Subnetting Explained Simply (With a Calculator You Can Use)",
    slug: "subnetting-explained-simply",
    category: "Networking",
    tags: ["Networking", "Subnetting", "IP"],
    excerpt:
      "Subnetting trips up almost everyone the first time. Here's the mental model that made it click for me, plus a free subnet calculator.",
    content:
      "Subnetting is just division — every host bit doubles your available addresses, and every bit you take for the network halves it. Try the Subnet Calculator in the Tools section to see it in action.",
    status: "published",
  },
  {
    title: "The Windows 11 + Linux Dual-Boot Checklist (Do This Before You Start)",
    slug: "windows-11-dual-boot-checklist",
    category: "How-To",
    tags: ["Dual Boot", "Windows 11", "Linux"],
    excerpt:
      "Most dual-boot horror stories come from skipping prep steps, not from the install itself. Here's the checklist I run through every time.",
    content:
      "Back up your data, confirm UEFI mode, shrink your Windows partition, disable Fast Startup, disable BitLocker temporarily, and verify your installer USB checksum before you begin.",
    status: "published",
  },
];

const projects = [
  {
    name: "Johnres Lab Website",
    description:
      "This site — a React + Vite + Tailwind personal brand site with a blog, tools, and downloadable resources, deployed on GitHub Pages.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    repo: "https://github.com/johnreslab/johnreslab.github.io",
  },
  {
    name: "GRUB Recovery Script",
    description:
      "A guided Bash script that automates the chroot + grub-install + update-grub sequence for restoring GRUB after it's overwritten by a Windows update.",
    tech: ["Bash", "Linux"],
    repo: "https://github.com/johnreslab/grub-recovery-script",
  },
];

const downloads = [
  {
    name: "Linux Command Cheat Sheet",
    category: "Cheat Sheets",
    format: "PDF",
    description: "The 60 commands I actually use day-to-day for file management, permissions, processes, and networking.",
    href: "/downloads/linux-command-cheatsheet.pdf",
  },
  {
    name: "Dual-Boot Pre-Flight Checklist",
    category: "Cheat Sheets",
    format: "PDF",
    description: "Printable checklist to run through before starting any Windows + Linux dual-boot install.",
    href: "/downloads/dualboot-checklist.pdf",
  },
];

async function seed() {
  console.log("Signing in…");
  await signInWithEmailAndPassword(auth, process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD);

  console.log("Seeding categories…");
  for (const c of categories) await addDoc(collection(db, "categories"), c);

  console.log("Seeding posts…");
  for (const p of posts) await addDoc(collection(db, "posts"), { ...p, createdAt: Date.now(), updatedAt: Date.now() });

  console.log("Seeding projects…");
  for (const p of projects) await addDoc(collection(db, "projects"), { ...p, createdAt: Date.now() });

  console.log("Seeding downloads…");
  for (const d of downloads) await addDoc(collection(db, "downloads"), { ...d, createdAt: Date.now() });

  console.log("Done! Check your Firestore console, or the admin dashboard.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
