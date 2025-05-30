import { useRef, useState, useEffect } from "react";
import Button from './Button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

function Card3(ip) {
  const nameref = useRef(null);
  const input = useRef(null);
  const [isDailyTask, setIsDailyTask] = useState(ip.task[ip.index]?.isDaily || false);

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    maxWidth: '400px',
    margin: '0 auto'
  };

  const profileImageStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '16px',
    border: '3px solid #e5e7eb'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
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
    width: '100%',
    '&:hover': {
      backgroundColor: '#4338ca'
    }
  };

  const labelStyle = {
    alignSelf: 'flex-start',
    marginBottom: '8px',
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  useEffect(() => {
    if (nameref.current && ip.task[ip.index]) {
      nameref.current.value = ip.task[ip.index].name || '';
      setIsDailyTask(ip.task[ip.index].isDaily || false);
  
      if (input.current && !ip.task[ip.index].isDaily) {
        input.current.value = ip.task[ip.index].deadline || '';
      }
    }
  }, [ip.task, ip.index]);

  function changetask() {
    const updatetask = ip.task.map((task, i) => {
      if (i === ip.index) {
        let names = task.name;
        let dedlin = task.deadline;
        let isDaily = task.isDaily;
  
        if (!isDaily && input.current && input.current.value !== "") {
          dedlin = input.current.value;
        }
        if (nameref.current && nameref.current.value !== "") {
          names = nameref.current.value;
        }
  
        return { ...task, name: names, deadline: dedlin, isDaily: isDailyTask };
      }
      return task;
    });
  
    if (nameref.current) nameref.current.value = '';
    if (input.current) input.current.value = ''; // Only clear if it exists
  
    ip.settask(updatetask);
    localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
  }  

  return (
    <div style={cardStyle}>
      <img
        style={profileImageStyle}
        src="https://th.bing.com/th/id/R.c0ad17e72403623d19623c61c98abb00?rik=J9%2bdJj2aBRlSzg&riu=http%3a%2f%2fwallpapercave.com%2fwp%2fozun9n8.jpg&ehk=NtZHPyOCXiZeKAp52FDbKy5%2fVIHpLlD4PI2xMnzAI8w%3d&risl=&pid=ImgRaw&r=0"
        alt="profile"
      />
      
      <label style={labelStyle}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        Task Name
      </label>
      <input 
        placeholder="Enter task name" 
        style={inputStyle} 
        ref={nameref}
        defaultValue={ip.task[ip.index]?.name}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <input
          type="checkbox"
          id="editDailyTask"
          checked={isDailyTask}
          onChange={(e) => setIsDailyTask(e.target.checked)}
        />
        <label htmlFor="editDailyTask">Daily Task (no deadline)</label>
      </div>
      
      {!isDailyTask && (
        <>
          <label style={labelStyle}>
            <FontAwesomeIcon icon={faClock} />
            Due Date & Time
          </label>
          <input 
            type="datetime-local" 
            style={inputStyle} 
            ref={input}
            defaultValue={ip.task[ip.index]?.deadline || ''}
          />
        </>
      )}
      
      <button
        style={buttonStyle}
        onClick={changetask}
      >
        Update Task
      </button>
    </div>
  );
}

export default Card3;