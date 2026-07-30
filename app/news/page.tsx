import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getAllNews } from "@/lib/news";

export const metadata = { title: "News" };

export default function NewsPage() {
  const posts = getAllNews();

  return (
    <div>
      <PageHeader
        eyebrow="League News"
        title="Articles & Updates"
        description="Power rankings, recaps, and league announcements."
      />

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/news/${post.slug}`}
            className="block border border-line rounded-lg p-6 hover:border-accent transition-colors"
          >
            <p className="font-mono text-xs text-mute mb-2">
              {post.date} &middot; {post.author}
            </p>
            <h2 className="font-display font-bold text-xl mb-2">
              {post.title}
            </h2>
            <p className="text-mute">{post.excerpt}</p>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="text-mute">
            No articles yet. Add a markdown file to{" "}
            <code className="font-mono text-xs bg-accent-soft px-1.5 py-0.5 rounded">
              content/news/
            </code>{" "}
            to publish one.
          </p>
        )}
      </div>
    </div>
  );
}
