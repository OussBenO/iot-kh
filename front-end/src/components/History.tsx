import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './styles/History.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const History: React.FC = () => {
  const [temperatureData, setTemperatureData] = useState<any>(null);
  const [humidityData, setHumidityData] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('jour');

  // Fonction pour récupérer les données du capteur
  const fetchSensorData = async () => {
    try {
      const response = await axios.get('http://192.168.87.104:8000/api/sensor-data/');
      const sensorData = response.data.data;
      const { tempChart, humidityChart } = formatChartData(sensorData, selectedPeriod);
      setTemperatureData(tempChart);
      setHumidityData(humidityChart);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };

  // Fonction pour filtrer et formater les données
  const filterData = (data: any[], period: string) => {
    const groupedData: Record<string, any> = {};

    data.forEach((item) => {
      const date = new Date(item.timestamp);
      let key: string | undefined;

      if (period === 'jour') {
        key = `${date.getHours()}h`;
      } else if (period === 'semaine') {
        key = date.toLocaleDateString();
      } else if (period === 'mois') {
        const week = getWeekNumber(date);
        key = `Semaine ${week}`;
      }

      if (key !== undefined) {
        if (!groupedData[key]) {
          groupedData[key] = {
            minTemp: item.temperature,
            maxTemp: item.temperature,
            minHumidity: item.humidity,
            maxHumidity: item.humidity,
          };
        } else {
          groupedData[key].minTemp = Math.min(groupedData[key].minTemp, item.temperature);
          groupedData[key].maxTemp = Math.max(groupedData[key].maxTemp, item.temperature);
          groupedData[key].minHumidity = Math.min(groupedData[key].minHumidity, item.humidity);
          groupedData[key].maxHumidity = Math.max(groupedData[key].maxHumidity, item.humidity);
        }
      }
    });

    return groupedData;
  };

  // Fonction pour obtenir le numéro de la semaine
  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  };

  // Fonction pour créer un dégradé pour les graphiques
  const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    return gradient;
  };

  // Fonction manquante pour formater les données du graphique
  const formatChartData = (data: any[], period: string) => {
    const filteredData = filterData(data, period);
    const labels = Object.keys(filteredData);
    const minTempData = labels.map((key) => filteredData[key].minTemp);
    const maxTempData = labels.map((key) => filteredData[key].maxTemp);
    const minHumidityData = labels.map((key) => filteredData[key].minHumidity);
    const maxHumidityData = labels.map((key) => filteredData[key].maxHumidity);

    const ctx = document.createElement('canvas').getContext('2d');

    const tempChart = {
      labels,
      datasets: [
        {
          label: 'Température Min (°C)',
          data: minTempData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: ctx ? createGradient(ctx, 'rgba(255, 99, 132, 0.5)') : 'rgba(255, 99, 132, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Température Max (°C)',
          data: maxTempData,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: ctx ? createGradient(ctx, 'rgba(255, 159, 64, 0.5)') : 'rgba(255, 159, 64, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    const humidityChart = {
      labels,
      datasets: [
        {
          label: 'Humidité Min (%)',
          data: minHumidityData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: ctx ? createGradient(ctx, 'rgba(54, 162, 235, 0.5)') : 'rgba(54, 162, 235, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Humidité Max (%)',
          data: maxHumidityData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: ctx ? createGradient(ctx, 'rgba(75, 192, 192, 0.5)') : 'rgba(75, 192, 192, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    return { tempChart, humidityChart };
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  return (
    <div className="history-page">
      <h1>Historique des Données</h1>
      
      <div className="tabs">
        <button onClick={() => setSelectedPeriod('jour')}>Aujourd'hui</button>
        <button onClick={() => setSelectedPeriod('semaine')}>Cette Semaine</button>
        <button onClick={() => setSelectedPeriod('mois')}>Ce Mois</button>
      </div>
      
      <div className="chart-container">
        {/* Graphe de Température */}
        <div className="chart-box">
          <h2>Température</h2>
          {temperatureData && <Line data={temperatureData} />}
        </div>
        
        {/* Graphe d'Humidité */}
        <div className="chart-box">
          <h2>Humidité</h2>
          {humidityData && <Line data={humidityData} />}
        </div>
      </div>
    </div>
);

};

export default History;
