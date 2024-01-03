import styles from "./ImageLinkForm.module.css";
import PropTypes from "prop-types";

const ImageLinkForm = ({ onInputChange, onSubmit }) => {
  return (
    <div>
      <p className="center f3 pa5 white">
        This App detects faces in your pictures. Give it a try!
      </p>
      <div className="center">
        <div className={`${styles.form} center pa4 br3 shadow-5`}>
          <input
            onChange={onInputChange}
            className="f4 pa2 w-70 center"
            type="text"
          />
          <button
            onClick={onSubmit}
            className="w-30 grow f4 link ph3 pv2 dib white bg-purple"
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

ImageLinkForm.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ImageLinkForm;
