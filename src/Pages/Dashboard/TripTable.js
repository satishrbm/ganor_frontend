import { filter } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Fade,
  Grid,
  CircularProgress,
} from "@mui/material";
import TripTableHeader from "./TripTableHeader";
import CustomerSearchNotFound from "../Trip/TripSearchNotFound";
import axios from "axios";
import config from "../../Utils/config";

const TABLE_HEAD = [
  { id: "Trip_date", label: "ટ્રીપ તારીખ", alignRight: false },
  { id: "Trip_no", label: "ટ્રીપ નંબર", alignRight: false },
  { id: "Route_name", label: "રુટ", alignRight: false },
  { id: "Delivery", label: "ડિલિવરી", alignRight: false },
  { id: "Empty_bottle", label: "ખાલી બોટલ", alignRight: false },
  { id: "Pending_empty_bottle", label: "બાકી ખાલી બોટલ", alignRight: false },
  //{ id: "Nextday_delivery", label: "બીજા દિવસે ડિલિવરી", alignRight: false },
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
        _user.Trip_date.toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1 ||
        _user.Trip_number.toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1 ||
        _user.Vehicle_number.Vehicle_number.toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1 ||
        _user.Delivery_boy.Name.toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TripTable() {
  const [order, setOrder] = useState("asc");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [orderBy, setOrderBy] = useState("Trip_number");
  const [filterName, setFilterName] = useState("");

  const getUpdatedTripListData = async (id) => {
    try {
      const response = await axios.get(`${config.BaseURL}/api/trip/tripview/${id}/`);
      return response.data; // Returns detailed trip data for the given ID
    } catch (error) {
      console.error(error);
      return null; // Return null if an error occurs
    }
  };

  const getTripList = async () => {
    try {
      const response = await axios.get(`${config.BaseURL}/api/trip/triplist`);
      return response.data; // Returns the list of trips
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchAndMergeData = async () => {
    try {
      //setLoading(true);

      // Fetch the trip list
      const tripListData = await getTripList();

      // Get today's date in YYYY-MM-DD format
      const today = "2025-01-03";//new Date().toISOString().split("T")[0];

      // Filter trips with today's date
      const todayTripList = tripListData.filter(
        (trip) => trip.Trip_date === today
      );

      // Fetch details for each trip and merge the data
      const detailedDataPromises = todayTripList.map(async (trip) => {
        const tripDetails = await getUpdatedTripListData(trip.id);

        // Merge the data and calculate the total given bottles
        const totalEmptyBottle = tripDetails.customer_data_list.reduce(
          (sum, customer) => sum + customer.total_given_bottle,
          0
        );

        // Merge the data and calculate the total given bottles
        const totalBottle = tripDetails.customer_data_list.reduce(
          (sum, customer) => sum + customer.milk_need_today,
          0
        );

        return {
          ...tripDetails,
          trip_summary: { ...trip, totalEmptyBottle, totalBottle}, // Include additional summary details
        };
      });

      // Wait for all detailed data to be fetched
      const detailedData = await Promise.all(detailedDataPromises);

      setUserList(detailedData);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndMergeData();
  }, []);

  var filteredUsers = applySortFilter(
    userList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  const totalEmptyBottle = userList.reduce(
    (sum, trip) => sum + trip.trip_summary.totalEmptyBottle,
    0
  );

  const totalBottle = userList.reduce(
    (sum, trip) => sum + trip.trip_summary.totalBottle,
    0
  );

  return (
    <TableContainer className="TableDivBlock" style={{ width: "40%", marginLeft: "auto" }}>
      <Table className="TableDiv">
        <TripTableHeader
          headLabel={TABLE_HEAD}
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
            .map((row) => {
              const {
                trip_summary,
              } = row;
              return (
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Stack direction="row" align="left" spacing={2}>
                      <Typography variant="subtitle2" noWrap>
                        {trip_summary.Trip_date}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">{trip_summary.Trip_number}</TableCell>
                  <TableCell align="center">
                    {trip_summary.Route_name.Route_name}
                  </TableCell>
                  <TableCell align="center">
                    {trip_summary.totalBottle}
                  </TableCell>
                  <TableCell align="center">
                    {trip_summary.totalEmptyBottle}
                  </TableCell>
                  <TableCell align="center">
                    {trip_summary.totalEmptyBottle}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={3} align="left">
                <Typography variant="subtitle2">Total</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2">{totalBottle}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2">{totalEmptyBottle}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2">{totalEmptyBottle}</Typography>
              </TableCell>
            </TableRow>
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
  );
}
