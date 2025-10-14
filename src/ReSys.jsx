import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';

const RearrangePage = ({ userData, tasks, onTaskUpdate }) => {
  const [dailyTasks, setDailyTasks] = useState(() => {
    // Initialize with some sample daily tasks or use existing tasks
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

  const taskItemStyle = (isDragging) => ({
    padding: '0.75rem',
    margin: '0.5rem 0',
    background: isDragging ? '#f0f9ff' : 'white',
    border: `2px solid ${isDragging ? '#4f46e5' : '#e2e8f0'}`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'grab',
    transition: 'all 0.2s ease'
  });

  const completedTaskStyle = {
    opacity: 0.7,
    textDecoration: 'line-through',
    background: '#f0f9ff'
  };

  const timeSlotStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    margin: '0.5rem 0',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white'
  };

  const timeLabelStyle = {
    fontWeight: 'bold',
    color: '#4f46e5',
    minWidth: '60px'
  };

  const statsStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    marginBottom: '1rem'
  };

  // Save to localStorage whenever tasks change
  React.useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  React.useEffect(() => {
    localStorage.setItem('dayTasks', JSON.stringify(dayTasks));
  }, [dayTasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Moving within the same list (timeline)
    if (source.droppableId === 'timeline' && destination.droppableId === 'timeline') {
      const items = Array.from(dailyTasks);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setDailyTasks(items);
    }
    // Moving from timeline to a day
    else if (source.droppableId === 'timeline' && destination.droppableId.startsWith('day-')) {
      const dayId = destination.droppableId.replace('day-', '');
      const timelineItems = Array.from(dailyTasks);
      const [movedItem] = timelineItems.splice(source.index, 1);
      
      const dayItems = Array.from(dayTasks[dayId] || []);
      dayItems.splice(destination.index, 0, {
        ...movedItem,
        completed: false
      });

      setDailyTasks(timelineItems);
      setDayTasks(prev => ({
        ...prev,
        [dayId]: dayItems
      }));
    }
    // Moving between days
    else if (source.droppableId.startsWith('day-') && destination.droppableId.startsWith('day-')) {
      const sourceDayId = source.droppableId.replace('day-', '');
      const destDayId = destination.droppableId.replace('day-', '');

      const sourceItems = Array.from(dayTasks[sourceDayId] || []);
      const [movedItem] = sourceItems.splice(source.index, 1);

      const destItems = Array.from(dayTasks[destDayId] || []);
      destItems.splice(destination.index, 0, movedItem);

      setDayTasks(prev => ({
        ...prev,
        [sourceDayId]: sourceItems,
        [destDayId]: destItems
      }));
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
        
        // Award XP for completion
        const task = dayItems.find(item => item.id === taskId);
        if (task && !task.completed) {
          // This would integrate with your XP system
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
            Level {userData.level}
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={layoutStyle}>
          {/* Timeline Section */}
          <div style={timelineStyle}>
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Daily Timeline</h3>
            <Droppable droppableId="timeline">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {dailyTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...taskItemStyle(snapshot.isDragging),
                            ...(task.completed && completedTaskStyle),
                            ...provided.draggableProps.style
                          }}
                        >
                          <div {...provided.dragHandleProps}>
                            <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500' }}>{task.content}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{task.time}</div>
                          </div>
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Days Grid */}
          <div style={daysGridStyle}>
            {days.map(day => (
              <div key={day.id} style={dayColumnStyle}>
                <div style={dayHeaderStyle}>{day.name}</div>
                <Droppable droppableId={`day-${day.id}`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ minHeight: '300px' }}
                    >
                      {(dayTasks[day.id] || []).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...taskItemStyle(snapshot.isDragging),
                                ...(task.completed && completedTaskStyle),
                                ...provided.draggableProps.style
                              }}
                            >
                              <div {...provided.dragHandleProps}>
                                <FontAwesomeIcon icon={faGripVertical} style={{ color: '#9ca3af' }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500' }}>{task.content}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{task.time}</div>
                              </div>
                              <button
                                onClick={() => toggleTaskCompletion(task.id, day.id)}
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
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
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
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default RearrangePage;