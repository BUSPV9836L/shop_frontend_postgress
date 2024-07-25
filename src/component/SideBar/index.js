import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import String from "../../string";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  return (
    <Sidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "white",
          height: "90vh",
          position:"fixed",
          borderRight:"1px solid #e8e6e1)",
        },
      }}
    >
      <Menu>
        <MenuItem
          component={<Link to={"/"+String.Dashboard} />}
          active={location.pathname === "/"+String.Dashboard}
          style={{
            color: location.pathname === "/"+String.Dashboard ? "var(--main-bg-color)" : "black",
          }}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          component={<Link to={"/"+String.Supplier} />}
          active={location.pathname === "/"+String.Supplier}
          style={{
            color: location.pathname === "/"+String.Supplier ? "var(--main-bg-color)" : "black",
          }}
        >
          Supplier List
        </MenuItem>
        <MenuItem
          component={<Link to={"/"+String.Stocks} />}
          active={location.pathname === "/"+String.Stocks}
          style={{
            color: location.pathname === "/"+String.Stocks ? "var(--main-bg-color)" : "black",
          }}
        >
          Stocks
        </MenuItem>
        <MenuItem
          component={<Link to={"/"+String.Sales} />}
          active={location.pathname === "/"+String.Sales}
          style={{
            color: location.pathname === "/"+String.Sales ? "var(--main-bg-color)" : "black",
          }}
        >
          Sales
        </MenuItem>
        <MenuItem
          component={<Link to={"/"+String.Purchase} />}
          active={location.pathname === "/"+String.Purchase}
          style={{
            color: location.pathname === "/"+String.Purchase ? "var(--main-bg-color)" : "black",
          }}
        >
          Purchase
        </MenuItem>
        <MenuItem
          component={<Link to={"/"+String.Invoice} />}
          active={location.pathname === "/"+String.Invoice}
          style={{
            color: location.pathname === "/"+String.Invoice ? "var(--main-bg-color)" : "black",
          }}
        >
          Invoice
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;