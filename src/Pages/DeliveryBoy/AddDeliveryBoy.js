import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
import React, { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";

const statusDropdown = [
  { label: "એકટીવ", phone: "376" },
  { label: "ડીએકટીવ", phone: "971" },
];

const AddCustomer = (props) => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("");

  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };
  const deliverBoyAdd = async (value) => {
    setLoading(true);
    try {
      await axios
        .post(`${config.BaseURL}/api/deliveryboy/create`, value, {})
        .then((response) => {
          if (response.status == 201) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            setLoading(false);
            setTimeout(() => {
              props.setModalRoute(false);
              props.setOnClose(true);
            }, 1000);
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

  const updateDeliverBoy = async (value) => {
    setLoading(true);
    try {
      await axios
        .put(
          `${config.BaseURL}/api/deliveryboy/edit/${props.editData.id}`,
          value,
          {}
        )
        .then((response) => {
          if (response.status == 200) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            setLoading(false);
            setTimeout(() => {
              props.setModalRoute(false);
              props.setOnClose(true);
            }, 1000);
          }
        })
        .catch((err) => {
          setAlertMessage(err.response.data.error);
          setAlertStyle("error");
          setShowToaster(true);
          setLoading(false);
          // alert(err.response.data.error);
        });
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };

  return (
    <div>
      {loading ? <Loader /> : null}
      <Formik
        initialValues={{
          Code: props.editData ? props.editData.Code : "",
          Name: props.editData ? props.editData.Name : "",
          Group: props.editData ? props.editData.Group : "",
          Home_number: props.editData ? props.editData.Home_number : "",
          Society: props.editData ? props.editData.Society : "",
          Area: props.editData ? props.editData.Area : "",
          Pincode: props.editData ? props.editData.Pincode : "",
          Moblie1: props.editData ? props.editData.Moblie1 : "",
          Moblie2: props.editData ? props.editData.Moblie2 : "",
          Email: props.editData ? props.editData.Email : "",
          License_number: props.editData ? props.editData.License_number : "",
          License_lastdate: props.editData
            ? dayjs(props.editData.License_lastdate, "YYYY/MM/DD")
            : "",
          License_type: props.editData ? props.editData.License_type : "",
          Birth_date: props.editData
            ? dayjs(props.editData.Birth_date, "YYYY/MM/DD")
            : "",
          Joining_date: props.editData
            ? dayjs(props.editData.Joining_date, "YYYY/MM/DD")
            : "",
          Current_status: props.editData ? props.editData.Current_status : "",
          is_active: props.editData ? props.editData.is_active : false,
        }}
        validationSchema={Yup.object().shape({
          Code: Yup.string().required("ક્રમ દાખલ કરો"),
          Name: Yup.string().required("નામ દાખલ કરો"),
          Group: Yup.string().required("ગ્રુપ દાખલ કરો"),
          Home_number: Yup.string().required("મકાન નંબર દાખલ કરો"),
          Society: Yup.string().required("સોસાયટી નું નામ દાખલ કરો"),
          Area: Yup.string().required("એરિયા/ચોક દાખલ કરો"),
          Pincode: Yup.string().required("પિનકોડ દાખલ કરો"),
          Moblie1: Yup.string().required("મોબાઇલ નંબર દાખલ કરો"),
          Moblie2: Yup.string().required("મોબાઇલ નંબર 2 દાખલ કરો"),
          Email: Yup.string().required("ઈમેલ દાખલ કરો"),
          License_number: Yup.string().required(
            "ડ્રાઇવિંગ લાઇસન્સ નંબર દાખલ કરો"
          ),
          License_lastdate: Yup.string().required(
            "ડ્રાઇવિંગ લાઇસન્સ પ્રકાર દાખલ કરો"
          ),
          License_type: Yup.string().required(
            "ડ્રાઇવિંગ લાઇસન્સ અંતિમ તારીખ દાખલ કરો"
          ),
          Birth_date: Yup.string().required("જન્મ તારીખ દાખલ કરો"),
          Joining_date: Yup.string().required("જોડાયા તારીખ દાખલ કરો"),
          Current_status: Yup.string().required("હાલનું સ્ટેટ્સ દાખલ કરો"),
        })}
        onSubmit={(values, { resetForm }) => {
          const output = values;
          output.Birth_date = dayjs(values.Birth_date).format("YYYY-MM-DD");
          output.Joining_date = dayjs(values.Joining_date).format("YYYY-MM-DD");
          output.License_lastdate = dayjs(values.License_lastdate).format(
            "YYYY-MM-DD"
          );
          if(output.is_active[0]=="on"){
            output.is_active = true
          }else{
            output.is_active = false
            
          }
          if (props.isEdit) {
            updateDeliverBoy(output);
          } else {
            deliverBoyAdd(output);
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
        }) => (
          <Form>
            <div className="flexTab-content">
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Code && errors.Code)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    કોડ
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="કોડ દાખલ કરો"
                    type="text"
                    name="Code"
                    value={values.Code}
                    onChange={handleChange}
                  />
                  {touched.Code && errors.Code && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Code}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Name && errors.Name)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    નામ
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="નામ દાખલ કરો"
                    type="text"
                    name="Name"
                    value={values.Name}
                    onChange={handleChange}
                  />
                  {touched.Name && errors.Name && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Name}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Group && errors.Group)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ગ્રુપ
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="ગ્રુપ દાખલ કરો"
                    type="text"
                    name="Group"
                    value={values.Group}
                    onChange={handleChange}
                  />
                  {touched.Group && errors.Group && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Group}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Home_number && errors.Home_number)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    મકાન નંબર
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="મકાન નંબર દાખલ કરો"
                    type="text"
                    name="Home_number"
                    value={values.Home_number}
                    onChange={handleChange}
                  />
                  {touched.Home_number && errors.Home_number && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Home_number}
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
                    id="standard-weight-helper-text-email-login"
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
                      id="standard-weight-helper-text-email-login"
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
                    id="standard-weight-helper-text-email-login"
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
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Area}
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
                    id="standard-weight-helper-text-email-login"
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
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Pincode}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Moblie1 && errors.Moblie1)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    મોબાઇલ નંબર
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="મોબાઇલ નંબર દાખલ કરો"
                    type="text"
                    name="Moblie1"
                    value={values.Moblie1}
                    onChange={handleChange}
                  />
                  {touched.Moblie1 && errors.Moblie1 && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Moblie1}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Moblie2 && errors.Moblie2)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    મોબાઇલ નંબર 2
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="મોબાઇલ નંબર 2 દાખલ કરો"
                    type="text"
                    name="Moblie2"
                    value={values.Moblie2}
                    onChange={handleChange}
                  />
                  {touched.Moblie2 && errors.Moblie2 && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Moblie2}
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
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(
                    touched.License_number && errors.License_number
                  )}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ડ્રાઇવિંગ લાઇસન્સ નંબર
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="ડ્રાઇવિંગ લાઇસન્સ નંબર દાખલ કરો"
                    type="text"
                    name="License_number"
                    value={values.License_number}
                    onChange={handleChange}
                  />
                  {touched.License_number && errors.License_number && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.License_number}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.License_type && errors.License_type)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ડ્રાઇવિંગ લાઇસન્સ પ્રકાર
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="ડ્રાઇવિંગ લાઇસન્સ પ્રકાર દાખલ કરો"
                    type="text"
                    name="License_type"
                    value={values.License_type}
                    onChange={handleChange}
                  />
                  {touched.License_type && errors.License_type && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.License_type}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(
                    touched.License_lastdate && errors.License_lastdate
                  )}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ડ્રાઇવિંગ લાઇસન્સ અંતિમ તારીખ
                  </FormHelperText>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className="DatePickerCustom"
                      inputFormat="yyyy/mm/dd"
                      value={values.License_lastdate} // Pass the current value from Formik
                      onChange={
                        (newValue) =>
                          setFieldValue(
                            "License_lastdate",
                            dayjs(newValue, "YYYY/MM/DD")
                          ) // Update the value in Formik
                      }
                    />
                  </LocalizationProvider>
                  {touched.License_lastdate && errors.License_lastdate && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.License_lastdate}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Birth_date && errors.Birth_date)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    જન્મ તારીખ
                  </FormHelperText>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className="DatePickerCustom"
                      inputFormat="yyyy/mm/dd"
                      value={values.Birth_date} // Pass the current value from Formik
                      onChange={
                        (newValue) =>
                          setFieldValue(
                            "Birth_date",
                            dayjs(newValue, "YYYY/MM/DD")
                          ) // Update the value in Formik
                      }
                    />
                  </LocalizationProvider>
                  {touched.Birth_date && errors.Birth_date && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Birth_date}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Joining_date && errors.Joining_date)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    જોડાયા તારીખ
                  </FormHelperText>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className="DatePickerCustom"
                      inputFormat="yyyy/mm/dd"
                      value={values.Joining_date} // Pass the current value from Formik
                      onChange={
                        (newValue) =>
                          setFieldValue(
                            "Joining_date",
                            dayjs(newValue, "YYYY/MM/DD")
                          ) // Update the value in Formik
                      }
                    />
                  </LocalizationProvider>
                  {touched.Joining_date && errors.Joining_date && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Joining_date}
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
                    id="standard-weight-helper-text-email-login"
                  >
                    હાલનું સ્ટેટ્સ
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="હાલનું સ્ટેટ્સ કરો"
                    options={statusDropdown}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    value={
                      values.Current_status == ""
                        ? null
                        : statusDropdown.find(
                            (e) => e.label == values.Current_status
                          )
                    }
                    onChange={(event, selectedOption) =>
                      // setFieldValue(selectedOption.label)
                      setFieldValue(
                        "Current_status",
                        selectedOption ? selectedOption.label : ""
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="હાલનું સ્ટેટ્સ કરો "
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
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Current_status}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControlLabel
                  control={
                    <Checkbox
                      color="success"
                      onChange={handleChange}
                      name="is_active"
                      checked={values.is_active}
                    />
                  }
                  label="સક્રિય"
                />
              </div>
            </div>
            <div>
              <Button className="SaveButton" type="submit">
                {props.isEdit ? "Update" : "Save"}
              </Button>
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
    </div>
  );
};

export default AddCustomer;
