import React, {useState,useEffect,useRef} from 'react';
import Card from './Card';
import Button from './Button/Button';
import Card3 from './Card3';
import Card2 from './Card2';
function ToDo(){
  const [task,setTask] = useState([]);
  const [newtask,setNewtask] = useState("");
  const [time,setTime] = useState(new Date());
  const [ind,setInd] = useState(0);
  const [show,setShow] = useState(-1);
  const input = useRef(null);
  const items = task.map((item,index) => (
    <Card key={index} name={item.name} para = {item.para} time={item.time} index={index} settask={setTask} tasks={task} ded={item.deadline} setInd={setInd} setShow={setShow} status={item.status}></Card>
  ));

  useEffect(()=>{
    setInterval(()=>{
      setTime(new Date());
    },100);
  });

    useEffect(() => {
      const storedData = localStorage.getItem('data');
      if (storedData) {
        setTask(JSON.parse(storedData));
      } else {
        fetch('/data.json')
          .then((response) => response.json())
          .then((task) => {
            localStorage.setItem('data', JSON.stringify(task));
          })
          .catch((error) => console.error('Error fetching data:', error));
      }
    }, []);

    const addItem = (newIte) => {
      const updatedData = [...task, newIte];
      setTask(updatedData);
      localStorage.setItem('data', JSON.stringify(updatedData));
    };


    const handleSubmit = (e) => {
      e.preventDefault();
      if (newtask.trim() != ""){
      addItem({name: newtask,para: time.toDateString(),time:time.toLocaleTimeString(),deadline:input.current.value,status:false});
      }
    };
  
  
  return (
    <div>
    <div className="todolist">
      <h1 className="tasks">Tasks</h1>
      <div className="input-container">
        <input
          className="inputfield"
          type="text"
          value={newtask}
          placeholder="Enter a task"
          onChange={(e) => setNewtask(e.target.value)}
        />
        <input className="inputfield" type="datetime-local" ref={input} />
        <input
          className="inputfield read-only"
          type="text"
          value={`${time.toDateString()} ${time.toLocaleTimeString()}`}
          readOnly
        />
        <Button onClick={(e) => handleSubmit(e)} text="Add Task" />
      </div>
    </div>
    <div style={{display: 'flex',width:'1500px',marginLeft:'-100px'}}>
      <div className='toka'>
        <ol className="task-list">{items}</ol>
      </div>
      <div className='toka1'>
        {show==1 ? <Card2 name={task[ind].name} para = {task[ind].para} time={task[ind].time} index={ind}/> : show==0 ? <Card3 task={task} settask={setTask} index={ind}/> : <div>No TuDu selected</div>}
      </div>
      </div>
    </div>
  );
}

export default ToDo