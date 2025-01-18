import PropTypes from "prop-types";
// material
import { styled } from "@mui/material/styles";
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
// component
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import React, { useState } from "react";
import axios from "axios";
import { Context } from "../../App";

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

DeliveryBoyListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function DeliveryBoyListToolbar({
  selected,
  numSelected,
  filterName,
  onFilterName,
}) {
  const { userList, setUserList, partnerList, setPartnerList } =
    React.useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const multipleDelete = () => {
    // setIsOpen(true)
  };
  const confirmDelete = () => {
    let list = userList;
    let filter = list.filter((x) => !selected.includes(x.id));
    setUserList(filter);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <RootStyle
        sx={{
          ...(numSelected > 0 && {
            color: "primary.main",
            bgcolor: "primary.lighter",
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <SearchStyle
            value={filterName}
            onChange={onFilterName}
            placeholder="Search..."
            className="SearchInputBar"
          />
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={() => multipleDelete()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </RootStyle>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          Do you want to remove this selected users
        </DialogTitle>
        <DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>No</Button>
            <Button onClick={() => confirmDelete()}>Yes</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
