import "../style/Header.css"
export const Header = () => {
  return (
    <div className="header">
      <div style={{ display: "flex" }}>
        <img src="/src/assets/image/IOT.png" alt="logo" style={{marginLeft: "222px", borderRadius: "100%", height: "45px", marginTop: "2px"}}/>
        <h1 className="title">IoT Project</h1>
      </div>
      <div className="profile-mini">
        <img src="/src/assets/image/z6299993648768_612a376b3a70a22140f8ffe85c4078af.jpg" alt="" className="image-profile" />
        <p className="name-profile">Hong Lee</p>
      </div>
    </div>
  );
};

export default Header;