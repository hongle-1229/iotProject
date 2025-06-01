import { Card, Table } from "antd";
import React, { useEffect, useState } from "react";
// import { dataDevice } from "../assets/data/dataSensor";
import SearchDevice from "../Layout/SearchDevice";
import Filter from "../Layout/Filter";
import axios from "axios";

interface AllDataSensor {
    ID: number;
    Temp?: number;
    Light?: number;
    Humidity?: number;
    CreateAt: string;
    // Smog?: number;
    // Wind?: number;
}

const DataContent = () => {
    const [allDataSensor, setAllDataSensor] = useState<AllDataSensor[]>([]);
    const [filterField, setFilterField] = useState<string>("all");

    const fetchData = (type: string) =>{
        let url = "http://localhost:3000/api/data";
        if (type!== "all"){
            url = `http://localhost:3000/api/data/parameter?type=${type}`;
        } 

        axios
            .get<{ data: AllDataSensor[] }>(url)
            .then((response) => {
                console.log("API response: ", response.data);
                setAllDataSensor(response.data.data);
            })
            .catch((error) => console.log("Lỗi lấy dữ liệu: ", error));
    }

    useEffect(() => {
        // fetchData(filterField)
        setInterval(()=>{
            fetchData(filterField);
        }, 2000);
    }, [filterField]);

    const baseColumn = [
        {
            title: "ID", dataIndex: "ID", key: "ID" 
        },
        {
            title: "Thời gian", dataIndex: "CreateAt", key: "CreateAt"
        }
    ]

    const fieldMap: Record<string, {title: string, dataIndex: keyof AllDataSensor}> = {
        temp: { title: "Nhiệt độ (°C)", dataIndex: "Temp"},
        humidity: { title: "Độ ẩm (%)", dataIndex: "Humidity"},
        light: { title: "Ánh sáng (Lux)", dataIndex: "Light"},
        // smog: { title: "Độ bụi (µg/m³)", dataIndex: "Smog"},
        // wind: { title: "Tốc độ gió (km/h)", dataIndex: "Wind"}
    };

    const columns = filterField === "all" ? [
        ...baseColumn,
        { title: "Nhiệt độ (°C)", dataIndex: "Temp", key: "Temp" },
        { title: "Độ ẩm (%)", dataIndex: "Humidity", key: "Humidity" },
        { title: "Ánh sáng (Lux)", dataIndex: "Light", key: "Light" },
        // { title: "Độ bụi (µg/m³)", dataIndex: "Smog", key: "Smog"},
        // { title: "Tốc độ gió (km/h)", dataIndex: "Wind", key: "Wind" }
    ] : [
        ...baseColumn,
        fieldMap[filterField] ? fieldMap[filterField] : {}
    ];
    
    

    const [currentPage, setCurrentPage] = React.useState(1);
    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        console.log(`Đang ở trang: ${page}, Số phần tử mỗi trang: ${pageSize}`);
    };

    return (
        <Card title="Dữ liệu cảm biến"
            style={{
                marginTop: "80px"
            }}
            extra={
                <div style={{ display: "flex", gap: "10px" }}>
                    <SearchDevice />
                    <Filter onFilterChange={setFilterField} />
                </div>
            }
        >
            <Table
                rowKey="ID"
                dataSource={allDataSensor}
                columns={columns}
                pagination={{
                    current: currentPage,
                    pageSize: 7,
                    total: allDataSensor.length,
                    onChange: handlePageChange,
                }}
            />

        </Card>
    );
};

export default DataContent;
