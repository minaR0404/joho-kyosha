"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-bold text-gray-200">500</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">
        エラーが発生しました
      </h2>
      <p className="mt-2 text-gray-500 text-center">
        申し訳ありません。しばらくしてからもう一度お試しください。
      </p>
      <button
        onClick={reset}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        もう一度試す
      </button>
    </div>
  );
}
