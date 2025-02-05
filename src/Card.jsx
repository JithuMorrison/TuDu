import Button from './Button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowUp, faArrowDown, faEdit, faEye, faCheckCircle, faWarning} from "@fortawesome/free-solid-svg-icons";

function Card(ip){
  const currentDate = new Date();
  const ipDate = new Date(ip.ded);
  const timeDifference = currentDate - ipDate;
  const daysDifference = timeDifference / (1000 * 3600 * 24);

  function deletetask(){
    const updatetask = ip.tasks.filter((_,i) => i != ip.index);   
    ip.settask(updatetask);
    localStorage.setItem('data', JSON.stringify(updatetask));
  }
  
  function moveup()
  {
    if(ip.index>0){
    const updatetask = [...ip.tasks];
    [updatetask[ip.index],updatetask[ip.index-1]]=[updatetask[ip.index-1],updatetask[ip.index]];
      ip.settask(updatetask);
      localStorage.setItem('data', JSON.stringify(updatetask));
    }
  }  

  function movedown()
  {
    if(ip.index<ip.tasks.length-1){
    const updatetask = [...ip.tasks];
    [updatetask[ip.index],updatetask[ip.index+1]]=[updatetask[ip.index+1],updatetask[ip.index]];
      ip.settask(updatetask);
      localStorage.setItem('data', JSON.stringify(updatetask));
    }
  }

  function displayinfo(){
    ip.setInd(ip.index);
    ip.setShow(1);
  }

  function displaychange(){
    ip.setInd(ip.index);
    ip.setShow(0);
  }

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    fontSize: '24px',
    color: ip.status ? 'green' : (currentDate > ipDate ? 'red' : 'black'),
    marginRight: '20px',
  };

  function handleChecked(){
    if(daysDifference<0){
      const updatetask = [...ip.tasks];
      updatetask[ip.index].status=!updatetask[ip.index].status;
      ip.settask(updatetask);
      localStorage.setItem('data', JSON.stringify(updatetask));
    }
  }

  return(
    <div className = "outercard">
      {ip.isMobileView ? 
        <div className="card">
        <button style={iconButtonStyle} onClick={handleChecked}>
          <FontAwesomeIcon icon={ip.tasks[ip.index].status ? faCheckCircle : Math.abs(daysDifference) > 3 ? faCheckCircle : faWarning} />
        </button>
        <div>
          <h2 className="profiletitle1">{ip.name}</h2>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <p className="profileinfo1">{new Date(ip.ded).toDateString()}</p>
          <p className="profileinfo1">{new Date(ip.ded).toLocaleTimeString()}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexDirection: 'row' }}>
          <Button icon={faTrash} onClick={deletetask} color="linear-gradient(to right, #ec3257, #f5758e)" width={'30px'} />
          <Button icon={faArrowUp} onClick={moveup} color="linear-gradient(to right, #2a8bd5, #6bc7f5)" width={'30px'} />
          <Button icon={faArrowDown} onClick={movedown} color="linear-gradient(to right, #2a8bd5, #6bc7f5)" width={'30px'} />
          <Button icon={faEye} onClick={displayinfo} color="linear-gradient(to right, #cde708, #c9d56c)" width={'30px'} />
          <Button icon={faEdit} onClick={displaychange} width={'30px'} />
        </div>
        </div>
      </div>      
      : 
      <div className="card">
        <button style={iconButtonStyle} onClick={handleChecked}>
          <FontAwesomeIcon icon={ ip.tasks[ip.index].status ? faCheckCircle : Math.abs(daysDifference) > 3 ? faCheckCircle : faWarning } />
        </button>
        <img className="profileimg" src="https://www.zoologiste.com/images/main/lion.jpg" alt="profile picture"></img>
        <div>
        <h2 className="profiletitle">{ip.name}</h2>
        <div style={{display:'flex'}}>
        <p className="profileinfo">{new Date(ip.ded).toDateString()}</p>
        <p className="profileinfo">{new Date(ip.ded).toLocaleTimeString()}</p>
        </div>
        </div>
        <Button icon={faTrash} onClick = {deletetask} color="linear-gradient(to right, #ec3257, #f5758e)" width={'55px'}></Button>
        <Button icon={faArrowUp} onClick = {moveup} color="linear-gradient(to right, #2a8bd5, #6bc7f5)" width={'55px'}></Button>
        <Button icon={faArrowDown} onClick = {movedown} color="linear-gradient(to right, #2a8bd5, #6bc7f5)" width={'55px'}></Button>
        <Button icon={faEye} onClick = {displayinfo} color="linear-gradient(to right, #cde708, #c9d56c)" width={'55px'}></Button>   
        <Button icon={faEdit} onClick = {displaychange} width={'55px'}></Button>  
      </div> 
      }
      </div>
  );
}

export default Card