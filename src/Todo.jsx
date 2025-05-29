import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Card3 from './Card3';
import Card2 from './Card2';
import Button from './Button/button';
import { faTrash, faArrowUp, faArrowDown, faEdit, faEye, faCheckCircle, faWarning, faClock } from "@fortawesome/free-solid-svg-icons";

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
  const [isDailyTask, setIsDailyTask] = useState(false);
  const input = useRef(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkForNewDay = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Check if it's midnight (or a specific time you prefer)
      if (hours === 0 && minutes === 0) {
        const updatedTasks = task.map(t => {
          if (t.isDaily) {
            return { ...t, status: false };
          }
          return t;
        });
        setTask(updatedTasks);
        localStorage.setItem(fetcho, JSON.stringify(updatedTasks));
      }
    };
    
    const interval = setInterval(checkForNewDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [task, fetcho]);

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
      const deadlineValue = input.current ? input.current.value : null;
      addItem({
        name: newtask,
        para: time.toDateString(),
        time: time.toLocaleTimeString(),
        deadline: deadlineValue,
        status: false,
        isDaily: isDailyTask, // Add this line
      });
      setNewtask("");
      setIsDailyTask(false); // Reset the daily task checkbox
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem(matcho);
    if (matcho=="") {
      alert("Enter a category");
    }
    else if (storedData) {
      alert("Category already exists");
    }
    else{
      const updatedCat = [...cato, matcho];
      setCato(updatedCat);
      setFetcho(matcho);
      localStorage.setItem('data', JSON.stringify(updatedCat));
      localStorage.setItem(matcho,JSON.stringify([]));
      setTask([]);
    }
  };

  const handleDeleteCategory = (category) => {
    if (category === 'Todo') {
      alert("Cannot delete default category");
      return;
    }
    const updatedCat = cato.filter(cat => cat !== category);
    setCato(updatedCat);
    localStorage.setItem('data', JSON.stringify(updatedCat));
    localStorage.removeItem(category);
    if (fetcho === category) {
      setFetcho('Todo');
      const todoData = localStorage.getItem('Todo');
      setTask(todoData ? JSON.parse(todoData) : []);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobileView ? 'column' : 'row',
    gap: '24px',
    width: isMobileView ? '90%' : '90%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobileView ? '16px' : '24px',
    backgroundColor: '#f5f7fa',
    minHeight: 'calc(100vh - 80px)'
  };

  const inputContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    marginBottom: '24px',
    width: isMobileView ? '88%' : '100%'
  };

  const taskListStyle = {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    width: isMobileView ? '89%' : '100%',
    maxHeight: isMobileView ? 'auto' : 'calc(100vh - 180px)',
    overflowY: 'auto',
    marginLeft: isMobileView? '0px' : '50px'
  };

  const detailPaneStyle = {
    width: isMobileView ? '100%' : '380px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    height: isMobileView ? 'auto' : 'fit-content',
    position: isMobileView ? 'static' : 'sticky',
    top: '100px'
  };

  const dialogStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };

  const headerStyle = {
    backgroundColor: '#4f46e5',
    padding: '16px 24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const timeStyle = {
    fontSize: '14px',
    fontWeight: 'normal',
    opacity: 0.9
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    '&:focus': {
      borderColor: '#4f46e5',
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)'
    }
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#4338ca'
    }
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '1em'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>TuDu</h1>
        <div style={timeStyle}>
          {time.toLocaleDateString()} | {time.toLocaleTimeString()}
        </div>
      </div>

      {/* Main Content */}
      <div style={containerStyle}>
        {/* Left Column - Inputs and Details */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          width: isMobileView ? '100%' : '40%',
          maxWidth: '500px'
        }}>
          {/* Task Input Section */}
          <div style={inputContainerStyle}>
            <h2 style={{ 
              marginBottom: '16px', 
              fontSize: '1.25rem', 
              color: '#2d3748',
              fontWeight: '600'
            }}>Add New Task</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <input
                style={inputStyle}
                type="text"
                value={newtask}
                placeholder="Enter task name"
                onChange={(e) => setNewtask(e.target.value)}
                required
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="dailyTask"
                  checked={isDailyTask}
                  onChange={(e) => setIsDailyTask(e.target.checked)}
                />
                <label htmlFor="dailyTask">Daily Task (no deadline)</label>
              </div>
              {!isDailyTask && (
                <input
                  style={inputStyle}
                  type="datetime-local"
                  ref={input}
                  required={!isDailyTask}
                />
              )}
              <button
                style={buttonStyle}
                type="submit"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Category Section */}
          <div style={inputContainerStyle}>
            <h2 style={{ 
              marginBottom: '16px', 
              fontSize: '1.25rem', 
              color: '#2d3748',
              fontWeight: '600'
            }}>Manage Categories</h2>
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  style={{ ...selectStyle, flex: 1 }}
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
                <Button
                  icon={faTrash}
                  onClick={() => handleDeleteCategory(fetcho)}
                  color="#ef4444"
                  width="36px"
                  tooltip="Delete category"
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  style={inputStyle}
                  type="text"
                  value={matcho}
                  placeholder="Enter new category"
                  onChange={(e) => setMatcho(e.target.value)}
                />
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#10b981',
                    '&:hover': {
                      backgroundColor: '#0d9f6e'
                    }
                  }}
                  onClick={handleClick}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Task Details Section */}
          {!isMobileView && (
            <div style={detailPaneStyle}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <button
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '30%',
                  }}
                  onClick={() => setShow(-1)}
                >
                  Close
                </button>
              </div>
              {show === 1 ? (
                <Card2 name={task[ind]?.name} para={task[ind]?.para} time={task[ind]?.time} index={ind} isMobileView={isMobileView} status={task[ind]?.status} />
              ) : show === 0 ? (
                <Card3 task={task} settask={setTask} index={ind} isMobileView={isMobileView} />
              ) : (
                <div style={{ 
                  color: '#64748b', 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <p style={{ margin: 0 }}>Select a task to view details</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Task List */}
        <div style={taskListStyle}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            paddingBottom: '16px',
            zIndex: 10
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              color: '#2d3748',
              fontWeight: '600'
            }}>{fetcho} Tasks</h2>
            <div style={{ 
              color: '#64748b',
              fontSize: '14px'
            }}>
              {task.length} {task.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>
          
          {task.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '40px 20px',
              color: '#64748b',
              textAlign: 'center'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 style={{ margin: '16px 0 8px' }}>No tasks found</h3>
              <p style={{ margin: 0 }}>Add a new task to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          )}
        </div>

        {/* Mobile Dialog */}
        {isMobileView && show !== -1 && (
          <div style={dialogStyle}>
            <div style={{ 
              backgroundColor: '#ffffff', 
              color: '#000', 
              padding: '24px', 
              borderRadius: '12px', 
              width: '100%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              {show === 1 ? (
                <Card2 name={task[ind]?.name} para={task[ind]?.para} time={task[ind]?.time} index={ind} isMobileView={isMobileView} />
              ) : show === 0 ? (
                <Card3 task={task} settask={setTask} index={ind} isMobileView={isMobileView} />
              ) : (
                <div>No Task Selected</div>
              )}
              <button
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  '&:hover': {
                    backgroundColor: '#4338ca'
                  }
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