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
          position: "fixed",
          borderRight: "1px solid #e8e6e1)",
        },
      }}
    >
      <Menu>
        <MenuItem
          component={<Link to={"/" + String.Dashboard} />}
          active={location.pathname === "/" + String.Dashboard}
          style={{
            color: location.pathname === "/" + String.Dashboard ? "var(--main-bg-color)" : "gray",
            textTransform: "uppercase",
            fontWeight: "500"
          }}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          component={<Link to={"/" + String.Supplier} />}
          active={location.pathname === "/" + String.Supplier}
          style={{
            color: location.pathname === "/" + String.Supplier ? "var(--main-bg-color)" : "gray", textTransform: "uppercase",
            fontWeight: "500"
          }}
        >
          Supplier List
        </MenuItem>
        <MenuItem
          component={<Link to={"/" + String.Purchase_List} />}
          active={location.pathname === "/" + String.Purchase_List}
          style={{
            color: location.pathname === "/" + String.Purchase_List ? "var(--main-bg-color)" : "gray", textTransform: "uppercase",
            fontWeight: "500"
          }}
        >
          Purchase List
        </MenuItem>

        <MenuItem
          component={<Link to={"/" + String.Purchase} />}
          active={location.pathname === "/" + String.Purchase}
          style={{
            color: location.pathname === "/" + String.Purchase ? "var(--main-bg-color)" : "gray", textTransform: "uppercase",
            fontWeight: "500"
          }}
        >
          Create Purchase
        </MenuItem>
        <MenuItem
          component={<Link to={"/" + String.Sales} />}
          active={location.pathname === "/" + String.Sales}
          style={{
            color: location.pathname === "/" + String.Sales ? "var(--main-bg-color)" : "gray", textTransform: "uppercase",
            fontWeight: "500"
          }}
        >
          Sales List
        </MenuItem>
        <MenuItem
          component={<Link to={"/" + String.Create_Sale} />}
          active={location.pathname === "/" + String.Create_Sale}
          style={{
            color: location.pathname === "/" + String.Create_Sale ? "var(--main-bg-color)" : "gray", textTransform: "uppercase",
            fontWeight: "500"
          }}
        >
          Create Sale
        </MenuItem>
        <MenuItem
          component={<Link to={"/" + String.Stocks} />}
          active={location.pathname === "/" + String.Stocks}
          style={{
            color: location.pathname === "/" + String.Stocks ? "var(--main-bg-color)" : "gray", textTransform: "uppercase",
            fontWeight: "500"
          }}
        >
          Stocks
        </MenuItem>

      </Menu>
    </Sidebar>
  );
};

export default SideBar;