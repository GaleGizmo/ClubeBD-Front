import React from "react";
import "./Loader.css";
import { ReactComponent as LoaderSVG } from "../../../src/Watchmen-smiley.svg";

const Loader = () => {
  return (
    <div className="loader-container">
      <LoaderSVG className="loader" />
    </div>
  );
};

export default Loader;
