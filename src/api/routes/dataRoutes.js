import express from "express";
import { sql, poolPromise } from "../config/connect_db.js";

const router = express.Router();

// API trả dữ liệu

//  Lấy toàn bộ dữ liệu cảm biến
router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : null;

        const sortBy = req.query.sortBy || "CreateAt";
        const sortOrder = req.query.sortOrder || "DESC";
        

        const allowedColumns = ["ID", "DeviceID", "Temp", "Humidity", "Light", "CreateAt"];
        const allowedOrders = ["ASC", "DESC"];
        if (!allowedColumns.includes(sortBy) || !allowedOrders.includes(sortOrder.toUpperCase())) {
            return res.status(400).json({ message: "Tham số sắp xếp không hợp lệ. Vui lòng nhập lại" });
        }

        console.log("sortOrder:", sortOrder);
        console.log("sortBy: ", sortBy);

        let query = `SELECT s.ID, s.Temp, s.Humidity, s.Light,
                            FORMAT(s.CreateAt, 'yyyy-MM-dd HH:mm:ss') AS CreateAt
                     FROM sensor_data s
                     ORDER BY ${sortBy} ${sortOrder}`;

        const request = pool.request();

        if (pageSize) {
            const offset = (pageNumber - 1) * pageSize;
            query += ` OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`;
            request.input("offset", sql.Int, offset);
            request.input("pageSize", sql.Int, pageSize);
        }

        const result = await request.query(query);

        res.json({
            page: pageNumber,
            pageSize: pageSize || "all",
            data: result.recordset
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





//  Lấy dữ liệu theo thông số (temp, humidity, light)
router.get("/parameter", async (req, res) => {
    try {
        const { type } = req.query;
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : null;
        const validParams = { "temp": "Temp", "humidity": "Humidity", "light": "Light"};

        const sortBy = req.query.sortBy || "CreateAt";
        const sortOrder = req.query.sortOrder || "DESC";

        const allowedColumns = ["ID", "DeviceID", "Temp", "Humidity", "Light", "CreateAt"];
        const allowedOrders = ["ASC", "DESC"];

        if (!allowedColumns.includes(sortBy) || !allowedOrders.includes(sortOrder.toUpperCase())) {
            return res.status(400).json({ message: "Tham số sắp xếp không hợp lệ. Vui lòng nhập lại" });

        }
        console.log("sortOrder:", sortOrder);
        console.log("sortBy: ", sortBy);

        const pool = await poolPromise;
        const query=`SELECT s.${validParams[type]} , 
                           FORMAT(s.CreateAt, 'yyyy-MM-dd HH:mm:ss') AS CreateAt 
                    FROM sensor_data s
                    JOIN sensor_device d ON s.DeviceID = d.DeviceID
                    ORDER BY ${sortBy} ${sortOrder}
                    OFFSET (@pageNumber - 1) * @pageSize ROWS
                    FETCH NEXT @pageSize ROWS ONLY`
                    ;

        // if (pageSize) {
        //     const offset = (pageNumber - 1) * pageSize;
        //     query += ` OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`;
        //     request.input("offset", sql.Int, offset);
        //     request.input("pageSize", sql.Int, pageSize);
        // }
        
        const result = await pool.request()
            .input("type", sql.NVarChar, type)
            .input("pageNumber", sql.Int, pageNumber)
            .input("pageSize", sql.Int, pageSize)
            .query(query);
        res.json({
            type: type,
            page: pageNumber,
            pageSize: pageSize || "all",
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});






// Lấy dữ liệu theo thiết bị (quạt, máy lạnh, đèn)
router.get("/device", async (req, res) => {
    try {
        const deviceName = (req.query.name || "").trim().toLowerCase();
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const deviceParams = {
            "quat": "s.Humidity AS Value",
            "dieu_hoa": "s.Temp AS Value",
            "den": "s.Light AS Value",
            // "do_bui": "s.Smog AS Value",
            // "toc_do_gio" "s.Wind AS Value"
        };

        if (!deviceParams[deviceName]) {
            return res.status(400).json({ message: `Thiết bị '${deviceName}' không hợp lệ! Chỉ chấp nhận: quat, dieu_hoa, den.` });
        }

        const query = `
            SELECT s.DeviceID, d.DeviceName, ${deviceParams[deviceName]}, 
                   FORMAT(s.CreateAt, 'yyyy-MM-dd HH:mm:ss') AS CreateAt
            FROM sensor_data s
            JOIN sensor_device d ON s.DeviceID = d.DeviceID
            WHERE d.DeviceName = @deviceName
            ORDER BY s.CreateAt
            OFFSET (@pageNumber - 1) * @pageSize ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `;

        const pool = await poolPromise;
        const result = await pool.request()
            .input("deviceName", sql.NVarChar, deviceName)
            .input("pageNumber", sql.Int, pageNumber)
            .input("pageSize", sql.Int, pageSize)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy dữ liệu cho thiết bị: ${deviceName}` });
        }

        res.json({
            page: pageNumber,
            pageSize: pageSize,
            device: deviceName,
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// lấy danh sách thiết bị theo trạng thái
router.get("/devices", async (req, res) => {
    try {
        const { name, status } = req.query;
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const pool = await poolPromise;
        const request = pool.request();

        let whereClause = "WHERE 1=1";

        if (name) {
            whereClause += " AND DeviceName LIKE @name";
            request.input("name", sql.NVarChar, `%${name}%`);
        }

        if (status) {
            const normalizedStatus = status.toUpperCase();
            if (normalizedStatus !== "ON" && normalizedStatus !== "OFF") {
                return res.status(400).json({ error: "Trạng thái không hợp lệ! Chỉ chấp nhận 'ON' hoặc 'OFF'." });
            }
            whereClause += " AND Statuss = @status";
            request.input("status", sql.NVarChar, normalizedStatus);
        }

        request.input("pageNumber", sql.Int, pageNumber);
        request.input("pageSize", sql.Int, pageSize);

        const query = `
            SELECT DeviceID, DeviceName, Statuss,
            FORMAT(TimeOfDay, 'yyyy-MM-dd HH:mm:ss') AS TimeOfDay   
            FROM sensor_device
            ${whereClause}
            ORDER BY TimeOfDay ASC
            OFFSET (@pageNumber - 1) * @pageSize ROWS
            FETCH NEXT @pageSize ROWS ONLY
        `;

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thiết bị phù hợp." });
        }

        res.json({
            page: pageNumber,
            pageSize: pageSize,
            data: result.recordset
        });
    } catch (err) {
        console.error("Lỗi API:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// lấy trạng thái mới nhất của thiết bị
router.get('/get_status', async (req, res) => {
    const { deviceName } = req.query;
    const pool = await poolPromise;
    const result = await pool.request()
        .input('deviceName', sql.NVarChar, deviceName)
        .query('SELECT TOP 1 Statuss FROM sensor_device WHERE DeviceName = @deviceName ORDER BY TimeOfDay DESC');
    if (result.recordset.length > 0) {
        res.json({ status: result.recordset[0].Statuss }); 
    } else {
        res.json({ status: "off" }); 
    }
});




// lấy toàn bộ danh sách thiết bị
router.get("/devices_all", async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : null;
        const offset = (pageNumber - 1) * (pageSize ?? 0);

        const pool = await poolPromise;
        const request = pool.request();

        let query = `
            SELECT DeviceID, DeviceName, Statuss,
            FORMAT(TimeOfDay, 'yyyy-MM-dd HH:mm:ss') AS TimeOfDay
            FROM sensor_device
            ORDER BY TimeOfDay ASC
        `;

        if (pageSize) {
            query += ` OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY`;
            request.input("offset", sql.Int, offset);
            request.input("pageSize", sql.Int, pageSize);
        }

        const result = await request.query(query);

        res.json({
            page: pageNumber,
            pageSize: pageSize ?? "all",
            data: result.recordset
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});








// tìm kiếm theo dữ liệu và trả về bản ghi
router.get('/search', async (req, res) => {
    try {
        const { parameter, value, min, max } = req.query;
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const pool = await poolPromise;

        if (!parameter) {
            return res.status(400).json({ message: "Thiếu tham số parameter." });
        }

        let column = "";
        switch (parameter.toLowerCase()) {
            case "temp":
                column = "s.Temp";
                break;
            case "humidity":
                column = "s.Humidity";
                break;
            case "light":
                column = "s.Light";
                break;
            case "time":
                column = "s.CreateAt";
                break;
            default:
                return res.status(400).json({ error: "Tham số không hợp lệ! Chỉ chấp nhận: temp, humidity, light, time." });
        }

        let query = "";
        let request = pool.request();

        if (column === "s.CreateAt") {
            // Tìm theo thời gian
            if (min && max) {
                query = `
                    SELECT s.Temp, s.Humidity, s.Light, FORMAT(s.CreateAt, 'yyyy-MM-dd HH:mm:ss') AS CreateAt
                    FROM sensor_data s
                    WHERE s.CreateAt BETWEEN @min AND @max
                    ORDER BY s.CreateAt DESC
                    OFFSET (@pageNumber - 1) * @pageSize ROWS
                    FETCH NEXT @pageSize ROWS ONLY
                `;
                request.input("min", sql.DateTime, new Date(min));
                request.input("max", sql.DateTime, new Date(max));
            } else if (value) {
                query = `
                    SELECT s.Temp, s.Humidity, s.Light, FORMAT(s.CreateAt, 'yyyy-MM-dd HH:mm:ss') AS CreateAt
                    FROM sensor_data s
                    WHERE CONVERT(VARCHAR, s.CreateAt, 120) = @value
                    ORDER BY s.CreateAt DESC
                    OFFSET (@pageNumber - 1) * @pageSize ROWS
                    FETCH NEXT @pageSize ROWS ONLY
                `;
                request.input("value", sql.VarChar, value);
            } else {
                return res.status(400).json({ message: "Thiếu 'value' hoặc 'min' và 'max' cho kiểu thời gian." });
            }
        } else {
            // Tìm theo giá trị cảm biến
            if (min && max) {
                query = `
                    SELECT ${column} AS Value, FORMAT(s.CreateAt, 'yyyy-MM-dd HH:mm:ss') AS CreateAt
                    FROM sensor_data s
                    WHERE ${column} BETWEEN @min AND @max
                    ORDER BY s.CreateAt DESC
                    OFFSET (@pageNumber - 1) * @pageSize ROWS
                    FETCH NEXT @pageSize ROWS ONLY
                `;
                request.input("min", sql.Float, parseFloat(min));
                request.input("max", sql.Float, parseFloat(max));
            } else if (value) {
                query = `
                    SELECT ${column} AS Value, FORMAT(s.CreateAt, 'yyyy-MM-dd HH:mm:ss') AS CreateAt
                    FROM sensor_data s
                    WHERE ${column} = @value
                    ORDER BY s.CreateAt DESC
                    OFFSET (@pageNumber - 1) * @pageSize ROWS
                    FETCH NEXT @pageSize ROWS ONLY
                `;
                request.input("value", sql.Float, parseFloat(value));
            } else {
                return res.status(400).json({ message: "Thiếu 'value' hoặc 'min' và 'max' cho kiểu cảm biến." });
            }
        }

        request.input("pageNumber", sql.Int, pageNumber);
        request.input("pageSize", sql.Int, pageSize);

        const result = await request.query(query);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy dữ liệu phù hợp." });
        }

        res.json({
            page: pageNumber,
            pageSize: pageSize,
            data: result.recordset
        });
    } catch (err) {
        console.error("Lỗi API:", err.message);
        res.status(500).json({ error: err.message });
    }
});





// phân trang
router.get("/page", async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        
        const sortBy = req.query.sortBy || "CreateAt";
        const sortOrder = req.query.sortOrder || "DESC"

        const allowedColumns = ["ID", "Temp", "Humidity", "Light", "CreateAt"];
        const allowedOrders = ["ASC", "DESC"];

        if (!allowedColumns.includes(sortBy) || !allowedOrders.includes(sortOrder.toUpperCase())) {
            return res.status(400).json({ message: "Tham số sắp xếp không hợp lệ. Vui lòng nhập lại" });

        }
        console.log("sortOrder:", sortOrder);
        console.log("sortBy: ", sortBy);

        const pool = await poolPromise;
        const query = `
            SELECT ID, Temp, Humidity, Light, FORMAT(CreateAt, 'yyyy-MM-dd HH:mm:ss') AS CreateAt
            FROM sensor_data
            ORDER BY ${sortBy} ${sortOrder}
            OFFSET (@pageNumber - 1) * @pageSize ROWS
            FETCH NEXT @pageSize ROWS ONLY;
        `;

        const result = await pool.request()
            .input("pageNumber", sql.Int, pageNumber)
            .input("pageSize", sql.Int, pageSize)
            .query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không có dữ liệu trên trang này" });
        }

        res.json({
            page: pageNumber,
            pageSize: pageSize,
            data: result.recordset
        });
    } catch (err) {
        console.error("Lỗi API:", err.message);
        res.status(500).json({ error: err.message });
    }
});



export default router;
