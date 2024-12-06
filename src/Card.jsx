import Button from "./Button/Button";
import Card2 from "./Card2";  
import Card3 from "./Card3";  
import {useState} from "react";
import { faTrash, faArrowUp, faArrowDown, faEdit, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

function Card(ip){

  const [showinfo,setShowinfo] = useState(false);
  const [showinf,setShowinf] = useState(false);
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
    setShowinfo(!showinfo);
  }
  function displaychange(){
    setShowinf(!showinf);
  }
  const iron = (<Card2 name={ip.name} para = {ip.para} time={ip.time} index={ip.index}/>);
  const iron2 = (<Card3 task={ip.tasks} settask={ip.settask} index={ip.index}/>);
  return(
    <div className = "outercard">
    <div className="card">
      <img className="profileimg" src="https://www.zoologiste.com/images/main/lion.jpg" alt="profile picture"></img>
      <div>
      <h2 className="profiletitle">{ip.name}</h2>
      <div style={{display:'flex'}}>
      <p className="profileinfo">{new Date(ip.ded).toDateString()}</p>
      <p className="profileinfo">{new Date(ip.ded).toLocaleTimeString()}</p>
      </div>
      </div>
      <Button icon={faTrash} onClick = {deletetask} color="linear-gradient(to right, #ec3257, #f5758e)" width={'55px'}></Button>
      <div>
      <Button icon={faArrowUp} onClick = {moveup} color="linear-gradient(to right, #2a8bd5, #6bc7f5)" width={'55px'}></Button>
      <Button icon={faArrowDown} onClick = {movedown} color="linear-gradient(to right, #2a8bd5, #6bc7f5)" width={'55px'}></Button>
      </div>
      <div>
      <Button text="Edit" onClick = {displayinfo} color="linear-gradient(to right, #cde708, #c9d56c)"></Button>   
      <Button text="Change" onClick = {displaychange} ></Button>  
      </div>
    </div>
      {showinfo ? iron : null}
      {showinf ? iron2 : null}
      </div>
  );
}

export default Card