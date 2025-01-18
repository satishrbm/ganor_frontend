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
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RootListToolbar from "./LandMarkListToolbar";
import RootListHead from "./LandMarkListHead";
import RootMoreMenu from "./LandMarkMoreMenu";
import RootSearchNotFound from "./LandMarkSearchNotFound";
// import "./RoottTableForm.css";
import AddRoot from "./AddLandMark";
import axios from "axios";
import config from "../../Utils/config";
const TABLE_HEAD = [
  { id: "landmark", label: "લેન્ડમાર્ક નું નામ", alignRight: false },
  { id: "action", label: "Action", alignRight: false },
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
        _user.landmark.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function LandMarkTable() {
  const [page, setPage] = useState(0);
  const [pageDb, setPageDb] = useState(0);
  const [order, setOrder] = useState("asc");
  const [editData, setEditData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deliverBoyName, setDeliverBoyName] = useState([]);
  const [userList, setUserList] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [modalRoute, setModalRoute] = useState(false);
  const [onClose, setOnClose] = useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [showToaster, setShowToaster] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [orderBy, setOrderBy] = useState("landmark");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [userListTotalRecords, setUserListTotalRecords] = useState(
    userList.length
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  //set user permission

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

  var filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;
  const [open, setOpen] = React.useState(false);
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

  const getRouteList = () => {
    try {
      axios
        .get(`${config.BaseURL}/api/customer/landmarks`, {})
        .then((response) => {
          setUserList(response.data);
          // setDeliverBoyName(response.data);
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getRouteList();
  }, []);

  useEffect(() => {
    if (!modalRoute) {
      getRouteList();
    }
  }, [modalRoute]);
  return (
    <>
      <Card className="pt-20">
        <div className="RootAddTitle">
          <div className="arrow-back-user">
            <Typography variant="p" gutterBottom className="UserListTitle">
              લેન્ડમાર્ક લિસ્ટ
            </Typography>
          </div>
          <div style={{ width: "60%" }}>
            <RootListToolbar
              pageName={"User"}
              selected={selected}
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
          </div>
          <Button
            type="button"
            className="ContinueButton mr-30 ml-20"
            onClick={() => handleClickOpen()}
            sx={{ mt: 1, mr: 1 }}
          >
            એડ લેન્ડમાર્ક
          </Button>
        </div>
        <>
          <>
            <TableContainer className="TableDivBlock">
              <Table className="TableDiv">
                <RootListHead
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
                      const { id, landmark } = row;
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
                                {landmark}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <RootMoreMenu
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
                        <RootSearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
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
              maxWidth: "900px",
              width: "100%",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" className="modalHeaderFlex">
            <p className="">{isEdit ? "અપડેટ લેન્ડમાર્ક" : "એડ લેન્ડમાર્ક "}</p>
            <span className="popupCloseIcon">
              {<CloseIcon onClick={() => handleClose()} />}
            </span>
          </DialogTitle>
          <DialogContent>
            <AddRoot
              editData={editData}
              isEdit={isEdit}
              setModalRoute={setModalRoute}
              setOnClose={setOnClose}
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
            <Button className="CancelButton" onClick={() => handleClose()}>
              Cancel
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
    </>
  );
}
