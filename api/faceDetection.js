import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const calculateFaceLocation = (data) => {
  return data.outputs[0].data.regions.map((region) => {
    const clarifaiFace = region.region_info.bounding_box;
    return {
      leftCol: clarifaiFace.left_col,
      topRow: clarifaiFace.top_row,
      rightCol: 1 - clarifaiFace.right_col,
      bottomRow: 1 - clarifaiFace.bottom_row,
    };
  });
};

const callClarifaiApi = async (imageUrl) => {
  const PAT = process.env.CLARIFAI_API_KEY;
  const USER_ID = "clarifai";
  const APP_ID = "main";
  const MODEL_ID = "face-detection";
  const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl,
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

  const response = await fetch(
    "https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    requestOptions
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  const result = await response.json();
  return result;
};

export { calculateFaceLocation, callClarifaiApi };
