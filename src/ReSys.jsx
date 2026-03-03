import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGripVertical, 
  faCheckCircle, 
  faCircle, 
  faPlus,
  faTrash,
  faEdit,
  faChevronLeft,
  faChevronRight,
  faCalendar,
  faCalendarAlt,
  faClock,
  faExclamationTriangle,
  faFlag,
  faCalendarDay
} from '@fortawesome/free-solid-svg-icons';

// Sortable Task Component for My Tasks
const SortableTask = ({ task, onToggle, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const taskItemStyle = {
    padding: '0.75rem',
    margin: '0.5rem 0',
    background: isDragging ? '#f0f9ff' : 'white',
    border: `2px solid ${isDragging ? '#4f46e5' : '#e2e8f0'}`,
    borderRadius: '8px',
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: 'all 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const completedTaskStyle = {
    opacity: 0.7,
    textDecoration: 'line-through',
    background: '#f0f9ff'
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...taskItemStyle,
        ...(task.completed && completedTaskStyle),
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
          <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{task.content}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            {task.duration && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.7rem' }} />
                {task.duration}
              </span>
            )}
            {task.priority && (
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                color: getPriorityColor(task.priority),
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={faFlag} style={{ fontSize: '0.7rem' }} />
                {task.priority}
              </span>
            )}
            {task.date && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '0.7rem' }} />
                {new Date(task.date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task, null);
          }}
          style={{
            background: '#f3f4f6',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '0.75rem',
            padding: '0.35rem 0.6rem',
            borderRadius: '4px',
            fontWeight: '500'
          }}
          title="Edit task"
        >
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.25rem' }} />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id, null);
          }}
          style={{
            background: '#fee2e2',
            border: 'none',
            cursor: 'pointer',
            color: '#ef4444',
            fontSize: '0.75rem',
            padding: '0.35rem 0.6rem',
            borderRadius: '4px',
            fontWeight: '500'
          }}
          title="Delete task"
        >
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: '0.25rem' }} />
          Delete
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id, null);
          }}
          style={{
            background: task.completed ? '#d1fae5' : '#f3f4f6',
            border: 'none',
            cursor: 'pointer',
            color: task.completed ? '#10b981' : '#6b7280',
            fontSize: '0.75rem',
            padding: '0.35rem 0.6rem',
            borderRadius: '4px',
            fontWeight: '500'
          }}
          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          <FontAwesomeIcon icon={task.completed ? faCheckCircle : faCircle} style={{ marginRight: '0.25rem' }} />
          {task.completed ? 'Done' : 'Mark'}
        </button>
      </div>
    </div>
  );
};

// Timeline Task Component
const TimelineTask = ({ task, onToggle, onEdit, onDelete, onMoveToTasks, dayId, dayDate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const taskItemStyle = {
    padding: '0.5rem',
    margin: '0.25rem 0',
    background: isDragging ? '#f0f9ff' : task.completed ? '#f0fdf4' : 'white',
    border: `2px solid ${isDragging ? '#4f46e5' : task.completed ? '#86efac' : '#e2e8f0'}`,
    borderRadius: '6px',
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: 'all 0.2s ease',
    opacity: isDragging ? 0.8 : task.completed ? 0.7 : 1,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...taskItemStyle,
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '0.25rem' }}>
          <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af', fontSize: '0.7rem' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontWeight: '500', 
            fontSize: '0.85rem',
            textDecoration: task.completed ? 'line-through' : 'none',
            wordBreak: 'break-word'
          }}>
            {task.content}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {task.duration && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.6rem' }} />
                {task.duration}
              </span>
            )}
            {task.priority && (
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                color: getPriorityColor(task.priority),
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={faFlag} style={{ fontSize: '0.6rem' }} />
                {task.priority}
              </span>
            )}
            {dayDate && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '0.6rem' }} />
                {dayDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveToTasks(task.id, dayId);
          }}
          style={{
            background: '#e0f2fe',
            border: 'none',
            cursor: 'pointer',
            color: '#0369a1',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '500'
          }}
          title="Move back to My Tasks"
        >
          📋 Move to Tasks
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id, dayId);
          }}
          style={{
            background: task.completed ? '#10b981' : '#e5e7eb',
            border: 'none',
            cursor: 'pointer',
            color: task.completed ? 'white' : '#6b7280',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '500'
          }}
        >
          {task.completed ? '✓ Done' : 'Mark Done'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id, dayId);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#ef4444',
            fontSize: '0.75rem',
            padding: '0.25rem'
          }}
          title="Delete task"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

