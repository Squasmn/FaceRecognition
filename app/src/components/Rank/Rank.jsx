import "./Rank.module.css";
import PropTypes from "prop-types";

const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className="white f3 center ">
        {`${name}, your current entry count is...`}
      </div>
      <div className="white f1 center">
        {isNaN(entries) ? "No entries yet" : entries}
      </div>
    </div>
  );
};
Rank.propTypes = {
  name: PropTypes.string.isRequired,
  entries: PropTypes.number.isRequired,
};
export default Rank;
