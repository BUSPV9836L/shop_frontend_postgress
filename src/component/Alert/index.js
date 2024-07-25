import React, { useEffect, useState } from "react";
const PRIMARY = "alert-primary";
const SUCCESS = "alert-success";
const DANGER = "alert-danger";

const Alert = (props) => {
  let progress_bar_color = "";
  if (props?.type == DANGER) {
    progress_bar_color = "#CC003A"
  } else if (props?.type == SUCCESS) {
    progress_bar_color = "#9DD961"
  } else {
    progress_bar_color = "#0C79AC"
  }
  const [progress, setProgress] = useState(100);
  const duration = 3000;

  useEffect(() => {
    const stepTime = 100;
    const totalSteps = duration / stepTime;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setProgress(((totalSteps - currentStep) / totalSteps) * 100);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        props.handelClear();
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [props, duration]);

  return (
    <div
      className={`alert ${props.type} alert-dismissible fade show custom-alert`}
      role="alert"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        width: "fit-content",
        minWidth: "400px",
        top: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "9999",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "4px",
          width: `${progress}%`,
          backgroundColor: `${progress_bar_color}`,
          transition: "width 0.1s linear",
        }}
      ></div>
      <div style={{ marginRight: "10px", fontSize: "12px" }}>
        <strong>{props.message}</strong>
      </div>

      <span  onClick={props.handelClear} style={{ marginTop: "-2px", fontSize:"20px", outline: "none",cursor:"pointer" }}>&times;</span>
    </div>
  );
};

export default Alert;
export { PRIMARY, SUCCESS, DANGER };