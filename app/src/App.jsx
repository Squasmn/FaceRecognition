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
  handleSignIn: PropTypes.func.isRequired,
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
      id: data.id,
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
  };

  const handleRegister = (newUser) => {
    setUser(newUser);
    setIsSignedIn(true);
  };
  console.log("users:", user);

  const calculateFaceLocation = (data) => {
    return data.outputs[0].data.regions.map((region) => {
      const clarifaiFace = region.region_info.bounding_box;
      const image = document.getElementById("inputimage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };

  const displayFaceBoxes = (boxes) => {
    setFaceBoxes(boxes);
  };

  const onSubmit = () => {
    setImageUrl(input);
    fetch("http://localhost:3000/image", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
      }),
    })
      .then((response) => response.json())
      .then((count) => {
        setUser((prevState) => {
          return { ...prevState, entries: count };
        });
      })
      .catch(console.log);
  };

  useEffect(() => {
    if (imageUrl) {
      console.log("imageUrl:", imageUrl);
      const PAT = process.env.REACT_APP_CLARIFY_API_KEY;
      const USER_ID = "clarifai";
      const APP_ID = "main";
      const MODEL_ID = "face-detection";
      const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
      const IMAGE_URL = imageUrl;
      console.log("IMAGE_URL:", IMAGE_URL);

      const raw = JSON.stringify({
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        inputs: [
          {
            data: {
              image: {
                url: IMAGE_URL,
              },
            },
          },
        ],
      });

      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Key " + PAT,
        },
        body: raw,
      };

      fetch(
        "https://api.clarifai.com/v2/models/" +
          MODEL_ID +
          "/versions/" +
          MODEL_VERSION_ID +
          "/outputs",
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(JSON.stringify(error));
            });
          }
          return response.json();
        })
        .then((result) => {
          if (result.outputs && result.outputs.length > 0) {
            console.log(result.outputs[0].data.regions);
            const faceLocations = calculateFaceLocation(result); // Calculate face locations
            displayFaceBoxes(faceLocations); // Update faceBoxes state
          } else {
            console.error("Error: No outputs found in response");
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }, [imageUrl]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="App">
      <ParticlesBg color="#800080" num={150} type="cobweb" bg={true} />
      <NavigationWrapper
        isSignedIn={isSignedIn}
        handleSignIn={handleSignIn}
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
