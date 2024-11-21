import React, {useState,useEffect,useRef} from 'react';
import Card from './Card';
import Button from './Button/Button';
function ToDo(){
  const [task,setTask] = useState([]);
  const [newtask,setNewtask] = useState("");
  const [time,setTime] = useState(new Date());
  const input = useRef(null);
  const items = task.map((item,index) => (
    <Card key={index} name={item.name} para = {item.para} time={item.time} index={index} settask={setTask} tasks={task} ded={item.deadline}></Card>
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
      addItem({name: newtask,para: time.toDateString(),time:time.toLocaleTimeString(),deadline:input.current.value});
      }
    };
  
  
  return (
    <div className='todolist'>
      <h1 className='tasks'>Tasks</h1>
      <div>
      <input className = "inputfield" type="text" value={newtask} placeholder='Enter a task' onChange={(e) => setNewtask(e.target.value)}/>
      <Button onClick={(e)=>handleSubmit(e)} text = "Add"/>
        </div>
      <input className='inputfield' type="datetime-local" ref={input}></input>
      <div>
        <input className = "inputfield1" type="text" value={time.toDateString()+" "+time.toLocaleTimeString()} placeholder='Enter a task' readOnly/>
          </div>
      <ol>{items}</ol>
    </div>
  );
}

export default ToDo