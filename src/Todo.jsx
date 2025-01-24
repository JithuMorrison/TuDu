import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Card3 from './Card3';
import Card2 from './Card2';
import Button from './Button/button';

function ToDo() {
  const [task, setTask] = useState([]);
  const [newtask, setNewtask] = useState("");
  const [time, setTime] = useState(new Date());
  const [ind, setInd] = useState(0);
  const [show, setShow] = useState(-1);
  const [isMobileView, setIsMobileView] = useState(false);
  const input = useRef(null);

  const items = task.map((item, index) => (
    <Card
      key={index}
      name={item.name}
      para={item.para}
      time={item.time}
      index={index}
      settask={setTask}
      tasks={task}
      ded={item.deadline}
      setInd={setInd}
      setShow={setShow}
      status={item.status}
    />
  ));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addItem = (newIte) => {
    const updatedData = [...task, newIte];
    setTask(updatedData);
    localStorage.setItem('data', JSON.stringify(updatedData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newtask.trim() !== "") {
      addItem({
        name: newtask,
        para: time.toDateString(),
        time: time.toLocaleTimeString(),
        deadline: input.current.value,
        status: false,
      });
      setNewtask("");
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobileView ? 'column' : 'row',
    alignItems: 'flex-start',
    width: '100%',
  };

  const dialogStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div>
    <div className="todolist" style={isMobileView ? { width: '280px', marginLeft: '-30px',marginRight: '-30px' } : {}}>
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
      <div style={containerStyle}>
        <div className='toka' style={isMobileView ? { width: '280px', marginLeft: '-30px',marginRight: '-30px' } : {}} >{items}</div>
        {isMobileView && show !== -1 && (
          <div style={dialogStyle}>
            <div style={{ backgroundColor: '#fff', color: '#000', padding: '20px', borderRadius: '10px', width: '90%' }}>
              {show === 1 ? (
                <Card2 name={task[ind].name} para={task[ind].para} time={task[ind].time} index={ind} />
              ) : show === 0 ? (
                <Card3 task={task} settask={setTask} index={ind} />
              ) : (
                <div>No TuDu selected</div>
              )}
              <button style={buttonStyle} onClick={() => setShow(-1)}>
                Close
              </button>
            </div>
          </div>
        )}
        {!isMobileView && (
          <div className='toka1'>
            {show === 1 ? (
              <Card2 name={task[ind].name} para={task[ind].para} time={task[ind].time} index={ind} />
            ) : show === 0 ? (
              <Card3 task={task} settask={setTask} index={ind} />
            ) : (
              <div>No TuDu selected</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDo;
