import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
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
  faEdit
} from '@fortawesome/free-solid-svg-icons';

// Sortable Task Component
const SortableTask = ({ task, onToggle, onEdit, onDelete, dayId = null }) => {
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

  const taskItemStyle = {
    padding: '0.75rem',
    margin: '0.5rem 0',
    background: isDragging ? '#f0f9ff' : 'white',
    border: `2px solid ${isDragging ? '#4f46e5' : '#e2e8f0'}`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: 'all 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
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
      <div {...attributes} {...listeners}>
        <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{task.content}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
          <span>⏰ {task.time}</span>
          {task.duration && <span>⏳ {task.duration}</span>}
          {task.priority && <span>🎯 {task.priority}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task, dayId);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '0.8rem'
          }}
          title="Edit task"
        >
          <FontAwesomeIcon icon={faEdit} />
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
            fontSize: '0.8rem'
          }}
          title="Delete task"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id, dayId);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: task.completed ? '#10b981' : '#9ca3af'
          }}
          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          <FontAwesomeIcon icon={task.completed ? faCheckCircle : faCircle} />
        </button>
      </div>
    </div>
  );
};

// Task component for DragOverlay
const Task = ({ task }) => {
  const taskItemStyle = {
    padding: '0.75rem',
    margin: '0.5rem 0',
    background: '#f0f9ff',
    border: '2px solid #4f46e5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'grabbing',
    transform: 'rotate(5deg)',
  };

  return (
    <div style={taskItemStyle}>
      <div>
        <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{task.content}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>⏰ {task.time}</div>
      </div>
      <button
        style={{
          background: 'none',
          border: 'none',
          color: task.completed ? '#10b981' : '#9ca3af'
        }}
      >
        <FontAwesomeIcon icon={task.completed ? faCheckCircle : faCircle} />
      </button>
    </div>
  );
};

