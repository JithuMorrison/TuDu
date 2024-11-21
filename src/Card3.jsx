import { useRef } from "react";
import Button from "./Button/Button";

function Card3(ip) {
  const nameref = useRef(null);
  const input = useRef(null);
  function changetask(){
    
    const updatetask = ip.task.map((task, i) => {
      if (i == ip.index) {
        let names = task.name;
        let dedlin = task.deadline;
        if(input.current.value!==""){
        console.log(input.current.value,dedlin);
        }
        if(nameref.current.value!==""){
          names = nameref.current.value;
        }
        if(input.current.value!==""){
          dedlin=input.current.value;
        }
        return { ...task, name: names, deadline: dedlin };
      }
      return task;   
    });
    nameref.current.value='';
    input.current.value='';
    ip.settask(updatetask);
    localStorage.setItem('data', JSON.stringify(updatetask));
  }
  return (
    <div className="card2">
      <img
        className="profileimg"
        src="https://www.zoologiste.com/images/main/lion.jpg"
        alt="profile picture"
      ></img><br></br>
      <input placeholder="task-name" className="inputfield" ref={nameref}></input><br></br>
      <input type="datetime-local" className="inputfield1" ref={input}></input><br></br>
      <Button title="Click" onClick={(e)=>changetask(e)}></Button>
    </div>
  );
}

export default Card3;
