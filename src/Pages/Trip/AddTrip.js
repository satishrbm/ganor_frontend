import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import axios from "axios";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";
import CloseIcon from "@mui/icons-material/Close";

// Start Grid Import

import { filter } from "lodash";
// import MainCard from "ui-component/cards/MainCard";
import { Link as RouterLink } from "react-router-dom";
// material
import {
  Table,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
  Tooltip,
  IconButton,
  Toolbar,
} from "@mui/material";
import ScrollBar from "react-perfect-scrollbar";
import UserListHead from "./UserListHead";
// import SponsorForm from "./AdminForm/SponsorForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TocIcon from "@mui/icons-material/Toc";
import { styled } from "@mui/material/styles";
// import { IconPencil, IconTrash } from "@tabler/icons";

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: "", label: "", alignRight: false },
  { id: "customer_id", label: "કસ્ટમર નંબર", alignRight: false },
  { id: "name", label: "Nick Name", alignRight: false },
  { id: "total_bottle", label: "ગઈકાલ ની બોટલ", alignRight: false },
  { id: "milk_need_today", label: "આજ ની બોટલ", alignRight: false },
  { id: "tommorrow_bottle", label: "આવતીકાલ ની બોટલ", alignRight: false },
];
//ahiya column add kari deje

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

// End Grid Import
const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 60,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: "100%",
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": {
    width: "100%",
    boxShadow: "8px 16px 20px rgb(145 158 171/24%)",
  },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

// MilkOneUpdate.propTypes = {
//   numSelected: PropTypes.number,
//   filterName: PropTypes.string,
//   onFilterName: PropTypes.func,
// };


