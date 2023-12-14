import { Link, useLocation } from "react-router-dom";
import "./Navigation.module.css";

const Navigation = ({ onSignOut, isSignedIn }) => {
  const location = useLocation();

  let navigationLink;
  if (location.pathname === "/signin") {
    navigationLink = (
      <Link to="/register" className="f3 link dim black underline pa3 pointer">
        Register
      </Link>
    );
  } else if (location.pathname === "/register") {
    navigationLink = (
      <Link to="/signin" className="f3 link dim black underline pa3 pointer">
        Sign In
      </Link>
    );
  } else if (isSignedIn) {
    navigationLink = (
      <p
        onClick={onSignOut}
        className="f3 link dim black underline pa3 pointer"
      >
        Sign Out
      </p>
    );
  }

  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      {navigationLink}
    </nav>
  );
};

export default Navigation;
