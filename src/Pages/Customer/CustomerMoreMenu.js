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
// import { USER, PARTNER } from "../../Config";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import config from "../../Utils/config";
import ReceiptIcon from "@mui/icons-material/Receipt";
// ----------------------------------------------------------------------

export default function CustomerMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyle, setAlertStyle] = useState("success");
  const [showToaster, setShowToaster] = React.useState(false);
  const [selectData, setSelectData] = React.useState({
    Order_number: "",
    Stand: "",
    Customer_name: "",
    Nick_name: "",
    work: "",
    House_number: "",
    Society: "",
    Area: "",
    Pincode: "",
    Mobile_number1: "",
    Mobile_number2: "",
    Email: "",
    Cutomer_route: "",
    Started_at: "",
    Current_status: "",
    Morning_bottle: "",
    End_date: "",
    Credit_debit: "",
    Further_account: "",
    Product: "",
  });
  const Navigation = useNavigate();

  const deleteClick = (param) => {
    setDeleteData(param);
    setIsOpen(true);
  };
  const handleCustomerUpdate = async (param) => {
    try {
      setTimeout(async () => {
        await axios
          .get(`${config.BaseURL}/api/customer/edit/${param.id}`, {})
          .then((response) => {
            if (response.status == 200) {
              props.setEditData(response.data);
            }
          })
          .catch((err) => {
            setAlertMessage(err.response.data.error);
            setAlertStyle("error");
            setShowToaster(true);
          });
      }, 1500);
    } catch (error) {
      console.error(error); // Handle any errors
    }
  };
  const editClick = (param) => {
    handleCustomerUpdate(param);
    props.setModalRoute(true);
    props.setIsEdit(true);
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
        .delete(`${config.BaseURL}/api/customer/delete/${deleteData.id}`, {})
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
        <MenuItem
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
            <ReceiptIcon width={24} height={24} />
          </ListItemIcon>
        </MenuItem>
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle id="alert-dialog-title">
            શું તમે આ કસ્ટમર ને ડીલીટ કરવા માંગો છો?
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
