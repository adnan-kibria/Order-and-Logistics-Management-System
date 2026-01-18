export default function Loading() {
    // Number of cards to show
    const cards = Array.from({ length: 6 });

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">
            <h1 className="text-5xl font-semibold text-gray-700 mb-6 text-center">
                Loading ...
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((_, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 animate-pulse"
                    >
                        {/* Card header */}
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

                        {/* Card content */}
                        <div className="space-y-3">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>

                        {/* Card footer button */}
                        <div className="h-10 bg-gray-300 rounded w-full mt-6"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
