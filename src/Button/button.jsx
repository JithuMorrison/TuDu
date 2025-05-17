import { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

function Button(props) {
  const buttonref = useRef(null);
  
  useEffect(() => {
    if (buttonref.current) {
      buttonref.current.style.backgroundColor = props.color || '#4f46e5';
      buttonref.current.style.width = props.width || '40px';
      buttonref.current.style.height = props.width || '40px';
    }
  }, [props.color, props.width]);

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
      opacity: 0.9,
      transform: 'translateY(-1px)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  };

  const tooltipStyle = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s ease',
    marginBottom: '8px',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '100%',
      left: '50%',
      marginLeft: '-5px',
      borderWidth: '5px',
      borderStyle: 'solid',
      borderColor: '#1f2937 transparent transparent transparent'
    }
  };

  return (
    <button 
      style={buttonStyle} 
      ref={buttonref} 
      onClick={props.onClick}
      onMouseEnter={(e) => {
        if (props.tooltip) {
          e.currentTarget.querySelector('span').style.opacity = 1;
          e.currentTarget.querySelector('span').style.visibility = 'visible';
        }
      }}
      onMouseLeave={(e) => {
        if (props.tooltip) {
          e.currentTarget.querySelector('span').style.opacity = 0;
          e.currentTarget.querySelector('span').style.visibility = 'hidden';
        }
      }}
    >
      {props.icon ? (
        <FontAwesomeIcon 
          icon={props.icon} 
          style={{ 
            color: '#ffffff',
            fontSize: '16px'
          }} 
        />
      ) : (
        props.text
      )}
      
      {props.tooltip && (
        <span style={tooltipStyle}>{props.tooltip}</span>
      )}
    </button>
  );
}

export default Button;