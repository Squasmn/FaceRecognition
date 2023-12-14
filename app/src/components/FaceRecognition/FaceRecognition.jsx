import styles from "./FaceRecognition.module.css";
import PropTypes from "prop-types";

export default function FaceRecognition({ imageUrl, faceBoxes }) {
  console.log(faceBoxes);
  return (
    <div className="center ma">
      <div className="absolute mt2" style={{ position: "relative" }}>
        <img
          id="inputimage"
          className={styles.inputimage}
          alt="Picture of a face or more"
          src={imageUrl}
        />
        {faceBoxes.map((box, index) => (
          <div
            key={index}
            className={styles["bounding-box"]}
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

FaceRecognition.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  faceBoxes: PropTypes.array.isRequired, // Change this to array
};
