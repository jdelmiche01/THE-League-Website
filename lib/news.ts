import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const newsDirectory = path.join(process.cwd(), "content/news");

export interface NewsMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
}

export function getAllNews(): NewsMeta[] {
  if (!fs.existsSync(newsDirectory)) return [];

  const filenames = fs.readdirSync(newsDirectory).filter((f) => f.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(newsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      author: data.author ?? "",
      excerpt: data.excerpt ?? "",
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getNewsBySlug(slug: string) {
  const fullPath = path.join(newsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    author: data.author ?? "",
    contentHtml,
  };
}

export function getAllNewsSlugs(): string[] {
  if (!fs.existsSync(newsDirectory)) return [];
  return fs
    .readdirSync(newsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
