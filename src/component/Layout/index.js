import { Outlet } from "react-router";
import Header from "../Header";
import SideBar from "../SideBar";

const Layout = (props) => {
  const setLogging=(value)=>{
    props.setLogging(value)
  }
  return (
    <div>
      <Header setLogging={setLogging}/>
      <div style={{paddingTop:"60px"}} className=" row ">
        <div style={{width:"15%"}}>
          <SideBar />
        </div>
        <div style={{width:"85%", marginTop:"10px"}}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default Layout;
