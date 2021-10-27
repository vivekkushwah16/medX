import React, { createRef, useContext, useState } from "react";
import { UserContext } from "../../Context/Auth/UserContextProvider";
import ButtonWithLoader from "../ButtonWithLoader/ButtonWithLoader";
import "./Certificate.css";
import html2canvas from "html2canvas";
import canvasToImage from "canvas-to-image";

export default function Certificate(props) {
  const { addClickAnalytics, event } = props.data;
  const { user } = useContext(UserContext);
  const certificatBody = createRef(null);
  const certificatDownloadBtn = createRef(null);

  const downloadCert = async () => {
    if (certificatBody.current) {
      // console.log(certificatDownloadBtn.current)
      if (certificatDownloadBtn.current) {
        certificatDownloadBtn.current.style.display = 'none'
      }
      const canvas = await html2canvas(certificatBody.current, {
        allowTaint: true,
        useCORS: true,
      });
      // document.body.appendChild(canvas);
      canvasToImage(canvas, {
        name: "certificate",
        type: "jpg",
        quality: 0.7,
      });
      addClickAnalytics();
      if (certificatDownloadBtn.current) {
        certificatDownloadBtn.current.style.display = ''
      }
    }
  };

  return (
    <div className="certificateContainer" ref={certificatBody}>
      <img
        // src={`/assets/images/certificate.jpg`}
        src={`https://storage.googleapis.com/cipla-impact.appspot.com/${event}/certificate.jpg`}
        width="100%"
        height="auto"
        className="certificate"
        alt=""
      />
      <span className="your_name" id="your_name">
        {user.displayName}
      </span>
      <ButtonWithLoader
        className="btn btn-secondary certDownload"
        name={"Download"}
        handleClick={downloadCert}
        refBtn={certificatDownloadBtn}
      />
    </div>
  );
}
