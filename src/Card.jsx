import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowUp, faArrowDown, faEdit, faEye, faCheckCircle, faWarning, faClock, faExclamationTriangle, faListCheck } from "@fortawesome/free-solid-svg-icons";
import Button from './Button/button';

function Card(ip) {
  const currentDate = new Date();
  const ipDate = ip.ded ? new Date(ip.ded) : null;
  const isOverdue = ipDate && currentDate > ipDate && !ip.status;
  const isDueSoon = ipDate && !ip.status && (ipDate - currentDate) < (24 * 60 * 60 * 1000);
  const [profileImg, setProfileImg] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const profileImages = [
    'https://www.zoologiste.com/images/main/lion.jpg',
    'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?cs=srgb&dl=animal-close-up-little-1661179.jpg&fm=jpg',
    'https://th.bing.com/th/id/OIP.fPKaGCVJYDhdLlhcczZongHaE8?rs=1&pid=ImgDetMain',
    'https://th.bing.com/th/id/R.cf87e97d9ccbf04e804a806f3c1cb70b?rik=pU4q47rzTixncA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-mv4naWQw3NA%2fT-IIUEYnEvI%2fAAAAAAAAA5c%2f2GtpbqI6bf4%2fs1600%2fCougar%2bCute%2bDesktop%2bAnimal%2bPictures.jpg&ehk=9i46tFYhFXMu2uUYTkFLis0VnDFT8BxYECwmgPocSD4%3d&risl=&pid=ImgRaw&r=0',
    'https://th.bing.com/th/id/OIP.2KDrlQ3f5OSl13qi2Z3kgQHaEo?rs=1&pid=ImgDetMain'
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * profileImages.length);
    setProfileImg(profileImages[randomIndex]);
  }, []);

  // Calculate subtask progress
