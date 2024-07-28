import { Outlet } from "react-router";
import { useAlert } from "../../CustomHooks/useAlert";
import Alert from "../Alert";

const LayoutLogin = (props) => {
  const { hideAlert, message } = useAlert();
  return (
    <div>
      {message.message !== "" && <Alert
        type={message.type}
        message={message.message}
        handelClear={hideAlert}
      />}

      <div>
        <Outlet />
      </div>

    </div>
  );
};

export default LayoutLogin;
