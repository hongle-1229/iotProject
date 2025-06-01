// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "antd/dist/reset.css";
// import App from './App.tsx'
// import Dashboard from './Home/Dashboard.tsx'
import { BrowserRouter } from 'react-router-dom'
import App from './App';
// import Login from './Log/Login';
import React from 'react';
// import HistoryActivity from './History/HistoryActivity.tsx';
// import HistoryActivity from './History/HistoryActivity.tsx'
// import Dashboard from './Home/Dashboard.tsx';
// import Profile from './Profile/Profile.tsx'
// import Dashboard from './Home/Dashboard.tsx'
// import Profile from './Profile/Profile.tsx'
// import Dashboard from './Home/Dashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <BrowserRouter>
    <App />
    {/* <Login></Login> */}
  </BrowserRouter>
</React.StrictMode>
)
