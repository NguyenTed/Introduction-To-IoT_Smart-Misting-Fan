import express from "express";
import { mqttClient } from "../config/mqtt.js";
import { DHT, Activity } from "../models/index.js";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  // Extract hours, minutes, and seconds with padding
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Extract day, month, and year with padding for day and month
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Format the date and time into the desired output format
  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
};

export const renderDashboardPage = async (req, res) => {
  const authenticated = req.isAuthenticated();
  if (!authenticated) {
    return res.redirect("/users/login");
  }

  const dhtData = await DHT.find({}).sort({ date: 1 }).limit(7);
  const activities = await Activity.find({}).sort({ date: -1 }).limit(5);

  const dataLabels = dhtData.map((data) => formatDate(data.date));
  const temperatureData = dhtData.map((data) => data.temperature);
  const humidityData = dhtData.map((data) => data.humidity);

  const averageTemperature =
    Math.round(
      (temperatureData.reduce((a, b) => a + b, 0) / temperatureData.length) *
        100 +
        Number.EPSILON
    ) / 100 || 0;
  const averageHumidity =
    Math.round(
      (humidityData.reduce((a, b) => a + b, 0) / humidityData.length) * 100 +
        Number.EPSILON
    ) / 100 || 0;

  const chartData = {
    labels: dataLabels,
    temperature: temperatureData,
    humidity: humidityData,
  };

  const activityData = activities.map((activity) => {
    return {
      date: formatDateTime(activity.date),
      activity: activity.activity,
    };
  });

  res.render("layouts/main-layout", {
    body: "../pages/dashboard.ejs",
    chartData,
    averageTemperature,
    averageHumidity,
    activityData,
    authenticated,
  });
};
