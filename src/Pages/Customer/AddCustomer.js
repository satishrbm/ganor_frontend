import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  OutlinedInput,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import "./AddCustomer.css";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import OffAddCustomer from "../OffCustomer/OffAddCustomer";

const statusDropdown = [
  { label: "એકટીવ", id: "1" },
  { label: "ડીએકટીવ", id: "0" },
];

const AddCustomer = (props) => {
  const currentDate = dayjs();
  const [value, setValue] = React.useState(0);
  const [orderNumber, setOrderNumber] = useState(10);
  const [customerRoute, setCustomerRoute] = useState([]);
  const [customerLandmark, setCustomerLandmark] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };
  const getOrderNumber = () => {
    try {
      setLoading(true);
      axios
        .get(`${config.BaseURL}/api/customer/ordernumber`, {})
        .then((response) => {
          setLoading(false);
          setOrderNumber(response.data.order_number);
        })
        .catch((err) => {
          setLoading(false);
          alert(err.response.data.error);
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
  const getLandmark = () => {
    try {
      setLoading(true);
      axios
        .get(`${config.BaseURL}/api/customer/landmarks`, {})
        .then((response) => {
          setLoading(false);
          setCustomerLandmark(response.data);
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
  const getProducts = () => {
    try {
      setLoading(true);
      axios
        .get(`${config.BaseURL}/api/product/list`, {})
        .then((response) => {
          setLoading(false);
          setProducts(response.data);
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
    getOrderNumber();
    getRoute();
    getLandmark();
    getProducts();
  }, []);
  const handleCustomerAdd = async (value) => {
    setLoading(true);
    try {
      await axios
        .post(`${config.BaseURL}/api/customer/create`, value, {})
        .then((response) => {
          if (response.status == 201) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            setTimeout(() => {
              props.setModalRoute(false);
              props.setOnClose(true);
            }, 1000);
            setLoading(false);
          }
        })
        .catch((err) => {
          // alert(err.response.data.error);
          setAlertMessage(err.response.data.error);
          setAlertStyle("error");
          setShowToaster(true);
          setLoading(false);
        });
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };

  const handleClose = () => {
    setDeactivateModal(!deactivateModal);
  };
  const handleCustomerUpdate = async (value) => {
    setLoading(true);
    try {
      await axios
        .put(
          `${config.BaseURL}/api/customer/edit/${props.editData.id}`,
          value,
          {}
        )
        .then((response) => {
          if (response.status == 200) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            setTimeout(() => {
              props.setModalRoute(false);
              props.setOnClose(true);
            }, 1000);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage(err.response.data.error);
          setAlertMessage(err.response.data.Email);
          setAlertStyle("error");
          setShowToaster(true);
          setLoading(false);
        });
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  const addProduct = (values) => {
    let data = products.filter((x) => x.id == values.Product);
    let rate = values.Customer_rate;
    data[0]["rate"] = rate;
    setSelectedProducts((prevSelectedProducts) => [
      ...prevSelectedProducts,
      data[0],
    ]);
  };
  const deleteProduct = (index) => {
    setSelectedProducts((prevSelectedProducts) => {
      const newSelectedProducts = [...prevSelectedProducts];
      newSelectedProducts.splice(index, 1);
      return newSelectedProducts;
    });
  };
  return (
    <div>
      {loading ? <Loader /> : null}
      <div>
        <Formik
          initialValues={{
            Order_number: props.editData
              ? props.editData.Order_number
              : orderNumber,
            Stand: props.editData ? props.editData.Stand : false,
            Customer_name: props.editData ? props.editData.Customer_name : "",
            Nick_name: props.editData ? props.editData.Nick_name : "",
            C_name: props.editData ? props.editData.C_name : "",
            N_name: props.editData ? props.editData.N_name : "",
            Frequency1: props.editData ? props.editData.Frequency1 : "",
            Frequency2: props.editData ? props.editData.Frequency2 : "",
            work: props.editData ? props.editData.work : "",
            House_number: props.editData ? props.editData.House_number : "",
            Society: props.editData ? props.editData.Society : "",
            Area: props.editData ? props.editData.Area : "",
            Pincode: props.editData ? props.editData.Pincode : "",
            Mobile_number1: props.editData ? props.editData.Mobile_number1 : "",
            Mobile_number2: props.editData ? props.editData.Mobile_number2 : "",
            Email: props.editData ? props.editData.Email : "",
            Landmark: props.editData ? props.editData.Landmark : "",
            Cutomer_route: props.editData ? props.editData.Cutomer_route : "",
            Started_at: props.editData
              ? dayjs(props.editData.Started_at, "YYYY/MM/DD")
              : "",
            Current_status: props.editData
              ? props.editData.Current_status
              : "0",
            Product: props.editData ? props.editData.Product : "",
            Customer_rate: props.editData ? props.editData.Customer_rate : "",
            Reference: props.editData ? props.editData.Reference : "",
            Saturday: props.editData ? props.editData.Saturday : false,
            Sunday: props.editData ? props.editData.Sunday : false,
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            Order_number: Yup.string().required("ક્રમ દાખલ કરો"),
            Customer_name: Yup.string().required("નામ દાખલ કરો"),
            Nick_name: Yup.string().required("નિક નામ દાખલ કરો"),
            C_name: Yup.string().required("Name દાખલ કરો"),
            N_name: Yup.string().required("Nick Name દાખલ કરો"),
            Frequency1: Yup.string().required("દૂધ મોકલવાનું દાખલ કરો"),
            Frequency2: Yup.string().required("દૂધ મોકલવાનું દાખલ કરો"),
            work: Yup.string().required("ધંધો નામ દાખલ કરો"),
            House_number: Yup.string().required("મકાન નંબર દાખલ કરો"),
            Society: Yup.string().required("સોસાયટી નું નામ દાખલ કરો"),
            Area: Yup.string().required("એરિયા/ચોક દાખલ કરો"),
            Pincode: Yup.string().required("પિનકોડ દાખલ કરો"),
            Mobile_number1: Yup.string().required("મોબાઇલ નંબર દાખલ કરો"),
            Mobile_number2: Yup.string().required("મોબાઇલ નંબર 2 દાખલ કરો"),
            // Email: Yup.string().required("ઈમેલ દાખલ કરો"),
            Landmark: Yup.string().required("Landmark દાખલ કરો"),
            Cutomer_route: Yup.string().required("Cutomer_route દાખલ કરો"),
            Started_at: Yup.string().required("શરૂ કરેલ તારીખ દાખલ કરો"),
            Current_status: Yup.string().required("હાલનું સ્ટેટ્સ દાખલ કરો"),
            Product: Yup.string().required("પ્રોડક્ટ સેલેક્ટ કરો"),
            Customer_rate: Yup.string().required("ભાવ દાખલ કરો"),
            Reference: Yup.string().required("રેફરેન્સ દાખલ કરો"),
          })}
          onSubmit={(values, { resetForm }) => {
            const output = values;
            output.Started_at = dayjs(values.Started_at).format("YYYY-MM-DD");
            if (props.isEdit) {
              handleCustomerUpdate(output);
            } else {
              handleCustomerAdd(output);
            }
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
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Order_number && errors.Order_number)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-count-login"
                    >
                      ક્રમ નં.
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="ક્રમ દાખલ કરો"
                      type="text"
                      name="Order_number"
                      disabled={true}
                      value={values.Order_number}
                      onChange={handleChange}
                    />
                    {touched.Order_number && errors.Order_number && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-count-login"
                      >
                        {errors.Order_number}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Started_at && errors.Started_at)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-start-date-login"
                    >
                      શરૂ કરેલ તારીખ
                    </FormHelperText>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        className="DatePickerCustom"
                        inputFormat="yyyy/mm/dd"
                        maxDate={currentDate}
                        value={values.Started_at} // Pass the current value from Formik
                        onChange={
                          (newValue) =>
                            setFieldValue(
                              "Started_at",
                              dayjs(newValue, "YYYY/MM/DD")
                            ) // Update the value in Formik
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
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Current_status && errors.Current_status
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-status-login"
                    >
                      હાલનું સ્ટેટ્સ
                    </FormHelperText>
                    <Autocomplete
                      className="InputAutocomplete"
                      id="country-select-demo"
                      placeholder="વાહન નંબર સિલેક્ટ કરો"
                      options={statusDropdown}
                      key={"vehicles"}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      onChange={(e, value) => {
                        setFieldValue(
                          "Current_status",
                          value?.id ? value.id : ""
                        );
                        if (value?.id == 0 && props.editData) {
                          setDeactivateModal(true);
                        }
                      }}
                      value={
                        values.Current_status == ""
                          ? null
                          : statusDropdown.find(
                              (e) => e.id == values.Current_status
                            )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="હાલનું સ્ટેટ્સ સિલેક્ટ કરો"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "off", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />

                    {touched.Current_status && errors.Current_status && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-status-login"
                      >
                        {errors.Current_status}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.C_name && errors.C_name)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-name-login"
                    >
                      Name
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="નામ દાખલ કરો"
                      type="text"
                      name="C_name"
                      value={values.C_name}
                      onChange={handleChange}
                    />
                    {touched.C_name && errors.C_name && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-name-login"
                      >
                        {errors.C_name}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.N_name && errors.N_name)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-nick-name-login"
                    >
                      Nick Name
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="નિક નામ દાખલ કરો"
                      type="text"
                      name="N_name"
                      value={values.N_name}
                      onChange={handleChange}
                    />
                    {touched.N_name && errors.N_name && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-nick-name-login"
                      >
                        {errors.N_name}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.work && errors.work)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-work-login"
                    >
                      ધંધો
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="ધંધો દાખલ કરો"
                      type="text"
                      name="work"
                      value={values.work}
                      onChange={handleChange}
                    />
                    {/*{touched.work && errors.work && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-work-login"
                      >
                        {errors.work}
                      </FormHelperText>
                    )}*/}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Customer_name && errors.Customer_name
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-name-first-login"
                    >
                      નામ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="નામ દાખલ કરો"
                      type="text"
                      name="Customer_name"
                      value={values.Customer_name}
                      onChange={handleChange}
                    />
                    {touched.Customer_name && errors.Customer_name && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-name-first-login"
                      >
                        {errors.Customer_name}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Nick_name && errors.Nick_name)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-nick-name-first-login"
                    >
                      નિક નામ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="નિક નામ દાખલ કરો"
                      type="text"
                      name="Nick_name"
                      value={values.Nick_name}
                      onChange={handleChange}
                    />
                    {touched.Nick_name && errors.Nick_name && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-nick-name-first-login"
                      >
                        {errors.Nick_name}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Reference && errors.Reference)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-reference-login"
                    >
                      રેફરેન્સ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="રેફરેન્સ દાખલ કરો"
                      type="text"
                      name="Reference"
                      defaultValue={"Facebook"}
                      value={values.Reference}
                      onChange={handleChange}
                    />
                    {touched.Reference && errors.Reference && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-reference-login"
                      >
                        {errors.Reference}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>

                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.House_number && errors.House_number)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-hose-number-login"
                    >
                      મકાન નંબર
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="મકાન નંબર દાખલ કરો"
                      type="text"
                      name="House_number"
                      value={values.House_number}
                      onChange={handleChange}
                    />
                    {touched.House_number && errors.House_number && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-hose-number-login"
                      >
                        {errors.House_number}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Society && errors.Society)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-society-login"
                    >
                      સોસાયટી નું નામ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="સોસાયટી નું નામ દાખલ કરો"
                      type="text"
                      name="Society"
                      value={values.Society}
                      onChange={handleChange}
                    />
                    {touched.Society && errors.Society && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-society-login"
                      >
                        {errors.Society}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Area && errors.Area)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-area-login"
                    >
                      એરિયા/ચોક
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="એરિયા/ચોક દાખલ કરો"
                      type="text"
                      name="Area"
                      value={values.Area}
                      onChange={handleChange}
                    />
                    {touched.Area && errors.Area && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-area-login"
                      >
                        {errors.Area}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>

                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Landmark && errors.Landmark)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-landmark-login"
                    >
                      લેન્ડમાર્ક
                    </FormHelperText>
                    <Autocomplete
                      className="InputAutocomplete"
                      id="country-select-demo"
                      placeholder="લેન્ડમાર્ક સેલેક્ટ કરો"
                      options={customerLandmark}
                      key={"Landmark"}
                      autoHighlight
                      getOptionLabel={(option) => option.landmark}
                      onChange={(e, value) => {
                        setFieldValue("Landmark", value?.id ? value.id : "");
                      }}
                      value={
                        customerLandmark.find(
                          (mark) => mark.id == values.Landmark
                        ) || null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="લેન્ડમાર્ક સેલેક્ટ કરો "
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "off", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />

                    {touched.Landmark && errors.Landmark && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-Landmark-login"
                      >
                        {errors.Landmark}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Pincode && errors.Pincode)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-pincode-login"
                    >
                      પિનકોડ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="પિનકોડ દાખલ કરો"
                      type="text"
                      name="Pincode"
                      value={values.Pincode}
                      onChange={handleChange}
                    />
                    {touched.Pincode && errors.Pincode && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-pincode-login"
                      >
                        {errors.Pincode}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Cutomer_route && errors.Cutomer_route
                    )}
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
                        setFieldValue(
                          "Cutomer_route",
                          value?.id ? value.id : ""
                        );
                      }}
                      value={
                        // values.Cutomer_route == ""
                        //   ? null
                        //   : customerRoute.find(
                        //       (e) => e.id == props.editData.Cutomer_route
                        //     )
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
                            autoComplete: "off", // disable autocomplete and autofill
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

                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Mobile_number1 && errors.Mobile_number1
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-number-login"
                    >
                      મોબાઇલ નંબર
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="મોબાઇલ નંબર દાખલ કરો"
                      type="text"
                      name="Mobile_number1"
                      value={values.Mobile_number1}
                      onChange={handleChange}
                      inputProps={{
                        pattern: "[0-9]*", // Only allow numbers
                        minLength: 10, // Minimum length
                        maxLength: 10, // Maximum length
                      }}
                    />
                    {touched.Mobile_number1 && errors.Mobile_number1 && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-number-login"
                      >
                        {errors.Mobile_number1}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Mobile_number2 && errors.Mobile_number2
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-number2-login"
                    >
                      મોબાઇલ નંબર 2
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="મોબાઇલ નંબર 2 દાખલ કરો"
                      type="text"
                      name="Mobile_number2"
                      value={values.Mobile_number2}
                      onChange={handleChange}
                      inputProps={{
                        pattern: "[0-9]*", // Only allow numbers
                        minLength: 10, // Minimum length
                        maxLength: 10, // Maximum length
                      }}
                    />
                    {touched.Mobile_number2 && errors.Mobile_number2 && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-number2-login"
                      >
                        {errors.Mobile_number2}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Email && errors.Email)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      ઈમેલ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="ઈમેલ દાખલ કરો"
                      type="text"
                      name="Email"
                      value={values.Email}
                      onChange={handleChange}
                    />
                    {touched.Email && errors.Email && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Email}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>

                <div className="inputDiv-customer milk-field">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Frequency1 && errors.Frequency1)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-send-milk-login"
                    >
                      દૂધ મોકલવાનું
                    </FormHelperText>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <OutlinedInput
                        style={{ width: "48%" }}
                        className="outlineInputChange"
                        variant="outlined"
                        placeholder="આપવાની બોટ્ટેલ નંબર દાખલ કરો"
                        type="text"
                        name="Frequency1"
                        value={values.Frequency1}
                        onChange={handleChange}
                      />
                      <OutlinedInput
                        style={{ width: "48%" }}
                        className="outlineInputChange"
                        variant="outlined"
                        placeholder="આપવાની બોટ્ટેલ નંબર દાખલ કરો"
                        type="text"
                        name="Frequency2"
                        value={values.Frequency2}
                        onChange={handleChange}
                      />
                    </div>
                    {touched.Frequency1 && errors.Frequency1 && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-send-milk-login"
                      >
                        {errors.Frequency1}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer milk-field">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Stand"
                        checked={values.Saturday}
                        onChange={(e) => {
                          const value = e.target.checked;
                          handleChange({
                            target: { name: "Saturday", value },
                          });
                        }}
                        // onChange={handleChange}
                        color="success"
                      />
                    }
                    label="શનિવારે નહિ"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Stand"
                        checked={values.Sunday}
                        onChange={(e) => {
                          const value = e.target.checked;
                          handleChange({
                            target: { name: "Sunday", value },
                          });
                        }}
                        color="success"
                      />
                    }
                    label="રવિવારે નહિ"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="Stand"
                        checked={values.Stand}
                        onChange={(e) => {
                          const value = e.target.checked;
                          handleChange({
                            target: { name: "Stand", value },
                          });
                        }}
                        color="success"
                      />
                    }
                    label="સ્ટેન્ડ આપેલ છે"
                  />
                </div>
              </div>
              <div className="tabSection">
                <div className="productBhavMainDiv">
                  <div className="inputDiv-customer">
                    <FormControl
                      className="inputFormControl"
                      error={Boolean(touched.Product && errors.Product)}
                    >
                      <FormHelperText
                        className="inputLabel"
                        id="standard-weight-helper-text-product-name-login"
                      >
                        પ્રોડક્ટ નામ
                      </FormHelperText>

                      <Autocomplete
                        className="InputAutocomplete"
                        id="country-select-demo"
                        placeholder="પ્રોડક્ટ સેલેક્ટ કરો"
                        options={products}
                        key={"Product"}
                        autoHighlight
                        getOptionLabel={(option) => option.Product_name}
                        onChange={(e, value) => {
                          setFieldValue(
                            "Customer_rate",
                            value?.Product_price ? value.Product_price : ""
                          );
                          setFieldValue("Product", value?.id ? value.id : "");
                        }}
                        value={
                          values.Product == ""
                            ? null
                            : products.find((e) => e.id == values.Product)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="પ્રોડક્ટ સેલેક્ટ કરો "
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "off", // disable autocomplete and autofill
                            }}
                          />
                        )}
                      />
                      {touched.Product && errors.Product && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-product-name-login"
                        >
                          {errors.Product}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>
                  <div className="inputDiv-customer">
                    <FormControl
                      className="inputFormControl"
                      error={Boolean(
                        touched.Customer_rate && errors.Customer_rate
                      )}
                    >
                      <FormHelperText
                        className="inputLabel"
                        id="standard-weight-helper-text-Product-rate-login"
                      >
                        ભાવ
                      </FormHelperText>
                      <OutlinedInput
                        className="outlineInputChange"
                        variant="outlined"
                        placeholder="ભાવ દાખલ કરો"
                        type="text"
                        name="Customer_rate"
                        value={values.Customer_rate}
                        onChange={handleChange}
                      />
                      {touched.Customer_rate && errors.Customer_rate && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-Product-rate-login"
                        >
                          {errors.Customer_rate}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>
                  <div className="inputDiv-customer">
                    <button
                      type="button"
                      onClick={() => addProduct(values)}
                      className="addProductCustomer"
                    >
                      એડ પ્રોડક્ટ
                    </button>
                  </div>
                </div>
                {selectedProducts.length > 0 ? (
                  <table border={1} style={{ width: "64%" }}>
                    <thead>
                      <th>પ્રોડક્ટ નામ</th>
                      <th>ભાવ</th>
                      <th>ડીલીટ</th>
                    </thead>
                    <tbody>
                      {selectedProducts.map((item, index) => {
                        return (
                          <tr>
                            <td>{item.Product_name}</td>
                            <td>{item.rate}</td>
                            <td>
                              <DeleteIcon
                                width={24}
                                height={24}
                                onClick={() => deleteProduct(index)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : null}
              </div>
              <div>
                <Button className="SaveButton" onClick={()=>{handleSubmit()}}>
                  {props.editData ? "Update" : "Save"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
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
      <Dialog
        open={deactivateModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "1300px",
            width: "100%",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" className="modalHeaderFlex">
          <p style={{ margin: 6 }}>કસ્ટમર બંધ કરો</p>
          <span className="popupCloseIcon">
            {<CloseIcon onClick={() => handleClose()} />}
          </span>
        </DialogTitle>
        <DialogContent>
          <OffAddCustomer
            Customers={props?.editData?.id}
            Customers_name={props?.editData?.C_name}
            setDeactivateModal={deactivateModal}
            setModalRoute={props.setModalRoute}
            handleCustomerUpdate={handleCustomerUpdate}
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: "10px 30px",
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid var(--borderColor)",
            padding: "20px 24px !important",
          }}
        >
          <Button className="CancelButton" onClick={() => handleClose()}>
            Cancel
          </Button>
          {/*<Button onClick={() => handleClose()} type="submit"></Button>*/}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddCustomer;
