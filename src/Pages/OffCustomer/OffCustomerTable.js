import { filter } from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Fade,
  Grid,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import "./RoottTableForm.css";
import CustomerListToolbar from "./OffCustomerListToolbar";
import CustomerListHead from "./OffCustomerListHead";
import CustomerSearchNotFound from "./OffCustomerSearchNotFound";
import CustomerMoreMenu from "./OffCustomerMoreMenu";
import AddCustomer from "./OffAddCustomer";
import config from "../../Utils/config";
import axios from "axios";
import OffOnAddCustomer from "./OffOnAddCustomer";
const TABLE_HEAD = [
  { id: "Order_number", label: "કસ્ટમર કોડ", alignRight: false },
  { id: "Date", label: "તારીખ", alignRight: false },
  { id: "C_name", label: "કસ્ટમર નામ", alignRight: false },
  { id: "Mobile_number1", label: "મોબાઈલ નંબર", alignRight: false },
  { id: "Reason", label: "કારણ", alignRight: false },
  //{ id: "action", label: "Action", alignRight: false },
];

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
      (_user) =>
        (_user.Customers.Order_number.toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !==
          -1)|| (
            _user.Customers.C_name.toString()
              .toLowerCase()
              .indexOf(query.toLowerCase()) !== -1
          ) ||
        _user.Customers.Mobile_number1.toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OffCustomerTable() {
  const navigation = useNavigate();
  const [page, setPage] = useState(0);
  const [pageDb, setPageDb] = useState(0);
  const [order, setOrder] = useState("asc");
  const [editData, setEditData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState([]);
  const [userList, setUserList] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [modalRoute, setModalRoute] = useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [showToaster, setShowToaster] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [orderBy, setOrderBy] = useState("C_name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  var filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;
  const [open, setOpen] = React.useState(false);
  const [onClose, setOnClose] = useState(false);

  const getCustomers = () => {
    try {
      axios
        .get(`${config.BaseURL}/api/customer/close_customer`, {})
        .then((response) => {
          setUserList(response.data);
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);
  useEffect(() => {
    if (!modalRoute) {
      getCustomers();
    }
  }, [modalRoute]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = userList.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setPageDb(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const handleClickOpen = () => {
    setIsEdit(false);
    setEditData(null);
    setModalRoute(!modalRoute);
  };
  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };
  const handleChangePage = (event, newPage) => {
    setPageDb(newPage);
  };
  const handleClose = () => {
    setModalRoute(false);
  };
  return (
    <>
      <Card className="pt-20">
        <div className="RootAddTitle">
          <div className="arrow-back-user">
            <Typography variant="p" gutterBottom className="UserListTitle">
              બંધ કસ્ટમર લિસ્ટ
            </Typography>
          </div>
          <div style={{ width: "60%" }}>
            <CustomerListToolbar
              pageName={"User"}
              selected={selected}
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
          </div>
          <div className="mr-30 ml-20" sx={{ mt: 1, mr: 1 }}></div>
        </div>
        <>
          <>
            <TableContainer className="TableDivBlock">
              <Table className="TableDiv">
                <CustomerListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {loading && (
                    <Fade in={loading}>
                      <TableRow sx={{ height: "100%", position: "relative" }}>
                        <TableCell colSpan={10} sx={{ display: "contents" }}>
                          <Grid
                            item
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                              width: "100%",
                              position: "absolute",
                              zIndex: "999",
                            }}
                          >
                            <CircularProgress value={150} />
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  )}
                  {filteredUsers
                    .slice(
                      pageDb * rowsPerPage,
                      pageDb * rowsPerPage + rowsPerPage
                    )
                    .map((row) => {
                      const { id, Customers, Date, Reason } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              className="CheckboxBox"
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" align="left" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {Customers.Order_number}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" align="left" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {Date}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" align="left" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {Customers.C_name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <Stack direction="row" align="left" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {Customers.Mobile_number1}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{Reason}</TableCell>

                          <TableCell align="right">
                            <CustomerMoreMenu
                              setIsEdit={setIsEdit}
                              setEditData={setEditData}
                              setModalRoute={setModalRoute}
                              SelectRow={row}
                              setUserList={setUserList}
                              userList={userList}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                        <CustomerSearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={pageDb}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton={true}
            showLastButton={true}
          />
        </>
      </Card>

      <div>
        <Dialog
          open={modalRoute}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            "& .MuiDialog-paper": {
              maxWidth: "1300px",
              width: "100%",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" className="modalHeaderFlex">
            <p style={{ margin: 6 }}>
              {isEdit ? "અપડેટ કસ્ટમર" : "એડ કસ્ટમર "}
            </p>
            <span className="popupCloseIcon">
              {<CloseIcon onClick={() => handleClose()} />}
            </span>
          </DialogTitle>
          <DialogContent>
            {!editData ? (
              <AddCustomer
                editData={editData}
                setModalRoute={setModalRoute}
                setOnClose={setOnClose}
                isEdit={isEdit}
              />
            ) : (
              <OffOnAddCustomer 
                editData={editData}
                setModalRoute={setModalRoute}
                setOnClose={setOnClose}
                isEdit={isEdit} 
              />
            )}
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
            <Button className="CancelButton" onClick={() => handleClose()}>
              Cancel
            </Button>
            {/*<Button onClick={() => handleClose()} type="submit"></Button>*/}
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
    </>
  );
}
