import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowUp, faArrowDown, faEdit, faEye, faCheckCircle, faWarning, faClock } from "@fortawesome/free-solid-svg-icons";
import Button from './Button/button';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

function Card(ip) {
  const currentDate = new Date();
  const ipDate = new Date(ip.ded);
  const timeDifference = currentDate - ipDate;
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  const [profileImg, setProfileImg] = useState('');

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

  function handleChecked() {
    if (daysDifference < 0) {
      const updatetask = [...ip.tasks];
      updatetask[ip.index].status = !updatetask[ip.index].status;
      ip.settask(updatetask);
      localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
    }
  }

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    borderLeft: `4px solid ${ip.status ? '#10b981' : currentDate > ipDate ? '#ef4444' : '#3b82f6'}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  };

  const profileImageStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '16px',
    border: '2px solid #f3f4f6'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
    marginTop: ip.isMobileView? '10px' : '0px',
    marginBottom: ip.isMobileView? '-10px' : '0px'
  };

  const iconStyle = {
    color: ip.status ? '#10b981' : currentDate > ipDate ? '#ef4444' : '#3b82f6',
    marginRight: '16px',
    fontSize: '20px',
    flexShrink: 0
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0
  };

  const titleStyle = {
    margin: '0 0 4px 0',
    color: '#1f2937',
    fontSize: '1rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: ip.isMobileView? '-27px' : '0px',
    marginLeft: ip.isMobileView? '-35px' : '0px',
    width: ip.isMobileView? '85px' : 'auto',
    flexWrap: ip.isMobileView? 'wrap' : 'nowrap'
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
    color: currentDate > ipDate ? '#ef4444' : '#6b7280',
    fontSize: ip.isMobileView ? '0.875rem' : '0.75rem',
    marginTop: ip.isMobileView ? '-30px' : '4px',
    marginLeft: ip.isMobileView? '15px' : '0px',
    width: ip.isMobileView ? '500px' : 'auto',
    flexWrap: ip.isMobileView ? 'wrap' : 'nowrap',
  };

  return (
    <div style={cardStyle}>
      <FontAwesomeIcon 
        icon={ip.status ? faCheckCircle : currentDate > ipDate ? faWarning : faClock} 
        style={iconStyle}
        onClick={handleChecked}
      />
      
      {!ip.isMobileView && (
        <img style={profileImageStyle} src={profileImg} alt="profile" />
      )}
      
      {!ip.isMobileView && (
      <div style={contentStyle}>
        <h3 style={titleStyle}>{ip.name}</h3>
        <div style={timeStyle}>
          <span>{ip.time}</span>
          <span>•</span>
          <span>{ip.para}</span>
        </div>
        <div style={deadlineStyle}>
          {ip.ded ? (
            <>
              <FontAwesomeIcon icon={faClock} style={{ fontSize: '12px' }} />
              <span>Due: {new Date(ip.ded).toLocaleString()}</span>
            </>
          ) : (
            <span>Daily Task</span>
          )}
        </div>
      </div>
    )}
    {(
      ip.isMobileView && (
        <div style={contentStyle}>
          <div style={{display: "flex", flexDirection: 'row', width: '500px', marginTop: '-8px'}}>
            <h3 style={titleStyle}>{ip.name}</h3>
            <div style={deadlineStyle}>
              {ip.ded ? (
                <>
                  <FontAwesomeIcon icon={faClock} style={{ fontSize: '12px' }} />
                  <span>Due: {new Date(ip.ded).toLocaleString()}</span>
                </>
              ) : (
                <span>Daily Task</span>
              )}
            </div>
          </div>
        </div>
        )
    )}
      
      <div style={buttonGroupStyle}>
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