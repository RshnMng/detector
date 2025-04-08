import { pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;
env.useBrowserCache = false;
import React, { useState, useEffect } from "react";

export default function App() {
  const [pipeLoading, isPipeLoading] = useState(false);
  const [detector, setDetector] = useState([]);
  const [url, setUrl] = useState("#");
  const [photo, isPhoto] = useState(false);
  const [photoChosen, isPhotoChosen] = useState(false);
  const [photoLoading, isPhotoLoading] = useState(false);

  function getUrl(event) {
    let files = event.target.files[0];
    let url = URL.createObjectURL(files);
    setUrl(url);
    isPhoto(true);
  }

  function handleSubmit() {
    isPhotoChosen(true);
  }

  useEffect(() => {
    const getObjects = async () => {
      isPhotoLoading(true);
      const detectorFunc = detector[0];
      const detectedObjects = await detectorFunc(url, {
        threshold: 0.5,
        percentage: true,
      });
      detectedObjects.forEach((obj) => {
        isPhotoLoading(false);
        console.log(obj, "detection");
      });
    };

    photo === true && getObjects();
  }, [photoChosen]);

  useEffect(() => {
    const runPipeline = async () => {
      const detector = await pipeline("object-detection", "Xenova/yolos-tiny");
      setDetector([detector]);
      isPipeLoading(false);
    };

    isPipeLoading(true);
    runPipeline();
  }, []);

  return (
    <>
      <h1>{pipeLoading || photoLoading ? "Loading..." : "Ready"}</h1>
      {photo && <img src={url} className="loaded-image" />}
      <input type="file" onChange={(event) => getUrl(event)}></input>
      <button onClick={handleSubmit}>submit</button>
      {photoLoading ? <h2>detecting objects</h2> : <h2>done</h2>}
    </>
  );
}