// Task Form Component
const TaskForm = ({ isOpen, onClose, onSave, task = null, dayId = null }) => {
  const [formData, setFormData] = useState({
    content: task?.content || '',
    time: task?.time || '09:00',
    duration: task?.duration || '30m',
    priority: task?.priority || 'Medium',
    description: task?.description || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.content.trim()) {
      onSave(formData, dayId);
      setFormData({
        content: '',
        time: '09:00',
        duration: '30m',
        priority: 'Medium',
        description: ''
      });
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
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
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
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </div>
            
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
          </div>

          <div style={{ marginBottom: '1rem' }}>
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
                borderRadius: '8px'
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
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
                border: '2px solid #e5e7eb',
                background: 'white',
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

const RearrangePage = ({ userData, tasks, onTaskUpdate }) => {
  const [dailyTasks, setDailyTasks] = useState(() => {
    const saved = localStorage.getItem('dailyTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [days] = useState([
    { id: 'monday', name: 'Monday' },
    { id: 'tuesday', name: 'Tuesday' },
    { id: 'wednesday', name: 'Wednesday' },
    { id: 'thursday', name: 'Thursday' },
    { id: 'friday', name: 'Friday' },
    { id: 'saturday', name: 'Saturday' },
    { id: 'sunday', name: 'Sunday' }
  ]);

  const [dayTasks, setDayTasks] = useState(() => {
    const saved = localStorage.getItem('dayTasks');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTask, setActiveTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingDayId, setEditingDayId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

    const activeTaskInfo = findTask(activeId);
    const overTaskInfo = findTask(overId);

    if (!activeTaskInfo || !overTaskInfo) return;

    const activeContainer = activeTaskInfo.container;
    const overContainer = overTaskInfo.container;

    // Moving within timeline
    if (activeContainer === 'timeline' && overContainer === 'timeline') {
      const oldIndex = dailyTasks.findIndex(task => task.id === activeId);
      const newIndex = dailyTasks.findIndex(task => task.id === overId);
      if (oldIndex !== newIndex) {
        setDailyTasks(items => arrayMove(items, oldIndex, newIndex));
      }
    }
    // Moving from timeline to day
    else if (activeContainer === 'timeline' && overContainer.startsWith('day-')) {
      const dayId = overContainer.replace('day-', '');
      const taskToMove = activeTaskInfo.task;

      setDailyTasks(items => items.filter(task => task.id !== activeId));
      setDayTasks(prev => {
        const dayItems = prev[dayId] || [];
        const overIndex = dayItems.findIndex(task => task.id === overId);
        const newItems = [...dayItems];
        newItems.splice(overIndex >= 0 ? overIndex : dayItems.length, 0, {
          ...taskToMove,
          id: generateId()
        });
        return { ...prev, [dayId]: newItems };
      });
    }
    // Moving within same day
    else if (activeContainer.startsWith('day-') && overContainer === activeContainer) {
      const dayId = activeContainer.replace('day-', '');
      const dayItems = dayTasks[dayId] || [];
      const oldIndex = dayItems.findIndex(task => task.id === activeId);
      const newIndex = dayItems.findIndex(task => task.id === overId);
      if (oldIndex !== newIndex) {
        setDayTasks(prev => ({
          ...prev,
          [dayId]: arrayMove(dayItems, oldIndex, newIndex)
        }));
      }
    }
    // Moving between different days
    else if (activeContainer.startsWith('day-') && overContainer.startsWith('day-')) {
      const sourceDayId = activeContainer.replace('day-', '');
      const destDayId = overContainer.replace('day-', '');
      const taskToMove = activeTaskInfo.task;

      setDayTasks(prev => {
        const sourceItems = prev[sourceDayId] || [];
        const destItems = prev[destDayId] || [];
        const overIndex = destItems.findIndex(task => task.id === overId);

        const newDestItems = [...destItems];
        newDestItems.splice(overIndex >= 0 ? overIndex : destItems.length, 0, {
          ...taskToMove,
          id: generateId()
        });

        return {
          ...prev,
          [sourceDayId]: sourceItems.filter(task => task.id !== activeId),
          [destDayId]: newDestItems
        };
      });
    }
  };

  const createTask = (taskData, dayId = null) => {
    const newTask = {
      id: generateId(),
      content: taskData.content,
      time: taskData.time,
      duration: taskData.duration,
      priority: taskData.priority,
      description: taskData.description,
      completed: false,
      createdAt: new Date().toISOString()
    };

    if (dayId) {
      setDayTasks(prev => ({
        ...prev,
        [dayId]: [...(prev[dayId] || []), newTask]
      }));
    } else {
      setDailyTasks(prev => [...prev, newTask]);
    }
    setShowTaskForm(false);
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
    } else {
      setDailyTasks(prev => 
        prev.map(item => 
          item.id === taskId ? { ...item, completed: !item.completed } : item
        )
      );
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

  const getAllTaskIds = () => {
    const timelineIds = dailyTasks.map(task => task.id);
    const dayIds = Object.values(dayTasks).flat().map(task => task.id);
    return [...timelineIds, ...dayIds];
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh'
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
    gridTemplateColumns: '350px 1fr',
    gap: '2rem',
    minHeight: '600px'
  };

  const timelineStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column'
  };

  const daysGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    alignContent: 'start'
  };

  const dayColumnStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '500px'
  };

  const dayHeaderStyle = {
    textAlign: 'center',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontWeight: 'bold',
    fontSize: '1.1rem'
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
    margin: '1rem 0',
    fontSize: '0.9rem'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Weekly Task Planner</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Drag and drop tasks between days. Create, edit, and organize your weekly schedule!
        </p>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#2d3748' }}>Weekly Progress</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              {getCompletedCount()} of {getTotalTasks()} tasks completed
              ({Math.round((getCompletedCount() / Math.max(getTotalTasks(), 1)) * 100)}%)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowTaskForm(true)}
              style={addButtonStyle}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add New Task
            </button>
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
            {/* Timeline Section */}
            <div style={timelineStyle}>
              <h3 style={{ marginBottom: '1rem', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📅 My Tasks
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
                onClick={() => setShowTaskForm(true)}
                style={{
                  ...addButtonStyle,
                  margin: '0 0 1rem 0',
                  justifyContent: 'center'
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add to My Tasks
              </button>

              <div style={{ flex: 1, minHeight: '200px' }}>
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
                    padding: '3rem 2rem',
                    border: '2px dashed #e2e8f0',
                    borderRadius: '8px',
                    background: '#fafafa'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>No tasks yet</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Create a task or drag tasks here from other days</p>
                  </div>
                )}
              </div>
            </div>

            {/* Days Grid */}
            <div style={daysGridStyle}>
              {days.map(day => (
                <div key={day.id} style={dayColumnStyle}>
                  <div style={dayHeaderStyle}>
                    {day.name}
                    <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
                      {(dayTasks[day.id] || []).length} tasks
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setEditingDayId(day.id);
                      setShowTaskForm(true);
                    }}
                    style={{
                      ...addButtonStyle,
                      margin: '0 0 1rem 0',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      fontSize: '0.8rem',
                      padding: '0.5rem 1rem',
                      justifyContent: 'center'
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add to {day.name}
                  </button>

                  <div style={{ flex: 1, minHeight: '300px' }}>
                    {(dayTasks[day.id] || []).map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onToggle={toggleTaskCompletion}
                        onEdit={editTask}
                        onDelete={deleteTask}
                        dayId={day.id}
                      />
                    ))}
                    {(dayTasks[day.id] || []).length === 0 && (
                      <div style={{ 
                        textAlign: 'center', 
                        color: '#9ca3af', 
                        padding: '2rem 1rem',
                        border: '2px dashed #e2e8f0',
                        borderRadius: '8px',
                        background: '#fafafa',
                        fontSize: '0.9rem'
                      }}>
                        Drag tasks here or click "Add to {day.name}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? <Task task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

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