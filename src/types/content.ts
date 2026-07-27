export type PostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string;
  status: PostStatus;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  createdAt?: number;
  updatedAt?: number;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  tech: string[];
  repo?: string;
  demo?: string;
  createdAt?: number;
};

export type DownloadItem = {
  id: string;
  name: string;
  category: string;
  format: string;
  description: string;
  href: string;
  createdAt?: number;
};

export type Category = {
  id: string;
  name: string;
  type: "blog" | "download";
};

export type Subscriber = {
  id: string;
  email: string;
  subscribedAt?: number;
};

export type FeaturedVideo = {
  id: string;
  videoId: string;
  title: string;
  order: number;
};

export type MediaFile = {
  name: string;
  url: string;
  fullPath: string;
  size: number;
  contentType: string;
  uploadedAt: number;
};

export type SiteSettings = {
  tagline: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  youtube: string;
};
