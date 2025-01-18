import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { Button } from "@mui/material";

const TripPrint = (props) => {
  const contentRef = useRef(null);
  const [printAllData, setPrintAllData] = useState(props.printAllData);
  let totalMilkNeedToday = 0;
  let totalEmptyBottle = 0;


  
  const generatePDF = () => {
    const content = contentRef.current;

    const pdf = {
      margin: 2,
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
        style={{ borderCollapse: "collapse", width: "100%", maxWidth: "270px" }}
      >
        <tr>
          <td
            colSpan="4"
            style={{
              padding: 4,
              fontSize: 12,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ગનોર દૂધ
          </td>
        </tr>
        <tr>
          <td style={{ padding: 4, fontSize: 12 }}>
            {props?.printAllData?.trip_data?.route_name}
          </td>
          <td style={{ padding: 4, fontSize: 12 }}>
            {props?.printAllData?.trip_data?.trip_number}
          </td>
          <td colSpan="2" style={{ padding: 4, fontSize: 12 }}>
            {props?.printAllData?.trip_data?.tomorrow_date}
          </td>
        </tr>
        <tr>
          <td colSpan="2" style={{ padding: 4, fontSize: 12 }}>
            {props?.printAllData?.trip_data?.delivery_boy}
          </td>

          <td colSpan="2" style={{ padding: 4, fontSize: 12 }}>
            {props?.printAllData?.trip_data?.vehicle_number}
          </td>
        </tr>
        <tr>
          <td colSpan="2" style={{ padding: 4, fontSize: 12 }}>
            કસ્ટમર
          </td>
          <td style={{ padding: 4, fontSize: 12, width: 25 }}>દૂધ </td>
          <td style={{ padding: 4, fontSize: 12, width: 25 }}>રિટર્ન</td>
        </tr>
        <></>
        {props.printAllData.customer_data_list &&
          props.printAllData.customer_data_list
            .slice()
            .sort((a, b) => a.sequence_number - b.sequence_number)
            .map((item) => {
              totalMilkNeedToday += item.tommorrow_bottle;
              totalEmptyBottle += item.total_given_bottle;

              return (
                <tr
                  style={{
                    backgroundColor: item.flag == 1 ? "yellow" : "transparent",
                  }}
                >
                  <td colSpan="2" style={{ padding: 4, fontSize: 11 }}>
                    {item.customer_number}
                    {" - "}
                    {props.selectedLanguage == 1 ? item.name : item.nick_name}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: 4,
                      fontSize: 11,
                      width: 25,
                    }}
                  >
                    {item.tommorrow_bottle}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: 4,
                      fontSize: 11,
                      width: 25,
                    }}
                  >
                    {item.total_given_bottle}
                  </td>
                </tr>
              );
            })}
        <tr>
          <td
            colSpan="2"
            style={{
              padding: 4,
              fontSize: 12,
              height: "20px",
              textAlign: "right",
            }}
          >
            <b> ટો. બોટલ</b>
          </td>
          <td style={{ textAlign: "center", padding: 4, fontSize: 12 }}>
            {" "}
            {/* {props?.bottleCount1}*/}
            {totalMilkNeedToday}
          </td>
          <td style={{ textAlign: "center", padding: 4, fontSize: 12 }}>
            {" "}
            {totalEmptyBottle}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default TripPrint;
