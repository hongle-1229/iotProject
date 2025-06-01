import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { AxiosError } from "axios";

interface SensorToggle3Props{
  deviceName: string;
}

export function SensorToggle3({deviceName}: SensorToggle3Props) {
    const [on, setOn] = useState(false);

    useEffect(() => {
        // Gọi API lấy trạng thái thiết bị khi component mount
        axios.get(`http://localhost:3000/api/data/get_status?deviceName=${deviceName}`)
            .then(res => {
                setOn(res.data.status === "on");
            })
            .catch(() => setOn(false));
    }, [deviceName]);

    const handleToggle = async () => {
        const newStatus = !on ? "on" : "off";
        try {
            const response = await axios.post("http://localhost:3000/api/devices_status/receive_device_status", {
                deviceName,
                status: newStatus,
            });
            message.success(`Thiết bị đã được ${newStatus === "on" ? "bật" : "tắt"}`);
            console.log("Phản hồi từ server:", response.data);
            setOn(!on);
        } catch (error: unknown) {
            const err = error as AxiosError;
            console.error("Lỗi khi gửi trạng thái:", err.response?.data || err.message);
            message.error("Không thể cập nhật trạng thái thiết bị");
        }
    };

    return (
        <div>
            <div className={`toggle-button-3 ${on ? 'active' : ''}`} onClick={handleToggle}>
                <div className={`spinner ${on ? 'active' : ''}`}></div>
            </div>
        </div>
    );
}
