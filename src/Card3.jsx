import React, { useRef, useState, useEffect } from "react";
import Button from './Button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function Card3(ip) {
  const nameref = useRef(null);
  const input = useRef(null);
  const [isDailyTask, setIsDailyTask] = useState(ip.task[ip.index]?.isDaily || false);
  const [newSubtask, setNewSubtask] = useState('');
  const [subtasks, setSubtasks] = useState(ip.task[ip.index]?.subtasks || []);

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
      setSubtasks(ip.task[ip.index].subtasks || []);
  
      if (input.current && !ip.task[ip.index].isDaily) {
        input.current.value = ip.task[ip.index].deadline || '';
      }
    }
  }, [ip.task, ip.index]);

  const addSubtask = () => {
    if (newSubtask.trim() === '') return;
    
    const subtask = {
      name: newSubtask.trim(),
      completed: false
    };

    setSubtasks(prev => [...prev, subtask]);
    setNewSubtask('');
  };

  const removeSubtask = (index) => {
    setSubtasks(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSubtask = (index) => {
    setSubtasks(prev => prev.map((subtask, i) => 
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    ));
  };

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
  
        return { 
          ...task, 
          name: names, 
          deadline: dedlin, 
          isDaily: isDailyTask,
          subtasks: subtasks 
        };
      }
      return task;
    });
  
    ip.settask(updatetask);
    localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
  }

  const calculateProgress = () => {
    if (subtasks.length === 0) return 0;
    const completed = subtasks.filter(st => st.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  };

  const progress = calculateProgress();

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

      {/* Subtasks Management */}
      <div style={{ width: '100%', marginBottom: '16px' }}>
        <label style={labelStyle}>
          <FontAwesomeIcon icon={faCalendarAlt} />
          Subtasks {subtasks.length > 0 && `(${progress}% completed)`}
        </label>
        
        {/* Add Subtask */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Add new subtask..."
            style={{
              ...inputStyle,
              marginBottom: '0',
              fontSize: '0.9rem',
              padding: '8px 12px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
          />
          <Button
            icon={faPlus}
            onClick={addSubtask}
            color="#10b981"
            width="36px"
            tooltip="Add subtask"
          />
        </div>

        {/* Subtasks List */}
        {subtasks.length > 0 ? (
          <div style={{ 
            maxHeight: '150px',
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px'
          }}>
            {subtasks.map((subtask, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
                marginBottom: '4px'
              }}>
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(index)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{
                  flex: 1,
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  color: subtask.completed ? '#6b7280' : '#374151',
                  fontSize: '0.9rem'
                }}>
                  {subtask.name}
                </span>
                <Button
                  icon={faTrash}
                  onClick={() => removeSubtask(index)}
                  color="#ef4444"
                  width="28px"
                  tooltip="Remove subtask"
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: '16px', 
            textAlign: 'center', 
            color: '#6b7280',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px dashed #d1d5db',
            fontSize: '0.9rem'
          }}>
            No subtasks added yet
          </div>
        )}
      </div>
      
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