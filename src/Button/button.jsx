import { useRef,useEffect } from "react";
import styles from "./button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Button(props) {
  const buttonref = useRef(null);
  useEffect(() => {
    if (buttonref.current) {
      buttonref.current.style.background = props.color;
      if (props.width) {
        buttonref.current.style.width = props.width;
        buttonref.current.style.height = props.width;
      }
    }
  }, [props.color, props.width]);
  return (
    <button className={styles.button1} ref= {buttonref} onClick={props.onClick || handleclick}>
      {props.icon ? (
        <FontAwesomeIcon 
        icon={props.icon} 
        style={{ 
          fontSize: props.width === '55px' ? "20px" : "10px", 
          color: "#fff", 
          marginBottom: props.width !== '55px' ? "60px" : "0px",
          marginTop: props.width !== '55px' ? "-3px" : "0px",
        }} 
      />      
      ) : (
        props.text
      )}
    </button>
  );
}
export default Button;
