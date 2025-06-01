import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { AxiosError } from "axios";

export function SensorToggle2() {
  const [on, setOn] = useState(false);
  const handleToggle = async () => {
    const newStatus = !on ? "on" : "off";
    try {
      const response = await axios.post("http://localhost:3000/api/data/receive_device_status", {
        deviceName: "den", // có thể truyền từ props nếu cần linh hoạt
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
    <button className="toggle-button-2"
      onClick={handleToggle}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: on ? "green" : "gray",
        color: "white",
        border: "none",
        cursor: "pointer"
      }}
    >
      {on ? "BẬT" : "TẮT"}
    </button>
  );
}