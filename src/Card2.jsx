import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function Card2(ip) {
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
      </div>
    </div>
  );
}

export default Card2;