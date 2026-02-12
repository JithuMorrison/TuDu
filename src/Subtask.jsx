import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function SubtaskManager({ task, taskIndex, tasks, setTasks, fetcho, onClose }) {
  const [newSubtask, setNewSubtask] = useState('');

  const addSubtask = () => {
    if (newSubtask.trim() === '') return;
    
    const updatedTasks = [...tasks];
    if (!updatedTasks[taskIndex].subtasks) {
      updatedTasks[taskIndex].subtasks = [];
    }
    
    updatedTasks[taskIndex].subtasks.push({
      name: newSubtask.trim(),
      completed: false
    });
    
    setTasks(updatedTasks);
    localStorage.setItem(fetcho, JSON.stringify(updatedTasks));
    setNewSubtask('');
  };

  const toggleSubtask = (subIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks[subIndex].completed = 
      !updatedTasks[taskIndex].subtasks[subIndex].completed;
    
    setTasks(updatedTasks);
    localStorage.setItem(fetcho, JSON.stringify(updatedTasks));
  };

  const removeSubtask = (subIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks.splice(subIndex, 1);
    
    setTasks(updatedTasks);
    localStorage.setItem(fetcho, JSON.stringify(updatedTasks));
  };

  const calculateProgress = () => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const progress = calculateProgress();

  const containerStyle = {
    backgroundColor: '#ffffff',
    color: '#000',
    padding: '24px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const progressStyle = {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '12px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem'
  };

  const subtaskItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid #e5e7eb'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, color: '#2d3748' }}>
          Manage Subtasks: {task.name}
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {/* Progress */}
      <div style={progressStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <strong>Overall Progress:</strong>
          <span style={{ color: progress === 100 ? '#10b981' : '#4f46e5', fontWeight: '600' }}>
            {progress}% ({task.subtasks?.filter(st => st.completed).length || 0}/{task.subtasks?.length || 0})
          </span>
        </div>
        <div style={{
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: progress === 100 ? '#10b981' : '#4f46e5',
            width: `${progress}%`,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Add Subtask */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Add new subtask..."
          style={inputStyle}
          onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
        />
        <button
          onClick={addSubtask}
          style={{
            ...buttonStyle,
            backgroundColor: '#10b981',
            width: '100%'
          }}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
          Add Subtask
        </button>
      </div>

      {/* Subtasks List */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '12px', fontSize: '1rem', color: '#4f46e5' }}>
          Subtasks:
        </h3>
        {task.subtasks && task.subtasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {task.subtasks.map((subtask, subIndex) => (
              <div key={subIndex} style={subtaskItemStyle}>
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(subIndex)}
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  flex: 1,
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  color: subtask.completed ? '#6b7280' : '#374151',
                  fontSize: '0.95rem'
                }}>
                  {subtask.name}
                </span>
                <button
                  onClick={() => removeSubtask(subIndex)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: '24px', 
            textAlign: 'center', 
            color: '#6b7280',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px dashed #d1d5db'
          }}>
            No subtasks added yet. Add your first subtask above!
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        style={{
          ...buttonStyle,
          width: '100%'
        }}
      >
        Close
      </button>
    </div>
  );
}

export default SubtaskManager;