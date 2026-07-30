export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tightest">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-mute max-w-2xl">{description}</p>
      )}
    </div>
  );
}
