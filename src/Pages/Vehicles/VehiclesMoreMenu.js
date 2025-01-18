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
// import { Context } from "../../../App";
import axios from "axios";
// import { USER, PARTNER } from "../../../Config";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import config from "../../Utils/config";
// ----------------------------------------------------------------------

export default function DeliveryBoyMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyle, setAlertStyle] = useState("success");
  const [showToaster, setShowToaster] = React.useState(false);
  const [selectData, setSelectData] = React.useState({
    Vehicle_number: "",
    Vehicle_type: "",
    Vehicle_owner_type: "",
    Vehicle_owner: "",
    Vehicle_price: "",
    Vehicle_purchase_date: "",
    Vehicle_average: "",
    Vehicle_puc: "",
    Vehicle_puc_date: "",
    Vehicle_insurance: "",
    Vehicle_insurance_date: "",
    Vehicle_status: "",
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
    try {
      axios
        .delete(`${config.BaseURL}/api/vehicles/delete/${deleteData.id}`, {})
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

  return (
    <>
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
        {/* <MenuItem
          onClick={() => alert("view click")}
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
        </MenuItem>*/}
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">
            શું તમે આ વાહન ને ડીલીટ કરવા માંગો છો?
          </DialogTitle>
          <DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()}>ના</Button>
              <Button onClick={() => confirmDelete()}>હા, ડીલીટ કરો</Button>
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
      {/* </Menu> */}
    </>
  );
}
