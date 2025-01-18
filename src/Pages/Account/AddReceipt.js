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
import React, { useState } from "react";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";
import dayjs from "dayjs";

const statusDropdown = [
  { label: "થેલી" },
  { label: "લીટર" },
  { label: "ગ્રામ" },
  { label: "કિ.ગ્રા" },
  { label: "મિલી" },
  { label: "નંગ" },
];
const creditDebit = [{ label: "જમા" }, { label: "ઉધાર" }];

const AddReceipt = (props) => {
  const currentDate = dayjs();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("");
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleAddProduct = async (value) => {
    setLoading(true);
    try {
      await axios
        .post(`${config.BaseURL}/api/product/create`, value, {})
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
  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };

  const handleEditProduct = async (value) => {
    setLoading(true);
    try {
      await axios
        .put(
          `${config.BaseURL}/api/product/edit/${props.editData.id}`,
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
          Receipt_number: props.editData ? props.editData.Receipt_number : "",
        }}
        validationSchema={Yup.object().shape({
          Receipt_number: Yup.string().required("પ્રોડક્ટ નામ દાખલ કરો"),
        })}
        onSubmit={(values, { resetForm }) => {
          if (props.isEdit) {
            handleEditProduct(values);
          } else {
            handleAddProduct(values);
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
                  error={Boolean(
                    touched.Receipt_number && errors.Receipt_number
                  )}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    રીસીપ્ટ નંબર
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="રીસીપ્ટ નંબર દાખલ કરો"
                    type="text"
                    name="Receipt_number"
                    value={values.Receipt_number}
                    onChange={handleChange}
                  />
                  {touched.Receipt_number && errors.Receipt_number && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Receipt_number}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Trip_date && errors.Trip_date)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ટ્રીપ તારીખ
                  </FormHelperText>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className="DatePickerCustom"
                      inputFormat="yyyy/mm/dd"
                      value={selectedDate}
                      maxDate={currentDate}
                      onChange={(newValue) => {
                        setSelectedDate(newValue); // Update the selectedDate state variable
                        setFieldValue("Trip_date", newValue); // Update the value in Formik
                      }}
                    />
                  </LocalizationProvider>
                  {touched.Trip_date && errors.Trip_date && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Trip_date}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Product_unit && errors.Product_unit)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    રુટ
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="રુટ સિલેક્ટ કરો"
                    options={statusDropdown}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    onChange={(e, value) => {
                      setFieldValue(
                        "Product_unit",
                        value?.label ? value.label : ""
                      );
                    }}
                    value={
                      values.Product_unit == ""
                        ? null
                        : statusDropdown.find(
                            (e) => e.label == values.Product_unit
                          )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="રુટ સિલેક્ટ કરો "
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                  {touched.Product_unit && errors.Product_unit && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Product_unit}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>
            <div>
              <div className="receiptCount">
                <p className="receiptColumn">ક્રમ</p>
                <p className="receiptDebitCredit">જમા/ઉધાર</p>
                <p className="customerName">કસ્ટમર</p>
                <p className="receiptPrice">રકમ</p>
                <p className="receiptPrice">બાકી રકમ</p>
              </div>
              <div className="receiptCount">
                <p className="receiptColumn">1</p>
                <p className="receiptDebitCredit">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Product_unit && errors.Product_unit)}
                  >
                    <Autocomplete
                      className="InputAutocomplete"
                      id="country-select-demo"
                      placeholder="રુટ સિલેક્ટ કરો"
                      options={creditDebit}
                      autoHighlight
                      getOptionLabel={(option) => option.label}
                      onChange={(e, value) => {
                        setFieldValue(
                          "Product_unit",
                          value?.label ? value.label : ""
                        );
                      }}
                      value={
                        values.Product_unit == ""
                          ? null
                          : creditDebit.find(
                              (e) => e.label == values.Product_unit
                            )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="જમા/ઉધાર સિલેક્ટ કરો "
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "off", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                    {touched.Product_unit && errors.Product_unit && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Product_unit}
                      </FormHelperText>
                    )}
                  </FormControl>
                </p>
                <p className="customerName">કસ્ટમર</p>
                <p className="receiptPrice">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Receipt_number && errors.Receipt_number
                    )}
                  >
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="રકમ દાખલ કરો"
                      type="text"
                      name="Receipt_number"
                      value={values.Receipt_number}
                      onChange={handleChange}
                    />
                    {touched.Receipt_number && errors.Receipt_number && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Receipt_number}
                      </FormHelperText>
                    )}
                  </FormControl>
                </p>
                <p className="receiptPrice">
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(
                      touched.Receipt_number && errors.Receipt_number
                    )}
                  >
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="બાકી રકમ દાખલ કરો"
                      type="text"
                      name="Receipt_number"
                      value={values.Receipt_number}
                      onChange={handleChange}
                    />
                    {touched.Receipt_number && errors.Receipt_number && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Receipt_number}
                      </FormHelperText>
                    )}
                  </FormControl>
                </p>
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

export default AddReceipt;
