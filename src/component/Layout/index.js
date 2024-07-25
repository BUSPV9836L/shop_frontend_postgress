import { Outlet } from "react-router";
import Header from "../Header";
import SideBar from "../SideBar";
import { useAlert } from "../../CustomHooks/useAlert";
import Alert from "../Alert";

const Layout = (props) => {
  const { hideAlert, message } = useAlert();
  const setLogging = (value) => {
    props.setLogging(value)
  }
  return (
    <div>
      <Header setLogging={setLogging} />
      <div style={{ paddingTop: "60px" }} className=" row ">
        {message.message !== "" && <Alert
          type={message.type}
          message={message.message}
          handelClear={hideAlert}
        />}
        <div style={{ width: "15%" }}>
          <SideBar />
        </div>
        <div style={{ width: "85%", marginTop: "10px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
