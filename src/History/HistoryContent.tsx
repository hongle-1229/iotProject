import { Card, Table } from "antd";
import { deviceHistory } from "../assets/data/dataActivity";
import React, { useEffect, useState } from "react";
import SearchDevice from "../Layout/SearchDevice";
import axios from "axios";
import Filter2 from "../Layout/Filter2";

interface DataDevice{
    DeviceID: number;
    DeviceName: string;
    Statuss: string;
    TimeOfDay: string;
}

const HistoryContent = () => {
    const [dataDevice, setDataDevice] = useState<DataDevice[]>([]);
    const [filterField, setFilterField] = useState<string>("all");

    const fetchData = (type:string)=>{
        let url = "http://localhost:3000/api/data/devices_all";
        if (type != "all"){
            url = `http://localhost:3000/api/data/devices?status=${type}`;
        }
        axios
            .get<{data: DataDevice[]}>(url)
            .then((response) => {
                console.log("API response: ", response.data);
                setDataDevice(response.data.data);
            })
            .catch((error) => console.log("Lỗi lấy dữ liệu: ", error));
    }

    useEffect(()=>{
        fetchData(filterField);
    }, [filterField]);

    const baseColumn = [
        {
            title: "DeviceID", dataIndex: "DeviceID", key: "DeviceID" 
        },
        {
            title: "Thời gian", dataIndex: "TimeOfDay", key: "TimeOfDay"
        }
    ]

    const fieldMap: Record<string, {title:string, dataIndex: keyof DataDevice}[]> = {
        on: [
        { title: "Tên thiết bị", dataIndex: "DeviceName" },
        { title: "Hoạt động", dataIndex: "Statuss" },
    ],
    off: [
        { title: "Tên thiết bị", dataIndex: "DeviceName" },
        { title: "Hoạt động", dataIndex: "Statuss" },
    ],

    };

    const columns = filterField === "all" ? [
        ...baseColumn,
        // { title: "DeviceID", dataIndex: "DeviceID", key: "DeviceID" },
        { title: "Tên thiết bị", dataIndex: "DeviceName", key: "DeviceName" },
        // { title: "Thời gian", dataIndex: "TimeOfDay", key: "TimeOfDay" },
        { title: "Hoạt động", dataIndex: "Statuss", key: "Statuss" },
    ] : [
        ...baseColumn,
        ...(fieldMap[filterField] || []).map(col => ({ ...col, key: col.dataIndex }))
    ];


    const [currentPage, setCurrentPage] = React.useState(1);
    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        console.log(`Đang ở trang: ${page}, Số phần tử mỗi trang: ${pageSize}`);
    };
    return (
        <Card title="Lịch sử hoạt động"
            style={{
                marginTop: "80px"
            }}
            extra={
                <div style={{ display: "flex", gap: "10px" }}>
                    <SearchDevice />
                    <Filter2 onFilterChange={setFilterField} />
                </div>
            }
        >
            <Table dataSource={dataDevice} columns={columns} pagination={{
                current: currentPage, // Trang hiện tại
                pageSize: 5, // Số phần tử mỗi trang
                pageSizeOptions: [5],
                total: deviceHistory.length,
                onChange: handlePageChange, // Sự kiện thay đổi trang
            }} />
            {/* <Pagination></Pagination> */}
        </Card>
    );
};

export default HistoryContent;
