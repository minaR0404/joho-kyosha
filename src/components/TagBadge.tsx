export default function TagBadge({ name }: { name: string }) {
  return (
    <span className="inline-block text-xs px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full">
      {name}
    </span>
  );
}
