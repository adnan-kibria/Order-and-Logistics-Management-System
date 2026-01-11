import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <FileQuestion className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">404</span>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          It might have been moved, deleted, or the URL might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Quick Links:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/admin"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
            >
              Dashboard
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              href="/admin/orders"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
            >
              Orders
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              href="/admin/products"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
            >
              Products
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link
              href="/admin/customers"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
            >
              Customers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
