import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card } from "antd";
import axios from 'axios';

interface DataDevice {
  Temp: number;
  Humidity: number;
  Light: number;
  CreateAt: string;
  // Smog: number;
  // Wind: number;
}

const ChartLine: React.FC = () => {
  const [dataDevice, setDataDevice] = useState<DataDevice[]>([]);

  useEffect(() => {
    console.log("hihi");
    
    const fetchData = ()=>{
      axios
      .get<{ data: DataDevice[] }>("http://localhost:3000/api/data?sortBy=CreateAt&sortOrder=DESC&pageSize=5&pageNumber=1")
      .then((response) => {
        console.log("API Response: ", response.data);
        setDataDevice(response.data.data.slice().reverse());
      })
      .catch((error) => console.log("Lỗi lấy dữ liệu: ", error));
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{display: "block"}}>

    <Card title="Quan sát ánh sáng" style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataDevice} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CreateAt" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Light" stroke="#eefa11" strokeWidth={2} name="Ánh sáng (lux)" />
        </LineChart>
        
      </ResponsiveContainer>
    </Card>

      <Card title="Quan sát nhiệt độ" style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataDevice} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CreateAt" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Temp" stroke="#ff7300" strokeWidth={2} name="Nhiệt độ (°C)" />
        </LineChart>
        
      </ResponsiveContainer>
    </Card>


    <Card title="Quan sát độ ẩm" style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataDevice} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CreateAt" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Humidity" stroke="#0051ff" strokeWidth={2} name="Độ ẩm (%)" />
        </LineChart>
        
      </ResponsiveContainer>
    </Card>

    
        
    {/* <Card title="Quan sát độ bụi, tốc độ gió trong ngày" style={{ width: "50%" }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dataDevice} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="TimeOfDay" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Smog" stroke="#7f7f80" strokeWidth={2} name="Độ bụi (°C)" />
          <Line type="monotone" dataKey="Wind" stroke="#82ca9d" strokeWidth={2} name="Tốc độ gió (lux)" />
          {/* <Line type="monotone" dataKey="Humidity" stroke="#ff7300" strokeWidth={2} name="Độ ẩm (%)" /> */}
        {/* </LineChart>
      </ResponsiveContainer>
    // </Card> */} 
    </div>
    
  );
};

export default ChartLine;
