import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import axios from "axios";
import config from "../../Utils/config";
import {Autocomplete, Button, FormControl, FormHelperText, TextField,} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Loader from "../../Component/Loader";

const InvoiceCreate = (props) => {
  const contentRef = useRef(null);
  const currentDate = dayjs();
  const [loading, setLoading] = useState(false);
  const [customerRoute, setCustomerRoute] = useState([]);
  const [billPrintData, setBillPrintData] = useState([]);
  const [printData, setPrintData] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [currentBillIndex, setCurrentBillIndex] = useState(0);

const getBillPrindData = (billData) => {
  try {
    setLoading(true);
    axios
      .get(
        `${config.BaseURL}/api/bill/localcustomerbill/`,
        {}
      )
      .then((response) => {
        setLoading(false);
        setBillPrintData(response.data);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage(err.response.data.error);
        setAlertStyle("error");
        setShowToaster(true);
        setLoading(false);
      });
  } catch (error) {
    setLoading(false);
    console.error(error);
  }
};
useEffect(() => {
    getBillPrindData();
  }, []);

 const generatePDF = () => {
   const content = document.getElementById("print".toString());
   if (!content) {
     console.error("Content element not found.");
     return;
   }

   let pdfName=printData.customer_name;
   setTimeout(() => {
     const pdf = {
       margin: 2,
       filename: pdfName + ".pdf",
       image: { type: "jpeg", quality: 1 },
       html2canvas: { scale: 2 },
       jsPDF: { unit: "mm", format: "a5", orientation: "portrait" },
     };

     html2pdf()
       .from(content)
       .set(pdf)
       .save()
       .catch((error) => {
         console.error("Error generating PDF:", error);
       });
   }, 1000); 
 };

  return (
    <div>
      {loading ? <Loader /> : null}
      <div style={{display:'flex'}}>
        <div style={{width:'60%'}}>
            {billPrintData.map((item, index) => (
                <div key={index} style={{display:'flex', flexWrap:'wrap', justifyContent:'space-between'}} className='listSectionTab'>
                    <div style={{display:'flex', flexWrap:'wrap'}}>
                        <p style={{margin:0}}>{item.bill_number}</p>
                        <p style={{margin:'0 20px'}}>{item.created_at_customer}</p>
                        <p style={{margin:0}}>{item.customer_name}</p>
                    </div>
                    <div>
                        <p style={{padding: '6px 20px', background: '#7556d5', color: '#fff', fontSize: 12, borderRadius: 5, cursor:'pointer', margin:0}} onClick={()=>{setPrintData(item)}}>View</p>
                    </div>
                </div>
            ))}
        </div>
        <div className="BillContentFlex" style={{width: '40%', flexDirection:'column', alignItems:'center'}}>
            <p onClick={()=>{generatePDF()}} style={{padding: '6px 20px', background: '#7556d5', color: '#fff', fontSize: 12, borderRadius: 5, cursor:'pointer', margin:0}}>પ્રિન્ટ </p>            
            <div id={"print"} ref={contentRef} style={{ display: "block"}}>
                <table className="billTableSection">
                <tbody>
                    <tr className="billPrintTitle">
                        <td colSpan={4}>ગેનોર દૂધ</td>
                    </tr>
                    <tr className="billPrintAddressTitle">
                        <td colSpan={4} style={{ padding: 4, fontSize: 14, fontWeight: "bold" }}>મઝદાગલી, NH - 8, પીપોદરા - સુરત</td>
                    </tr>
                    <tr>
                        <td style={{textAlign: "center",fontSize: 14,fontWeight: "bold",}}>બિલ નં. {printData.bill_number}</td>
                        <td style={{textAlign: "center",fontSize: 14,fontWeight: "bold",}}>{printData.created_at_customer}</td>
                        <td colSpan={2}style={{textAlign: "right",fontSize: 14,fontWeight: "bold",}} ></td>
                    </tr>
                    <tr>
                        <td colSpan={4} style={{ fontSize: 14, padding: 4 }}>કસ્ટમર: {printData.customer_name}</td>
                    </tr>
                    <tr>
                        <td className="ProductPrintList">વિગત</td>
                        <td className="ProductPrintList">જથ્થો</td>
                        <td className="ProductPrintList">ભાવ</td>
                        <td className="ProductPrintList">RS</td>
                    </tr>
                    {printData?.products?.map(item=>{
                        return(
                            <tr>
                                <td >{item.product}</td>
                                <td style={{ textAlign: "center" }}>{item.quantity}</td>
                                <td style={{ textAlign: "center" }}>{item.rate}</td>
                                <td style={{ textAlign: "center" }}>{item.total_amount}</td>
                            </tr>
                        );
                    })}

                    <tr>
                        <td colSpan={2} className="amountSection">ટોટલ રૂ</td>
                        <td colSpan={2} className="amountSection">{printData.grand_total}</td>
                    </tr>
                    <tr>
                        <td colSpan={4} className="amountSection"></td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>નામ: {printData.customer_name}</td>
                        <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>તારીખ: {printData.created_at_customer}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>રૂ.લેનારની સહી: ______________</td>
                        <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>આપેલ રકમ: ______________</td>
                    </tr>                    
                </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreate;
