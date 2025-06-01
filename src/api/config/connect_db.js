import sql from "mssql";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Xác định đường dẫn tuyệt đối đến thư mục gốc dự án
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Debug: Kiểm tra giá trị biến môi trường
console.log("🟢 DB_SERVER:", process.env.DB_SERVER);
console.log("🟢 DB_USER:", process.env.DB_USER);
console.log("🟢 DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("🟢 DB_DATABASE:", process.env.DB_DATABASE);

const config = {
    server: process.env.DB_SERVER || "MISSING_SERVER",
    database: process.env.DB_DATABASE || "MISSING_DATABASE",
    user: process.env.DB_USER || "MISSING_USER",
    password: process.env.DB_PASSWORD || "MISSING_PASSWORD",
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === "true"
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("✅ Connected to SQL Server successfully!");
        return pool;
    })
    .catch(err => {
        console.error("❌ DB connect failed:", err);
    });

export { sql, poolPromise };
