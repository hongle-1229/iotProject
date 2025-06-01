import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { AxiosError } from "axios";

export function SensorToggle1() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = async () => {
    const newStatus = !isOn ? "on" : "off"; 
    try {
      const response = await axios.post("http://localhost:3000/api/data/receive_device_status", {
        deviceName: "den",
        status: newStatus,
      });
      message.success(`Thiết bị đã được ${newStatus === "on" ? "bật" : "tắt"}`);
      console.log("Phản hồi từ server:", response.data);
      setIsOn(!isOn); 
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Lỗi khi gửi trạng thái:", err.response?.data || err.message);
      message.error("Không thể cập nhật trạng thái thiết bị");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="toggle-button-1 rounded-full shadow-md transition-all"
      style={{
        backgroundColor: isOn ? "yellow" : "gray",
        color: isOn ? "black" : "white",
      }}
    >
      <FontAwesomeIcon icon={faLightbulb} size="2x" />
    </button>
  );
}
