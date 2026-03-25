export default function TagBadge({ name }: { name: string }) {
  return (
    <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full">
      {name}
    </span>
  );
}
