import Button from './Button/button';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowUp, faArrowDown, faEdit, faEye, faCheckCircle, faWarning} from "@fortawesome/free-solid-svg-icons";

function Card(ip){
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

  function deletetask(){
    const updatetask = ip.tasks.filter((_,i) => i != ip.index);   
    ip.settask(updatetask);
    localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
  }
  
  function moveup()
  {
    if(ip.index>0){
    const updatetask = [...ip.tasks];
    [updatetask[ip.index],updatetask[ip.index-1]]=[updatetask[ip.index-1],updatetask[ip.index]];
      ip.settask(updatetask);
      localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
    }
  }  

  function movedown()
  {
    if(ip.index<ip.tasks.length-1){
    const updatetask = [...ip.tasks];
    [updatetask[ip.index],updatetask[ip.index+1]]=[updatetask[ip.index+1],updatetask[ip.index]];
      ip.settask(updatetask);
      localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
    }
  }

  function displayinfo(){
    ip.setInd(ip.index);
    ip.setShow(1);
  }

  function displaychange(){
    ip.setInd(ip.index);
    ip.setShow(0);
  }

  const iconButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '0',
    cursor: 'pointer',
    fontSize: '24px',
    color: ip.status ? 'green' : (currentDate > ipDate ? 'red' : 'black'),
    marginRight: '20px',
  };

  function handleChecked(){
    if(daysDifference<0){
      const updatetask = [...ip.tasks];
      updatetask[ip.index].status=!updatetask[ip.index].status;
      ip.settask(updatetask);
      localStorage.setItem(ip.fetcho, JSON.stringify(updatetask));
    }
  }

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    margin: '10px 0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
    }
  };

  const profileImageStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '20px',
    border: '2px solid #e0e0e0'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0px',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5'
  };

  return(
    <div className="outercard">
      {ip.isMobileView ? 
        <div style={cardStyle}>
          <button style={iconButtonStyle} onClick={handleChecked}>
            <FontAwesomeIcon icon={ip.tasks[ip.index].status ? faCheckCircle : Math.abs(daysDifference) > 3 ? faCheckCircle : faWarning} />
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 8px 0', color: '#2d3748', fontSize: '1.2rem' }}>{ip.name}</h2>
            <div style={{ display: 'flex', gap: '10px', color: '#718096' }}>
              <p>{new Date(ip.ded).toDateString()}</p>
              <p>{new Date(ip.ded).toLocaleTimeString()}</p>
            </div>
            <div style={buttonGroupStyle}>
              <Button icon={faTrash} onClick={deletetask} color="#ec3257" width={'35px'} />
              <Button icon={faArrowUp} onClick={moveup} color="#2a8bd5" width={'35px'} />
              <Button icon={faArrowDown} onClick={movedown} color="#2a8bd5" width={'35px'} />
              <Button icon={faEye} onClick={displayinfo} color="#cde708" width={'35px'} />
              <Button icon={faEdit} onClick={displaychange} width={'35px'} />
            </div>
          </div>
        </div>      
      : 
      <div style={cardStyle}>
        <button style={iconButtonStyle} onClick={handleChecked}>
          <FontAwesomeIcon icon={ ip.tasks[ip.index].status ? faCheckCircle : Math.abs(daysDifference) > 3 ? faCheckCircle : faWarning } />
        </button>
        <img style={profileImageStyle} src={profileImg} alt="profile" />
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#2d3748', fontSize: '1.2rem', marginBottom: '-10px' }}>{ip.name}</h2>
          <div style={{ display: 'flex', gap: '10px', color: '#718096' }}>
            <p>{new Date(ip.ded).toDateString()}</p>
            <p>{new Date(ip.ded).toLocaleTimeString()}</p>
          </div>
        </div>
        <div style={{...buttonGroupStyle, marginLeft: '10px'}}>
          <Button icon={faTrash} onClick={deletetask} color="#ec3257" width={'35px'} />
          <Button icon={faArrowUp} onClick={moveup} color="#2a8bd5" width={'35px'} />
          <Button icon={faArrowDown} onClick={movedown} color="#2a8bd5" width={'35px'} />
          <Button icon={faEye} onClick={displayinfo} color="#cde708" width={'35px'} />
          <Button icon={faEdit} onClick={displaychange} width={'35px'} />
        </div>
      </div> 
      }
    </div>
  );
}

export default Card