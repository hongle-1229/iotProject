import { NavLink } from "react-router-dom";
import "../style/Navbar.css"

const Navbar = () => {
  return (
    <nav className="nav-bar">
      <ul>
        <li>
          <NavLink to="/" className="isActive">
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink to="/data-project" className={({ isActive }) => (isActive ? "active" : "")}>
            Dữ liệu cảm biến
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>
            Lịch sử hoạt động
          </NavLink>
        </li>
        <li>
            <NavLink to="/profile" className={({isActive}) => (isActive ? "active" : "")}>
            Hồ sơ
            </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
