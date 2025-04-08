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

  function getUrl(event) {
    let files = event.target.files[0];
    let url = URL.createObjectURL(files);
    setUrl(url);
    isPhoto(true);
  }

  function handleSubmit() {
    isPipeLoading(true);
  }

  useEffect(() => {
    const getObjects = async () => {
      const detectedObjects = await detector[0](url);
      console.log(detectedObjects, "detected");
    };

    getObjects();
  }, [photoChosen]);

  useEffect(() => {
    const runPipeline = async () => {
      const detector = await pipeline("object-detection", "Xenova/yolos-tiny");
      setDetector([detector]);
      isPipeLoading(false);
      photoChosen(false);
    };

    isPipeLoading(true);
    runPipeline();
  }, []);

  return (
    <>
      <h1>{pipeLoading ? "Loading..." : "Ready!"}</h1>
      {photo && <img src={url} className="loaded-image" />}
      <input type="file" onChange={(event) => getUrl(event)}></input>
      <button onClick={handleSubmit}>submit</button>
    </>
  );
}
