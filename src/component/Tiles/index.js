const Tiles = (props) => {
  return (
    <div
      style={{
        width: `${props?.width}px`,
        height: `${props?.height > 60 ? props?.height : 60}px`,
        cursor: `${(props?.count&&props.clickable) ? "pointer" : ""}`,
        color: `${props?.color}`,
        border: "1px solid white",
        borderRadius: "6px",
        padding: "10px",
        boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        margin:"10px",
        
      }}
      onClick={()=>{
        if(props?.count>0&&props.clickable){
            props?.callbackOnClick()
        }
      }}
    >
      <div style={{ color: "black", fontSize: "12px", fontWeight:"600", color:"gray" }}>{props?.title}</div>
      <div style={{ fontWeight: "500", fontSize:"14px" }}>{props?.count ? props?.count : 0}</div>
    </div>
  );
};

export default Tiles;
