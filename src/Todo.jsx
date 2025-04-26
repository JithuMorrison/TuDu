import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Card3 from './Card3';
import Card2 from './Card2';
import Button from './Button/button';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

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
    gap: '24px',
    width: isMobileView ? '100%': '70%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    marginLeft: isMobileView? '0px' : '220px'
  };

  const inputContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
    marginLeft: isMobileView? '0px' : '-150px',
    width: isMobileView? '75%' : '135%'
  };

  const taskListStyle = {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: isMobileView? '75%' : '100%',
    minWidth: isMobileView ? '0px' : '600px',
    marginLeft: isMobileView? '0px' : '50px',
  };

  const detailPaneStyle = {
    width: isMobileView ? '90%' : '340px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const dialogStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '89%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      {/* Header */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#2d3748' }}>Task Manager</h1>
      </div>

      {/* Main Content */}
      <div style={containerStyle}>
        {/* Task Input Section */}
        <div style={{ width: '100%' }}>
          <div style={inputContainerStyle}>
            <h2 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#2d3748' }}>Add New Task</h2>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobileView ? 'column' : 'row' }}>
              <input
                style={{ 
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                type="text"
                value={newtask}
                placeholder="Enter task name"
                onChange={(e) => setNewtask(e.target.value)}
              />
              <input
                style={{ 
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                type="datetime-local"
                ref={input}
              />
              <button
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4299e1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
                onClick={handleSubmit}
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Category Section */}
          <div style={{ ...inputContainerStyle, marginTop: '16px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#2d3748' }}>Manage Categories</h2>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobileView ? 'column' : 'row' }}>
              <select
                style={{ 
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                value={fetcho}
                onChange={(e) => {
                  setFetcho(e.target.value);
                  updateTask(e.target.value);
                }}
              >
                <option value="" disabled>Select a category</option>
                {cato.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              <input
                style={{ 
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                type="text"
                value={matcho}
                placeholder="Enter new category"
                onChange={(e) => setMatcho(e.target.value)}
              />
              <button
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#48bb78',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
                onClick={handleClick}
              >
                Add Category
              </button>
            </div>
          </div>

          {/* Task Details Section */}
        {!isMobileView && (
          <div style={detailPaneStyle}>
            {show === 1 ? (
              <Card2 name={task[ind].name} para={task[ind].para} time={task[ind].time} index={ind} isMobileView={isMobileView} />
            ) : show === 0 ? (
              <Card3 task={task} settask={setTask} index={ind} isMobileView={isMobileView} />
            ) : (
              <div style={{ color: '#718096', textAlign: 'center', padding: '24px' }}>
                Select a task to view details
              </div>
            )}
          </div>
        )}
        </div>

        {/* Tasks Display Section */}
        <div style={taskListStyle}>
          <h2 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#2d3748' }}>Tasks</h2>
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

        {/* Mobile Dialog */}
        {isMobileView && show !== -1 && (
          <div style={dialogStyle}>
            <div style={{ backgroundColor: '#ffffff', color: '#000', padding: '24px', borderRadius: '12px', width: '80%', maxWidth: '500px' }}>
              {show === 1 ? (
                <Card2 name={task[ind].name} para={task[ind].para} time={task[ind].time} index={ind} isMobileView={isMobileView} />
              ) : show === 0 ? (
                <Card3 task={task} settask={setTask} index={ind} isMobileView={isMobileView} />
              ) : (
                <div>No Task Selected</div>
              )}
              <button
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  backgroundColor: '#4299e1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%'
                }}
                onClick={() => setShow(-1)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDo;