import { useEffect, useState } from "react";
import axios from "axios";
import "../style/Warning.css"


export default function WarningDiv() {
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const fetchWarning = () => {
      axios.get("http://localhost:3000/api/devices_status/warning")
        .then(res => setWarning(res.data.warning === "on"))
        .catch(() => setWarning(false));
    };
    fetchWarning();
    const interval = setInterval(fetchWarning, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
        style={{backgroundColor: "red", width: "200px", marginLeft: "40px", padding: "40px 80px", borderRadius: "20px", color: "white", fontWeight: "800"}}
        className={warning ? "warning-blink" : ""}
    >
      {warning ? "CẢNH BÁO" : "KHÔNG"}
    </div>
  );
}