// Drop Zone Component for Timeline Slots
const TimelineSlot = ({ dayId, time, tasks, onToggle, onEdit, onDelete, onMoveToTasks, dayDate }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `timeline-${dayId}-${time}`,
  });

  const slotStyle = {
    minHeight: '60px',
    padding: '0.5rem',
    background: isOver ? '#f0f9ff' : 'transparent',
    border: isOver ? '2px dashed #4f46e5' : '2px dashed transparent',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  };

  return (
    <div ref={setNodeRef} style={slotStyle}>
      {tasks.map(task => (
        <TimelineTask
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveToTasks={onMoveToTasks}
          dayId={dayId}
          dayDate={dayDate}
        />
      ))}
    </div>
  );
};

// My Tasks Drop Zone
const MyTasksDropZone = ({ isOver }) => {
  return (
    <div style={{
      padding: '0.75rem',
      border: isOver ? '3px dashed #4f46e5' : '2px dashed #e2e8f0',
      borderRadius: '8px',
      background: isOver ? '#f0f9ff' : '#fafafa',
      textAlign: 'center',
      color: isOver ? '#4f46e5' : '#9ca3af',
      fontSize: '0.85rem',
      transition: 'all 0.2s ease',
      fontWeight: isOver ? '600' : '400'
    }}>
      {isOver ? '📥 Drop here!' : '👆 Drag timeline tasks here'}
    </div>
  );
};

// Allocated Tasks Component
const AllocatedTasksList = ({ tasks, onNavigateToTask, onClose }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDateTime = (task) => {
    const date = task.dayDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    const time = task.time || 'No time set';
    return `${date} at ${time}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#1f2937' }}>
            📅 Allocated Tasks ({tasks.length})
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#6193f6ff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Close
          </button>
        </div>

        {tasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#9ca3af', 
            padding: '3rem 1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>No allocated tasks</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Drag tasks from "My Tasks" to the calendar to schedule them</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map(task => (
              <div
                key={`${task.dayId}-${task.id}`}
                style={{
                  padding: '1rem',
                  background: task.completed ? '#f0fdf4' : 'white',
                  border: `2px solid ${task.completed ? '#86efac' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: task.completed ? 0.8 : 1
                }}
                onClick={() => onNavigateToTask(task)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '1rem',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      marginBottom: '0.25rem'
                    }}>
                      {task.content}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      <FontAwesomeIcon icon={faCalendar} style={{ fontSize: '0.7rem' }} />
                      {formatDateTime(task)}
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#64748b', 
                      display: 'flex', 
                      gap: '1rem', 
                      flexWrap: 'wrap' 
                    }}>
                      {task.duration && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.6rem' }} />
                          {task.duration}
                        </span>
                      )}
                      {task.priority && (
                        <span style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.25rem',
                          color: getPriorityColor(task.priority),
                          fontWeight: '600'
                        }}>
                          <FontAwesomeIcon icon={faFlag} style={{ fontSize: '0.6rem' }} />
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: task.completed ? '#10b981' : '#e0f2fe',
                    color: task.completed ? 'white' : '#0369a1',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    {task.completed ? '✓ Done' : 'Scheduled'}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: '#4f46e5',
                  fontWeight: '500'
                }}>
                  👆 Click to navigate to this date
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Task component for DragOverlay
const Task = ({ task }) => {
  const taskItemStyle = {
    padding: '0.75rem',
    background: '#f0f9ff',
    border: '2px solid #4f46e5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'grabbing',
    transform: 'rotate(3deg)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    maxWidth: '300px'
  };

  return (
    <div style={taskItemStyle}>
      <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{task.content}</div>
        {task.time && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>⏰ {task.time}</div>}
      </div>
    </div>
  );
};

