import express from "express";
import {sql, poolPromise} from "../config/connect_db.js";
// const { message } = require('antd');

const router = express.Router();

// lấy toàn bộ thiết bị
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query("SELECT * FROM sensor_device");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

// lấy từng thiết bị
router.get('/:deviceId', async (req, res) => {
    try {
        const {deviceId} = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('deviceId', sql.Int, deviceId) // dung input de tranh sql injection
            .query("SELECT DeviceID, DeviceName FROM sensor_device WHERE DeviceID = @deviceId");
        if (result.recordset.length ===0){
            return res.status(404).json({message: "Not found device"});
        }
        res.json(result.recordset[0]); // tra ve thong tin thiet bi
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})
export default router;