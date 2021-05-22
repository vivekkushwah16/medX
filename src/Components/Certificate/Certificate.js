import React, { createRef, useContext } from "react";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader";
import "./Certificate.css";
import html2canvas from "html2canvas";
import canvasToImage from "canvas-to-image";

export default function Certificate(props) {
  const { addClickAnalytics } = props.data;
  const { user } = useContext(UserContext);
  const certificatBody = createRef(null);

  const downloadCert = async () => {
    if (certificatBody.current) {
      const canvas = await html2canvas(certificatBody.current);
      canvasToImage(canvas, {
        name: "certificate",
        type: "jpg",
        quality: 0.7,
      });
      addClickAnalytics();
    }
  };

  return (
    <div className="certificateContainer" ref={certificatBody}>
      <img
        src="/assets/images/EvolveCertificate.png"
        width="100%"
        height="auto"
        className="certificate"
      />
      <span class="your_name" id="your_name">
        {user.displayName}
      </span>
      <ButtonWithLoader
        className="btn btn-secondary certDownload"
        name={"Download"}
        handleClick={downloadCert}
      />
    </div>
  );
}
