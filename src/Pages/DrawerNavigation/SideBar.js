import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HeaderLogo from "../../Assets/img/header-logo.png";
import AdminIcon from "../../Assets/img/user-icon.png";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";

const Sidebar = () => {
  const location = useLocation();
  const Navigation = useNavigate();
  useEffect(() => {
    setActivePage(location.pathname.substring(1, location.pathname.length));
  }, []);
  const [activePage, setActivePage] = useState("Dashboard");
  const AddCustomer = () => {
    setActivePage("Customer");
    Navigation("/Customer");
  };
  const OffAddCustomer = () => {
    setActivePage("OffCustomer");
    Navigation("/OffCustomer");
  };
  const handleDashboard = () => {
    setActivePage("Dashboard");
    Navigation("/Dashboard");
  };
  const handleRoot = () => {
    setActivePage("Root");
    Navigation("/Root");
  };
  const handleLandmark = () => {
    setActivePage("Landmark");
    Navigation("/Landmark");
  };
  const DeliveryBoyTable = () => {
    setActivePage("DeliveryBoyTable");
    Navigation("/DeliveryBoyTable");
  };
  const handleVehicles = () => {
    setActivePage("Vehicles");
    Navigation("/Vehicles");
  };
  const handleProduct = () => {
    setActivePage("Product");
    Navigation("/Product");
  };
  const handleTrip = () => {
    setActivePage("Trip");
    Navigation("/Trip");
  };
  const handleAccount = () => {
    setActivePage("Account");
    Navigation("/Account");
  };
  useEffect(() => {
    if (localStorage.getItem("email") === null) {
      Navigation("/");
    }
  }, []);
  return (
    <>
      <div className="TopBar">
        <div className="headerLogo">
          <img src={HeaderLogo} alt="Header Logo" />
        </div>
        <div className="AdminProfile">
          <img src={AdminIcon} alt="AdminProfile" />
          <p>માસ્ટર એડમીન </p>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="sidebarMain">
          <div
            className={
              activePage === "Dashboard"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => handleDashboard()}
          >
            <DashboardIcon />
            <p>ડેશબોર્ડ</p>
          </div>
          <div
            className={
              activePage === "Customer"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => AddCustomer()}
          >
            <PeopleIcon />
            <p>કસ્ટમર</p>
          </div>
          <div
            className={
              activePage === "OffCustomer"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => OffAddCustomer()}
          >
            <PeopleIcon />
            <p>બંધ કસ્ટમર</p>
          </div>
          <div
            className={
              activePage === "Root"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => handleRoot()}
          >
            <LocalShippingIcon />
            <p>રૂટ</p>
          </div>
          <div
            className={
              activePage === "Landmark"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => handleLandmark()}
          >
            <LocalShippingIcon />
            <p>લેન્ડમાર્ક</p>
          </div>
          <div
            className={
              activePage === "Trip"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => handleTrip()}
          >
            <DashboardIcon />
            <p>ટ્રીપ</p>
          </div>
          {/*<div className="menuListBar">
            <DashboardIcon />
            <p>પર્ચેઝ</p>
          </div>
          <div className="menuListBar">
            <DescriptionIcon />
            <p>ઈન્વોઈસ</p>
          </div>*/}
          <div
            className={
              activePage === "Account"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => handleAccount()}
          >
            <ReceiptIcon />
            <p>એકાઉન્ટ</p>
          </div>
          <div
            className={
              activePage === "DeliveryBoyTable"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => DeliveryBoyTable()}
          >
            <DeliveryDiningIcon />
            <p>ડિલિવરી બોય</p>
          </div>
          <div
            className={
              activePage === "Vehicles"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => handleVehicles()}
          >
            <AgricultureIcon />
            <p>વાહનો</p>
          </div>
          <div
            className={
              activePage === "Product"
                ? "menuListBar menuActiveListBar"
                : "menuListBar"
            }
            onClick={() => handleProduct()}
          >
            <MarkunreadMailboxIcon />
            <p>પ્રોડક્ટ</p>
          </div>
          <div
            className="menuListBar"
            onClick={() => {
              localStorage.clear();
              Navigation("/");
            }}
          >
            <LogoutIcon />
            <p>બહાર</p>
          </div>
        </div>
        <div
          style={{
            width: "calc(100% - 85px)",
            height: "calc(100vh - 65px)",
            overflow: "auto",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
