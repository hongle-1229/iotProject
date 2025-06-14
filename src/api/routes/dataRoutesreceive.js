import express from 'express';
import { sql, poolPromise } from "../config/connect_db.js";
import mqtt from 'mqtt';
 

const router = express.Router();

// Kết nối MQTT 
const mqttClient = mqtt.connect('mqtt://10.21.36.33:8888', {
    username: 'HongLe',
    password: 'hongle1229'
});
mqttClient.on('connect', () => {
    console.log('✅ Đã kết nối MQTT broker!');
});

let currenStatus = {
  led: 0,
  fan: 0,
  lamp: 0
}

router.post('/receive_device_status', async (req, res) => {
    console.log("Nhận requet từ client: ", req.body);
    
    try {
        const { deviceName, status } = req.body;

        const validDevices = ['quat', 'dieu_hoa', 'den'];
        const validStatus = ['on', 'off'];

        if (!validDevices.includes(deviceName?.toLowerCase())) {
            return res.status(400).json({ error: `Thiết bị ${deviceName} không hợp lệ!` });
        }
        if (!validStatus.includes(status?.toLowerCase())) {
            return res.status(400).json({ error: `Trạng thái ${status} không hợp lệ!` })
        }

        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const formattedTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
            `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('deviceName', sql.NVarChar, deviceName)
            .input('status', sql.NVarChar, status)
            .input('time', sql.NVarChar, formattedTime)
            .query(`INSERT INTO sensor_device (DeviceName, Statuss, TimeOfDay) 
                VALUES (@deviceName, @status, @time)`);

        // trạng thái của thiết bị
        let fan=0, led=0, lamp=0;
        if (deviceName.toLowerCase() === 'den') currenStatus.led = status.toLowerCase() === 'on' ? 1 : 0;
        if (deviceName.toLowerCase() === 'quat') currenStatus.fan = status.toLowerCase() === 'on' ? 1 : 0;
        if (deviceName.toLowerCase() === 'dieu_hoa') currenStatus.lamp = status.toLowerCase() === 'on' ? 1 : 0;

        //payload
        const payload = JSON.stringify({
            "1": currenStatus.led,
            "2": currenStatus.fan,
            "3": currenStatus.lamp
        });

        mqttClient.publish('device/topic', payload, (err) => {
            if (err) {
                console.log("Lỗi gửi mqtt: ", err);
            }
            else console.log("Đã gửi lệnh mqtt: ", payload);
        });

        console.log("Dữ liệu được thêm vào DB thành công", result.recordset);;
        res.status(200).json({
            message: "Dữ liệu được thêm vào DB thành công",
            inserted: {
                deviceName,
                status,
                time: formattedTime
            },
            rowsAffected: result.rowsAffected[0]
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router;