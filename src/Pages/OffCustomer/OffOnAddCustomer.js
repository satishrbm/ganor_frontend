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
import React, { useEffect, useState } from "react";
import "./AddCustomer.css";
import dayjs from "dayjs";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";
const statusDropdown = [
  { label: "એકટીવ", id: "1" },
  { label: "ડીએકટીવ", id: "0" },
];

const OffOnAddCustomer = (props) => {
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
    const { Current_status } = value;

    setLoading(true);
    try {
      await axios
        .put(
          `${config.BaseURL}/api/customer/customer_reactive/${props.editData.id}/`,
          {Current_status},
          {}
        )
        .then((response) => {
          if (response.status == 200) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
              props.setModalRoute(false);
              // props.setOnClose(true);
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
            Customers: props.editData.C_name
              ? props.editData.C_name
              : props.editData.C_name,
            Current_status: 0 ? 0 : "",
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            Customers: Yup.string().required("નામ દાખલ કરો"),
            Current_status: Yup.string().required("કારણ દાખલ કરો"),
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
                      value={props.editData.C_name}
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

export default OffOnAddCustomer;
