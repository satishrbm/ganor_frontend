import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Theme } from "./Utils/theme";
import { ThemeProvider } from "@mui/material";
import React, { createContext } from "react";
import Login from "./Pages/Auth/Login";
import Sidebar from "./Pages/DrawerNavigation/SideBar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import CustomerTable from "./Pages/Customer/CustomerTable";
import DeliveryBoyTable from "./Pages/DeliveryBoy/DeliveryBoyTable";
import VehiclesTable from "./Pages/Vehicles/VehiclesTable";
import ProductTable from "./Pages/Product/ProductTable";
import TripTable from "./Pages/Trip/TripTable";
import RootTable from "./Pages/Root/RootTable";
import TripPrint from "./Pages/Trip/TripPrint";
import OffCustomerTable from "./Pages/OffCustomer/OffCustomerTable";
import LandMarkTable from "./Pages/LandMark/LandMarkTable";
import Account from "./Pages/Account/Account";

export const Context = createContext();

function App() {
  return (
    <Context.Provider value={{}}>
      <ThemeProvider theme={Theme}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route element={<Sidebar />}>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Customer" element={<CustomerTable />} />
              <Route path="/OffCustomer" element={<OffCustomerTable />} />
              <Route path="/Root" element={<RootTable />} />
              <Route path="/Landmark" element={<LandMarkTable />} />
              <Route path="/DeliveryBoyTable" element={<DeliveryBoyTable />} />
              <Route path="/Vehicles" element={<VehiclesTable />} />
              <Route path="/Product" element={<ProductTable />} />
              <Route path="/Trip" element={<TripTable />} />
              <Route path="/TripPrint" element={<TripPrint />} />
              <Route path="/Account" element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Context.Provider>
  );
}

export default App;
