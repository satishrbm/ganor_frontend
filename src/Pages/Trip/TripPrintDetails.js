import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@mui/material";

const TripPrintDetails = (props) => {
  const contentRef = useRef(null);
  const [totalBottle, setTotalBottle] = useState("");

  useEffect(() => {
    setTotalBottle(
      props?.printTripData?.reduce((acc, current) => {
        if (current.bottle_count !== null && !isNaN(current.bottle_count)) {
          return acc + current.bottle_count;
        }
        return acc;
      }, 0)
    );
  }, []);
  const generatePDF = () => {
    const content = contentRef.current;

    const pdf = {
      margin: 10,
      filename: props?.otherDetails?.Trip_number + ".pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a5", orientation: "portrait" },
    };

    html2pdf()
      .from(content)
      .set(pdf)
      .outputPdf((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = pdf.filename;
        link.click();
      })
      .save();
  };

  return (
    <div>
      <Button
        type="button"
        className="ContinueButton mr-30 ml-20"
        onClick={() => generatePDF()}
        sx={{ mt: 1, mr: 1 }}
      >
        પ્રિન્ટ
      </Button>

      <table
        ref={contentRef}
        border="1"
        style={{ borderCollapse: "collapse", maxWidth: "700px" }}
      >
        <tr>
          <td
            colSpan="8"
            style={{ padding: "5px", textAlign: "center", fontWeight: "bold" }}
          >
            ગનોર દૂધ
          </td>
        </tr>
        <tr>
          <td style={{ padding: "5px" }}>ટ્રીપ નં. </td>
          <td style={{ padding: "5px" }}>{props?.otherDetails?.Trip_number}</td>
          <td colSpan="1" style={{ padding: "5px" }}>
            તારીખ
          </td>
          <td colSpan="1" style={{ padding: "5px" }}>
            {props?.otherDetails?.Trip_date}
          </td>
          <td style={{ padding: "5px" }}>ડિલિવરી બોય</td>
          <td style={{ padding: "5px" }}>
            {props?.otherDetails?.Delivery_boy.Name}
          </td>
        </tr>
        <tr>
          <td style={{ padding: "5px" }}>રુટ </td>
          <td style={{ padding: "5px" }}>
            {props?.otherDetails?.Route_name.Route_name}
          </td>
          <td style={{ padding: "5px" }}>વા. નં.</td>
          <td style={{ padding: "5px" }}>
            {props?.otherDetails?.Vehicle_number.Vehicle_number}
          </td>
        </tr>
        <tr>
          <td colSpan="1" style={{ padding: "5px" }}>
            ટોટલ બોટલ
          </td>
          <td colSpan="1" style={{ padding: "5px" }}>
            {totalBottle}
          </td>
          <td colSpan="2" style={{ padding: "5px" }}>
            ટો. ખા. લે. બોટલ{" "}
          </td>
          <td colSpan="2" style={{ padding: "5px" }}>
            {" "}
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td style={{ padding: "5px", height: "20px" }}> </td>
          <td style={{ textAlign: "center", padding: "5px" }}> </td>
          <td style={{ textAlign: "center", padding: "5px" }}> </td>
          <td style={{ textAlign: "center", padding: "5px" }}> </td>
        </tr>
        <tr>
          <td colSpan="2" style={{ padding: "5px" }}>
            કસ્ટમર
          </td>
          <td colSpan="2" style={{ padding: "5px" }}>
            એડ્રેસ
          </td>
          <td style={{ padding: "5px" }}>જરૂર</td>
          <td style={{ padding: "5px" }}>ખા. લે. બોટલ</td>
        </tr>
        {props.printTripData &&
          props.printTripData.map((item) => {
            return (
              <tr
                style={{
                  backgroundColor:
                    item.flag_today == 1 ? "yellow" : "transparent",
                }}
              >
                <td colSpan="2" style={{ padding: "5px" }}>
                  {props.selectedLanguage == 1 ? item.name : item.nick_name}
                </td>
                <td colSpan="2" style={{ padding: "5px" }}>
                  {item.address}
                </td>
                <td style={{ textAlign: "center", padding: "5px" }}>
                  {item.milk_need_today}
                </td>
                <td style={{ textAlign: "center", padding: "5px" }}>
                  {item.tommorrow_bottle}
                </td>
              </tr>
            );
          })}

        <tr>
          <td colSpan="2" style={{ padding: "5px" }}>
            ટો. ખા. લે. બોટલ{" "}
          </td>
          <td colSpan="2" style={{ padding: "5px" }}>
            ટો. ખા. આવી બોટલ{" "}
          </td>
          <td colSpan="1" style={{ padding: "5px" }}>
            ટો. બોટલ{" "}
          </td>
          <td colSpan="1" style={{ padding: "5px" }}>
            ડેમેજ{" "}
          </td>
        </tr>
        <tr>
          <td colSpan="2" style={{ padding: "5px" }}>
            {props?.bottleCount3}
          </td>
          <td colSpan="2" style={{ padding: "5px" }}></td>
          <td colSpan="1" style={{ padding: "5px" }}>
            {" "}
          </td>
          <td colSpan="1" style={{ padding: "5px" }}></td>
        </tr>
      </table>
    </div>
  );
};

export default TripPrintDetails;