const AddTrip = (props) => {
  const currentDate = dayjs();
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
  const [selectedRoute, setSelectedRoute] = useState("");
  const [bottleCount, setBottleCount] = useState("");
  const [bottleCount1, setBottleCount1] = useState(""); //total_bottle_all
  const [bottleCount2, setBottleCount2] = useState(""); //milk need today
  const [bottleCount3, setBottleCount3] = useState(""); // tommorow bottle all

  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };

  const getOrderNumber = () => {
    try {
      setLoading(true);
      axios
        .get(`${config.BaseURL}/api/trip/tripnumber`, {})
        .then((response) => {
          setLoading(false);
          setTripNumber(response.data.order_number);
        })
        .catch((err) => {
          setLoading(false);
          alert(err.response.data.error);
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
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
          customer_data = customer_data.sort(function (a, b) {
            return a.sequence_number - b.sequence_number;
          });
          setSponsorDate(customer_data ? customer_data : []);
          setBottleCount1(response.data.total_bottle_all);
          setBottleCount2(response.data.milk_need_today_all);
          setBottleCount3(response.data.tomorrow_bottle_all);
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
  const handleTripSubmit = (value) => {
    value["Route_name"] = selectedRoute;
    try {
      setLoading(true);
      axios
        .post(`${config.BaseURL}/api/trip/create/`, value, {})
        .then((response) => {
          if (response.status == 201) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            setTimeout(() => {
              props.setModalRoute(false);
            }, 1000);
            setLoading(false);
          }
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

  useEffect(() => {
    getOrderNumber();
    getRoute();
  }, []);

  // Start Grid JS

  const [sponsorDate, setSponsorDate] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("Order_number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [isExtraCustomer, setIsExtraCustomer] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [bkpCustomersData, setBkpCustomersData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleCheckboxChange = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  const getCustomers = () => {
    try {
      axios
        .get(`${config.BaseURL}/api/trip/customers`, {})
        .then((response) => {
          setCustomersData(response.data);
          setBkpCustomersData(response.data);
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
  useEffect(() => {
    if (searchText) {
      let data = bkpCustomersData.filter(
        (x) =>
          x.Customer_name.includes(searchText.toString()) ||
          x.N_name.includes(searchText.toString()) ||
          x.address.includes(searchText.toString())
      );
      setCustomersData(data);
    } else {
      setCustomersData(bkpCustomersData);
    }
  }, [searchText]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleCloseExtraCustomer = () => {
    setIsExtraCustomer(false);
  };
  const handleSaveExtraCustomer = async () => {
    try {
      let value = {
        customer_ids: selectedCustomers,
        new_route_id: selectedRoute,
      };
      setLoading(true);
      await axios
        .put(`${config.BaseURL}/api/trip/customer/routeupdate/`, value, {})
        .then((response) => {
          if (response.status == 200) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            setLoading(false);
            setIsExtraCustomer(false);
            handleChangeRoute(selectedRoute);
          }
        })
        .catch((err) => {
          setAlertMessage(err.response.data.error);
          setAlertStyle("error");
          setShowToaster(true);
          setLoading(false);
        });
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sponsorDate.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const [open, setOpen] = useState(false);
  //Start snackbar and toast
  const handleOpenClick = () => {
    setOpen(true);
  };
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    code: "",
  });

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sponsorDate.length) : 0;

  const filteredUsers = applySortFilter(
    sponsorDate,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  const handleDragEnd = (result, provided) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    setSponsorDate((prev) => {
      const temp = [...prev];
      const [removed] = temp.splice(result.source.index, 1);
      temp.splice(result.destination.index, 0, removed);

      // Update sequence numbers
      temp.forEach((element, i) => {
        element.sequence_number = i + 1;
      });

      return temp;
    });
    let params = [];
    sponsorDate.forEach((element) => {
      params.push({
        Customer: element.customer_id,
        Sequence_number: element.sequence_number,
      });
    });
    axios
      .post(`${config.BaseURL}/api/customer/sequences`, params)
      .then((response) => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage(err.response.data.error);
        setAlertStyle("error");
        setShowToaster(true);
        setLoading(false);
      });
  };

  // End Grid JS

  return (
    <div>
      {loading ? <Loader /> : null}
      <Formik
        initialValues={{
          Trip_number: tripNumber,
          Trip_date: currentDate,
          Route_name: "", //ID
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
          handleTripSubmit(output);
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
                      minDate={currentDate}
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
                  error={Boolean(touched.Route_name && errors.Route_name)}
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
                    getOptionLabel={(option) => option.Route_name}
                    onChange={(e, value) => {
                      setFieldValue("Route_name", value?.id ? value.id : "");
                      if (value?.id) {
                        handleChangeRoute(value.id);
                      }
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
              <div className="inputDiv-customer">
                <p style={{ margin: 0 }}>વધારાના કસ્ટમર</p>
                <p
                  className="moreCustomerAdd"
                  onClick={() => {
                    if (selectedRoute != "") {
                      setIsExtraCustomer(true);
                    } else {
                      setAlertStyle("error");
                      setAlertMessage("પહેલા રૂટ સિલેક્ટ કરો");
                      setShowToaster(true);
                    }
                  }}
                >
                  વધારાના કસ્ટમર ઉમેરો
                </p>
              </div>
              <div>
                <Container>
                  <Box sx={{ border: "1px solid #ddd", borderRadius: "10px" }}>
                    <ScrollBar>
                      <TableContainer sx={{ minWidth: 800, width: "100%" }}>
                        <Table>
                          <UserListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={sponsorDate.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                          />
                          <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable
                              droppableId="droppable"
                              direction="vertical"
                            >
                              {(droppableProvided) => (
                                <TableBody
                                  ref={droppableProvided.innerRef}
                                  {...droppableProvided.droppableProps}
                                >
                                  {sponsorDate
                                    .slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row, index) => {
                                      const {
                                        id,
                                        customer_id,
                                        customer_number,
                                        name,
                                        total_bottle,
                                        milk_need_today,
                                        tommorrow_bottle,
                                      } = row;
                                      const isItemSelected =
                                        selected.indexOf(customer_id) !== -1;

                                      return (
                                        <Draggable
                                          key={row.customer_id}
                                          draggableId={row.customer_id.toString()}
                                          index={index}
                                        >
                                          {(draggableProvided, snapshot) => {
                                            return (
                                              <>
                                                <TableRow
                                                  ref={
                                                    draggableProvided.innerRef
                                                  }
                                                  {...draggableProvided.draggableProps}
                                                  style={{
                                                    ...draggableProvided
                                                      .draggableProps.style,
                                                    background:
                                                      snapshot.isDragging
                                                        ? "rgba(245,245,245, 0.75)"
                                                        : "none",
                                                  }}
                                                >
                                                  <TableCell align="left">
                                                    <div
                                                      {...draggableProvided.dragHandleProps}
                                                    >
                                                      <TocIcon />
                                                    </div>
                                                  </TableCell>
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                    padding="none"
                                                  >
                                                    <Stack
                                                      direction="row"
                                                      alignItems="center"
                                                      spacing={2}
                                                    >
                                                      <Typography
                                                        variant="subtitle2"
                                                        noWrap
                                                      >
                                                        {customer_number}
                                                      </Typography>
                                                    </Stack>
                                                  </TableCell>
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                    padding="none"
                                                  >
                                                    <Stack
                                                      direction="row"
                                                      alignItems="center"
                                                      spacing={2}
                                                    >
                                                      <Typography
                                                        variant="subtitle2"
                                                        noWrap
                                                      >
                                                        {name}
                                                      </Typography>
                                                    </Stack>
                                                  </TableCell>
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                    padding="none"
                                                  >
                                                    <Stack
                                                      direction="row"
                                                      alignItems="center"
                                                      spacing={2}
                                                    >
                                                      <Typography
                                                        variant="subtitle2"
                                                        noWrap
                                                      >
                                                        {total_bottle}
                                                      </Typography>
                                                    </Stack>
                                                  </TableCell>
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                    padding="none"
                                                  >
                                                    <Stack
                                                      direction="row"
                                                      alignItems="center"
                                                      spacing={2}
                                                    >
                                                      <Typography
                                                        variant="subtitle2"
                                                        noWrap
                                                      >
                                                        {milk_need_today}
                                                      </Typography>
                                                    </Stack>
                                                  </TableCell>
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                    padding="none"
                                                  >
                                                    <Stack
                                                      direction="row"
                                                      alignItems="center"
                                                      spacing={2}
                                                    >
                                                      <Typography
                                                        variant="subtitle2"
                                                        noWrap
                                                      >
                                                        {tommorrow_bottle}
                                                      </Typography>
                                                    </Stack>
                                                  </TableCell>
                                                </TableRow>
                                                {index ==
                                                sponsorDate.length - 1 ? (
                                                  <TableRow>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell
                                                      style={{
                                                        fontSize: 20,
                                                        fontWeight: 600,
                                                        background: "#7556d547",
                                                      }}
                                                    >
                                                      {bottleCount1}
                                                    </TableCell>
                                                    <TableCell
                                                      style={{
                                                        fontSize: 20,
                                                        fontWeight: 600,
                                                        background: "#7556d547",
                                                      }}
                                                    >
                                                      {bottleCount2}
                                                    </TableCell>
                                                    <TableCell
                                                      style={{
                                                        fontSize: 20,
                                                        background: "#7556d547",
                                                        fontWeight: 600,
                                                      }}
                                                    >
                                                      {bottleCount3}
                                                    </TableCell>
                                                  </TableRow>
                                                ) : null}
                                              </>
                                            );
                                          }}
                                        </Draggable>
                                      );
                                    })}
                                  {droppableProvided.placeholder}
                                </TableBody>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </Table>
                      </TableContainer>
                    </ScrollBar>
                  </Box>
                </Container>
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
      <div>
        <Dialog
          open={isExtraCustomer}
          onClose={handleCloseExtraCustomer}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              maxWidth: "900px",
              width: "100%",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" className="modalHeaderFlex">
            <p className="">વધારાના કસ્ટમર ઉમેરો</p>
            <span className="popupCloseIcon">
              {<CloseIcon onClick={() => handleCloseExtraCustomer()} />}
            </span>
          </DialogTitle>
          <DialogContent>
            <div className="inputDiv-customer">
              <FormControl className="inputFormControl">
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
                  }}
                  value={
                    customerRoute.find((route) => route.id === selectedRoute) ||
                    null
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
              </FormControl>
            </div>
            <></>
            <RootStyle>
              <SearchStyle
                value={searchText}
                onChange={(text) => {
                  setSearchText(text.target.value);
                }}
                placeholder="Search..."
                className="SearchInputBar"
              />
            </RootStyle>
            <table
              border="1"
              style={{ borderCollapse: "collapse", width: "98%" }}
            >
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Customer Name</th>
                  <th>Nick Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {customersData.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleCheckboxChange(customer.id)}
                      />
                    </td>
                    <td>{customer.Customer_name}</td>
                    <td>{customer.N_name}</td>
                    <td>{customer.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: "10px 30px",
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid var(--borderColor)",
              padding: "20px 24px!important",
            }}
          >
            <Button
              className="CancelButton"
              onClick={() => handleCloseExtraCustomer()}
            >
              Cancel
            </Button>
            <Button
              className="SaveButton"
              onClick={() => handleSaveExtraCustomer()}
              type="button"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
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

export default AddTrip;
