import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faTrophy, faStar, faCheckCircle, faChartLine, faBolt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const Home = ({ userData }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerStyle = {
    padding: '3rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '4rem',
    position: 'relative',
  };

  const titleStyle = {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 50%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#6b7280',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: '1.6',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem'
  };

  const statCardStyle = (delay) => ({
    background: '#ffffff',
    padding: '2.5rem 2rem',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    border: '1px solid rgba(229, 231, 235, 0.5)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transitionDelay: `${delay}s`,
  });

  const iconContainerStyle = (bgColor, textColor) => ({
    width: '64px',
    height: '64px',
    background: bgColor,
    color: textColor,
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    fontSize: '1.8rem',
    boxShadow: `0 8px 16px ${bgColor}40`,
  });

  const statValueStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '0.5rem',
    fontVariantNumeric: 'tabular-nums',
  };

  const statLabelStyle = {
    color: '#6b7280',
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const progressSectionStyle = {
    background: '#ffffff',
    padding: '3rem',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
    marginBottom: '3rem',
    border: '1px solid rgba(229, 231, 235, 0.5)',
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transitionDelay: '0.4s',
    transition: 'all 0.8s ease-out',
  };

  const progressBarStyle = {
    height: '16px',
    background: '#f3f4f6',
    borderRadius: '8px',
    overflow: 'hidden',
    margin: '1.5rem 0',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
  };

  const progressFillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
    borderRadius: '8px',
    width: `${Math.min(100, (userData.xp / (userData.level * 1000)) * 100)}%`,
    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  const featureCardStyle = {
    padding: '2rem',
    background: '#f8fafc',
    borderRadius: '20px',
    border: '1px solid #f1f5f9',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: 'rgba(79, 70, 229, 0.1)',
          color: '#4f46e5',
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '0.875rem',
          marginBottom: '1.5rem',
        }}>
          ✨ Welcome Back to TuDu
        </div>
        <h1 style={titleStyle}>Productivity Gamified</h1>
        <p style={subtitleStyle}>
          Level up your productivity! Complete tasks, build streaks, and unlock achievements in a beautifully designed task management universe.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={statsGridStyle} className="home-stats-grid">
        <div style={statCardStyle(0.1)} className="hover-lift">
          <div style={iconContainerStyle('rgba(139, 92, 246, 0.1)', '#8b5cf6')}>
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div style={statValueStyle}>{userData.level}</div>
          <div style={statLabelStyle}>Current Level</div>
        </div>

        <div style={statCardStyle(0.2)} className="hover-lift">
          <div style={iconContainerStyle(userData.streak > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(156, 163, 175, 0.1)', userData.streak > 0 ? '#f59e0b' : '#9ca3af')}>
            <FontAwesomeIcon icon={faFire} />
          </div>
          <div style={statValueStyle}>{userData.streak} days</div>
          <div style={statLabelStyle}>Active Streak</div>
        </div>

        <div style={statCardStyle(0.3)} className="hover-lift">
          <div style={iconContainerStyle('rgba(236, 72, 153, 0.1)', '#ec4899')}>
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <div style={statValueStyle}>{userData.achievements?.length || 0}</div>
          <div style={statLabelStyle}>Achievements</div>
        </div>

        <div style={statCardStyle(0.4)} className="hover-lift">
          <div style={iconContainerStyle('rgba(16, 185, 129, 0.1)', '#10b981')}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div style={statValueStyle}>
            {userData.completedToday || 0} <span style={{ color: '#9ca3af', fontSize: '1.5rem' }}>/ {userData.todaysGoal || 3}</span>
          </div>
          <div style={statLabelStyle}>Today's Goal</div>
        </div>
      </div>

      {/* Progress Section */}
      <div style={progressSectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '8px', borderRadius: '12px' }}>
            <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '1.25rem' }} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#111827', fontWeight: 'bold' }}>Level Journey</h2>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem' }}>
          <div>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase' }}>Current Progress</span>
            <div style={{ color: '#4f46e5', fontWeight: '800', fontSize: '1.5rem', marginTop: '0.25rem' }}>
              {userData.xp} <span style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: '500' }}>/ {userData.level * 1000} XP</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase' }}>Next Level</span>
            <div style={{ color: '#111827', fontWeight: '800', fontSize: '1.5rem', marginTop: '0.25rem' }}>
              Level {userData.level + 1}
            </div>
          </div>
        </div>
        
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
        
        <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '500', textAlign: 'center' }}>
          You need <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>{userData.level * 1000 - userData.xp} XP</span> to reach the next level! Keep crushing those tasks.
        </p>
      </div>

      {/* Features Section */}
      <div style={{...progressSectionStyle, transitionDelay: '0.5s'}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '8px', borderRadius: '12px' }}>
            <FontAwesomeIcon icon={faBolt} style={{ fontSize: '1.25rem' }} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#111827', fontWeight: 'bold' }}>Core Features</h2>
        </div>
        
        <div style={featuresGridStyle}>
          <div style={featureCardStyle} className="hover-lift-sm">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', margin: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faCalendarCheck} />
              </div>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 'bold' }}>Task Management</h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              Create, organize, and track your tasks with deadlines, subtasks, and distinct categories to stay perfectly organized.
            </p>
          </div>
          
          <div style={featureCardStyle} className="hover-lift-sm">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', margin: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faStar} />
              </div>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 'bold' }}>Gamified XP</h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              Earn XP, level up your stats, and unlock unique achievements as you hit daily goals and build unstoppable streaks.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;