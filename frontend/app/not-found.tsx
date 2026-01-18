'use client';

import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4">
      {/* Main content */}
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 rounded-lg bg-neutral text-white font-medium hover:bg-neutral-focus transition"
          >
            Go Home
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Optional illustration */}
      <div className="mt-10">
        <svg
          className="w-80 h-60 text-gray-300 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L15 12m0 0l-5.25-5M15 12H3m12 0h6"
          />
        </svg>
      </div>
    </div>
  );
}
