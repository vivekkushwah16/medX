import React, { useContext, useEffect, useState } from "react";
import { eventContext } from "../../../../Context/Event/EventContextProvider";
import ButtonWithLoader from "../../../ButtonWithLoader/ButtonWithLoader";
import ReadMore from "../../../ReadMore/ReadMore";
import swal from "sweetalert";
export default function PartnerWithUsCard(props) {
  const { data, countIn, agreedData } = props;
  const { getPartnerWithUsAgreeStatus } = useContext(eventContext);
  // const [alreadyAgreed, setAlreadyAgreed] = useState(false)
  const [buttonState, setButtonState] = useState(false);

  useEffect(() => {
    if (agreedData) {
      // console.log(agreedData, data.id, agreedData.hasOwnProperty(data.id))
      if (agreedData.hasOwnProperty(data.id)) {
        updateCountIn(agreedData[data.id]);
      } else {
        updateCountIn(false);
      }
    }
  }, [agreedData]);

  // useEffect(() => {
  //     try {
  //         readCountData()
  //     } catch (error) {
  //         console.log(error)
  //     }
  //     return (() => {
  //         console.log("Unmounting --", data.id)
  //     })
  // }, [])

  const updateCountIn = (val) => {
    // console.log(data.id + " " + val);
    setButtonState(val);
  };

  const readCountData = async () => {
    try {
      let status = await getPartnerWithUsAgreeStatus(data.id);
      updateCountIn(status);
    } catch (error) {
      console.log(error);
    }
  };

  const count = () => {
    return new Promise(async (res, rej) => {
      try {
        await countIn(data.eventId, data.id);
        setButtonState(true);
        res();
      } catch (error) {
        rej(error);
      }
    });
  };

  return (
    <div className="partnerBox__item" key={`partnerWithUs-${data.id}`}>
      <div
        className="partnerBox__item-pic"
        key={`partnerWithUs-${data.id}-image`}
      >
        <img src={data.thumbnailUrl} alt="" />
      </div>
      <div
        className="partnerBox__item-text"
        key={`partnerWithUs-${data.id}-text`}
      >
        <h3 className="partnerBox__item-title mg-b20">{data.title}</h3>
        <ReadMore
          className="partnerBox__item-desc mg-b20"
          description={data.description}
          limit={100}
        />
        {/* <h3 className="partnerBox__item-title mg-b20">{data.subTitle}</h3>
                <ReadMore className="partnerBox__item-desc mg-b20" description={data.subDesciption} limit={100} /> */}
        <div className="partnerBox__item-action">
          <ButtonWithLoader
            className="btn btn-sm btn-secondary"
            name={buttonState ? "Thanks" : "Count me in"}
            disabled={buttonState}
            handleClick={() => {
              return new Promise(async (res, rej) => {
                await countIn(data.eventId, data.id);
                res();
                swal(
                  "Thank you for reaching out. We will be in touch shortly."
                );
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
