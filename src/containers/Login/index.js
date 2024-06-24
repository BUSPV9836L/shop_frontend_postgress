import { useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import String from "../../string";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Login = (props) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoogedIn, setIsLoogedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkUser = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${String.BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ``,
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (data.accessToken) {
        setIsLoogedIn(true);
        props.setLogging(true);
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("userid", data.userid);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("companyaddress", data.address);
        setTimeout(() => {
          navigate("/" + String.Dashboard);
        }, 500);
      } else {
       alert("Server Error!");
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = () => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address!");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(form.password)) {
      alert("Password must be at least 6 characters long!");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail() && validatePassword()) {
      checkUser();
    }
  };

  const leftComponent = () => {
    return (
      <div
        style={{
          height: "100vh",
          color: "white",
          fontWeight: "700",
          fontSize: "30px",
        }}
        className="felx justify-content-center text-center  align-content-center "
      >
        Sales Management
      </div>
    );
  };

  const rightComponent = () => {
    return (
      <div
        style={{ height: "100vh" }}
        className="row justify-content-center  text-center  align-content-center "
      >
        <div className=" col-10">
          <p  >
            <b style={{ fontSize: "18px", color:"gray" }}>Logging to Sales Management</b>
          </p>
          {isLoogedIn ? (
            <FaUnlock color="grey" size={30} />
          ) : (
            <FaLock color="grey" size={30} />
          )}
          {loginForm()}
          <p className=" mt-3" style={{ cursor: "pointer" }}>
            <b style={{ color: "var(--main-bg-color)"}}>
              <Link to={"/Register"} style={{textDecoration:"none"}}>Don't have an Account? Register!</Link>
            </b>
          </p>
        </div>
      </div>
    );
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleSubmit} className="text-start">
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChanges}
            name="email"
            className="form-control"
            type="email"
          />
        </div>
        <div className="mt-2">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChanges}
            id="password"
            type="password"
            name="password"
            className="form-control"
          />
        </div>
        <div>
          <button
            disabled={isLoading}
            style={{ backgroundColor: "var(--main-bg-color)", color: "white" }}
            className="form-control mt-3 btn"
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="row w-100">
      <div className="col-8 login-left">{leftComponent()}</div>
      <div className="col-4">{rightComponent()}</div>
    </div>
  );
};

export default Login;
