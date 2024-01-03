import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Nav/Navigation.jsx";
import "tachyons";
import Logo from "./components/Logo/Logo.jsx";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.jsx";
import Rank from "./components/Rank/Rank.jsx";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.jsx";
import ParticlesBg from "particles-bg";
import SignIn from "./components/SignIn/SignIn.jsx";
import Register from "./components/Register/Register.jsx";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

const NavigationWrapper = ({ isSignedIn, handleSignOut }) => {
  return <Navigation isSignedIn={isSignedIn} onSignOut={handleSignOut} />;
};

NavigationWrapper.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  handleSignOut: PropTypes.func.isRequired,
};

const AppContent = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [faceBoxes, setFaceBoxes] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  const loadUser = (data) => {
    setUser({
      id: data._id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  const handleSignIn = () => {
    setIsSignedIn(true);
    navigate("/");
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    navigate("/signin");

    // Reset state
    setInput("");
    setImageUrl("");
    setFaceBoxes([]);
    setUser({
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    });
  };

  const handleRegister = (newUser) => {
    setUser(newUser);
    setIsSignedIn(true);
  };

  const displayFaceBoxes = (boxes) => {
    setFaceBoxes(boxes);
  };

  const onSubmit = () => {
    setImageUrl(input);
    fetch("http://localhost:3000/image", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id, imageUrl: input }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.entries) {
          setUser((prevState) => ({ ...prevState, entries: data.entries }));
        }
        return fetch("http://localhost:3000/imageurl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input }),
        });
      })
      .then((response) => response.json())
      .then((faceLocations) => {
        displayFaceBoxes(faceLocations);
      })
      .catch(console.log);
  };

  useEffect(() => {
    setImageUrl(input);
  }, [input]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setFaceBoxes([]); // Reset faceBoxes state
  };

  return (
    <div className="App">
      <ParticlesBg color="#800080" num={150} type="cobweb" bg={true} />
      <NavigationWrapper
        isSignedIn={isSignedIn}
        handleSignOut={handleSignOut}
      />

      <Routes>
        <Route
          path="/signin"
          element={
            isSignedIn ? (
              <Navigate to="/" />
            ) : (
              <SignIn onSignIn={handleSignIn} loadUser={loadUser} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isSignedIn ? (
              <Navigate to="/" />
            ) : (
              <Register onRegister={handleRegister} />
            )
          }
        />
        <Route
          path="/"
          element={
            isSignedIn ? (
              <>
                <Logo />
                <Rank name={user.name} entries={user.entries} />
                <ImageLinkForm
                  input={input}
                  setinput={setInput}
                  onInputChange={handleInputChange}
                  onSubmit={onSubmit}
                />
                <FaceRecognition
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  faceBoxes={faceBoxes}
                />
              </>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
