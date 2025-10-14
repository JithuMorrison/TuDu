import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faTrophy, faStar, faMedal, faGem } from '@fortawesome/free-solid-svg-icons';

const LevelingSystem = ({ userData }) => {
  const containerStyle = {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '1rem'
  };

  const levelCardStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    marginBottom: '2rem',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
  };

  const levelNumberStyle = {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  };

  const progressBarStyle = {
    height: '12px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    overflow: 'hidden',
    margin: '1.5rem 0'
  };

  const progressFillStyle = {
    height: '100%',
    background: 'white',
    borderRadius: '6px',
    width: `${(userData.xp / (userData.level * 1000)) * 100}%`
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const statItemStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e2e8f0'
  };

  const achievementsSectionStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem'
  };

  const achievementGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  };

  const achievementCardStyle = {
    padding: '1rem',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const achievementIconStyle = {
    fontSize: '1.5rem',
    color: '#f59e0b'
  };

  const xpInfoStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
  };

  const xpItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #e2e8f0'
  };

  const commonAchievements = [
    { name: '3-day Streak', description: 'Maintain a 3-day task completion streak' },
    { name: '7-day Streak', description: 'Maintain a 7-day task completion streak' },
    { name: 'Monthly Streak', description: 'Maintain a 30-day task completion streak' },
    { name: 'Level 5', description: 'Reach level 5' },
    { name: 'Level 10', description: 'Reach level 10' },
    { name: 'Level 20', description: 'Reach level 20' },
    { name: 'Early Bird', description: 'Complete a task well before its deadline' },
    { name: 'Task Master', description: 'Complete 50 tasks' }
  ];

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Leveling System</h1>
        <p style={{ color: '#64748b' }}>
          Track your progress, achievements, and level up your productivity!
        </p>
      </div>

      {/* Level Card */}
      <div style={levelCardStyle}>
        <div style={levelNumberStyle}>Level {userData.level}</div>
        <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          {userData.xp} / {userData.level * 1000} XP
        </div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {userData.level * 1000 - userData.xp} XP to next level
        </div>
      </div>

      {/* Stats Grid */}
      <div style={statsGridStyle}>
        <div style={statItemStyle}>
          <FontAwesomeIcon icon={faFire} style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
            {userData.streak}
          </div>
          <div style={{ color: '#64748b' }}>Day Streak</div>
        </div>

        <div style={statItemStyle}>
          <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
            {userData.achievements?.length || 0}
          </div>
          <div style={{ color: '#64748b' }}>Achievements</div>
        </div>

        <div style={statItemStyle}>
          <FontAwesomeIcon icon={faStar} style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
            {userData.xp}
          </div>
          <div style={{ color: '#64748b' }}>Total XP</div>
        </div>

        <div style={statItemStyle}>
          <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
            {userData.completedToday || 0}/{userData.todaysGoal || 3}
          </div>
          <div style={{ color: '#64748b' }}>Today's Goal</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Achievements Section */}
        <div style={achievementsSectionStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#2d3748' }}>Your Achievements</h2>
          <div style={achievementGridStyle}>
            {commonAchievements.map((achievement, index) => {
              const isUnlocked = userData.achievements?.includes(achievement.name);
              return (
                <div 
                  key={index} 
                  style={{
                    ...achievementCardStyle,
                    background: isUnlocked ? '#f0f9ff' : '#f8fafc',
                    borderColor: isUnlocked ? '#4f46e5' : '#e2e8f0'
                  }}
                >
                  <FontAwesomeIcon 
                    icon={isUnlocked ? faTrophy : faMedal} 
                    style={{...achievementIconStyle, color: isUnlocked ? '#f59e0b' : '#9ca3af'}} 
                  />
                  <div>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: isUnlocked ? '#2d3748' : '#9ca3af',
                      marginBottom: '0.25rem'
                    }}>
                      {achievement.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: isUnlocked ? '#64748b' : '#cbd5e1'
                    }}>
                      {achievement.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Information */}
        <div style={xpInfoStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#2d3748' }}>How to Earn XP</h2>
          <div style={xpItemStyle}>
            <span style={{ color: '#64748b' }}>Complete a task</span>
            <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>+50 XP</span>
          </div>
          <div style={xpItemStyle}>
            <span style={{ color: '#64748b' }}>Complete daily task</span>
            <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>+25 XP</span>
          </div>
          <div style={xpItemStyle}>
            <span style={{ color: '#64748b' }}>Early completion</span>
            <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>+5-100 XP</span>
          </div>
          <div style={xpItemStyle}>
            <span style={{ color: '#64748b' }}>Streak bonus (every 3 days)</span>
            <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>+50 XP</span>
          </div>
          <div style={xpItemStyle}>
            <span style={{ color: '#64748b' }}>New category</span>
            <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>+50 XP</span>
          </div>
          <div style={xpItemStyle}>
            <span style={{ color: '#64748b' }}>Achievement unlock</span>
            <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>+100-500 XP</span>
          </div>
          <div style={{ ...xpItemStyle, borderBottom: 'none' }}>
            <span style={{ color: '#64748b' }}>Surprise reward</span>
            <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>+25-75 XP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelingSystem;