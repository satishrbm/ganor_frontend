import {
  Alert,
  FormHelperText,
  Snackbar,
  Stack,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import Loader from "../../Component/Loader";




const UpdatedTripData = (props) => {  
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showToaster, setShowToaster] = React.useState(false);
  const [alertStyle, setAlertStyle] = useState("success");
  const [totalMilkNeedToday, setTotalMilkNeedToday] = useState(0);
  const [totalEmptyBottle, setTotalEmptyBottle] = useState(0);

  const handleCloseToaster = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertMessage("");
    setShowToaster(false);
  };
  useEffect(() => {
    if (props.updatedData && props.updatedData.customer_data_list) {
      let milkTotal = 0;
      let bottleTotal = 0;
      props.updatedData.customer_data_list.forEach((item) => {
        milkTotal += item.milk_need_today;
        bottleTotal += item.total_given_bottle;
      });
      setTotalMilkNeedToday(milkTotal);
      setTotalEmptyBottle(bottleTotal);
    }
  }, [props.updatedData]);
  return (
    <div>
      {loading ? <Loader /> : null}      
      <tabel class="updatedDataTable">
        <tr>
          <th>કસ્ટમર નંબર</th>
          <th>Nick Name</th>
          <th>આજ ની બોટલ</th>
          <th>ટોટલ બોટલ</th>
        </tr>
        {props.updatedData.customer_data_list &&
          props.updatedData.customer_data_list
            .slice()
            .sort((a, b) => a.sequence_number - b.sequence_number)
            .map((item) => {

              return (
                <tr
                  style={{
                    backgroundColor: item.flag == 1 ? "yellow" : "transparent",
                  }}
                >
                  <td>{item.customer_number}</td>
                  <td>{item.nick_name}</td>
                  <td style={{textAlign:'center'}}>{item.milk_need_today}</td>
                  <td style={{textAlign:'center'}}>{item.total_given_bottle}</td>
                </tr>
              );
            })}     
            <tr>
              <td></td>
              <td></td>
              <td style={{textAlign:'center'}}><b>{totalMilkNeedToday}</b></td>
              <td style={{textAlign:'center'}}><b>{totalEmptyBottle}</b></td>
            </tr>     
      </tabel>
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
  );
};

export default UpdatedTripData;
