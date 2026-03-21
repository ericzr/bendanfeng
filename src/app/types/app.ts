export type AppProductType =
  | "tool"
  | "analysis"
  | "platform"
  | "monitor"
  | "service"
  | "marketing"
  | "specialist";

export type AppSuperCategory = "skill" | "app";

export interface AppItem {
  id: string;
  name: string;
  description: string;
  businessType: string;
  productType: AppProductType;
  superCategory: AppSuperCategory;
  icon: string;
  tags: string[];
  status: "available" | "installed" | "update";
  rating: number;
  ratingCount: number;
  downloads: number;
  lastUpdated: string;
  features: string[];
  author: string;
  version: string;
}

export type SkillCategory =
  | "data-processing"
  | "content-gen"
  | "comm-integration"
  | "web-scraping"
  | "multimedia"
  | "security"
  | "ai-enhance"
  | "dev-tools";

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  superCategory: "skill";
  icon: string;
  author: string;
  version: string;
  downloads: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  status: "available" | "installed" | "update";
  lastUpdated: string;
  features: string[];
  compatibility: string[];
}
