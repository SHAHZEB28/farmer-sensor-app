// frontend/src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import api from './Services/api.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import SubmissionForm from './Components/submissionForm';
import BulkUpload from './Components/bulkUpload';
import AnimatedCard from './Components/animatedCard';
import SkeletonLoader from './Components/skeletonLoader';

const StatCard = ({ title, value, icon, loading = false }) => {
  if (loading) {
    return <SkeletonLoader />;
  }
  return (
    <AnimatedCard className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-600">{title}</h3>
          <div className="text-primary">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-neutral-800 mt-2">{value}</p>
      </div>
    </AnimatedCard>
  );
};

const TempIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 18h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM12 6V4m0 16v-2m-6-4H4m16 0h-2m-4-6V4m0 16v-2" /></svg>;
const MoistureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5A6.5 6.5 0 105.5 12 6.5 6.5 0 0012 18.5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v.01M12 8v.01M12 16v.01" /></svg>;

function App() {
  const [stats, setStats] = useState({ temp: null, moisture: null });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState({ stats: true, chart: true });

  const fetchData = useCallback(async () => {
    setLoading({ stats: true, chart: true });
    try {
      const tempResponse = await api.getAnalytics(1, 'temperature');
      setStats(prev => ({ ...prev, temp: tempResponse.data }));
    } catch (err) { console.log("No temp data"); setStats(prev => ({ ...prev, temp: null })); }
    try {
      const moistureResponse = await api.getAnalytics(1, 'soil_moisture');
      setStats(prev => ({ ...prev, moisture: moistureResponse.data }));
    } catch (err) { console.log("No moisture data"); setStats(prev => ({ ...prev, moisture: null })); }
    finally { setLoading(prev => ({ ...prev, stats: false })); }

    try {
      const chartResponse = await api.getChartData(1, 24);
      setChartData(chartResponse.data);
    } catch (err) { console.log("No chart data"); setChartData([]); }
    finally { setLoading(prev => ({ ...prev, chart: false })); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="bg-neutral-50 min-h-screen font-sans text-neutral-800">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800">
              Field<span className="text-primary">Insights</span>
            </h1>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Fields" value="1" loading={loading.stats} />
          <StatCard title="Sensors Online" value="2" loading={loading.stats} />
          <StatCard title="Avg. Temp" value={stats.temp ? `${stats.temp.avg.toFixed(1)} °C` : 'N/A'} icon={<TempIcon />} loading={loading.stats} />
          <StatCard title="Avg. Moisture" value={stats.moisture ? `${stats.moisture.avg.toFixed(1)} %` : 'N/A'} icon={<MoistureIcon />} loading={loading.stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg-col-span-2"><SubmissionForm onNewData={fetchData} /></div>
            <div className="lg-col-span-3"><BulkUpload onNewData={fetchData} /></div>
        </div>

        <AnimatedCard>
          <h2 className="text-xl font-semibold mb-4 text-neutral-700">Sensor Readings (Last 24h)</h2>
          {loading.chart ? (
            <div className="h-96 flex items-center justify-center text-neutral-500">Loading chart data...</div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#4f46e5" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Temperature (°C)" connectNulls />
                <Line yAxisId="right" type="monotone" dataKey="soil_moisture" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Moisture (%)" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          )}
        </AnimatedCard>
      </main>
    </div>
  );
}

export default App;
