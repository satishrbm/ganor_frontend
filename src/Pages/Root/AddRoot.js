import React, { useEffect, useState } from "react";
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
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";

const AddRoot = (props) => {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState([]);
  const getVehicleList = async () => {
    try {
      await axios
        .get(`${config.BaseURL}/api/route/vehicles`, {})
        .then((response) => {
          if (response.status == 200) {
            setVehicles(response.data);
          }
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  const getDeliveryBoys = async () => {
    try {
      await axios
        .get(`${config.BaseURL}/api/route/deliveryboy`, {})
        .then((response) => {
          if (response.status == 200) {
            setDeliveryBoy(response.data);
          }
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  useEffect(() => {
    getVehicleList();
    getDeliveryBoys();
  }, []);
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
  const handleRouteAdd = async (value) => {
    setLoading(true);
    try {
      await axios
        .post(`${config.BaseURL}/api/route/create`, value, {})
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
  const updateRoute = async (value) => {
    setLoading(true);
    try {
      await axios
        .put(`${config.BaseURL}/api/route/edit/${props.editData.id}`, value, {})
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
      <div>
        <Formik
          initialValues={{
            Route_name: props.editData ? props.editData.Route_name : "",
            Vehicle_number: props.editData
              ? props?.editData?.Vehicle_number?.id
              : "",
            Delivery_boy: props.editData ? props.editData.Delivery_boy.id : "",
          }}
          validationSchema={Yup.object().shape({
            Route_name: Yup.string().required("નામ દાખલ કરો"),
            Vehicle_number: Yup.string().required("વાહન નંબર સિલેક્ટ કરો"),
            Delivery_boy: Yup.string().required("ડિલિવરી બોય સિલેક્ટ કરો"),
          })}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            if (props.isEdit) {
              updateRoute(values);
            } else {
              handleRouteAdd(values);
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
                    error={Boolean(touched.Route_name && errors.Route_name)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      રૂટ નું નામ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="રૂટ નું નામ દાખલ કરો"
                      type="text"
                      name="Route_name"
                      value={values.Route_name}
                      onChange={handleChange}
                    />
                    {touched.Route_name && errors.Route_name && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Route_name}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
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
                      વાહન નંબર
                    </FormHelperText>
                    <Autocomplete
                      className="InputAutocomplete"
                      id="country-select-demo"
                      placeholder="વાહન નંબર સિલેક્ટ કરો"
                      options={vehicles}
                      key={"vehicles"}
                      getOptionLabel={(option) => option.Vehicle_number}
                      onChange={(e, value) => {
                        setFieldValue(
                          "Vehicle_number",
                          value?.id ? value.id : ""
                        );
                      }}
                      // value={
                      //   values.Vehicle_number == ""
                      //     ? null
                      //     : vehicles.find(
                      //         (e) => e.id == values.Vehicle_number
                      //       )
                      // }
                      value={
                        vehicles.find(
                          (vehicle) => vehicle.id === values.Vehicle_number
                        ) || null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="વાહન નંબર સિલેક્ટ કરો "
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "off",
                          }}
                        />
                      )}
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
                    error={Boolean(touched.Delivery_boy && errors.Delivery_boy)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      ડિલિવરી બોય
                    </FormHelperText>
                    <Autocomplete
                      className="InputAutocomplete"
                      id="country-select-demo"
                      placeholder="ડિલિવરી બોય સિલેક્ટ કરો"
                      options={deliveryBoy}
                      key={"deliveryBoy"}
                      autoHighlight
                      getOptionLabel={(option) => option.Name}
                      onChange={(e, value) => {
                        setFieldValue(
                          "Delivery_boy",
                          value?.id ? value.id : ""
                        );
                      }}
                      // value={
                      //   values.Delivery_boy == ""
                      //     ? null
                      //     : vehicles.find((e) => e.id == values.Delivery_boy)
                      // }
                      value={
                        deliveryBoy.find(
                          (boy) => boy.id === values.Delivery_boy
                        ) || null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="ડિલિવરી બોય સિલેક્ટ કરો "
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "off", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                    {touched.Delivery_boy && errors.Delivery_boy && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.Delivery_boy}
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

export default AddRoot;
