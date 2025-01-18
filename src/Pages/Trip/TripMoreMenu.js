import React, { useEffect, useRef, useState } from "react";
// material
import {
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Snackbar,
  Alert,
  Autocomplete,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import config from "../../Utils/config";
import CloseIcon from "@mui/icons-material/Close";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import TripPrint from "./TripPrint";
import TripPrintDetails from "./TripPrintDetails";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import AddEmptyBottleData from "../EmptyBottle/AddEmptyBottleData";
import UpdateIcon from "@mui/icons-material/Update";
import UpdatedTripData from "./UpdatedTripData";

// ----------------------------------------------------------------------

export default function ProductMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});

  const [alertMessage, setAlertMessage] = useState("");
  const [printType, setPrintType] = useState("1");
  const [alertStyle, setAlertStyle] = useState("success");
  const [showToaster, setShowToaster] = React.useState(false);
  const [selectData, setSelectData] = React.useState({});
  const Navigation = useNavigate();
  const [isOpenPrint, setIsOpenPrint] = useState(false);
  const [isEmptyBottle, setIsEmptyBottle] = useState(false);
  const [updatedDataModal, setUpdatedDataModal] = useState(false);
  const [customerRoute, setCustomerRoute] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTripNumber, setSelectedTripNumber] = useState("");
  const [tripData, setTripData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [printTripData, setPrintTripData] = useState([]);
  const [printAllData, setPrintAllData] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("1");
  const [bottleCount1, setBottleCount1] = useState(""); //total_bottle_all
  const [bottleCount2, setBottleCount2] = useState(""); //milk need today
  const [bottleCount3, setBottleCount3] = useState(""); // tommorow bottle all

  const handleClosePrint = () => {
    setIsOpenPrint(false);
    setIsEmptyBottle(false);
    setUpdatedDataModal(false);
  };
  const deleteClick = (param) => {
    setDeleteData(param);
    setIsOpen(true);
  };

  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };

  const confirmDelete = () => {
    try {
      axios
        .delete(`${config.BaseURL}/api/trip/delete/${deleteData.id}`, {})
        .then((response) => {
          setAlertMessage(response.data.message);
          setAlertStyle("success");
          setShowToaster(true);
          let filter = props.userList.filter((x) => x.id != deleteData.id);
          props.setUserList(filter);
          setTimeout(() => {
            handleClose();
          }, 1000);
          setTimeout(() => {
            setShowToaster(false);
          }, 2000);
        })
        .catch((err) => {
          // alert(err.response.data.error);
          setAlertMessage(err.response.data.error);
          setAlertStyle("error");
          setShowToaster(true);
          setTimeout(() => {
            setShowToaster(false);
          }, 3000);
        });
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const getRoute = () => {
    try {
      axios
        .get(`${config.BaseURL}/api/trip/routelist`, {})
        .then((response) => {
          setCustomerRoute(response.data);
          setSelectedRoute(props.SelectRow.Route_name.id);
          getTripListData(props.SelectRow.id);
        })
        .catch((err) => {});
    } catch (error) {
      console.error(error);
    }
  };
  const getTripListData = (id) => {
    axios
      .get(`${config.BaseURL}/api/trip/tripprint/${id}/`, {})
      .then((response) => {
        let allData = response.data;     
        setPrintAllData(allData);
        setTripData(allData.trip_data);
      });
  };
  const getUpdatedTripListData = (id) => {
    axios
      .get(`${config.BaseURL}/api/trip/tripview/${id}/`, {})
      .then((response) => {
        let allData = response.data;
        setUpdatedData(allData);
      });
  };

  const printTypes = [
    { label: "કોમપેક્ટ", id: "1" },
    { label: "ડીટેઇલ", id: "2" },
  ];
 
  const Language = [
    { label: "ગુજરાતી", id: "1" },
    { label: "English", id: "2" },
  ];
  return (
    <>
      <div className="menuIcon-flex">
        <MenuItem
          onClick={() => {
            setSelectedTripNumber(props.SelectRow.Trip_number);
            setSelectedDate(props.SelectRow.Trip_date);
            getRoute();

            setIsOpenPrint(true);
          }}
          sx={{
            color: "text.secondary",
            paddingLeft: "0px",
            paddingRight: "0px",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <ListItemIcon>
            <RemoveRedEyeIcon width={24} height={24} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedTripNumber(props.SelectRow.Trip_number);
            setSelectedRoute(props.SelectRow.Route_name.id);
            setSelectedDate(props.SelectRow.Trip_date);
            //   setSelectedDate(props.SelectRow.Trip_date);
            //   getRoute();

            setIsEmptyBottle(true);
          }}
          sx={{
            color: "text.secondary",
            paddingLeft: "0px",
            paddingRight: "0px",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <ListItemIcon>
            <HourglassBottomIcon width={24} height={24} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          onClick={() => {
            getUpdatedTripListData(props.SelectRow.id);
            setUpdatedDataModal(true);
          }}
          sx={{
            color: "text.secondary",
            paddingLeft: "0px",
            paddingRight: "0px",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <ListItemIcon>
            <UpdateIcon width={24} height={24} />
          </ListItemIcon>
        </MenuItem>
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">
            Do you want to remove this user
          </DialogTitle>
          <DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()}>No</Button>
              <Button onClick={() => confirmDelete()}>Yes</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
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
      <div>
        <Dialog
          open={updatedDataModal}
          onClose={handleClosePrint}
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
            <p>ટ્રીપ નો ઉપડતે કરેલ ડેટા </p>
            <span className="popupCloseIcon">
              {<CloseIcon onClick={() => handleClosePrint()} />}
            </span>
          </DialogTitle>
          <DialogContent>
            <UpdatedTripData updatedData={updatedData} />
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
            <Button className="CancelButton" onClick={() => handleClosePrint()}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isOpenPrint}
          onClose={handleClosePrint}
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
            <p>ટ્રીપ ની પ્રિન્ટ </p>
            <span className="popupCloseIcon">
              {<CloseIcon onClick={() => handleClosePrint()} />}
            </span>
          </DialogTitle>
          <DialogContent>
            <div className="flexTab-content">
              <div className="inputDiv-customer">
                <FormControl className="inputFormControl">
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ટાઈપ
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="ટાઈપ સિલેક્ટ કરો"
                    options={printTypes}
                    getOptionLabel={(option) => option.label}
                    onChange={(e, value) => {
                      setPrintType(value?.id ? value.id : "");
                    }}
                    value={printTypes.find((e) => e.id == printType)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="ટાઈપ સિલેક્ટ કરો"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off",
                        }}
                      />
                    )}
                  />
                </FormControl>
              </div>
              <></>
              <div className="inputDiv-customer" style={{ width: "30%" }}>
                <FormControl className="inputFormControl">
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ભાષા /<br /> Language
                  </FormHelperText>
                  <Autocomplete
                    className="InputAutocomplete"
                    id="country-select-demo"
                    placeholder="ભાષા સિલેક્ટ કરો"
                    options={Language}
                    getOptionLabel={(option) => option.label}
                    onChange={(e, value) => {
                      setSelectedLanguage(value?.id ? value.id : "");
                    }}
                    value={Language.find((e) => e.id == selectedLanguage)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="ભાષા સિલેક્ટ કરો"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off",
                        }}
                      />
                    )}
                  />
                </FormControl>
              </div>
              <></>
              <div className="inputDiv-customer" style={{ width: "14%" }}>
                <FormControl className="inputFormControl">
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    રૂટ
                  </FormHelperText>
                  <span>{tripData.route_name}</span>
                </FormControl>
              </div>

              <div className="inputDiv-customer" style={{ width: "14%" }}>
                <FormControl className="inputFormControl">
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    ટ્રીપ નંબર
                  </FormHelperText>
                  <span>{tripData.trip_number}</span>
                </FormControl>
              </div>
              <div className="inputDiv-customer" style={{ width: "14%" }}>
                <FormControl className="inputFormControl">
                  <FormHelperText
                    className="inputLabel"
                    id="standard-weight-helper-text-email-login"
                  >
                    તારીખ
                  </FormHelperText>
                  <span>{tripData.trip_date}</span>
                </FormControl>
              </div>
            </div>
            <></>
            <div>
              {printType == 1 ? (
                <TripPrint
                  printAllData={printAllData}
                  // printTripData={printTripData}
                  selectedLanguage={selectedLanguage}
                  // otherDetails={props.SelectRow}
                  // bottleCount1={bottleCount1}
                  // bottleCount2={bottleCount2}
                  // bottleCount3={bottleCount3}
                />
              ) : (
                <TripPrintDetails
                  printTripData={printTripData}
                  selectedLanguage={selectedLanguage}
                  otherDetails={props.SelectRow}
                  bottleCount1={bottleCount1}
                  bottleCount2={bottleCount2}
                  bottleCount3={bottleCount3}
                />
              )}
            </div>
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
            <Button className="CancelButton" onClick={() => handleClosePrint()}>
              Cancel
            </Button>
            <Button onClick={() => handleClosePrint()} type="submit"></Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isEmptyBottle}
          onClose={handleClosePrint}
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
            <p>કસ્ટમર ના ખાલી બોટલના ડેટા નાખો</p>
            <span className="popupCloseIcon">
              {<CloseIcon onClick={() => handleClosePrint()} />}
            </span>
          </DialogTitle>
          <DialogContent>
            <AddEmptyBottleData
              selectedTripNumber={selectedTripNumber}
              selectedRoute={selectedRoute}
              selectedDate={selectedDate}
              setIsEmptyBottle={setIsEmptyBottle}
            />
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
            <Button className="CancelButton" onClick={() => handleClosePrint()}>
              Cancel
            </Button>
            {/* <Button onClick={() => handleClosePrint()} type="submit"></Button> */}
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: "20px",
  },
  title: {
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 15,
    marginTop: 10,
  },
  details: {
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 12,
  },
  tripDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 12,
    paddingTop: 3,
    paddingBottom: 3,
  },
});
