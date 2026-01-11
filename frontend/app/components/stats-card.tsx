export default function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === "number" && title.includes("Revenue")
            ? `${value.toLocaleString()}`
            : value.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}