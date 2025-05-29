import { useEffect, useRef, useState } from "react";
import "./App.css";
import * as faceApi from "face-api.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [message, setMessage] = useState("");

  const onBrowserClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const loadModals = async () => {
      const ModalURL = "/models";
      await faceApi.nets.tinyFaceDetector.loadFromUri(ModalURL);
      await faceApi.nets.faceLandmark68Net.loadFromUri(ModalURL);
      await faceApi.nets.faceRecognitionNet.loadFromUri(ModalURL);
      await faceApi.nets.ageGenderNet.loadFromUri(ModalURL);
    };
    loadModals();
  }, []);

  const processFile = (file) => {
    const imageURL = URL.createObjectURL(file);
    const imageObject = new Image();
    imageObject.src = imageURL;

    imageObject.onload = async () => {
      const detections = await faceApi
        .detectAllFaces(imageObject, new faceApi.TinyFaceDetectorOptions())
        .withAgeAndGender();

      if (detections.length > 0) {
        setImage(imageURL);
        setAge(Math.round(detections[0].age));
        setGender(detections[0].gender);
        setMessage("");
      } else {
        setImage(imageURL);
        setAge(null);
        setGender(null);
        setMessage("Face is not detected!");
      }
    };
  };

  const handleClickFile = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="faceDetectionContainer">
      <div className="faceDetectionbox">
        <h5 className="faceTitle">Face, Age or Gender Detection!</h5>
        <p className="faceSubtitle">
          Application is trying to find your face, age or gender. Please upload
          a clear image of your face. Make sure your face is clearly visible and
          well-fit for accurate detection.
        </p>

        <div className="faceInputBox">
          <div
            className="dragBox"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16.004V17a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-8-.5v-11M15.5 8L12 4.5L8.5 8"
              />
            </svg>
            <p style={{ fontWeight: 500 }}>Drag & drop any file here</p>
            <span style={{ fontFamily: "cursive" }}>
              or
              <input
                type="file"
                name="facedetect"
                ref={fileInputRef}
                onChange={handleClickFile}
                className="faceDetectionInput form-control"
                accept="image/*"
                style={{ display: "none" }}
              />
              &nbsp;
              <label
                onClick={onBrowserClick}
                style={{ cursor: "pointer", color: "#0d6efd" }}
              >
                browse file
              </label>
              &nbsp;from device
            </span>
          </div>
          <button className="btn btn-primary detectButton">Upload</button>
        </div>

        <div className="uploadImage mt-4 text-center">
          {image && (
            <img src={image} alt="Uploaded Face" className="uploadImageBox" />
          )}
          {age != null && gender != null && (
            <p className="paragraphStyle">
              Detected a face estimated to be {age} years old and identified as{" "}
              {gender}
            </p>
          )}
          {image && (age == null || gender == null) && message && (
            <p className="paragraphStyle">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
