import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Dashboard.css';

// Interface pour les données des capteurs
interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [latestData, setLatestData] = useState<SensorData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.87.104:8000/api/sensor-data/');
        const data = response.data.data;
        if (data.length > 0) {
          setLatestData(data[data.length - 1]);
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-page">
      <main className="content full-width">
        <h1>Real-time Sensor Dashboard</h1>
        {latestData ? (
          <div className="sensor-container">
            <div className="sensor-info">
              <img src="/icons/temperature.svg" alt="Temperature" className="sensor-icon" />
              <h2>{latestData.temperature}°C</h2>
              <p>Temperature</p>
            </div>
            <div className="sensor-info">
              <img src="/icons/humidity.svg" alt="Humidity" className="sensor-icon" />
              <h2>{latestData.humidity}%</h2>
              <p>Humidity</p>
            </div>
            <div className="sensor-info">
              <img src="/icons/clock.svg" alt="Time" className="sensor-icon" />
              <h2>{new Date(latestData.timestamp).toLocaleTimeString()}</h2>
              <p>Time</p>
            </div>
          </div>
        ) : (
          <p>Loading data...</p>
        )}
      </main>
    </div>
  );
  
};

export default Dashboard;
