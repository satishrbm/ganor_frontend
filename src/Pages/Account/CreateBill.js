import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";



const CreateBill = (props) => {
  const currentDate = dayjs();
  const [value, setValue] = React.useState(0);
  const [customerRoute, setCustomerRoute] = useState([]);
  const [billData, setBillData] = useState([]);
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
  useEffect(() => {
    getRoute();
  }, []);

  const getBillDate = (Cutomer_route,Started_at,from_date) => {
    try {
      setLoading(true);
      axios
        .get(`${config.BaseURL}/api/bill/customers/${Cutomer_route}/${Started_at}/${from_date}/`, {})
        .then((response) => {
          setLoading(false);
          setBillData(response.data);
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

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const handleCheckboxChange = (customerId) => {    
    if (selectedCustomers.includes(customerId)) {      
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
    } else {     
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };
  const createBill = () => {
     const data = {
       "customer_ids": selectedCustomers,
       "from_date": fromDate,
       "to_date": toDate,
     };
    let generate_bill_api = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${config.BaseURL}/api/bill/generate_bill_api/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    setLoading(true);
    try {
      axios
        .request(generate_bill_api)
        .then((response) => { 
          setLoading(false);
          if (response.status == 200) {
              setAlertMessage("Bills Created Successfully");
              setAlertStyle("success");
              setShowToaster(true);
          }
        })
        .catch((err) => {
          console.log(err);
           setLoading(false);
           setAlertMessage(err.response.data.error);
           setAlertStyle("error");
           setShowToaster(true);
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  return (
    <div>
      {loading ? <Loader /> : null}
      <div>
        <Formik
          initialValues={{
            Cutomer_route: "",
            Started_at: "",
            from_date: "",
          }}
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            Cutomer_route: Yup.string().required("Cutomer_route દાખલ કરો"),
            Started_at: Yup.string().required("શરૂ કરેલ તારીખ દાખલ કરો"),
            from_date: Yup.string().required("શરૂ કરેલ તારીખ દાખલ કરો"),
          })}
          onSubmit={(values, { resetForm }) => {
            const output = values;
            output.Started_at = dayjs(values.Started_at).format("YYYY-MM-DD");
            output.from_date = dayjs(values.from_date).format("YYYY-MM-DD");
            setFromDate(dayjs(values.Started_at).format("YYYY-MM-DD"));
            setToDate(dayjs(values.from_date).format("YYYY-MM-DD"));
            getBillDate(
              output.Cutomer_route,
              output.Started_at,
              output.from_date
            );
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
                <div className="inputDiv-customer" style={{ width: "25%" }}>
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
                <div className="inputDiv-customer" style={{ width: "25%" }}>
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.Started_at && errors.Started_at)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-start-date-login"
                    >
                      ફ્રોમ તારીખ
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
                <div className="inputDiv-customer" style={{ width: "25%" }}>
                  <FormControl
                    className="inputFormControl"
                    error={Boolean(touched.from_date && errors.from_date)}
                  >
                    <FormHelperText
                      className="inputLabel"
                      id="standard-weight-helper-text-start-date-login"
                    >
                      ટુ તારીખ
                    </FormHelperText>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        className="DatePickerCustom"
                        inputFormat="yyyy/mm/dd"
                        maxDate={currentDate}
                        value={values.from_date} // Pass the current value from Formik
                        onChange={
                          (newValue) =>
                            setFieldValue(
                              "from_date",
                              dayjs(newValue, "YYYY/MM/DD")
                            ) // Update the value in Formik
                        }
                      />
                    </LocalizationProvider>
                    {touched.from_date && errors.from_date && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-start-date-login"
                      >
                        {errors.from_date}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div style={{ width: "20%" }}>
                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                    className="searchButton"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <></>
      <>
        <table className="BillTableDetails">
          <tr>
            <th className="inputCheckbox"></th>
            <th className="BillCustomerName">કસ્ટમર</th>
            <th className="BillTotalBottle">ટોટલ થેલી </th>
            <th className="BillTotalBottle">ભાવ</th>
            <th className="BillTotalBottle">દૂધની રકમ</th>
            <th className="BillCustomerName">અન્ય વસ્તુઓ</th>
            <th className="BillTotalBottle">અન્ય રકમ</th>
            <th className="BillTotalBottle">પાછળના</th>
            <th className="BillTotalBottle">ટોટલ</th>
          </tr>
          {billData.map((item, index) => {
            return (
              <tr key={index}>
                <td className="inputCheckbox">
                  <input
                    type="checkbox"
                    name={"selectCustomer" + index}
                    id={"selectCustomer" + index}
                    onChange={() => handleCheckboxChange(item.customer_id)}
                    checked={selectedCustomers.includes(item.customer_id)}
                  />
                </td>
                <td className="BillCustomerName">{item.name}</td>
                <td className="BillTotalBottle">{item.total_bottles}</td>
                <td className="BillTotalBottle">{item.milk_price}</td>
                <td className="BillTotalBottle">{item.total_cost}</td>
                <td className="BillCustomerName">dudh</td>
                <td className="BillTotalBottle">0</td>
                <td className="BillTotalBottle">0</td>
                <td className="BillTotalBottle">{item.total_cost}</td>
              </tr>
            );
          })}
        </table>
      </>

      <div>
        <Button
          className="SaveButton"
          type="button"
          onClick={() => {
            createBill(selectedCustomers);
          }}
        >
          Save
        </Button>
      </div>
      <></>
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
}

export default CreateBill
