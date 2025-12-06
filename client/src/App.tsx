import { WeatherOverview } from "./components/WeatherOverview";
import { StatsSection } from "./components/StatsSection";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-blue-900 mb-2">Weather Monitoring System</h1>
          <p className="text-gray-600">Real-time environmental data and analytics</p>
        </header>

        {/* Weather Overview Cards */}
        <WeatherOverview />

        {/* Statistics Section */}
        <StatsSection />
      </div>
    </div>
  );
}
