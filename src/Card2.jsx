import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faCheckCircle, faTimesCircle, faListCheck } from '@fortawesome/free-solid-svg-icons';

function Card2(ip) {
  const calculateSubtaskProgress = () => {
    if (!ip.task?.subtasks || ip.task.subtasks.length === 0) return 0;
    const completed = ip.task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / ip.task.subtasks.length) * 100);
  };

  const progress = calculateSubtaskProgress();
  const hasSubtasks = ip.task?.subtasks && ip.task.subtasks.length > 0;

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

  const titleStyle = {
    margin: '0 0 8px 0',
    color: '#1f2937',
    fontSize: '1.25rem',
    fontWeight: '600',
    textAlign: 'center'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    width: '100%',
    marginTop: '16px'
  };

  const infoItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const labelStyle = {
    color: '#6b7280',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const valueStyle = {
    color: '#1f2937',
    fontSize: '1rem',
    fontWeight: '600'
  };

  const iconStyle = {
    marginRight: '8px',
    color: '#4f46e5'
  };

  const subtaskItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.9rem'
  };

  return (
    <div style={cardStyle}>
      <img 
        style={profileImageStyle} 
        src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/lizzie-ally-animals-to-follow-on-instagram-1568303611.jpg?crop=0.993xw:0.795xh;0.00519xw,0.114xh&resize=480:*" 
        alt="profile" 
      />
      <h2 style={titleStyle}>{ip.name}</h2>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        color: '#6b7280',
        marginBottom: '16px'
      }}>
        <FontAwesomeIcon icon={faCalendarAlt} />
        <span>{ip.para}</span>
      </div>
      
      <div style={infoGridStyle}>
        <div style={infoItemStyle}>
          <span style={labelStyle}>
            <FontAwesomeIcon icon={faClock} style={iconStyle} />
            Time
          </span>
          <span style={valueStyle}>{ip.time}</span>
        </div>
        
        <div style={infoItemStyle}>
          <span style={labelStyle}>
            <FontAwesomeIcon 
              icon={ip.status ? faCheckCircle : faTimesCircle} 
              style={{ 
                ...iconStyle,
                color: ip.status ? '#10b981' : '#ef4444'
              }} 
            />
            Status
          </span>
          <span style={{
            ...valueStyle,
            color: ip.status ? '#10b981' : '#ef4444'
          }}>
            {ip.status ? "Completed" : "Pending"}
          </span>
        </div>
        
        <div style={infoItemStyle}>
          <span style={labelStyle}>
            <FontAwesomeIcon icon={faCalendarAlt} style={iconStyle} />
            Type
          </span>
          <span style={valueStyle}>
            {ip.isDaily ? "Daily Task" : "One-time Task"}
          </span>
        </div>

        <div style={infoItemStyle}>
          <span style={labelStyle}>
            <FontAwesomeIcon icon={faListCheck} style={iconStyle} />
            Subtasks
          </span>
          <span style={valueStyle}>
            {hasSubtasks ? `${progress}% completed` : 'None'}
          </span>
        </div>
      </div>

      {/* Subtasks Section */}
      {hasSubtasks && (
        <div style={{ width: '100%', marginTop: '16px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '1rem', color: '#4f46e5' }}>
            Subtasks ({progress}% completed)
          </h3>
          <div style={{ 
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px'
          }}>
            {ip.task.subtasks.map((subtask, index) => (
              <div key={index} style={subtaskItemStyle}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `2px solid ${subtask.completed ? '#10b981' : '#d1d5db'}`,
                  backgroundColor: subtask.completed ? '#10b981' : 'transparent',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px'
                }}>
                  {subtask.completed && '✓'}
                </div>
                <span style={{
                  textDecoration: subtask.completed ? 'line-through' : 'none',
                  color: subtask.completed ? '#6b7280' : '#374151',
                  flex: 1
                }}>
                  {subtask.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Progress</span>
              <span style={{ fontSize: '0.875rem', color: '#4f46e5', fontWeight: '600' }}>
                {progress}%
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
        </div>
      )}
    </div>
  );
}

export default Card2;