import { useRef,useEffect } from "react";
import styles from "./button.module.css";
function Button(props) {
  const buttonref = useRef(null);
  useEffect(() => {
    if (buttonref.current) {
      buttonref.current.style.background = props.color;
    }
  }, []);
  return (
    <button className={styles.button1} ref= {buttonref} onClick={props.onClick || handleclick}>
      {props.text}
    </button>
  );
}
export default Button;
