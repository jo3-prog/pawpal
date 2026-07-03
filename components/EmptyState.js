import Link from "next/link";

export default function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}) {
  return (
    <div className="kennel-card items-center text-center py-14 px-6">
      <div className="text-4xl mb-3" aria-hidden="true">
        🐾
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-ink/70 mt-2 max-w-sm">{message}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
