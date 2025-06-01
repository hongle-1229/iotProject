import { lazy } from "react";
import { RouteObject} from "react-router-dom";
// import { Navigate } from "react-router-dom";
import Dashboard from "../Home/Dashboard";

// kiem tra dang nhap
// const isAuthenticated = () => localStorage.getItem("isAuthenticated") === "true";

// Lazy load các trang con để tối ưu hiệu suất
// const Login = lazy(() => import("../Log/Login"));
const Home = lazy(() => import("../Home/Sensor"));
const DeviceData = lazy(() => import("../Dataset/DataContent"));
const ActivityHistory = lazy(() => import("../History/HistoryContent"));
const Profile = lazy(() => import("../Profile/ProfileContent"));

export const routes: RouteObject[] = [
  // {
  //   path: "/login",
  //   element: <Login></Login>
  // },
  {
    path: "/",
    // element: isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace></Navigate>,
    element: <Dashboard></Dashboard>,
    children: [
      { path: "", element: <Home /> },
      { path: "device-data", element: <DeviceData /> },
      { path: "activity-history", element: <ActivityHistory /> },
      { path: "profile", element: <Profile /> },
    ],
  }
  // {
  //   path: "*",
  //   element: <Navigate to="/login" replace></Navigate>
  // }
];
