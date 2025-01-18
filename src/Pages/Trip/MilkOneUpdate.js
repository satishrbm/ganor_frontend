import PropTypes from "prop-types";
// material
import { styled } from "@mui/material/styles";
import {
  Toolbar,
  OutlinedInput,
  Stack,
  Snackbar,
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
} from "@mui/material";
// component
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../App";
import config from "../../Utils/config";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import Loader from "../../Component/Loader";

// ----------------------------------------------------------------------

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

MilkOneUpdate.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function MilkOneUpdate({
  selected,
  numSelected,
  filterName,
  onFilterName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [Customer_name, setCustomer_name] = useState("");
  const [N_name, setN_name] = useState("");
  const [Order_number, setOrder_number] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [userList, setUserList] = useState([]);
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedBottle, setSelectedBottle] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyle, setAlertStyle] = useState("");
  const [customerRoute, setCustomerRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

// const getRoute = () => {
//   try {
//     setLoading(true);
//     axios
//       .get(`${config.BaseURL}/api/trip/routelist`, {})
//       .then((response) => {
//         setLoading(false);
//         setCustomerRoute(response.data);
//       })
//       .catch((err) => {
//         setLoading(false);
//         setAlertMessage(err.response.data.error);
//         setAlertStyle("error");
//         setShowToaster(true);
//         setLoading(false);
//       });
//   } catch (error) {
//     setLoading(false);
//     console.error(error);
//   }
// };

const handleChangeRoute = () => {
  // setSelectedRoute(routeValue);
  try {
    setLoading(true);
    axios
      .get(`${config.BaseURL}/api/trip/customers`, {})
      .then((response) => {
        setLoading(false);
        setUserList(response.data);
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
  handleChangeRoute()
}, []);
 useEffect(() => {
   let data = userList.filter(
     (x) =>
       (x.Order_number && x.Order_number.toString() == searchText) ||
       x.N_name.toString().toLowerCase().indexOf(searchText.toLowerCase()) !==
         -1 ||
       x.C_name.toString().toLowerCase().indexOf(searchText.toLowerCase()) !==
         -1
   );
   if (data.length > 0) {
     data.forEach((element) => {
       element["bottle_count"] = "";
       element["date"] = currentDate;
     });
     setFilteredCustomers(data);
   } else {
     setCustomer_name("");
     setN_name("");
     setOrder_number("");
     setSelectedId("");
   }
 }, [searchText]);
const handleMilkUpdate=(id)=>{
 
   let data = filteredCustomers;
   let customer_id = "";
   let date = "";
   let today_bottle = "";
   data.forEach((element) => {
     if (element.id == id) {
       customer_id = element.id;
       date = element.date;
       today_bottle = element.bottle_count;
     }
   });
   let params = {
     Customers: customer_id,
     Date: dayjs(date).format("YYYY-MM-DD"),
     milk_need: today_bottle,
   };
   axios
     .post(`${config.BaseURL}/api/customer/extramilk/`, params, {})
     .then((response) => {
       setAlertStyle("success");
       setAlertMessage("Bottle updated successful");
       setShowToaster(true);
     })
     .catch((err) => {
       setAlertStyle("error");
       setAlertMessage(err.response.data.error);
       setShowToaster(true);
     });
}
 const handleCloseToaster = (event, reason) => {
   if (reason === "clickaway") {
     return;
   }
   setAlertMessage("");
   setShowToaster(false);
 };

  return (
    <>
      {loading ? <Loader /> : null}
      {/*<div className="inputDiv-customer">
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
              customerRoute.find((route) => route.id === selectedRoute) || null
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
              </div>*/}
      <RootStyle
        sx={{
          ...(numSelected > 0 && {
            color: "primary.main",
            bgcolor: "primary.lighter",
          }),
        }}
      >
        <SearchStyle
          value={searchText}
          onChange={(text) => {
            setSearchText(text.target.value);
          }}
          placeholder="Search..."
          className="SearchInputBar"
        />
      </RootStyle>
      {filteredCustomers.length > 0 ? (
        <table border={1}>
          <tr>
            <th>કસ્ટમર કોડ</th>
            <th>Name</th>
            <th>Nick Name</th>
            <th>Supply Date</th>
            <th>Bottle</th>
          </tr>

          {searchText &&
            filteredCustomers.map((item, i) => {
              if (i <= 10)
                return (
                  <tr>
                    <td>{item.Order_number}</td>
                    <td>{item.N_name}</td>
                    <td>{item.C_name}</td>
                    <td>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          className="DatePickerCustom"
                          inputFormat="yyyy/mm/dd"
                          value={item.date}
                          onChange={(newValue) => {
                            let newData = filteredCustomers;
                            newData.forEach((element) => {
                              if (element.id == item.id) {
                                element.date = newValue;
                              }
                            });
                            setFilteredCustomers((item) => [...newData]);
                          }}
                        />
                      </LocalizationProvider>
                    </td>
                    <td>
                      <OutlinedInput
                        className="outlineInputChange"
                        variant="outlined"
                        type="text"
                        placeholder="બોટલ દાખલ કરો"
                        name="selectedBottle"
                        value={item.bottle_count}
                        onChange={(newValue) => {
                          let newData = filteredCustomers;
                          newData.forEach((element) => {
                            if (element.id == item.id) {
                              element.bottle_count = newValue.target.value;
                            }
                          });
                          setFilteredCustomers((item) => [...newData]);
                        }}
                      />
                    </td>
                    <td>
                      <Button
                        className="CancelButton"
                        onClick={() => handleMilkUpdate(item.id)}
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                );
            })}
        </table>
      ) : null}
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
    </>
  );
}
