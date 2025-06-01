import { ChartData } from "chart.js";

const labels: string[] = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const temperatureData: number[] = [22, 24, 26, 28, 30, 32, 34, 35, 33, 31, 29, 27, 25]; // °C
const humidityData: number[] = [80, 75, 70, 65, 60, 55, 50, 45, 50, 55, 60, 65, 70]; // %
const lightData: number[] = [200, 400, 600, 800, 1000, 950, 900, 850, 700, 600, 500, 300, 100]; // Lux

export const data_sensor: ChartData<"line"> = {
  labels,
  datasets: [
    {
      label: "Nhiệt độ (°C)",
      data: temperatureData,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: false,
    },
    {
      label: "Độ ẩm (%)",
      data: humidityData,
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.2)",
      fill: false,
    },
    {
      label: "Ánh sáng (Lux)",
      data: lightData,
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: false,
    },
  ],
};

export default data_sensor;
