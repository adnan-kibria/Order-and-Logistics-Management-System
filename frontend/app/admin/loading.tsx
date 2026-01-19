export default function AdminLoading() {
  const skeletonClass = "bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse";

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-3">
        <div className={`${skeletonClass} h-8 w-48`} />
        <div className={`${skeletonClass} h-4 w-72`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`${skeletonClass} h-24 w-full`} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${skeletonClass} h-64 w-full`} />
        <div className={`${skeletonClass} h-64 w-full`} />
      </div>
      <div className="space-y-4">
        <div className={`${skeletonClass} h-6 w-32`} />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${skeletonClass} h-12 w-full`} />
          ))}
        </div>
      </div>
    </div>
  );
}