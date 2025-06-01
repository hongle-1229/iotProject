import "../style/ProfileContent.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const ProfileContent = () => {
    return (
        <div className="information">
            <div className="left-info">
                <img src="/src/assets/image/z6299993648768_612a376b3a70a22140f8ffe85c4078af.jpg" alt="" className="image-pro" />
                <p className="markazi-text">Hoàng Thị Hồng Lê</p>
                <p className="markazi-text">MSV: B21DCPT139</p>
                <p className="markazi-text">Email: hongle1229@gmail.com</p>
                <p className="markazi-text" style={{paddingBottom:"20px"}}>Sđt: 036......</p>
                <div style={{paddingLeft:"90px"}}>
                <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
                <a className="markazi-text git-link" href="https://github.com/hongle-1229" target="_blank" rel="noopener noreferrer">Git Link</a>
                </div>
            </div>
            <div className="right-info">
                <div className="top">
                    <div className="activity">
                    </div>
                    <div className="activity">
                        <img src="/src/assets/image/IOT.png" alt="" style={{height: "200px", marginLeft: "20px", marginTop: "20px"}}/>
            
                    </div>
                </div>
                <div className="bottom">
                    <div className="activity">
                        haha
                    </div>
                    <div className="activity">
                        haha
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;