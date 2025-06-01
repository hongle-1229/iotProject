import express from "express";
import {sql, poolPromise} from "../config/connect_db.js";
// const { message } = require('antd');

const router = express.Router();

// lay toan bo danh sach nguoi dung
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const rerult = await pool.request()
            .query("SELECT UserID, UserName, Email FROM users");
        res.json(rerult.recordset);
    } catch (error) {
        res.status(500).json({error: error.mesage});
    }
})

//
router.get('/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query("SELECT UserID, UserName, Email FROM users WHERE UserID = @userId")
        if (result.recordset.length ===0){
            return res.status(404).json({message: "Not found user"});
        }
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({error: err.mesage});
    }    
})

export default router;