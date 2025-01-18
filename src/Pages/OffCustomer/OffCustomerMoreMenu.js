import React, { useRef, useState } from "react";
// material
import {
  MenuItem,
  ListItemIcon,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------

export default function OffCustomerMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});

  const [alertMessage, setAlertMessage] = useState("");
  const [alertStyle, setAlertStyle] = useState("success");
  const [showToaster, setShowToaster] = React.useState(false);
  const [selectData, setSelectData] = React.useState({
    
  });
  const Navigation = useNavigate();

  
  const editClick = (param) => {
    // handleCustomerUpdate(param);
    props.setEditData(param.Customers);
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
