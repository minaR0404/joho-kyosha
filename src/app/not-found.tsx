import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">
        ページが見つかりません
      </h2>
      <p className="mt-2 text-gray-500 text-center">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
