import React, { useRef, useState } from "react";
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
} from "@mui/material";
// component
// import Iconify from '../../../components/Iconify';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Context } from "../../App";
import axios from "axios";
// import { USER, PARTNER } from "../../../Config";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import config from "../../Utils/config";
import Loader from "../../Component/Loader";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CloseIcon from "@mui/icons-material/Close";
import DayWisePouchPrint from "./DayWisePouchPrint";
// ----------------------------------------------------------------------

export default function RootMoreMenu(props) {
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dayWiseOpen, setDayWiseOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyle, setAlertStyle] = useState("success");
  const [showToaster, setShowToaster] = React.useState(false);
  const [selectData, setSelectData] = React.useState({
    Route_name: "",
    Vehicle_number: "",
    Delivery_boy: "",
  });
  const Navigation = useNavigate();

  const deleteClick = (param) => {
    setDeleteData(param);
    setIsOpen(true);
  };
  const editClick = (param) => {
    props.setModalRoute(true);
    props.setIsEdit(true);
    props.setEditData(param);
  };
  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };

  const confirmDelete = () => {
    setLoading(true);
    try {
      axios
        .delete(`${config.BaseURL}/api/route/delete/${deleteData.id}`, {})
        .then((response) => {
          if (response.status == 200) {
            setAlertMessage(response.data.message);
            setAlertStyle("success");
            setShowToaster(true);
            let filter = props.userList.filter((x) => x.id != deleteData.id);
            props.setUserList(filter);
            setTimeout(() => {
              handleClose();
            }, 1000);
            setLoading(false);
            setTimeout(() => {
              setShowToaster(false);
            }, 2000);
          }
        })
        .catch((err) => {
          // alert(err.response.data.error);
          setAlertMessage(err.response.data.error);
          setAlertStyle("error");
          setShowToaster(true);
          setTimeout(() => {
            setShowToaster(false);
          }, 3000);
          setLoading(false);
        });
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  const handleClose = () => {
    setIsOpen(false);
    setDayWiseOpen(false);
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div className="menuIcon-flex">
        <MenuItem
          onClick={() => editClick(props.SelectRow)}
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
            <EditIcon width={24} height={24} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          sx={{ color: "text.secondary" }}
          onClick={() => deleteClick(props.SelectRow)}
        >
          <ListItemIcon>
            <DeleteIcon width={24} height={24} />
          </ListItemIcon>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDayWiseOpen(true);
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
            <ReceiptIcon width={24} height={24} />
          </ListItemIcon>
        </MenuItem>
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">
            શું તમે આ રૂટ ને ડીલીટ કરવા માંગો છો?
          </DialogTitle>
          <DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()}>ના</Button>
              <Button onClick={() => confirmDelete()}>હા, ડીલીટ કરો</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <div>
          <Dialog
            open={dayWiseOpen}
            onClose={handleClose}
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
              <p className="">કસ્ટમર નું ડે વાઈઝ બિલ</p>
              <span className="popupCloseIcon">
                {<CloseIcon onClick={() => handleClose()} />}
              </span>
            </DialogTitle>
            <DialogContent>
              <DayWisePouchPrint selectedRoute={props.SelectRow.Route_name} />
            </DialogContent>
            {/* <DialogActions
              sx={{
                justifyContent: "space-between",
                padding: "10px 30px",
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid var(--borderColor)",
                padding: "20px 24px!important",
              }}
            >
              <Button className="CancelButton" onClick={() => handleClose()}>
                Cancel
              </Button>
            </DialogActions> */}
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
    </>
  );
}
