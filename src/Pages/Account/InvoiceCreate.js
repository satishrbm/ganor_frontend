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
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [currentBillIndex, setCurrentBillIndex] = useState(0);

const getBillPrindData = (billData) => {
  try {
    setLoading(true);
    axios
      .get(
        `${config.BaseURL}/api/bill/bill_list/?route=${billData.Cutomer_route}&from_date=${billData.Started_at}&to_date=${billData.from_date}`,
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
const getRoute = () => {
  try {
    setLoading(true);
    axios
      .get(`${config.BaseURL}/api/customer/routelist`, {})
      .then((response) => {
        setLoading(false);
        setCustomerRoute(response.data);
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
  getRoute();
}, []);
 const generatePDF = () => {
   const content = document.getElementById("print"+currentBillIndex.toString());
   if (!content) {
     console.error("Content element not found.");
     return;
   }

   let pdfName=billPrintData[currentBillIndex].Bill_number;
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

  const handleNextClick = () => {
    setCurrentBillIndex((prevIndex) =>
      prevIndex < billPrintData.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePreviousClick = () => {
    setCurrentBillIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  }
  return (
    <div>
      {loading ? <Loader /> : null}
      <Formik
        initialValues={{
          Cutomer_route: "",
          Started_at: "",
          from_date: "",
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          Cutomer_route: Yup.string().required("Cutomer_route દાખલ કરો"),
          Started_at: Yup.string().required("શરૂ કરેલ તારીખ દાખલ કરો"),
          from_date: Yup.string().required("શરૂ કરેલ તારીખ દાખલ કરો"),
        })}
        onSubmit={(values, { resetForm }) => {
          const output = values;
          output.Started_at = dayjs(values.Started_at).format("YYYY-MM-DD");
          output.from_date = dayjs(values.from_date).format("YYYY-MM-DD");
          getBillPrindData(output);
        }}
      >
        {({
          handleBlur,
          handleChange,
          values,
          errors,
          isSubmitting,
          touched,
          setFieldValue,
          handleSubmit,
        }) => (
          <Form>
            <div className="flexTab-content">
              <div className="inputDiv-customer" style={{ width: "25%" }}>
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Cutomer_route && errors.Cutomer_route)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-Cutomer_route-login"
                  >
                    રુટ
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="કસ્ટમર નો રૂટ સેલેક્ટ કરો"
                    options={customerRoute}
                    key={"Cutomer_route"}
                    autoHighlight
                    getOptionLabel={(option) => option.Route_name}
                    onChange={(e, value) => {
                      setFieldValue("Cutomer_route", value?.id ? value.id : "");
                    }}
                    value={
                      customerRoute.find(
                        (route) => route.id == values.Cutomer_route
                      ) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="કસ્ટમર નો રૂટ સેલેક્ટ કરો "
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off",
                        }}
                      />
                    )}
                  />
                  {touched.Cutomer_route && errors.Cutomer_route && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-Cutomer_route-login"
                    >
                      {errors.Cutomer_route}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer" style={{ width: "25%" }}>
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Started_at && errors.Started_at)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-start-date-login"
                  >
                    ફ્રોમ તારીખ
                  </FormHelperText>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className="DatePickerCustom"
                      inputFormat="yyyy/mm/dd"
                      maxDate={currentDate}
                      value={values.Started_at}
                      onChange={(newValue) =>
                        setFieldValue(
                          "Started_at",
                          dayjs(newValue, "YYYY/MM/DD")
                        )
                      }
                    />
                  </LocalizationProvider>
                  {touched.Started_at && errors.Started_at && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-start-date-login"
                    >
                      {errors.Started_at}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer" style={{ width: "25%" }}>
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.from_date && errors.from_date)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-start-date-login"
                  >
                    ટુ તારીખ
                  </FormHelperText>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className="DatePickerCustom"
                      inputFormat="yyyy/mm/dd"
                      maxDate={currentDate}
                      value={values.from_date}
                      onChange={(newValue) =>
                        setFieldValue(
                          "from_date",
                          dayjs(newValue, "YYYY/MM/DD")
                        )
                      }
                    />
                  </LocalizationProvider>
                  {touched.from_date && errors.from_date && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-start-date-login"
                    >
                      {errors.from_date}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>

              <Button
                onClick={() => {
                  handleSubmit();
                }}
                className="searchButton"
                type="submit"
              >
                Search
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <></>
      {!billPrintData.length == 0 ? (
        <div className="BillContentFlex">
          <button className="searchButton" onClick={handlePreviousClick}>
            Previous
          </button>
          <div>
            <span style={{ padding: "0px 20px" }}>
              {currentBillIndex + 1}/{billPrintData.length}
            </span>
          </div>
          <button className="searchButton" onClick={handleNextClick}>
            Next
          </button>
          <button className="searchButton" onClick={generatePDF}>
            Download
          </button>
        </div>
      ) : null}
      <div className="BillContentFlex">
        {billPrintData.map((item, index) => (
          <div
            key={index}
            id={"print" + index}
            ref={contentRef}
            style={{ display: index === currentBillIndex ? "block" : "none" }}
          >
            <table key={index} className="billTableSection">
              <tbody>
                <tr className="billPrintTitle">
                  <td colSpan={4}>ગેનોર દૂધ</td>
                </tr>
                <tr className="billPrintAddressTitle">
                  <td
                    colSpan={4}
                    style={{ padding: 4, fontSize: 14, fontWeight: "bold" }}
                  >
                    મઝદાગલી, NH - 8, પીપોદરા - સુરત
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    બિલ નં. {item.Bill_number}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {item.bill_date}
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "right",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {item.Customer.Order_number}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ fontSize: 14, padding: 4 }}>
                    કસ્ટમર: {item.Customer.Customer_name}
                  </td>
                </tr>
                <tr>
                  <td className="ProductPrintList">વિગત</td>
                  <td className="ProductPrintList">જથ્થો</td>
                  <td className="ProductPrintList">ભાવ</td>
                  <td className="ProductPrintList">RS</td>
                </tr>
                <tr>
                  <td>દૂધ</td>
                  <td style={{ textAlign: "center" }}>{item.bottle_couont}</td>
                  <td style={{ textAlign: "center" }}>{item.rate}</td>
                  <td style={{ textAlign: "center" }}>{item.count_total}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="amountSection">
                    ટોટલ રૂ
                  </td>
                  <td colSpan={2} className="amountSection">
                    {item.count_total}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="amountSection">
                    બાકી/જમા રૂ
                  </td>
                  <td colSpan={2} className="amountSection">
                    {item.baaki_jamaa}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="amountSection">
                    ટોટલ
                  </td>
                  <td colSpan={2} className="amountSection">
                    {item.final_price}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="amountSection"></td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>
                    નામ: {item.Customer.Customer_name}
                  </td>
                  <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>
                    તારીખ: {item.bill_date}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>
                    રૂ.લેનારની સહી: ______________
                  </td>
                  <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>
                    આપેલ રકમ: ______________
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ fontSize: 14, padding: 4 }}>
                    <b>નોંધ: નીચેનો કાગળ બિલ સાથે ફરજીયાત આપવો</b>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    બિલ નં. {item.Bill_number}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {item.bill_date}
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "right",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {item.Customer.Order_number}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ fontSize: 14, padding: 4 }}>
                    કસ્ટમર: {item.Customer.Customer_name}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>
                    ટોટલ રૂ : {item.final_price}
                  </td>
                  <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>
                    તારીખ:
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>
                    ચુકવેલ રૂ :
                  </td>
                  <td colSpan={2} style={{ fontSize: 14, padding: 4 }}>
                    આપનાર સહી
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    style={{ fontSize: 14, padding: 4, height: 20 }}
                  ></td>
                  <td
                    colSpan={2}
                    style={{ fontSize: 14, padding: 4, height: 20 }}
                  ></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceCreate;
