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
  TextField,
} from "@mui/material";
import { Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";

const statusDropdown = [
  { label: "થેલી" },
  { label: "લીટર" },
  { label: "ગ્રામ" },
  { label: "કિ.ગ્રા" },
  { label: "મિલી" },
  { label: "નંગ" },
];

const AddProduct = (props) => {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("");

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
          Product_name: props.editData ? props.editData.Product_name : "",
          Hsn_code: props.editData ? props.editData.Hsn_code : "",
          Product_unit: props.editData ? props.editData.Product_unit : "",
          Product_price: props.editData ? props.editData.Product_price : "",
          Previous_stock: props.editData ? props.editData.Previous_stock : "",
          Minimum_stock: props.editData ? props.editData.Minimum_stock : "",
          Maximum_stock: props.editData ? props.editData.Maximum_stock : "",
          Product_active: props.editData
            ? props.editData.Product_active
            : false,
        }}
        validationSchema={Yup.object().shape({
          Product_name: Yup.string().required("પ્રોડક્ટ નામ દાખલ કરો"),
          Hsn_code: Yup.string().required("HSN Code દાખલ કરો"),
          Product_unit: Yup.string().required("યુનિટ દાખલ કરો"),
          Product_price: Yup.string().required("ભાવ દાખલ કરો"),
          Previous_stock: Yup.string().required("આગળ નો સ્ટોક દાખલ કરો"),
          Minimum_stock: Yup.string().required("મિનિમમ સ્ટોક દાખલ કરો"),
          Maximum_stock: Yup.string().required("મહત્તમ સ્ટોક દાખલ કરો"),
          // Product_active: Yup.string().required("સક્રિય સિલેક્ટ કરો"),
        })}
        onSubmit={(values, { resetForm }) => {
          if (props.isEdit) {
            handleEditProduct(values);
          } else {
            handleAddProduct(values);
          }
          // handleAddProduct(values);
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
                  error={Boolean(touched.Product_name && errors.Product_name)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    પ્રોડક્ટ નામ
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="પ્રોડક્ટ નામ દાખલ કરો"
                    type="text"
                    name="Product_name"
                    value={values.Product_name}
                    onChange={handleChange}
                  />
                  {touched.Product_name && errors.Product_name && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Product_name}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Hsn_code && errors.Hsn_code)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    HSN Code
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="HSN code દાખલ કરો"
                    type="text"
                    name="Hsn_code"
                    value={values.Hsn_code}
                    onChange={handleChange}
                  />
                  {touched.Hsn_code && errors.Hsn_code && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Hsn_code}
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
                    યુનિટ
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="યુનિટ સિલેક્ટ કરો"
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
                        placeholder="યુનિટ સિલેક્ટ કરો "
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
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Product_price && errors.Product_price)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ભાવ
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="ભાવ દાખલ કરો"
                    type="text"
                    name="Product_price"
                    value={values.Product_price}
                    onChange={handleChange}
                  />
                  {touched.Product_price && errors.Product_price && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Product_price}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(
                    touched.Previous_stock && errors.Previous_stock
                  )}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    આગળ નો સ્ટોક
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="આગળ નો સ્ટોક દાખલ કરો"
                    type="text"
                    name="Previous_stock"
                    value={values.Previous_stock}
                    onChange={handleChange}
                  />
                  {touched.Previous_stock && errors.Previous_stock && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Previous_stock}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Minimum_stock && errors.Minimum_stock)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    મિનિમમ સ્ટોક
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="મિનિમમ સ્ટોક દાખલ કરો"
                    type="text"
                    name="Minimum_stock"
                    value={values.Minimum_stock}
                    onChange={handleChange}
                  />
                  {touched.Minimum_stock && errors.Minimum_stock && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Minimum_stock}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(touched.Maximum_stock && errors.Maximum_stock)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    મહત્તમ સ્ટોક
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="મહત્તમ સ્ટોક દાખલ કરો"
                    type="text"
                    name="Maximum_stock"
                    value={values.Maximum_stock}
                    onChange={handleChange}
                  />
                  {touched.Maximum_stock && errors.Maximum_stock && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Maximum_stock}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              <div className="inputDiv-customer">
                <FormControl
                  className="inputFormControl"
                  error={Boolean(
                    touched.Product_active && errors.Product_active
                  )}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="success"
                        name="Product_active"
                        checked={values.Product_active}
                        onChange={(e) => {
                          const value = e.target.checked; // Convert to string
                          handleChange({
                            target: { name: "Product_active", value },
                          });
                        }}
                      />
                    }
                    label="સક્રિય"
                  />
                  {touched.Product_active && errors.Product_active && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Product_active}
                    </FormHelperText>
                  )}
                </FormControl>
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

export default AddProduct;
