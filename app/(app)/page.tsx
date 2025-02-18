import Link from "next/link";

;

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A3848] to-[#0A0708] flex flex-col items-center justify-center text-white px-6 text-center">
    {/* Hero Section */}
    <h1 className="text-4xl font-bold mb-4">"Stay Ahead of the Weather, Anytime, Anywhere!"</h1>
    <p className="text-lg text-gray-300 max-w-2xl">
        Get real-time weather updates, track your favorite locations, and never get caught in the rain unprepared!
    </p>
    
    {/* Call to Action */}
    <div className="mt-6">
        <Link href="/login" className="bg-black hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md">
            Login to Get Started
        </Link>
    </div>

    {/* Feature Highlights */}
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl">
        <div className="p-6 bg-white bg-opacity-10 rounded-lg">
            <h2 className="text-xl font-semibold">🌍 Track Multiple Cities</h2>
            <p className="text-gray-300">Save and monitor weather conditions in your favorite locations.</p>
        </div>
        <div className="p-6 bg-white bg-opacity-10 rounded-lg">
            <h2 className="text-xl font-semibold">📊 Hourly Forecasts</h2>
            <p className="text-gray-300">Plan your day better with precise weather insights.</p>
        </div>
        <div className="p-6 bg-white bg-opacity-10 rounded-lg">
            <h2 className="text-xl font-semibold">⚡ Real-time Updates</h2>
            <p className="text-gray-300">Get the latest weather conditions instantly.</p>
        </div>
    </div>
</div>
);
}
