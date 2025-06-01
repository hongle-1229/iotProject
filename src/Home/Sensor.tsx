import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTemperatureLow } from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faFan } from "@fortawesome/free-solid-svg-icons";
import { faWind } from "@fortawesome/free-solid-svg-icons";
// import { faSmog } from "@fortawesome/free-solid-svg-icons";
// import { faWind } from "@fortawesome/free-solid-svg-icons";
// import { SensorToggle1 } from "./SensorToggle1";
// import { SensorToggle2 } from "./SensorToggle2";
import { SensorToggle3 } from "./SensorToggle3";
import "../style/Dashboard.css";
import ChartLine from "./ChartLine";
import { useEffect, useState } from "react";
import axios from "axios";
import Warning from "../Layout/Warning";

interface DataSensor {
    Temp: number;
    Light: number;
    Humidity: number;
}



export const Sensor = () => {
    const [dataSensor, setDataSenSor] = useState<DataSensor[]>([]);
    const sensorData = dataSensor[0]; 
    useEffect(() => {
        const fetchData = () =>{
            axios
            .get<{ data: DataSensor[] }>("http://localhost:3000/api/data?sortBy=CreateAt&sortOrder=DESC&pageSize=1&pageNumber=1")
            .then((response) => {
                console.log("API response: ", response.data);
                setDataSenSor(response.data.data);
            })
            .catch((error) => console.log("Lỗi lấy dữ liệu: ", error));
        }
        fetchData();
        const interval = setInterval(fetchData,2000);
        return () => clearInterval(interval);
    }, []);

    

    return (
        <div className="sensor">
            <div className="sensor-header">
                <div className="sensor-1">
                    <div>
                        <p className="title-1">Nhiệt độ</p>
                        <FontAwesomeIcon icon={faTemperatureLow} className="icon-1" />
                    </div>
                    <p style={{fontSize: "40px"}} className="mota">{sensorData ? `${sensorData.Temp}` : "Loading..."}</p>
                    <p style={{ fontSize: "20px", paddingLeft: "5px", paddingTop: "39px" }}>°C</p>
                </div>
                <div className="sensor-2">
                    <div>
                        <p className="title-1">Độ ẩm</p>
                        <FontAwesomeIcon icon={faDroplet} className="icon-2" />
                    </div>
                    <p style={{fontSize: "40px"}} className="mota">{sensorData ? `${sensorData.Humidity}` : "Loading..."}</p>
                    <p style={{ fontSize: "20px", paddingLeft: "5px", paddingTop: "39px" }}>%</p>
                </div>
                <div className="sensor-3">
                    <div>
                        <p className="title-1">Ánh sáng</p>
                        <FontAwesomeIcon icon={faLightbulb} className="icon-3" />
                    </div>
                    <div style={{ display: "flex" }}>
                    <p style={{fontSize: "40px"}} className="mota">{sensorData ? `${sensorData.Light}` : "Loading..."}</p>
                    <p style={{ fontSize: "20px", paddingLeft: "5px", paddingTop: "39px" }}>Lux</p>
                    </div>
                </div>
                <Warning></Warning>
            </div>
            <div className="sensor-footer">
                <div className="sensor-chart">
                    <ChartLine></ChartLine>
                </div>
                <div className="sensor-token">
                    <div className="sensor-token-1" style={{display: "flex"}}>
                        <div className="token-1"><p>Đèn</p>
                            <FontAwesomeIcon icon={faLightbulb} className="icon-6" /></div>
                        <SensorToggle3 deviceName="den" />
                    </div>
                    <div className="sensor-token-2" style={{display: "flex"}}>
                        <div className="token-1">
                            <p>Quạt</p>
                            <FontAwesomeIcon icon={faFan} className="icon-7" />
                        </div>
                        <SensorToggle3 deviceName="quat" />
                    </div>
                    <div className="sensor-token-3" style={{display: "flex"}}>
                        <div className="token-1">
                            <p>Điều hoà</p>
                            <FontAwesomeIcon icon={faWind} className="icon-8" />
                        </div>
                        <SensorToggle3 deviceName="dieu_hoa" />
                    </div>
                    {/* <div className="sensor-token-4" style={{display: "flex"}}>
                        <div className="token-1">
                            <p>Gió</p>
                            <FontAwesomeIcon icon={faWind} className="icon-9" />
                        </div>
                        <SensorToggle3 />
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Sensor;