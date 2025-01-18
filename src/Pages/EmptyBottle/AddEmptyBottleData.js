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
import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import config from "../../Utils/config";
import axios from "axios";
import Loader from "../../Component/Loader";

const AddEmptyBottleData = (props) => {
  const currentDate = dayjs(props.selectedDate);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [tripNumber, setTripNumber] = useState();
  const [customerRoute, setCustomerRoute] = useState([]);
  const [deliveryBoyRoute, setDeliveryBoyRoute] = useState([]);
  const [vehiclesRoute, setVehiclesRoute] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(props.selectedRoute);
  const [bottleCount, setBottleCount] = useState("");
  const [sponsorDate, setSponsorDate] = useState([]);
  const [gridTotalBottle, setGridTotalBottle] = useState([]);
  const [gridTotalTakeBottle, setGridTotalTakeBottle] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customersData, setCustomersData] = useState([]);
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
        .get(`${config.BaseURL}/api/trip/routelist`, {})
        .then((response) => {
          setLoading(false);
          setCustomerRoute(response.data);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage(err.response.data.message);
          setAlertStyle("error");
          setShowToaster(true);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const getCustomers = () => {
    try {
      axios
        .get(`${config.BaseURL}/api/trip/customers`, {})
        .then((response) => {
          setCustomersData(response.data);
          let cust = response.data.map((item) => item.id);
          let output = sponsorDate.filter((item) => cust.includes(item.id));
          setSelectedCustomers(output.map((item) => item.id));
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleChangeRoute = (routeValue) => {
    setSelectedRoute(routeValue);
    try {
      setLoading(true);
      axios
        .get(`${config.BaseURL}/api/trip/route/${routeValue}/`, {})
        .then((response) => {
          setLoading(false);
          setDeliveryBoyRoute(response.data.delivery_boys);
          setSelectedDeliveryBoy(
            response.data.delivery_boys.length > 0
              ? response.data.delivery_boys[0].id
              : ""
          );
          setVehiclesRoute(response.data.vehicles);
          setSelectedVehicle(
            response.data.vehicles.length > 0
              ? response.data.vehicles[0].id
              : ""
          );
          let customer_data = response.data.customer_data_list;
          let total_count=0
          customer_data.forEach((element) => {
            element["come_bottle"] = element.total_bottle;
            total_count+=element.total_bottle;
          });
          setGridTotalBottle(total_count)
          setGridTotalTakeBottle(total_count)
          // let all_data = response.data.supplies_data_list; //supplies_data_list api mathi nathi aavtu
          let current_date = dayjs(new Date()).format("YYYY-MM-DD");
          // console.log("all_data.data---==---", all_data);
          // let filter = all_data.filter(
          //   (item) => item.Supply_date == current_date
          // );
          // customer_data.forEach((element) => {
          //   element["come_bottle"] = "";
          //   filter.forEach((today) => {
          //     if (element.id == today.customer_id) {
          //       element["bottle_count"] = today.Today_bottle;
          //     }
          //   });
          // });
          customer_data = customer_data.sort(function (a, b) {
            return a.sequence_number - b.sequence_number;
          });
          setSponsorDate(customer_data ? customer_data : []);
          setBottleCount(
            response.data.supplies_data_list
              ? response.data.supplies_data_list
              : []
          );
          setSelectedCustomers([]);
          getCustomers();
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
    //  getOrderNumber();
    getRoute();
    handleChangeRoute(selectedRoute);
  }, []);
  const updateComeBottleForRow = (rowIndex, newValue) => {
    const updatedArray = [...sponsorDate];
    let total_count=0;
    if (updatedArray[rowIndex].total_bottle < newValue) {
      updatedArray[rowIndex].come_bottle = updatedArray[rowIndex].total_bottle;
      setSponsorDate(updatedArray);
      updatedArray.forEach((element) => {
        total_count += parseInt(element.come_bottle);
      });
      setGridTotalBottle(total_count)
    } else {
      updatedArray[rowIndex].come_bottle = newValue;
      setSponsorDate(updatedArray);
      updatedArray.forEach((element) => {
        total_count += parseInt(element.come_bottle);
      });
      setGridTotalBottle(total_count);
    }
   
  };
  return (
    <div>
      {loading ? <Loader /> : null}
      <Formik
        initialValues={{
          Trip_number: props.selectedTripNumber,
          Trip_date: currentDate,
          Route_name: props.selectedRoute, //ID
          Vehicle_number: selectedVehicle, // ID
          Delivery_boy: selectedDeliveryBoy,
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          Trip_number: Yup.string().required("ક્રમ દાખલ કરો"),
          Trip_date: Yup.string().required("ટ્રીપ તારીખ દાખલ કરો"),
          // Route_name: Yup.string().required("રુટ નું નામ દાખલ કરો"),
          Vehicle_number: Yup.string().required("વાહન નંબર દાખલ કરો"),
          Delivery_boy: Yup.string().required("ડિલિવરી બોય દાખલ કરો"),
        })}
        onSubmit={(values, { resetForm }) => {
          const output = values;
          output.Trip_date = dayjs(values.Trip_date).format("YYYY-MM-DD");
          let updateBottle = [];
          sponsorDate.forEach((element) => {
            updateBottle.push({
              Customer: element.customer_id,
              Today_return_bottle: parseInt(element.come_bottle),
              Supply_date: dayjs(values.Trip_date).format("YYYY-MM-DD"),
            });
          });
          try {
            setLoading(true);
            axios
              .post(
                `${config.BaseURL}/api/trip/bulk_bottle_update/`,
                updateBottle,
                {}
              )
              .then((response) => {
                if (response.status == 200) {
                  setAlertMessage(response.data.message);
                  setAlertStyle("success");
                  setShowToaster(true);
                  setTimeout(() => {
                    props.setIsEmptyBottle(false);
                  }, 2000);
                  setLoading(false);
                }
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
                  error={Boolean(touched.Trip_number && errors.Trip_number)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ટ્રીપ નંબર
                  </FormHelperText>
                  <OutlinedInput
                    className="outlineInputChange"
                    variant="outlined"
                    placeholder="ટ્રીપ નંબર દાખલ કરો"
                    type="text"
                    name="Trip_number"
                    disabled={true}
                    value={values.Trip_number}
                    onChange={handleChange}
                  />
                  {touched.Trip_number && errors.Trip_number && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-email-login"
                    >
                      {errors.Trip_number}
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
                  // error={Boolean(touched.Route_name && errors.Route_name)}
                >
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    રુટ નું નામ
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="કસ્ટમર નો રૂટ સેલેક્ટ કરો"
                    autoHighlight="off"
                    options={customerRoute}
                    key={"Route_name"}
                    getOptionLabel={(option) => option.Route_name}
                    onChange={(e, value) => {
                      if (value?.id) {
                        handleChangeRoute(value.id);
                      }
                      setTimeout(() => {
                        setFieldValue("Route_name", value?.id ? value.id : "");
                      }, 1000);
                    }}
                    value={
                      customerRoute.find(
                        (route) => route.id === selectedRoute
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

                  {touched.Route_name && errors.Route_name && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-Route_name-login"
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
                    onChange={(e, value) => {
                      setFieldValue(
                        "Vehicle_number",
                        value?.id ? value.id : ""
                      );
                    }}
                    className="InputAutocomplete"
                    id="country-select-demo"
                    options={vehiclesRoute}
                    key={"Vehicle_number"}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    value={
                      values.Vehicle_number == ""
                        ? null
                        : vehiclesRoute.find(
                            (e) => e.id == values.Vehicle_number
                          )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="વાહન નંબર સિલેક્ટ કર "
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />

                  {touched.Vehicle_number && errors.Vehicle_number && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-Vehicle_number-login"
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
                    onChange={(e, value) => {
                      setFieldValue("Delivery_boy", value?.id ? value.id : "");
                    }}
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="કસ્ટમર નો રૂટ સેલેક્ટ કરો"
                    options={deliveryBoyRoute}
                    key={"Delivery_boy"}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    value={
                      values.Delivery_boy == ""
                        ? null
                        : deliveryBoyRoute.find(
                            (e) => e.id == values.Delivery_boy
                          )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="ડિલિવરી બોય સિલેક્ટ કર "
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
                      id="standard-weight-helper-text-Delivery_boy-login"
                    >
                      {errors.Delivery_boy}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>
            <div>
              <div className="customer-data-bottle-head">
                <p>કસ્ટમર નું નામ</p>
                <p>કસ્ટમર નું એડ્રેસ</p>
                <p>ટોટલ ખાલી બોટલ લેવાની</p>
                <p>આજે બોટ્ટલે આવી</p>
              </div>
              {sponsorDate &&
                sponsorDate.map((item, index) => {
                  return (
                    <div className="customer-data-bottle-head">
                      <p>{item.name}</p>
                      <p>{item.nick_name}</p>
                      <p>{item.total_bottle}</p>
                      <p>
                        <input
                          type="number"
                          placeholder="આજે આવેલી ખાલી બોટ્ટલ નાખો"
                          className="empty-bottle-input"
                          value={item.come_bottle}
                          onChange={(e) =>
                            updateComeBottleForRow(index, e.target.value)
                          }
                        />
                      </p>
                    </div>
                  );
                })}
              <div
                className="customer-data-bottle-head"
                style={{ fontSize: 18, fontWeight: 600 }}
              >
                <p> </p>
                <p> </p>
                <p>{gridTotalTakeBottle}</p>
                <p>{gridTotalBottle}</p>
              </div>
            </div>

            <div>
              <Button
                className="SaveButton"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Save
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

export default AddEmptyBottleData;
