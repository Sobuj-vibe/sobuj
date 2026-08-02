export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p data-reveal className="technical-label">
        {label}
      </p>
      <h2 data-reveal className="amber-rule mt-4 text-4xl leading-[1.05] sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p data-reveal className="mt-6 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}