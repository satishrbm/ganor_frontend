import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  OutlinedInput,
  Snackbar,
  Stack,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import axios from "axios";
import config from "../../Utils/config";

const AddCustomer = (props) => {
  const [value, setValue] = React.useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("");

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

  const loginSubmit = async (value) => {
    try {
      await axios
        .post(`${config.BaseURL}/api/vehicles/create`, value, {})
        .then((response) => {
          if (response.status == 201) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
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
        });
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  const editVehicles = async (value) => {
    try {
      await axios
        .put(
          `${config.BaseURL}/api/vehicles/edit/${props.editData.id}`,
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
          }
        })
        .catch((err) => {
          // alert(err.response.data.error);
          setAlertMessage(err.response.data.error);
          setAlertStyle("error");
          setShowToaster(true);
        });
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  return (
    <div>
      <Formik
        initialValues={{
          Vehicle_number: props.editData ? props.editData.Vehicle_number : "",
          Vehicle_type: props.editData ? props.editData.Vehicle_type : "",
          Vehicle_owner_type: props.editData
            ? props.editData.Vehicle_owner_type
            : "",
          Vehicle_owner: props.editData ? props.editData.Vehicle_owner : "",
          Vehicle_price: props.editData ? props.editData.Vehicle_price : "",
          Vehicle_purchase_date: props.editData
            ? dayjs(props.editData.Vehicle_purchase_date, "MM/DD/YYYY")
            : "",
          Vehicle_average: props.editData ? props.editData.Vehicle_average : "",
          Vehicle_puc: props.editData ? props.editData.Vehicle_puc : "",
          Vehicle_puc_date: props.editData
            ? dayjs(props.editData.Vehicle_puc_date, "MM/DD/YYYY")
            : "",
          Vehicle_insurance: props.editData
            ? props.editData.Vehicle_insurance
            : "",
          Vehicle_insurance_date: props.editData
            ? dayjs(props.editData.Vehicle_insurance_date, "MM/DD/YYYY")
            : "",
          Vehicle_status: props.editData
            ? props.editData.Vehicle_status
            : false,
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          Vehicle_number: Yup.string().required("વાહનો નંબર દાખલ કરો"),
          Vehicle_type: Yup.string().required("વાહન પ્રકાર દાખલ કરો"),
          Vehicle_owner_type: Yup.string().required("માલિક પ્રકાર દાખલ કરો"),
          Vehicle_owner: Yup.string().required("માલિક દાખલ કરો"),
          Vehicle_price: Yup.string().required("ખરીદી કિંમત દાખલ કરો"),
          Vehicle_purchase_date: Yup.string().required(
            "વાહન ખરીદી તારીખ દાખલ કરો"
          ),
          Vehicle_average: Yup.string().required("એવરેજ દાખલ કરો"),
          Vehicle_puc: Yup.string().required(
            "પી.યુ.સી. સટીફીકેટ નંબર દાખલ કરો"
          ),
          Vehicle_puc_date: Yup.string().required(
            "પી.યુ.સી. ખરીદી તારીખ દાખલ કરો"
          ),
          Vehicle_insurance: Yup.string().required("વીમા નંબર દાખલ કરો"),
          Vehicle_insurance_date: Yup.string().required(
            "વીમા ખરીદી તારીખ દાખલ કરો"
          ),
          // Vehicle_status: Yup.string().required("સક્રિય દાખલ કરો"),
        })}
        onSubmit={(values, { resetForm }) => {
          const output = values;
          output.Vehicle_insurance_date = dayjs(
            values.Vehicle_insurance_date
          ).format("MM-DD-YYYY");
          output.Vehicle_puc_date = dayjs(values.Vehicle_puc_date).format(
            "MM-DD-YYYY"
          );
          output.Vehicle_purchase_date = dayjs(
            values.Vehicle_purchase_date
          ).format("MM-DD-YYYY");
          if (props.isEdit) {
            editVehicles(output);
          } else {
            loginSubmit(output);
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
            <div className="tabSection">
              <div className="flexTab-content">
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_number && errors.Vehicle_number
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      વાહનો નંબર{" "}
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="વાહનો નંબર દાખલ કરો"
                      type="text"
                      name="Vehicle_number"
                      value={values.Vehicle_number}
                      onChange={handleChange}
                    />
                    {touched.Vehicle_number && errors.Vehicle_number && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_number}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Vehicle_type && errors.Vehicle_type)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      વાહન પ્રકાર
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="વાહન પ્રકાર  દાખલ કરો"
                      type="text"
                      name="Vehicle_type"
                      value={values.Vehicle_type}
                      onChange={handleChange}
                    />
                    {touched.Vehicle_type && errors.Vehicle_type && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_type}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_owner_type && errors.Vehicle_owner_type
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      માલિક પ્રકાર
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="માલિક પ્રકાર દાખલ કરો"
                      type="text"
                      name="Vehicle_owner_type"
                      value={values.Vehicle_owner_type}
                      onChange={handleChange}
                    />
                    {touched.Vehicle_owner_type &&
                      errors.Vehicle_owner_type && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-email-login"
                        >
                          {errors.Vehicle_owner_type}
                        </FormHelperText>
                      )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_owner && errors.Vehicle_owner
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      માલિક
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="માલિક દાખલ કરો"
                      type="text"
                      name="Vehicle_owner"
                      value={values.Vehicle_owner}
                      onChange={handleChange}
                    />
                    {touched.Vehicle_owner && errors.Vehicle_owner && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_owner}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_price && errors.Vehicle_price
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      ખરીદી કિંમત{" "}
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="ખરીદી કિંમત દાખલ કરો"
                      type="text"
                      name="Vehicle_price"
                      value={values.Vehicle_price}
                      onChange={handleChange}
                    />
                    {touched.Vehicle_price && errors.Vehicle_price && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_price}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_purchase_date &&
                        errors.Vehicle_purchase_date
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      વાહન ખરીદી તારીખ
                    </FormHelperText>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        className="DatePickerCustom"
                        inputFormat="yyyy/mm/dd"
                        value={values.Vehicle_purchase_date} // Pass the current value from Formik
                        onChange={
                          (newValue) =>
                            setFieldValue(
                              "Vehicle_purchase_date",
                              dayjs(newValue, "YYYY/MM/DD")
                            ) // Update the value in Formik
                        }
                      />
                    </LocalizationProvider>
                    {touched.Vehicle_purchase_date &&
                      errors.Vehicle_purchase_date && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-email-login"
                        >
                          {errors.Vehicle_purchase_date}
                        </FormHelperText>
                      )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_average && errors.Vehicle_average
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      એવરેજ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="એવરેજ દાખલ કરો"
                      type="text"
                      name="Vehicle_average"
                      value={values.Vehicle_average}
                      onChange={handleChange}
                    />
                    {touched.Vehicle_average && errors.Vehicle_average && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_average}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Vehicle_puc && errors.Vehicle_puc)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      પી.યુ.સી. સટીફીકેટ નંબર{" "}
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="પી.યુ.સી. સટીફીકેટ નંબર દાખલ કરો"
                      type="text"
                      name="Vehicle_puc"
                      value={values.Vehicle_puc}
                      onChange={handleChange}
                    />
                    {touched.Vehicle_puc && errors.Vehicle_puc && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_puc}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_puc_date && errors.Vehicle_puc_date
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      પી.યુ.સી. ખરીદી તારીખ
                    </FormHelperText>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        inputFormat="yyyy/mm/dd"
                        className="DatePickerCustom"
                        value={values.Vehicle_puc_date} // Pass the current value from Formik
                        onChange={
                          (newValue) =>
                            setFieldValue(
                              "Vehicle_puc_date",
                              dayjs(newValue, "YYYY/MM/DD")
                            ) // Update the value in Formik
                        }
                      />
                    </LocalizationProvider>
                    {touched.Vehicle_puc_date && errors.Vehicle_puc_date && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_puc_date}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_insurance && errors.Vehicle_insurance
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      વીમા નંબર
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="વીમા નંબર દાખલ કરો"
                      type="text"
                      name="Vehicle_insurance"
                      value={values.Vehicle_insurance}
                      onChange={handleChange}
                    />
                    {touched.Vehicle_insurance && errors.Vehicle_insurance && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_insurance}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_insurance_date &&
                        errors.Vehicle_insurance_date
                    )}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      વીમા ખરીદી તારીખ
                    </FormHelperText>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        className="DatePickerCustom"
                        inputFormat="yyyy/mm/dd"
                        value={values.Vehicle_insurance_date} // Pass the current value from Formik
                        onChange={
                          (newValue) =>
                            setFieldValue(
                              "Vehicle_insurance_date",
                              dayjs(newValue, "YYYY/MM/DD")
                            ) // Update the value in Formik
                        }
                      />
                    </LocalizationProvider>
                    {touched.Vehicle_insurance_date &&
                      errors.Vehicle_insurance_date && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-email-login"
                        >
                          {errors.Vehicle_insurance_date}
                        </FormHelperText>
                      )}
                  </FormControl>
                </div>
                <div className="inputDiv-customer">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Vehicle_status && errors.Vehicle_status
                    )}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          name="Vehicle_status"
                          checked={values.Vehicle_status}
                          onChange={(e) => {
                            const value = e.target.checked; // Convert to string
                            handleChange({
                              target: { name: "Vehicle_status", value },
                            });
                          }}
                        />
                      }
                      label="સક્રિય"
                    />
                    {touched.Vehicle_status && errors.Vehicle_status && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Vehicle_status}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
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
