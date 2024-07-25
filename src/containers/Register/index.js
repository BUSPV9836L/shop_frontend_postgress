import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import String from "../../string";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAlert } from "../../CustomHooks/useAlert";
import { DANGER, PRIMARY, SUCCESS } from "../../component/Alert";

const Register = (props) => {
  const {Alert}=useAlert();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address:""
  });
  const [isLoading, setIsLoading] = useState(false);

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
      Alert(PRIMARY,"Please enter a valid email address!");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(form.password)) {
      Alert(PRIMARY,"Password must be at least 6 characters long!");
      return false;
    }
    return true;
  };

  const validateConfirmPassword = () => {
    if (form.password !== form.confirmPassword) {
      Alert(PRIMARY,"Passwords do not match!");
      return false;
    }
    return true;
  };
  const validateCompanyAddress = () => {
    if (form.address.split(" ").length<3) {
      Alert(PRIMARY,"Company address should be atleast three word.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail() && validatePassword() && validateConfirmPassword()&&validateCompanyAddress()) {
      try {
        setIsLoading(true);
        const response = await fetch(`${String.BASE_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.companyName,
            email: form.email,
            password: form.password,
            address:form.address
          }),
        });
        const data = await response.json();
        if (data.success) {
          Alert(SUCCESS,"Registration successful!");
          navigate("/");
        }else{
          Alert(PRIMARY,data.message);
        }
      } catch (error) {
        Alert(DANGER,error.message);
      } finally {
        setIsLoading(false);
      }
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
        className="felx justify-content-center text-center align-content-center"
      >
        Sales Management
      </div>
    );
  };

  const rightComponent = () => {
    return (
      <div
        style={{ height: "100vh" }}
        className="row justify-content-center text-center align-content-center"
      >
        <div className="col-10">
          <p>
            <b style={{ fontSize: "18px", color: "gray" }}>
              Register for Sales Management
            </b>
          </p>
          <FaUserPlus color="grey" size={30} />
          {registerForm()}
          <p className=" mt-3" style={{ cursor: "pointer" }}>
            <b style={{ color: "var(--main-bg-color)"}}>
              <Link to={"/"} style={{textDecoration:"none"}}>Already a user Signin!</Link>
            </b>
          </p>
        </div>
      </div>
    );
  };

  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit} className="text-start">
        <div>
          <label htmlFor="companyName">Company Name</label>
          <input
            onChange={handleChanges}
            name="companyName"
            value={form.companyName}
            className="form-control"
            type="text"
            required
          />
        </div>
        <div>
          <label htmlFor="companyName">Company Address</label>
          <input
            onChange={handleChanges}
            name="address"
            className="form-control"
            type="text"
            value={form.address}
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChanges}
            name="email"
            className="form-control"
            type="email"
            value={form.email}
            required
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
            value={form.password}
            required
          />
        </div>
        <div className="mt-2">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            onChange={handleChanges}
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            required
          />
        </div>
        <div>
          <button
            disabled={isLoading}
            style={{ backgroundColor: "var(--main-bg-color)", color: "white" }}
            className="form-control mt-3 btn"
          >
            {isLoading ? "Registering..." : "Register"}
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

export default Register;
