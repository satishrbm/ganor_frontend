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

const AddLandMark = (props) => {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState([]);
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
  const handleLandMarkAdd = async (value) => {
    setLoading(true);
    try {
      await axios
        .post(`${config.BaseURL}/api/customer/landmarks/create`, value, {})
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
            landmark: props.editData ? props.editData.landmark : "",
          }}
          validationSchema={Yup.object().shape({
            landmark: Yup.string().required("લેન્ડમાર્ક નામ દાખલ કરો"),
          })}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            if (props.isEdit) {
              updateRoute(values);
            } else {
              handleLandMarkAdd(values);
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
                    error={Boolean(touched.landmark && errors.landmark)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-email-login"
                    >
                      લેન્ડમાર્ક નું નામ
                    </FormHelperText>
                    <OutlinedInput
                      className="outlineInputChange"
                      variant="outlined"
                      placeholder="લેન્ડમાર્ક નું નામ દાખલ કરો"
                      type="text"
                      name="landmark"
                      value={values.landmark}
                      onChange={handleChange}
                    />
                    {touched.landmark && errors.landmark && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-email-login"
                      >
                        {errors.landmark}
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

export default AddLandMark;
