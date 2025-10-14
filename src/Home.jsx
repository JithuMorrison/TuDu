import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faTrophy, faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Home = ({ userData }) => {
  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem'
  };

  const subtitleStyle = {
    fontSize: '1.2rem',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  };

  const statCardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  };

  const statValueStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: '0.5rem'
  };

  const statLabelStyle = {
    color: '#64748b',
    fontSize: '1rem'
  };

  const iconStyle = {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#4f46e5'
  };

  const progressSectionStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem'
  };

  const progressBarStyle = {
    height: '12px',
    background: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden',
    margin: '1rem 0'
  };

  const progressFillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
    borderRadius: '6px',
    width: `${(userData.xp / (userData.level * 1000)) * 100}%`,
    transition: 'width 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Productivity Gamified</h1>
        <p style={subtitleStyle}>
          Level up your productivity! Complete tasks, build streaks, and unlock achievements in this gameified task management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <FontAwesomeIcon icon={faStar} style={iconStyle} />
          <div style={statValueStyle}>Level {userData.level}</div>
          <div style={statLabelStyle}>Current Level</div>
        </div>

        <div style={statCardStyle}>
          <FontAwesomeIcon icon={faFire} style={{...iconStyle, color: userData.streak > 0 ? '#f59e0b' : '#9ca3af'}} />
          <div style={{...statValueStyle, color: userData.streak > 0 ? '#f59e0b' : '#9ca3af'}}>
            {userData.streak} days
          </div>
          <div style={statLabelStyle}>Current Streak</div>
        </div>

        <div style={statCardStyle}>
          <FontAwesomeIcon icon={faTrophy} style={iconStyle} />
          <div style={statValueStyle}>{userData.achievements?.length || 0}</div>
          <div style={statLabelStyle}>Achievements Unlocked</div>
        </div>

        <div style={statCardStyle}>
          <FontAwesomeIcon icon={faCheckCircle} style={iconStyle} />
          <div style={statValueStyle}>
            {userData.completedToday || 0}/{userData.todaysGoal || 3}
          </div>
          <div style={statLabelStyle}>Today's Progress</div>
        </div>
      </div>

      {/* Progress Section */}
      <div style={progressSectionStyle}>
        <h2 style={{ marginBottom: '1rem', color: '#2d3748' }}>Level Progress</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ color: '#64748b' }}>Level {userData.level}</span>
          <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>
            {userData.xp} / {userData.level * 1000} XP
          </span>
        </div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {userData.level * 1000 - userData.xp} XP needed for next level
        </p>
      </div>

      {/* Features Section */}
      <div style={progressSectionStyle}>
        <h2 style={{ marginBottom: '1rem', color: '#2d3748' }}>Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>📝 Task Management</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Create, organize, and track your tasks with deadlines and categories.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>🎮 Gamification</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Earn XP, level up, and unlock achievements as you complete tasks.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>📅 Daily Planning</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Drag and drop tasks to plan your day and track completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;