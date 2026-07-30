import { getAllNewsSlugs, getNewsBySlug } from "@/lib/news";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  let post;
  try {
    post = await getNewsBySlug(params.slug);
  } catch {
    notFound();
  }

  if (!post) return notFound();

  return (
    <article className="max-w-2xl mx-auto">
      <Link href="/news" className="text-sm text-accent hover:underline">
        &larr; All news
      </Link>

      <p className="font-mono text-xs text-mute mt-6 mb-2">
        {post.date} &middot; {post.author}
      </p>
      <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tightest mb-8">
        {post.title}
      </h1>

      <div
        className="prose-custom [&_p]:mb-4 [&_p]:leading-relaxed [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
