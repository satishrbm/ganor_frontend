import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";

const DayWisePouchPrint = (props) => {
  const contentRef = useRef(null);
  const [totalBottle, setTotalBottle] = useState("");
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [tripNumber, setTripNumber] = useState();
  const [customerRoute, setCustomerRoute] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [selectedPrintRoute, setSelectedPrintRoute] = useState("");
  const [printCustomer, setPrintCustomer] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");

  const getCustomers = (route_id) => {
    try {
      setLoading(true);
      axios
        .get(`${config.BaseURL}/api/route/route/${route_id}/`, {})
        .then((response) => {
          setLoading(false);
          setCustomers(response.data.customer_data);
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
        .get(`${config.BaseURL}/api/trip/routelist`, {})
        .then((response) => {
          setLoading(false);
          let id = response.data.filter(
            (item) => item.Route_name == props.selectedRoute
          );
          setSelectedRoute(id[0].id);
          getCustomers(id[0].id);
          setSelectedPrintRoute(id[0].Route_name);
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
      filename:
        printCustomer.length > 0 ? printCustomer[0].name : "print" + ".pdf",
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
  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };
  return (
    <div>
      {loading ? <Loader /> : null}
      <Formik
        initialValues={{
          Route_name: selectedRoute, //ID
          Customer_name: "", //ID
          From_date: "",
          To_date: "",
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          Route_name: Yup.string().required("રુટ નું નામ સેલેક્ટ કરો"),
          Customer_name: Yup.string().required("કસ્ટમર નું નામ સેલેક્ટ કરો"),
          From_date: Yup.string().required("ફ્રોમ તારીખ દાખલ કરો"),
          To_date: Yup.string().required("ટૂ તારીખ દાખલ કરો"),
        })}
        onSubmit={(values) => {
          var output = values;
          output.From_date = dayjs(values.From_date).format("YYYY-MM-DD");
          output.To_date = dayjs(values.To_date).format("YYYY-MM-DD");
          axios
            .get(
              `${config.BaseURL}/api/route/customer/${output.Customer_name}/?start_date=${output.From_date}&end_date=${output.To_date}`,
              {}
            )
            .then((response) => {
              setLoading(false);
              setPrintData(response.data.supplies_data_list);
              let ttl = 0;
              response.data.supplies_data_list.forEach((element) => {
                ttl += element.Today_bottle;
              });
              let customer = response.data.customer_data;
              customer[0].Total_bottle = ttl;
              setPrintCustomer(response.data.customer_data);
            })
            .catch((err) => {
              setLoading(false);
              setAlertMessage(err.response.data.error);
              setAlertStyle("error");
              setShowToaster(true);
              setLoading(false);
            });
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form>
            <div className="flexTab-content">
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Route_name && errors.Route_name)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    રુટ નું નામ
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="કસ્ટમર નો રૂટ સેલેક્ટ કરો"
                    autoHighlight="off"
                    options={customerRoute}
                    key={"Route_name"}
                    getOptionLabel={(option) => option.Route_name}
                    onChange={(e, value) => {
                      //   handleChangeRoute(value);
                      setTimeout(() => {
                        getCustomers(value?.id);
                        setSelectedPrintRoute(value?.Route_name);
                        setFieldValue("Route_name", value?.id ? value.id : "");
                      }, 1000);
                    }}
                    value={
                      values.Route_name == ""
                        ? null
                        : customerRoute.find((e) => e.id == values.Route_name)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="કસ્ટમર નો રૂટ સેલેક્ટ કરો "
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />

                  {touched.Route_name && errors.Route_name && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-Route_name-login"
                    >
                      {errors.Route_name}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Customer_name && errors.Customer_name)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    કસ્ટમર નું નામ
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    autoHighlight="off"
                    options={customers}
                    key={"Customer_name"}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => {
                      //   handleChangeRoute(value);
                      setTimeout(() => {
                        setFieldValue(
                          "Customer_name",
                          value?.id ? value.id : ""
                        );
                      }, 1000);
                    }}
                    value={
                      values.Customer_name == ""
                        ? null
                        : customers.find((e) => e.id == values.Customer_name)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="કસ્ટમર નું નામ સેલેક્ટ કરો"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off",
                        }}
                      />
                    )}
                  />

                  {touched.Route_name && errors.Route_name && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-Route_name-login"
                    >
                      {errors.Route_name}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="flexTab-content">
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.From_date && errors.From_date)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ફ્રોમ ડેટ
                  </FormHelperText>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className="DatePickerCustom"
                      inputFormat="yyyy/mm/dd"
                      value={values.From_date}
                      onChange={(newValue) => {
                        setFieldValue("From_date", newValue);
                      }}
                    />
                  </LocalizationProvider>
                  {touched.From_date && errors.From_date && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.From_date}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.To_date && errors.To_date)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ટુ ડેટ
                  </FormHelperText>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className="DatePickerCustom"
                      inputFormat="yyyy/mm/dd"
                      value={values.To_date}
                      disabled={values.From_date == ""}
                      minDate={values.From_date}
                      onChange={(newValue) => {
                        setFieldValue("To_date", newValue);
                      }}
                    />
                  </LocalizationProvider>
                  {touched.To_date && errors.To_date && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.To_date}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>

              <div className="inputDiv-customer" style={{ display: "flex" }}>
                <Button
                  type="submit"
                  className="ContinueButton mr-30 ml-20"
                  sx={{ mt: 3 }}
                >
                  સર્ચ
                </Button>
                <Button
                  type="button"
                  className="ContinueButton mr-30 ml-20"
                  onClick={() => generatePDF()}
                  sx={{ mt: 3, mr: 1 }}
                >
                  પ્રિન્ટ
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={showToaster}
          autoHideDuration={6000}
          onClose={handleCloseToaster}
        >
          <Alert
            onClose={handleCloseToaster}
            severity={alertStyle}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Stack>

      <table
        ref={contentRef}
        border="1"
        style={{ borderCollapse: "collapse", maxWidth: "450px" }}
      >
        <tr>
          <td
            colSpan="4"
            style={{ padding: "5px", textAlign: "center", fontWeight: "bold" }}
          >
            ગનોર દૂધ
          </td>
        </tr>
        <tr>
          <td colSpan="4" style={{ padding: "5px" }}>
            કસ્ટમર નું નામ:{" "}
            {printCustomer.length > 0 ? printCustomer[0].name : ""}
          </td>
        </tr>
        <tr>
          <td colSpan="2" style={{ padding: "5px" }}>
            રુટ{" "}
          </td>
          <td colSpan="2" style={{ padding: "5px" }}>
            {selectedPrintRoute}
          </td>
        </tr>

        <tr>
          <td colSpan="2" style={{ padding: "5px" }}>
            ટોટલ બોટલ
          </td>
          <td colSpan="2" style={{ padding: "5px" }}>
            પાછી આપેલ ખાલી બોટલ
          </td>
        </tr>
        <tr>
          <td colSpan="2" style={{ padding: "5px", height: "20px" }}>
            {printCustomer.length > 0 ? printCustomer[0].Total_bottle : 0}
          </td>
          <td colSpan="2" style={{ padding: "5px" }}>
            0
          </td>
        </tr>
        <tr>
          <td style={{ padding: "5px", height: "20px" }}> </td>
          <td style={{ textAlign: "center", padding: "5px" }}> </td>
          <td style={{ textAlign: "center", padding: "5px" }}> </td>
          <td style={{ textAlign: "center", padding: "5px" }}> </td>
        </tr>
        <tr>
          <td colSpan="1" style={{ padding: "5px" }}>
            #
          </td>
          <td style={{ padding: "5px" }}>તારીખ</td>
          <td style={{ padding: "5px" }}>આપેલ બોટલ</td>
          <td style={{ padding: "5px" }}>પાછી આપેલ ખાલી બોટલ</td>
        </tr>
        {printData?.map((item, index) => {
          return (
            <tr>
              <td colSpan="1" style={{ padding: "5px" }}>
                {index + 1}
              </td>
              <td style={{ textAlign: "center", padding: "5px" }}>
                {item.Supply_date}
              </td>
              <td style={{ textAlign: "center", padding: "5px" }}>
                {item.Today_bottle}
              </td>
              <td style={{ textAlign: "center", padding: "5px" }}></td>
            </tr>
          );
        })}

        <tr>
          <td colSpan="2" style={{ padding: "5px", height: "20px" }}>
            {" "}
          </td>
          <td style={{ textAlign: "center", padding: "5px" }}> </td>
          <td style={{ textAlign: "center", padding: "5px" }}> </td>
        </tr>
        <tr>
          <td colSpan="1" style={{ padding: "5px" }}>
            ડેમેજ
          </td>
          <td colSpan="1" style={{ padding: "5px" }}></td>
          <td colSpan="1" style={{ padding: "5px" }}></td>
          <td colSpan="1" style={{ padding: "5px" }}></td>
        </tr>
        <tr>
          <td colSpan="1" style={{ padding: "5px" }}></td>
          <td colSpan="1" style={{ padding: "5px" }}></td>
          <td colSpan="1" style={{ padding: "5px", height: "20px" }}></td>
          <td colSpan="1" style={{ padding: "5px" }}></td>
        </tr>
      </table>
    </div>
  );
};

export default DayWisePouchPrint;
