import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CreateBill from "./CreateBill";
import InvoiceCreate from "./InvoiceCreate";
import LocalBill from "./LocalBill";
import LocalBillList from "./LocalBillList";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Account = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="બિલ બનાવો" {...a11yProps(0)} />
            <Tab label="પ્રિન્ટ બિલ" {...a11yProps(1)} />
            <Tab label="રફ બિલ" {...a11yProps(2)} />
            <Tab label="રફ બિલ પ્રિન્ટ" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <CreateBill />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <InvoiceCreate />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <LocalBill />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <LocalBillList />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default Account;
