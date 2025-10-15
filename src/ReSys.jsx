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
import { faGripVertical, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';

// Sortable Task Component
const SortableTask = ({ task, onToggle, isTimeline = false, dayId = null }) => {
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
      {...attributes}
      {...listeners}
    >
      <div>
        <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500' }}>{task.content}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{task.time}</div>
      </div>
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
      >
        <FontAwesomeIcon icon={task.completed ? faCheckCircle : faCircle} />
      </button>
    </div>
  );
};

// Task component for DragOverlay (non-sortable version)
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
  };

  const completedTaskStyle = {
    opacity: 0.7,
    textDecoration: 'line-through',
    background: '#f0f9ff'
  };

  return (
    <div style={{ ...taskItemStyle, ...(task.completed && completedTaskStyle) }}>
      <div>
        <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500' }}>{task.content}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{task.time}</div>
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

const RearrangePage = ({ userData, tasks, onTaskUpdate }) => {
  const [dailyTasks, setDailyTasks] = useState(() => {
    const saved = localStorage.getItem('dailyTasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', content: 'Morning routine', completed: false, time: '08:00' },
      { id: '2', content: 'Work on project', completed: false, time: '10:00' },
      { id: '3', content: 'Lunch break', completed: false, time: '12:00' },
      { id: '4', content: 'Exercise', completed: false, time: '18:00' },
      { id: '5', content: 'Evening planning', completed: false, time: '20:00' }
    ];
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
  const [activeContainer, setActiveContainer] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto'
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
    gridTemplateColumns: '300px 1fr',
    gap: '2rem',
    height: 'calc(100vh - 200px)'
  };

  const timelineStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    overflowY: 'auto'
  };

  const daysGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    overflowY: 'auto'
  };

  const dayColumnStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    minHeight: '400px'
  };

  const dayHeaderStyle = {
    textAlign: 'center',
    padding: '0.5rem',
    background: '#4f46e5',
    color: 'white',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontWeight: 'bold'
  };

  const statsStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    marginBottom: '1rem'
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  // Save to localStorage whenever tasks change
  React.useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  React.useEffect(() => {
    localStorage.setItem('dayTasks', JSON.stringify(dayTasks));
  }, [dayTasks]);

  const findTask = (id) => {
    // Check timeline tasks
    const timelineTask = dailyTasks.find(task => task.id === id);
    if (timelineTask) return { task: timelineTask, container: 'timeline' };

    // Check day tasks
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
      setActiveContainer(taskInfo.container);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    setActiveTask(null);
    setActiveContainer(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the containers
    const activeTaskInfo = findTask(activeId);
    const overTaskInfo = findTask(overId);

    if (!activeTaskInfo || !overTaskInfo) return;

    const activeContainer = activeTaskInfo.container;
    const overContainer = overTaskInfo.container;

    // Moving within the same container (timeline)
    if (activeContainer === 'timeline' && overContainer === 'timeline') {
      const oldIndex = dailyTasks.findIndex(task => task.id === activeId);
      const newIndex = dailyTasks.findIndex(task => task.id === overId);

      if (oldIndex !== newIndex) {
        setDailyTasks(items => arrayMove(items, oldIndex, newIndex));
      }
    }
    // Moving from timeline to a day
    else if (activeContainer === 'timeline' && overContainer.startsWith('day-')) {
      const dayId = overContainer.replace('day-', '');
      const taskToMove = activeTaskInfo.task;

      // Remove from timeline
      setDailyTasks(items => items.filter(task => task.id !== activeId));
      
      // Add to day
      setDayTasks(prev => {
        const dayItems = prev[dayId] || [];
        const newTask = { ...taskToMove, id: `${activeId}-${Date.now()}`, completed: false };
        
        // Find position to insert
        const overIndex = dayItems.findIndex(task => task.id === overId);
        const newItems = [...dayItems];
        newItems.splice(overIndex, 0, newTask);

        return { ...prev, [dayId]: newItems };
      });
    }
    // Moving within the same day
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
    else if (activeContainer.startsWith('day-') && overContainer.startsWith('day-') && activeContainer !== overContainer) {
      const sourceDayId = activeContainer.replace('day-', '');
      const destDayId = overContainer.replace('day-', '');
      const taskToMove = activeTaskInfo.task;

      // Remove from source day
      setDayTasks(prev => {
        const sourceItems = prev[sourceDayId] || [];
        const updatedSource = sourceItems.filter(task => task.id !== activeId);
        
        // Add to destination day
        const destItems = prev[destDayId] || [];
        const overIndex = destItems.findIndex(task => task.id === overId);
        const newDestItems = [...destItems];
        newDestItems.splice(overIndex, 0, { ...taskToMove, id: `${activeId}-${Date.now()}` });

        return {
          ...prev,
          [sourceDayId]: updatedSource,
          [destDayId]: newDestItems
        };
      });
    }
  };

  const toggleTaskCompletion = (taskId, dayId = null) => {
    if (dayId) {
      // Toggle completion for day task
      setDayTasks(prev => {
        const dayItems = prev[dayId] || [];
        const updatedItems = dayItems.map(item => 
          item.id === taskId ? { ...item, completed: !item.completed } : item
        );
        
        const task = dayItems.find(item => item.id === taskId);
        if (task && !task.completed) {
          console.log('Task completed! Would award XP here');
        }

        return { ...prev, [dayId]: updatedItems };
      });
    } else {
      // Toggle completion for timeline task
      setDailyTasks(prev => 
        prev.map(item => 
          item.id === taskId ? { ...item, completed: !item.completed } : item
        )
      );
    }
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

  // Get all task IDs for SortableContext
  const getAllTaskIds = () => {
    const timelineIds = dailyTasks.map(task => task.id);
    const dayIds = Object.values(dayTasks).flat().map(task => task.id);
    return [...timelineIds, ...dayIds];
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Daily Planner</h1>
        <p style={{ color: '#64748b' }}>
          Drag and drop tasks to plan your week. Complete tasks to earn XP!
        </p>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#2d3748' }}>Weekly Progress</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              {getCompletedCount()} of {getTotalTasks()} tasks completed
            </p>
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
            background: '#4f46e5', 
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
              <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Daily Timeline</h3>
              <div style={{ minHeight: '200px' }}>
                {dailyTasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompletion}
                    isTimeline={true}
                  />
                ))}
                {dailyTasks.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#9ca3af', 
                    padding: '2rem',
                    border: '2px dashed #e2e8f0',
                    borderRadius: '8px'
                  }}>
                    No tasks in timeline
                  </div>
                )}
              </div>
            </div>

            {/* Days Grid */}
            <div style={daysGridStyle}>
              {days.map(day => (
                <div key={day.id} style={dayColumnStyle}>
                  <div style={dayHeaderStyle}>{day.name}</div>
                  <div style={{ minHeight: '300px' }}>
                    {(dayTasks[day.id] || []).map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onToggle={toggleTaskCompletion}
                        dayId={day.id}
                      />
                    ))}
                    {(dayTasks[day.id] || []).length === 0 && (
                      <div style={{ 
                        textAlign: 'center', 
                        color: '#9ca3af', 
                        padding: '2rem',
                        border: '2px dashed #e2e8f0',
                        borderRadius: '8px'
                      }}>
                        Drop tasks here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <Task task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default RearrangePage;