import { Tilt } from "react-next-tilt";
import styles from "./Logo.module.css";
import LogoImage from "../../assets/DavDevDefinitive2.png";

const Logo = () => {
  return (
    <div className="tilt">
      <Tilt tiltMaxAngleX={30} tiltMaxAngleY={30} scale={1.2}>
        <img className={styles.logo} src={LogoImage} />{" "}
        {/* Use styles.logo to assign the class name */}
      </Tilt>
    </div>
  );
};

export default Logo;
