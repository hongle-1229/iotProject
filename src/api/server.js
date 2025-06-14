import express from "express";
import cors from 'cors';
import "./config/connect_db.js";
import usersRoutes from "./routes/usersRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import dataRoutesreveive from "./routes/dataRoutesreceive.js";
import mqtt from "mqtt";

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:5173',
    'http://192.168.30.110',
    'http://192.168.0.129',
    'http://10.21.36.33'
  ], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,               
}));

app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/devices_status", dataRoutesreveive);



// Khai báo biến toàn cục ở đầu file
let latestWarning = "off";
const mqttClient = mqtt.connect('mqtt://10.21.36.33:8888', {
  username: 'HongLe',
  password: 'hongle1229'
});
// Khi nhận được message MQTT, cập nhật biến này
mqttClient.on('message', (topic, message) => {
  console.log("Received MQTT message:", topic, message.toString());
  if (topic === 'device/warning') {
    try {
      const data = JSON.parse(message.toString());
      latestWarning = data.warning; 
      console.log("Updated latestWarning:", latestWarning);
    } catch (e) {
      latestWarning = "off";
      console.log("Error parsing warning:", e);
    }
  }
});
mqttClient.on('connect', () => {
  console.log("MQTT connected!");
  mqttClient.subscribe('device/warning', (err) => {
    if (err) console.log("Subscribe error:", err);
    else console.log("Subscribed to device/warning");
  });
});


app.get('/api/devices_status/warning', (req, res) => {
  res.json({ warning: latestWarning });
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