// Calendar Component
const Calendar = ({ selectedDates, onDateSelect, dayTasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    const dateString = date.toDateString();
    return Object.values(dayTasks).flat().filter(task => 
      task.date === dateString
    );
  };

  const getPriorityCount = (tasks, priority) => {
    return tasks.filter(task => task.priority === priority).length;
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={calendarDayStyle}></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDates.some(selected => selected.toDateString() === dateString);
      const dayTasks = getTasksForDate(date);
      const hasUrgent = getPriorityCount(dayTasks, 'Urgent') > 0;
      const hasHigh = getPriorityCount(dayTasks, 'High') > 0;
      
      days.push(
        <div
          key={day}
          style={{
            ...calendarDayStyle,
            background: isSelected ? '#4f46e5' : isToday ? '#f0f9ff' : 'white',
            color: isSelected ? 'white' : isToday ? '#4f46e5' : '#374151',
            border: isSelected ? '2px solid #4f46e5' : isToday ? '2px solid #4f46e5' : '1px solid #e5e7eb',
            fontWeight: isToday || isSelected ? '600' : '400',
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={() => onDateSelect(date)}
          title={`${dayTasks.length} tasks`}
        >
          {day}
          {dayTasks.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              display: 'flex',
              gap: '1px'
            }}>
              {hasUrgent && <div style={{ width: '4px', height: '4px', background: '#ef4444', borderRadius: '50%' }}></div>}
              {hasHigh && <div style={{ width: '4px', height: '4px', background: '#f59e0b', borderRadius: '50%' }}></div>}
              {!hasUrgent && !hasHigh && dayTasks.length > 0 && (
                <div style={{ width: '4px', height: '4px', background: '#10b981', borderRadius: '50%' }}></div>
              )}
            </div>
          )}
          {dayTasks.length > 0 && (
            <div style={{
              fontSize: '0.6rem',
              color: isSelected ? 'white' : '#6b7280',
              marginTop: '2px'
            }}>
              {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calendarStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem'
  };

  const calendarHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  };

  const calendarGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem'
  };

  const calendarDayStyle = {
    padding: '0.75rem',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '0.9rem',
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  const dayHeaderStyle = {
    textAlign: 'center',
    fontWeight: '600',
    color: '#4f46e5',
    fontSize: '0.8rem',
    padding: '0.5rem'
  };

  const navButtonStyle = {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <div style={calendarStyle}>
      <div style={calendarHeaderStyle}>
        <button 
          onClick={() => navigateMonth(-1)}
          style={navButtonStyle}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: '#2d3748' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button 
            onClick={goToToday}
            style={{
              ...navButtonStyle,
              background: '#f3f4f6',
              color: '#4f46e5',
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem'
            }}
          >
            Today
          </button>
        </div>
        
        <button 
          onClick={() => navigateMonth(1)}
          style={navButtonStyle}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <div style={calendarGridStyle}>
        {dayNames.map(day => (
          <div key={day} style={dayHeaderStyle}>
            {day}
          </div>
        ))}
        {renderMonthView()}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></div>
          <span>Urgent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></div>
          <span>High</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
          <span>Tasks</span>
        </div>
      </div>
    </div>
  );
};

// Task Form Component
const TaskForm = ({ isOpen, onClose, onSave, task = null, dayId = null }) => {
  const [formData, setFormData] = useState({
    content: task?.content || '',
    duration: task?.duration || '30m',
    priority: task?.priority || 'Medium',
    description: task?.description || '',
    date: task?.date || new Date().toDateString()
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.content.trim()) {
      onSave(formData, dayId);
      setFormData({
        content: '',
        duration: '30m',
        priority: 'Medium',
        description: '',
        date: new Date().toDateString()
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Task Description *
            </label>
            <input
              type="text"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="What needs to be done?"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              >
                <option value="15m">15 minutes</option>
                <option value="30m">30 minutes</option>
                <option value="45m">45 minutes</option>
                <option value="1h">1 hour</option>
                <option value="1.5h">1.5 hours</option>
                <option value="2h">2 hours</option>
                <option value="3h">3+ hours</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  color: getPriorityColor(formData.priority),
                  fontWeight: '600'
                }}
              >
                <option value="Low" style={{ color: '#10b981' }}>Low</option>
                <option value="Medium" style={{ color: '#3b82f6' }}>Medium</option>
                <option value="High" style={{ color: '#f59e0b' }}>High</option>
                <option value="Urgent" style={{ color: '#ef4444' }}>Urgent</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Date
            </label>
            <input
              type="date"
              value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value).toDateString() }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Notes (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional notes..."
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid rgba(95, 147, 249, 1)ff',
                background: '#3176feff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: '#4f46e5',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RearrangePage = ({ userData, setXp, saveUserData }) => {
  const [dailyTasks, setDailyTasks] = useState(() => {
    const saved = localStorage.getItem('dailyTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDates, setSelectedDates] = useState([]);
  const [dayTasks, setDayTasks] = useState(() => {
    const saved = localStorage.getItem('dayTasks');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTask, setActiveTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingDayId, setEditingDayId] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showAllocatedTasks, setShowAllocatedTasks] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate days based on selected dates
  const getDaysFromSelectedDates = () => {
    if (selectedDates.length === 0) {
      // Default to current week if no dates selected
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return {
          id: date.toDateString(),
          name: date.toLocaleDateString('en-US', { weekday: 'long' }),
          date: date
        };
      });
    }

    return selectedDates.map(date => ({
      id: date.toDateString(),
      name: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date
    }));
  };

  const days = getDaysFromSelectedDates();
  const isFullWeekView = selectedDates.length === 0;

  // Time slots for the timeline (24 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  // Generate unique ID
  const generateId = () => `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Save to localStorage
  React.useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  React.useEffect(() => {
    localStorage.setItem('dayTasks', JSON.stringify(dayTasks));
  }, [dayTasks]);

  const findTask = (id) => {
    const timelineTask = dailyTasks.find(task => task.id === id);
    if (timelineTask) return { task: timelineTask, container: 'timeline' };

    for (const dayId in dayTasks) {
      const task = dayTasks[dayId].find(task => task.id === id);
      if (task) return { task, container: `day-${dayId}` };
    }
    return null;
  };

  const handleDateSelect = (date) => {
    setSelectedDates(prev => {
      const dateString = date.toDateString();
      const exists = prev.some(d => d.toDateString() === dateString);
      
      if (exists) {
        // Remove date if already selected
        return prev.filter(d => d.toDateString() !== dateString);
      } else if (prev.length < 2) {
        // Add date if less than 2 selected
        return [...prev, date];
      } else {
        // Replace the oldest selected date
        return [prev[1], date];
      }
    });
    // Reset to first two dates when selecting new dates
    setCurrentDayIndex(0);
  };

  const moveTaskToMyTasks = (taskId, dayId) => {
    if (!dayId) return;

    // Find the task in the day tasks
    const taskToMove = dayTasks[dayId]?.find(task => task.id === taskId);
    if (!taskToMove) return;

    // Create a copy without the time property
    const { time, ...taskWithoutTime } = taskToMove;

    // Remove from day tasks
    setDayTasks(prev => ({
      ...prev,
      [dayId]: (prev[dayId] || []).filter(task => task.id !== taskId)
    }));

    // Add to My Tasks with a new ID
    setDailyTasks(prev => [...prev, { 
      ...taskWithoutTime, 
      id: generateId() 
    }]);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const taskInfo = findTask(active.id);
    if (taskInfo) {
      setActiveTask(taskInfo.task);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if dropping on a timeline slot (from My Tasks to Days OR from one Day to another Day)
    if (overId.startsWith('timeline-')) {
      const parts = overId.split('-');
      const targetDayId = parts[1];
      const timeSlot = parts.slice(2).join('-');
      
      const activeTaskInfo = findTask(activeId);
      if (!activeTaskInfo) return;

      // Update task date to match the target day
      const targetDate = new Date(targetDayId);
      const taskToMove = { 
        ...activeTaskInfo.task, 
        time: timeSlot,
        date: targetDate.toDateString()
      };

      // Remove from source
      if (activeTaskInfo.container === 'timeline') {
        // Moving from My Tasks to a Day
        setDailyTasks(items => items.filter(task => task.id !== activeId));
      } else if (activeTaskInfo.container.startsWith('day-')) {
        // Moving from one Day to another Day
        const sourceDayId = activeTaskInfo.container.replace('day-', '');
        setDayTasks(prev => ({
          ...prev,
          [sourceDayId]: (prev[sourceDayId] || []).filter(task => task.id !== activeId)
        }));
      }

      // Add to target day
      setDayTasks(prev => ({
        ...prev,
        [targetDayId]: [...(prev[targetDayId] || []), { ...taskToMove, id: generateId() }].sort((a, b) => 
          a.time.localeCompare(b.time)
        )
      }));
      return;
    }

    // Check if dropping back to My Tasks drop zone (from Days to My Tasks)
    if (overId === 'my-tasks-drop-zone') {
      const activeTaskInfo = findTask(activeId);
      if (!activeTaskInfo || !activeTaskInfo.container.startsWith('day-')) return;

      const sourceDayId = activeTaskInfo.container.replace('day-', '');
      const taskToMove = { ...activeTaskInfo.task };
      delete taskToMove.time;

      // Remove from source day
      setDayTasks(prev => ({
        ...prev,
        [sourceDayId]: (prev[sourceDayId] || []).filter(task => task.id !== activeId)
      }));
      
      // Add to My Tasks
      setDailyTasks(prev => [...prev, { ...taskToMove, id: generateId() }]);
      return;
    }

    // Handle reordering within My Tasks
    const activeTaskInfo = findTask(activeId);
    const overTaskInfo = findTask(overId);

    if (!activeTaskInfo || !overTaskInfo) return;

    const activeContainer = activeTaskInfo.container;
    const overContainer = overTaskInfo.container;

    if (activeContainer === 'timeline' && overContainer === 'timeline') {
      const oldIndex = dailyTasks.findIndex(task => task.id === activeId);
      const newIndex = dailyTasks.findIndex(task => task.id === overId);
      if (oldIndex !== newIndex) {
        setDailyTasks(items => arrayMove(items, oldIndex, newIndex));
      }
    }
    // Handle reordering within the same day
    else if (activeContainer.startsWith('day-') && overContainer.startsWith('day-') && 
             activeContainer === overContainer) {
      const dayId = activeContainer.replace('day-', '');
      const dayTaskList = dayTasks[dayId] || [];
      const oldIndex = dayTaskList.findIndex(task => task.id === activeId);
      const newIndex = dayTaskList.findIndex(task => task.id === overId);
      
      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        setDayTasks(prev => ({
          ...prev,
          [dayId]: arrayMove(dayTaskList, oldIndex, newIndex)
        }));
      }
    }
  };

  const createTask = (taskData, dayId = null) => {
    const newTask = {
      id: generateId(),
      content: taskData.content,
      duration: taskData.duration,
      priority: taskData.priority,
      description: taskData.description,
      date: taskData.date,
      completed: false,
      createdAt: new Date().toISOString()
    };

    if (dayId) {
      // For day tasks, we don't set a time until they're dragged to timeline
      setDayTasks(prev => ({
        ...prev,
        [dayId]: [...(prev[dayId] || []), newTask]
      }));
    } else {
      setDailyTasks(prev => [...prev, newTask]);
    }
    setShowTaskForm(false);
    setEditingDayId(null);
  };

  const updateTask = (taskData, dayId = null) => {
    const updatedTask = {
      ...editingTask,
      ...taskData
    };

    if (dayId) {
      setDayTasks(prev => ({
        ...prev,
        [dayId]: prev[dayId].map(task => 
          task.id === editingTask.id ? updatedTask : task
        )
      }));
    } else {
      setDailyTasks(prev => 
        prev.map(task => task.id === editingTask.id ? updatedTask : task)
      );
    }
    setEditingTask(null);
    setEditingDayId(null);
  };

  const deleteTask = (taskId, dayId = null) => {
    if (dayId) {
      setDayTasks(prev => ({
        ...prev,
        [dayId]: prev[dayId].filter(task => task.id !== taskId)
      }));
    } else {
      setDailyTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const toggleTaskCompletion = (taskId, dayId = null) => {
    if (dayId) {
      setDayTasks(prev => ({
        ...prev,
        [dayId]: prev[dayId].map(item => 
          item.id === taskId ? { ...item, completed: !item.completed } : item
        )
      }));
      setXp(userData.xp+10);
      saveUserData({ ...userData, xp: userData.xp + 10 });
    } else {
      setDailyTasks(prev => 
        prev.map(item => 
          item.id === taskId ? { ...item, completed: !item.completed } : item
        )
      );
      setXp(userData.xp+10);
      saveUserData({ ...userData, xp: userData.xp + 10 });
    }
  };

  const editTask = (task, dayId = null) => {
    setEditingTask(task);
    setEditingDayId(dayId);
  };

  const getCompletedCount = () => {
    const timelineCompleted = dailyTasks.filter(task => task.completed).length;
    const daysCompleted = Object.values(dayTasks).flat().filter(task => task.completed).length;
    return timelineCompleted + daysCompleted;
  };

  const getTotalTasks = () => {
    const timelineTotal = dailyTasks.length;
    const daysTotal = Object.values(dayTasks).flat().length;
    return timelineTotal + daysTotal;
  };

  const getAllAllocatedTasks = () => {
    const allocatedTasks = [];
    
    Object.entries(dayTasks).forEach(([dayId, tasks]) => {
      tasks.forEach(task => {
        allocatedTasks.push({
          ...task,
          dayId,
          dayDate: new Date(dayId)
        });
      });
    });
    
    // Sort by date and time
    return allocatedTasks.sort((a, b) => {
      const dateCompare = a.dayDate.getTime() - b.dayDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // If same date, sort by time
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });
  };

  const navigateToTaskDate = (task) => {
    const taskDate = new Date(task.dayId);
    
    // Add the date to selected dates if not already there
    setSelectedDates(prev => {
      const exists = prev.some(d => d.toDateString() === taskDate.toDateString());
      if (!exists) {
        if (prev.length < 2) {
          return [...prev, taskDate];
        } else {
          return [prev[1], taskDate];
        }
      }
      return prev;
    });
    
    // Close allocated tasks view
    setShowAllocatedTasks(false);
    
    // Reset day index to show the selected date
    setCurrentDayIndex(0);
  };

  const getAllTaskIds = () => {
    const timelineIds = dailyTasks.map(task => task.id);
    const dayIds = Object.values(dayTasks).flat().map(task => task.id);
    return [...timelineIds, ...dayIds];
  };

  const getTasksForTimeSlot = (dayId, time) => {
    return (dayTasks[dayId] || []).filter(task => task.time === time);
  };

  const nextDays = () => {
    if (isFullWeekView && currentDayIndex < days.length - 2) {
      setCurrentDayIndex(prev => prev + 2);
    }
  };

  const prevDays = () => {
    if (isFullWeekView && currentDayIndex > 0) {
      setCurrentDayIndex(prev => prev - 2);
    }
  };

  const visibleDays = isFullWeekView ? days.slice(currentDayIndex, currentDayIndex + 2) : days;

  const { setNodeRef: setMyTasksRef, isOver: isOverMyTasks } = useDroppable({
    id: 'my-tasks-drop-zone',
  });

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1600px',
    margin: '0 auto',
    minHeight: '100vh',
    background: '#f8fafc'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '0.5rem'
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '2rem',
    minHeight: '600px'
  };

  const myTasksStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 250px)',
    position: 'sticky',
    top: '20px'
  };

  const daysContainerStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
  };

  const statsStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem'
  };

  const addButtonStyle = {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    width: '100%',
    justifyContent: 'center'
  };

  const navButtonStyle = {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem'
  };

  const timelineStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  };

  const dayColumnStyle = {
    flex: 1,
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const dayHeaderStyle = {
    textAlign: 'center',
    padding: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  };

  const timelineContentStyle = {
    maxHeight: 'calc(100vh - 400px)',
    overflowY: 'auto'
  };

  const timeSlotStyle = {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0'
  };

  const timeColumnStyle = {
    width: '80px',
    padding: '0.75rem',
    background: '#f8fafc',
    borderRight: '1px solid #e2e8f0',
    fontWeight: '600',
    fontSize: '0.85rem',
    color: '#64748b',
    textAlign: 'center',
    flexShrink: 0
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Weekly Task Planner</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Select dates from calendar and drag tasks to schedule them
        </p>
      </div>

      {/* Calendar */}
      <Calendar 
        selectedDates={selectedDates} 
        onDateSelect={handleDateSelect}
        dayTasks={dayTasks}
      />

      {/* Stats */}
      <div style={statsStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#2d3748' }}>Weekly Progress</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              {getCompletedCount()} of {getTotalTasks()} tasks completed
              ({Math.round((getCompletedCount() / Math.max(getTotalTasks(), 1)) * 100)}%)
            </p>
            {selectedDates.length > 0 && (
              <p style={{ margin: '0.5rem 0 0 0', color: '#4f46e5', fontSize: '0.9rem' }}>
                📅 Viewing {selectedDates.length} selected date{selectedDates.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div style={{ 
            background: '#4f46e5', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            Level {userData?.level || 1}
          </div>
        </div>
        <div style={{ 
          height: '8px', 
          background: '#e2e8f0', 
          borderRadius: '4px', 
          marginTop: '1rem',
          overflow: 'hidden'
        }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
            width: `${(getCompletedCount() / Math.max(getTotalTasks(), 1)) * 100}%`,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={getAllTaskIds()} strategy={verticalListSortingStrategy}>
          <div style={layoutStyle}>
            {/* My Tasks Section */}
            <div style={myTasksStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#2d3748', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📋 My Tasks
                  <span style={{ 
                    background: '#4f46e5', 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                  }}>
                    {dailyTasks.length}
                  </span>
                </h3>
                <button
                  onClick={() => setShowAllocatedTasks(true)}
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="View all allocated tasks"
                >
                  📅 Allocated ({getAllAllocatedTasks().length})
                </button>
              </div>
              
              <button
                onClick={() => setShowTaskForm(true)}
                style={{
                  ...addButtonStyle,
                  marginBottom: '1rem'
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Task
              </button>

              <div ref={setMyTasksRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <MyTasksDropZone isOver={isOverMyTasks} />
                
                <div style={{ flex: 1, overflowY: 'auto', marginTop: '0.5rem' }}>
                  {dailyTasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      onToggle={toggleTaskCompletion}
                      onEdit={editTask}
                      onDelete={deleteTask}
                    />
                  ))}
                  {dailyTasks.length === 0 && (
                    <div style={{ 
                      textAlign: 'center', 
                      color: '#9ca3af', 
                      padding: '2rem 1rem',
                      border: '2px dashed #e2e8f0',
                      borderRadius: '8px',
                      background: '#fafafa'
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>No tasks yet</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>Create tasks or drag them back here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Days Timeline Section */}
            <div style={daysContainerStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                {isFullWeekView && (
                  <button
                    onClick={prevDays}
                    disabled={currentDayIndex === 0}
                    style={{
                      ...navButtonStyle,
                      opacity: currentDayIndex === 0 ? 0.5 : 1,
                      cursor: currentDayIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Previous
                  </button>
                )}
                
                <h3 style={{ color: '#2d3748', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FontAwesomeIcon icon={faCalendarDay} />
                  {visibleDays.map((d, index) => (
                    <span key={d.id}>
                      {d.name} ({d.date.toLocaleDateString()})
                      {index < visibleDays.length - 1 && ' & '}
                    </span>
                  ))}
                </h3>
                
                {isFullWeekView && (
                  <button
                    onClick={nextDays}
                    disabled={currentDayIndex >= days.length - 2}
                    style={{
                      ...navButtonStyle,
                      opacity: currentDayIndex >= days.length - 2 ? 0.5 : 1,
                      cursor: currentDayIndex >= days.length - 2 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                )}
              </div>

              <div style={timelineStyle}>
                {visibleDays.map(day => (
                  <div key={day.id} style={dayColumnStyle}>
                    <div style={dayHeaderStyle}>
                      {day.name}
                      <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
                        {day.date.toLocaleDateString()} • {(dayTasks[day.id] || []).length} tasks
                      </div>
                    </div>
                    
                    <div style={timelineContentStyle}>
                      {timeSlots.map(time => {
                        const tasksAtTime = getTasksForTimeSlot(day.id, time);
                        return (
                          <div key={time} style={timeSlotStyle}>
                            <div style={timeColumnStyle}>
                              {time}
                            </div>
                            <div style={{ flex: 1, padding: '0.5rem' }}>
                              <TimelineSlot
                                dayId={day.id}
                                time={time}
                                tasks={tasksAtTime}
                                onToggle={toggleTaskCompletion}
                                onEdit={editTask}
                                onDelete={deleteTask}
                                onMoveToTasks={moveTaskToMyTasks}
                                dayDate={day.date}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? <Task task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Allocated Tasks Modal!! */}
      {showAllocatedTasks && (
        <AllocatedTasksList
          tasks={getAllAllocatedTasks()}
          onNavigateToTask={navigateToTaskDate}
          onClose={() => setShowAllocatedTasks(false)}
        />
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm || !!editingTask}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
          setEditingDayId(null);
        }}
        onSave={editingTask ? updateTask : createTask}
        task={editingTask}
        dayId={editingDayId}
      />
    </div>
  );
};

export default RearrangePage;