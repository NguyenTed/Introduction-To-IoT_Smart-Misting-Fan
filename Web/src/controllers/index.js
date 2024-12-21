import express from "express";
import { mqttClient } from "../config/mqtt.js";
import { DHT } from "../models/index.js";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

export const renderDashboardPage = async (req, res) => {
  const dhtData = await DHT.find({}).sort({ date: 1 }).limit(7);

  const dataLabels = dhtData.map((data) => formatDate(data.date));
  const temperatureData = dhtData.map((data) => data.temperature);
  const humidityData = dhtData.map((data) => data.humidity);

  console.log(dataLabels);
  console.log(temperatureData);
  console.log(humidityData);

  const chartData = {
    labels: dataLabels,
    temperature: temperatureData,
    humidity: humidityData,
  };
  res.render("layouts/main-layout2", {
    chartData,
  });
};
