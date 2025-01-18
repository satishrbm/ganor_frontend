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

const OffAddCustomer = (props) => {
  const currentDate = dayjs();
  const [products, setProducts] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [loading, setLoading] = useState(false);

  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };

  const handleOFFCustomerAdd = async (value) => {
    setLoading(true);
    try {
      await axios
        .post(`${config.BaseURL}/api/customer/closecustomer`, value, {})
        .then((response) => {
          if (response.status == 201) {
            // props.handleCustomerUpdate();
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            setTimeout(() => {
              props.setModalRoute(false);
              // props.setOnClose(true);
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

  return (
    <div>
      {loading ? <Loader /> : null}
      <div>
        <Formik
          initialValues={{
            Customers: props.Customers ? props.Customers : "",
            Reason: props.editData ? props.editData.Reason : "",
            Date: props.editData
              ? dayjs(props.editData.Date, "YYYY/MM/DD")
              : "",
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            Customers: Yup.string().required("નામ દાખલ કરો"),
            Reason: Yup.string().required("કારણ દાખલ કરો"),
            Date: Yup.string().required("બંધ કરેલ તારીખ દાખલ કરો"),
          })}
          onSubmit={(values, { resetForm }) => {
            const output = values;
            output.Date = dayjs(values.Date).format("YYYY-MM-DD");

            handleOFFCustomerAdd(output);
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
                    error={Boolean(touched.Customers && errors.Customers)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      કસ્ટમર નું નામ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="કસ્ટમર નું નામ દાખલ કરો"
                      type="text"
                      name="Customers"
                      disabled={true}
                      value={props.Customers_name}
                      onChange={handleChange}
                    />
                    {touched.Customers && errors.Customers && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Customers}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Date && errors.Date)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      બંધ કરેલ તારીખ
                    </FormHelperText>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        className="DatePickerCustom"
                        inputFormat="yyyy/mm/dd"
                        maxDate={currentDate}
                        value={values.Date} // Pass the current value from Formik
                        onChange={
                          (newValue) =>
                            setFieldValue("Date", dayjs(newValue, "YYYY/MM/DD")) // Update the value in Formik
                        }
                      />
                    </LocalizationProvider>
                    {touched.Date && errors.Date && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Date}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Reason && errors.Reason)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      કારણ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="કારણ દાખલ કરો"
                      type="text"
                      name="Reason"
                      value={values.Reason}
                      onChange={handleChange}
                    />
                    {touched.Reason && errors.Reason && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Reason}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
              </div>
              <div>
                <Button className="SaveButton" type="submit">
                  Save
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
    </div>
  );
};

export default OffAddCustomer;
