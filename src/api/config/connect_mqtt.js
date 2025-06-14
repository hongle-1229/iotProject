console.log(">>> File connect_mqtt.js đang chạy");

import express from 'express';
import mqtt from 'mqtt';
import sql from 'mssql';


// Kết nối MQTT 
const mqttClient = mqtt.connect('mqtt://10.21.36.33:8888', {
    username: 'HongLe',
    password: 'hongle1229'
}); 

// Kết nối SQL Server
const sqlConfig = {
    user: 'sa',
    password: 'hongle1229',
    server: 'localhost',
    database: 'data_sensor_web',
    options: {
        trustServerCertificate: true,
    }
};

// Kết nối MQTT thành công
mqttClient.on('connect', () => {
    console.log("✅ MQTT connected");
    mqttClient.subscribe('sensor/topic', (err) => {
        if (err) {
            console.log("❌ Error subscribing to topic", err);
        } else {
            console.log("📡 Subscribed to 'sensor/topic'");
        }
    });
});

// Xử lý khi nhận tin nhắn từ MQTT
mqttClient.on('message', async (topic, message) => {
    if (topic === 'sensor/topic') {
        try {
            const data = JSON.parse(message.toString());

            // Kiểm tra dữ liệu đầy đủ
            if (data.temperature === undefined || data.humidity === undefined || data.light === undefined) {
                console.log("⚠️ Dữ liệu thiếu trường cần thiết!");
                return;
            }

            // Kết nối và insert vào database
            const pool = await sql.connect(sqlConfig);
            await pool.request()
                .input('temp', sql.Float, data.temperature)
                .input('humidity', sql.Int, data.humidity)
                .input('light', sql.Int, data.light)
                .query(`INSERT INTO sensor_data (Temp, Humidity, Light) VALUES (@temp, @humidity, @light)`);

            console.log("✅ Dữ liệu đã được ghi vào DB:", data);
        } catch (error) {
            console.error("❌ Lỗi khi insert vào DB:", error.message);
        }
    }
});