const calculateSubtaskProgress = () => {
  const task = ip.tasks[ip.index];
  if (!task || !task.subtasks || task.subtasks.length === 0) return 0;
  
  const completed = task.subtasks.filter(st => st && st.completed).length;
  return Math.round((completed / task.subtasks.length) * 100);
};

  const progress = calculateSubtaskProgress();
  const hasSubtasks = ip.tasks[ip.index]?.subtasks && (ip.tasks[ip.index].subtasks || []).length > 0;

  function deletetask() {
    const updatetask = ip.tasks.filter((_, i) => i != ip.index);   
    ip.settask(updatetask);
    localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
  }
  
  function moveup() {
    if (ip.index > 0) {
      const updatetask = [...ip.tasks];
      [updatetask[ip.index], updatetask[ip.index-1]] = [updatetask[ip.index-1], updatetask[ip.index]];
      ip.settask(updatetask);
      localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
    }
  }  

  function movedown() {
    if (ip.index < ip.tasks.length-1) {
      const updatetask = [...ip.tasks];
      [updatetask[ip.index], updatetask[ip.index+1]] = [updatetask[ip.index+1], updatetask[ip.index]];
      ip.settask(updatetask);
      localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
    }
  }

  function displayinfo() {
    ip.setInd(ip.index);
    ip.setShow(1);
  }

  function displaychange() {
    ip.setInd(ip.index);
    ip.setShow(0);
  }

  function displaySubtasks() {
    ip.setInd(ip.index);
    ip.setShow(2); // 2 for subtask management
  }

  const handleChecked = () => {
    const newStatus = !ip.status;
    ip.onCheck(ip.index, newStatus);
    
    if (newStatus && ip.streak > 0) {
      const potentialBonus = Math.floor(50 * (1 + ip.streak * 0.1));
      setShowTooltip(`Complete for +${potentialBonus} XP!`);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const toggleSubtask = (subIndex) => {
    const updatedTasks = [...ip.tasks];
    if (!updatedTasks[ip.index].subtasks) {
      updatedTasks[ip.index].subtasks = [];
    }
    
    if (updatedTasks[ip.index].subtasks[subIndex]) {
      updatedTasks[ip.index].subtasks[subIndex].completed = 
        !updatedTasks[ip.index].subtasks[subIndex].completed;
      
      ip.settask(updatedTasks);
      localStorage.setItem(ip.fetcho, JSON.stringify(updatedTasks));
    }
  };

  const streakEffect = ip.streak > 0 ? {
    boxShadow: `0 0 10px ${ip.streak > 3 ? '#f59e0b' : '#a5b4fc'}`,
    borderTop: `2px solid ${ip.streak > 3 ? '#f59e0b' : '#a5b4fc'}`,
    borderRight: `2px solid ${ip.streak > 3 ? '#f59e0b' : '#a5b4fc'}`,
    borderBottom: `2px solid ${ip.streak > 3 ? '#f59e0b' : '#a5b4fc'}`,
  } : {};

  const getStatusIcon = () => {
    if (ip.status) return faCheckCircle;
    if (isOverdue) return faExclamationTriangle;
    if (isDueSoon) return faWarning;
    if (ip.tasks[ip.index].isDaily) return faCheckCircle;
    return faClock;
  };

  const getStatusColor = () => {
    if (ip.status) return '#10b981';
    if (isOverdue) return '#ef4444';
    if (isDueSoon) return '#f59e0b';
    if (ip.tasks[ip.index].isDaily) return '#3b82f6';
    return '#3b82f6';
  };

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    borderLeft: `4px solid ${getStatusColor()}`,
    opacity: ip.status ? 0.8 : 1,
    marginBottom: '12px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  };

  const enhancedCardStyle = {
    ...cardStyle,
    ...streakEffect,
    position: 'relative'
  };

  const profileImageStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '16px',
    border: `2px solid ${getStatusColor()}`
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
    marginTop: ip.isMobileView ? '10px' : '0px',
    marginBottom: ip.isMobileView ? '-10px' : '0px'
  };

  const iconStyle = {
    color: getStatusColor(),
    marginRight: '16px',
    fontSize: '20px',
    flexShrink: 0,
    cursor: 'pointer'
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0
  };

  const titleStyle = {
    margin: '0 0 4px 0',
    color: ip.status ? '#6b7280' : '#1f2937',
    fontSize: '1rem',
    fontWeight: ip.status ? '400' : '500',
    textDecoration: ip.status ? 'line-through' : 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: ip.isMobileView ? '-27px' : '0px',
    marginLeft: ip.isMobileView ? '-35px' : '0px',
    width: ip.isMobileView ? '85px' : 'auto'
  };

  const timeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6b7280',
    fontSize: '0.875rem'
  };

  const deadlineStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: isOverdue ? '#ef4444' : isDueSoon ? '#f59e0b' : '#6b7280',
    fontSize: ip.isMobileView ? '0.875rem' : '0.75rem',
    marginTop: ip.isMobileView ? '-30px' : '4px',
    marginLeft: ip.isMobileView ? '15px' : '0px',
    fontWeight: isOverdue || isDueSoon ? '600' : '400'
  };

  const subtaskButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: hasSubtasks ? (progress === 100 ? '#10b98120' : '#4f46e520') : '#f8fafc',
    border: `2px solid ${hasSubtasks ? (progress === 100 ? '#10b981' : '#4f46e5') : '#e5e7eb'}`,
    borderRadius: '20px',
    color: hasSubtasks ? (progress === 100 ? '#10b981' : '#4f46e5') : '#64748b',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginRight: '8px'
  };

  const progressBarStyle = {
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    marginTop: '8px',
    overflow: 'hidden'
  };

  const progressFillStyle = {
    height: '100%',
    backgroundColor: progress === 100 ? '#10b981' : '#4f46e5',
    width: `${progress}%`,
    transition: 'width 0.3s ease'
  };

  const streakIndicator = ip.streak > 0 ? (
    <div style={{
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: ip.streak > 3 ? '#f59e0b' : '#a5b4fc',
      color: 'white',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}>
      {ip.streak}
    </div>
  ) : null;

  const xpTooltip = showTooltip && typeof showTooltip === 'string' ? (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '6px',
      fontSize: '0.8rem',
      whiteSpace: 'nowrap',
      zIndex: 10,
      marginBottom: '5px'
    }}>
      {showTooltip}
      <div style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '5px solid #4f46e5'
      }}></div>
    </div>
  ) : null;

  return (
    <div style={enhancedCardStyle}>
      {streakIndicator}
      {xpTooltip}
      <FontAwesomeIcon 
        icon={getStatusIcon()} 
        style={iconStyle}
        onClick={handleChecked}
      />
      
      {!ip.isMobileView && (
        <img style={profileImageStyle} src={profileImg} alt="profile" />
      )}
      
      <div style={contentStyle}>
        {!ip.isMobileView ? (
          <>
            <div style={{ position: 'relative', width: '100%' }}>
              <h3
                style={titleStyle}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                {ip.name}
              </h3>

              {showTooltip && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '0',
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  fontSize: '0.7rem',
                  zIndex: 10,
                  transform: 'translateY(-4px)',
                  marginLeft: '-3px',
                }}>
                  {ip.name}
                </div>
              )}
            </div>
            <div style={timeStyle}>
              <span>{ip.time}</span>
              <span>•</span>
              <span>{ip.para}</span>
            </div>
            <div style={deadlineStyle}>
              {ip.ded ? (
                <>
                  <FontAwesomeIcon icon={faClock} style={{ fontSize: '12px' }} />
                  <span>
                    {isOverdue ? 'Overdue! ' : isDueSoon ? 'Due soon! ' : 'Due: '} 
                    {new Date(ip.ded).toLocaleString()}
                  </span>
                </>
              ) : (
                <span>Daily Task</span>
              )}
            </div>

            {/* Subtasks Progress Bar */}
            {hasSubtasks && (
              <div style={progressBarStyle}>
                <div style={progressFillStyle}></div>
              </div>
            )}

            {/* Subtasks Panel */}
            {showSubtasks && (
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#4f46e5' }}>
                    Subtasks ({progress}% completed)
                  </h4>
                </div>
                
                {(ip.tasks[ip.index].subtasks || []).slice(0, 3).map((subtask, subIndex) => (
                  <div key={subIndex} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 0',
                    fontSize: '0.8rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={(e) => toggleSubtask(subIndex)}
                      style={{ width: '14px', height: '14px' }}
                    />
                    <span style={{
                      textDecoration: subtask.completed ? 'line-through' : 'none',
                      color: subtask.completed ? '#6b7280' : '#374151'
                    }}>
                      {subtask.name}
                    </span>
                  </div>
                ))}
                
                {(ip.tasks[ip.index].subtasks || []).length > 3 && (
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '4px' }}>
                    +{(ip.tasks[ip.index].subtasks || []).length - 3} more subtasks
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div style={{display: "flex", flexDirection: 'row', width: '500px', marginTop: '-8px'}}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <h3 style={titleStyle} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
                {ip.name}
              </h3>
              {showTooltip && (
                <div style={{
                  position: 'absolute',
                  marginTop: '-60px',
                  left: '-80%',
                  backgroundColor: '#333',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  fontSize: '0.8rem',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}>
                  {ip.name}
                </div>
              )}
            </div>
            <div style={deadlineStyle}>
              {ip.ded ? (
                <>
                  <FontAwesomeIcon icon={faClock} style={{ fontSize: '12px' }} />
                  <span>
                    {isOverdue ? 'Overdue! ' : isDueSoon ? 'Due soon! ' : 'Due: '} 
                    {new Date(ip.ded).toLocaleString()}
                  </span>
                </>
              ) : (
                <span>Daily Task</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div style={buttonGroupStyle}>
        {/* Subtask Button */}
        <button 
          style={subtaskButtonStyle}
          onClick={() => setShowSubtasks(!showSubtasks)}
          title="Toggle Subtasks"
        >
          <FontAwesomeIcon icon={faListCheck} />
          {hasSubtasks && (
            <span>{progress}%</span>
          )}
        </button>

        <Button 
          icon={faEye} 
          onClick={displayinfo} 
          color="#3b82f6" 
          width="36px"
          tooltip="View details"
        />
        <Button 
          icon={faEdit} 
          onClick={displaychange} 
          color="#f59e0b" 
          width="36px"
          tooltip="Edit task"
        />
        <Button 
          icon={faArrowUp} 
          onClick={moveup} 
          color="#10b981" 
          width="36px"
          tooltip="Move up"
        />
        <Button 
          icon={faArrowDown} 
          onClick={movedown} 
          color="#10b981" 
          width="36px"
          tooltip="Move down"
        />
        <Button 
          icon={faTrash} 
          onClick={deletetask} 
          color="#ef4444" 
          width="36px"
          tooltip="Delete task"
        />
      </div>
    </div>
  );
}

export default Card;