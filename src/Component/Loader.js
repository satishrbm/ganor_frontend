import React from "react";
import LoaderGif from "../Assets/img/loader.gif";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#ae90ff7a",
        width: "100%",
        height: "100%",
        zIndex: "9999999999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={LoaderGif}
        style={{
          display: "block",
          width: "150px",
          height: "150px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default Loader;
