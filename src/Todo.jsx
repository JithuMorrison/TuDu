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
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [cato, setCato] = useState([]);
  const [fetcho, setFetcho] = useState('Todo');
  const [matcho, setMatcho] = useState('');
  const input = useRef(null);

  // Fetch stored tasks from localStorage on category change
  useEffect(() => {
    const storedData = localStorage.getItem(fetcho);
    const storedCategories = localStorage.getItem('data');
    
    if (storedCategories) {
      setCato(JSON.parse(storedCategories));
    }

    if (storedData) {
      setTask(JSON.parse(storedData));
    } else {
      fetch('/data.json')
        .then((response) => response.json())
        .then((task) => {
          localStorage.setItem(fetcho, JSON.stringify(task));
          setTask(task);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [fetcho]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addItem = (newItem) => {
    const updatedData = [...task, newItem];
    setTask(updatedData);
    localStorage.setItem(fetcho, JSON.stringify(updatedData));

    if (!cato.includes(fetcho)) {
      const updatedCat = [...cato, fetcho];
      setCato(updatedCat);
      localStorage.setItem('data', JSON.stringify(updatedCat));
    }
  };

  const updateTask = () => {
    const storedData = localStorage.getItem(fetcho);
    if (storedData) {
      setTask(JSON.parse(storedData));
    } else {
      setTask([]);
    }
  }

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

  const handleClick = (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem(matcho);
    if (storedData) {
      alert("Already present");
    }
    else{
      const updatedCat = [...cato, matcho];
      setCato(updatedCat);
      localStorage.setItem('data', JSON.stringify(updatedCat));
      localStorage.setItem(matcho,JSON.stringify([]));
      setTask([]);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobileView ? 'column' : 'row',
    alignItems: 'flex-start',
    width: '100%',
  };

  const dialogStyle = {
    position: 'fixed',
    top: 0,
    left: 8,
    width: '95%',
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
      {/* Task Input Section */}
      <div className="todolist" style={isMobileView ? { width: '107%', marginLeft: '-30px' } : {}}>
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
          <Button onClick={handleSubmit} text="Add Task" />
        </div>
      </div>

      {/* Task Selection Section */}
      <div className="todolist" style={isMobileView ? { width: '107%', marginLeft: '-30px' } : {}}>
        <div className="input-container">
          <select 
            className="inputfield"
            value={fetcho} 
            onChange={(e) => {
              setFetcho(e.target.value); 
              updateTask(e.target.value); // Call task update function
            }}
          >
            <option value="" disabled>Select a category</option>
            {cato.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <input
            className="inputfield"
            type="text"
            value={matcho}
            placeholder="Enter category"
            onChange={(e) => setMatcho(e.target.value)}
          />
          <Button onClick={handleClick} text="Select" />
        </div>
      </div>

      {/* Tasks Display Section */}
      <div style={containerStyle}>
        <div className='toka' style={isMobileView ? { width: '107%', marginLeft: '-30px' } : {}}>
          {task.map((item, index) => (
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
              isMobileView={isMobileView}
              fetcho={fetcho}
            />
          ))}
        </div>

        {/* Dialog Box for Mobile View */}
        {isMobileView && show !== -1 && (
          <div style={dialogStyle}>
            <div style={{ backgroundColor: '#fff', color: '#000', padding: '20px', borderRadius: '10px', width: '80%' }}>
              {show === 1 ? (
                <Card2 name={task[ind].name} para={task[ind].para} time={task[ind].time} index={ind} isMobileView={isMobileView} />
              ) : show === 0 ? (
                <Card3 task={task} settask={setTask} index={ind} isMobileView={isMobileView} />
              ) : (
                <div>No Task Selected</div>
              )}
              <button style={buttonStyle} onClick={() => setShow(-1)}>Close</button>
            </div>
          </div>
        )}

        {/* Desktop View Task Details */}
        {!isMobileView && (
          <div className='toka1'>
            {show === 1 ? (
              <Card2 name={task[ind].name} para={task[ind].para} time={task[ind].time} index={ind} isMobileView={isMobileView} />
            ) : show === 0 ? (
              <Card3 task={task} settask={setTask} index={ind} isMobileView={isMobileView} />
            ) : (
              <div>No Task Selected</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDo;