import styles from "./FaceRecognition.module.css";
import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";

export default function FaceRecognition({ imageUrl, faceBoxes }) {
  const imageRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, [imageUrl]);

  return (
    <div className="center ma">
      <div className="absolute mt2" style={{ position: "relative" }}>
        <img
          ref={imageRef}
          id="inputimage"
          className={styles.inputimage}
          alt="Picture of a face or more"
          src={imageUrl}
          onLoad={() => setImageLoaded(true)}
        />
        {imageLoaded &&
          faceBoxes.map((box, index) => {
            const width = Number(imageRef.current?.width);
            const height = Number(imageRef.current?.height);
            const topRow = box.topRow * height;
            const rightCol = box.rightCol * width;
            const bottomRow = box.bottomRow * height;
            const leftCol = box.leftCol * width;

            return (
              <div
                key={index}
                className={styles["bounding-box"]}
                style={{
                  top: topRow,
                  right: rightCol,
                  bottom: bottomRow,
                  left: leftCol,
                }}
              ></div>
            );
          })}
      </div>
    </div>
  );
}

FaceRecognition.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  faceBoxes: PropTypes.array.isRequired,
};
