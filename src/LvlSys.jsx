import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFire, faTrophy, faStar, faMedal, faGem, faCheckCircle,
  faFistRaised, faShieldAlt, faRunning, faBrain, faHeart, faMagic,
  faPlus, faTrash, faEdit, faList, faBullseye, faFlagCheckered
} from '@fortawesome/free-solid-svg-icons';

const LevelingSystem = ({ userData, onUpdateUserData, availableSkills, setAvailableSkills }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quests, setQuests] = useState([]);
  const [missions, setMissions] = useState([]);
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [editingMission, setEditingMission] = useState(null);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    subtasks: [],
    reward: { xp: 0, stats: {}, skills: [] },
    deadline: '',
    difficulty: 'medium'
  });
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    reward: { xp: 0, stats: {}, skills: [
      { id: 1, name: 'Time Management', description: 'Complete tasks faster', level: 1, xp: 10 },
      { id: 2, name: 'Focus', description: 'Longer task sessions', level: 1, xp: 20 },
      { id: 3, name: 'Organization', description: 'Better task organization', level: 1, xp: 10 },
      { id: 4, name: 'Planning', description: 'Better deadline management', level: 1, xp: 5 }
    ] },
    deadline: '',
    type: 'daily'
  });
  const [newSubtask, setNewSubtask] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedQuests = localStorage.getItem('userQuests');
    const savedMissions = localStorage.getItem('userMissions');
    const savedSkills = localStorage.getItem('userSkills');
    
    if (savedQuests) setQuests(JSON.parse(savedQuests));
    if (savedMissions) setMissions(JSON.parse(savedMissions));
    if (savedSkills) setAvailableSkills(JSON.parse(savedSkills));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userQuests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('userMissions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('userSkills', JSON.stringify(availableSkills));
  }, [availableSkills]);

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
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '1rem'
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '1rem'
  };

  const tabStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    background: isActive ? '#4f46e5' : 'transparent',
    color: isActive ? 'white' : '#64748b',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  });

  const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e2e8f0',
    marginBottom: '1.5rem'
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

  const formStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    marginBottom: '2rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '1rem',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    marginRight: '0.5rem'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: '#6b7280'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    background: '#ef4444'
  };

  // Stats and Attributes Configuration
  const statsConfig = {
    strength: { icon: faFistRaised, color: '#dc2626', description: 'Physical power and capability' },
    agility: { icon: faRunning, color: '#16a34a', description: 'Speed and flexibility' },
    endurance: { icon: faShieldAlt, color: '#ca8a04', description: 'Stamina and resilience' },
    intelligence: { icon: faBrain, color: '#2563eb', description: 'Mental capacity and learning' },
    hp: { icon: faHeart, color: '#dc2626', description: 'Health Points' },
    mp: { icon: faMagic, color: '#7c3aed', description: 'Mana Points' }
  };

  const handleAddQuest = () => {
    if (newQuest.title.trim() === '') return;

    const quest = {
      id: Date.now(),
      ...newQuest,
      completed: false,
      progress: 0,
      createdAt: new Date().toISOString()
    };

    setQuests([...quests, quest]);
    setNewQuest({
      title: '',
      description: '',
      subtasks: [],
      reward: { xp: 0, stats: {}, skills: [] },
      deadline: '',
      difficulty: 'medium'
    });
    setShowQuestForm(false);
  };

  const handleAddMission = () => {
    if (newMission.title.trim() === '') return;

    const mission = {
      id: Date.now(),
      ...newMission,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setMissions([...missions, mission]);
    setNewMission({
      title: '',
      description: '',
      reward: { xp: 0, stats: {}, skills: [] },
      deadline: '',
      type: 'daily'
    });
    setShowMissionForm(false);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() === '') return;
    setNewQuest({
      ...newQuest,
      subtasks: [...newQuest.subtasks, { text: newSubtask, completed: false }]
    });
    setNewSubtask('');
  };

  const handleCompleteQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && onUpdateUserData) {
      // Award XP
      const newXp = userData.xp + quest.reward.xp;
      
      // Award stat improvements
      const newStats = { ...userData.stats };
      if (quest.reward.stats) {
        Object.keys(quest.reward.stats).forEach(stat => {
          newStats[stat] = (newStats[stat] || 0) + quest.reward.stats[stat];
        });
      }

      // Update user data
      onUpdateUserData({
        xp: newXp,
        stats: newStats
      });

      // Award skill improvements
      if (quest.reward.skills && quest.reward.skills.length > 0) {
        const updatedSkills = availableSkills.map(skill => {
          const improvement = quest.reward.skills.find(s => s.skillId === skill.id);
          if (improvement) {
            const newXp = skill.xp + improvement.xp;
            const xpForNextLevel = skill.level * 100;
            let newLevel = skill.level;
            let remainingXp = newXp;
            
            // Handle level ups
            while (remainingXp >= xpForNextLevel) {
              newLevel += 1;
              remainingXp -= xpForNextLevel;
            }
            
            return { 
              ...skill, 
              xp: remainingXp, 
              level: newLevel 
            };
          }
          return skill;
        });
        setAvailableSkills(updatedSkills);
        
        // Show skill improvement notifications
        quest.reward.skills.forEach(improvement => {
          const skill = availableSkills.find(s => s.id === improvement.skillId);
          if (skill) {
            showTemporaryReward(`${skill.name} +${improvement.xp} XP`, 'star');
          }
        });
      }

      // Show completion reward
      showTemporaryReward(`Quest Complete! +${quest.reward.xp} XP`, 'trophy');

      // Mark quest as completed
      setQuests(quests.map(q => q.id === questId ? { ...q, completed: true } : q));
    }
  };

  const handleCompleteMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission && onUpdateUserData) {
      // Award XP
      const newXp = userData.xp + mission.reward.xp;
      
      // Award stat improvements
      const newStats = { ...userData.stats };
      if (mission.reward.stats) {
        Object.keys(mission.reward.stats).forEach(stat => {
          newStats[stat] = (newStats[stat] || 0) + mission.reward.stats[stat];
        });
      }

      // Update user data
      onUpdateUserData({
        xp: newXp,
        stats: newStats
      });

      // Award skill improvements
      if (mission.reward.skills && mission.reward.skills.length > 0) {
        const updatedSkills = availableSkills.map(skill => {
          const improvement = mission.reward.skills.find(s => s.skillId === skill.id);
          if (improvement) {
            const newXp = skill.xp + improvement.xp;
            const xpForNextLevel = skill.level * 100;
            let newLevel = skill.level;
            let remainingXp = newXp;
            
            // Handle level ups
            while (remainingXp >= xpForNextLevel) {
              newLevel += 1;
              remainingXp -= xpForNextLevel;
            }
            
            return { 
              ...skill, 
              xp: remainingXp, 
              level: newLevel 
            };
          }
          return skill;
        });
        setAvailableSkills(updatedSkills);
        console.log('Updated Skills:', updatedSkills);
      }

      // Show completion reward
      showTemporaryReward(`Mission Complete! +${mission.reward.xp} XP`, 'medal');

      // Mark mission as completed
      setMissions(missions.map(m => m.id === missionId ? { ...m, completed: true } : m));
    }
  };

  const showTemporaryReward = (message, type) => {
    // Use your existing reward notification system from ToDo component
    console.log(`Reward: ${message}`); // Replace with your actual notification system
  };

  const handleUpdateSubtask = (questId, subtaskIndex, completed) => {
    setQuests(quests.map(quest => {
      if (quest.id === questId) {
        const updatedSubtasks = quest.subtasks.map((subtask, index) =>
          index === subtaskIndex ? { ...subtask, completed } : subtask
        );
        
        const progress = (updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100;
        
        return { ...quest, subtasks: updatedSubtasks, progress };
      }
      return quest;
    }));
  };

  const handleDeleteQuest = (questId) => {
    setQuests(quests.filter(q => q.id !== questId));
  };

  const handleDeleteMission = (missionId) => {
    setMissions(missions.filter(m => m.id !== missionId));
  };

  const renderOverview = () => (
    <div>
      {/* Level Card */}
      <div style={levelCardStyle}>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Level {userData.level}
        </div>
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
          <FontAwesomeIcon icon={faBullseye} style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
            {quests.filter(q => !q.completed).length}
          </div>
          <div style={{ color: '#64748b' }}>Active Quests</div>
        </div>

        <div style={statItemStyle}>
          <FontAwesomeIcon icon={faFlagCheckered} style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
            {missions.filter(m => !m.completed).length}
          </div>
          <div style={{ color: '#64748b' }}>Active Missions</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Attributes */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Attributes</h3>
          {Object.entries(userData.stats || {}).map(([stat, value]) => (
            <div key={stat} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FontAwesomeIcon 
                  icon={statsConfig[stat]?.icon || faStar} 
                  style={{ color: statsConfig[stat]?.color || '#6b7280' }} 
                />
                <span style={{ textTransform: 'capitalize' }}>{stat}</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Skills</h3>
          {availableSkills.map(skill => {
            const xpForNextLevel = skill.level * 100;
            const currentLevelXp = skill.xp % xpForNextLevel;
            const progress = (currentLevelXp / xpForNextLevel) * 100;
            
            return (
              <div key={skill.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{skill.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Level {skill.level}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{currentLevelXp}/{xpForNextLevel} XP</div>
                  <div style={{ 
                    width: '60px', 
                    height: '4px', 
                    background: '#e2e8f0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${progress}%`, 
                      height: '100%', 
                      background: '#4f46e5' 
                    }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderQuests = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#2d3748' }}>Your Quests</h2>
        <button 
          style={buttonStyle}
          onClick={() => setShowQuestForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
          New Quest
        </button>
      </div>

      {showQuestForm && (
        <div style={formStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Quest</h3>
          <input
            style={inputStyle}
            type="text"
            placeholder="Quest Title"
            value={newQuest.title}
            onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
          />
          <textarea
            style={{ ...inputStyle, minHeight: '80px' }}
            placeholder="Quest Description"
            value={newQuest.description}
            onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
          />
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Subtasks
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                type="text"
                placeholder="Add subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
              />
              <button style={secondaryButtonStyle} onClick={handleAddSubtask}>
                Add
              </button>
            </div>
            {newQuest.subtasks.map((subtask, index) => (
              <div key={index} style={{ 
                padding: '0.5rem', 
                background: '#f8fafc', 
                borderRadius: '4px',
                marginBottom: '0.25rem'
              }}>
                {subtask.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                XP Reward
              </label>
              <input
                style={inputStyle}
                type="number"
                value={newQuest.reward.xp}
                onChange={(e) => setNewQuest({ 
                  ...newQuest, 
                  reward: { ...newQuest.reward, xp: parseInt(e.target.value) || 0 }
                })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Deadline
              </label>
              <input
                style={inputStyle}
                type="datetime-local"
                value={newQuest.deadline}
                onChange={(e) => setNewQuest({ ...newQuest, deadline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button style={secondaryButtonStyle} onClick={() => setShowQuestForm(false)}>
              Cancel
            </button>
            <button style={buttonStyle} onClick={handleAddQuest}>
              Create Quest
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {quests.filter(q => !q.completed).map(quest => (
          <div key={quest.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>{quest.title}</h4>
                <p style={{ margin: 0, color: '#64748b' }}>{quest.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  style={{ ...buttonStyle, padding: '0.5rem 1rem' }}
                  onClick={() => handleCompleteQuest(quest.id)}
                >
                  Complete
                </button>
                <button 
                  style={{ ...dangerButtonStyle, padding: '0.5rem 1rem' }}
                  onClick={() => handleDeleteQuest(quest.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>

            {quest.subtasks.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  height: '6px', 
                  background: '#e2e8f0', 
                  borderRadius: '3px',
                  marginBottom: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    background: '#4f46e5', 
                    width: `${quest.progress}%` 
                  }}></div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Progress: {Math.round(quest.progress)}%
                </div>
                
                <div style={{ marginTop: '0.5rem' }}>
                  {quest.subtasks.map((subtask, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      marginBottom: '0.25rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) => handleUpdateSubtask(quest.id, index, e.target.checked)}
                      />
                      <span style={{ 
                        textDecoration: subtask.completed ? 'line-through' : 'none',
                        color: subtask.completed ? '#64748b' : '#2d3748'
                      }}>
                        {subtask.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '0.8rem',
              color: '#64748b'
            }}>
              <span>Reward: {quest.reward.xp} XP</span>
              {quest.deadline && (
                <span>Due: {new Date(quest.deadline).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}

        {quests.filter(q => !q.completed).length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', color: '#64748b' }}>
            <FontAwesomeIcon icon={faBullseye} style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No Active Quests</h3>
            <p>Create your first quest to get started!</p>
          </div>
        )}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Stat Rewards
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {Object.keys(statsConfig).map(stat => (
            <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', width: '80px' }}>
                {stat}:
              </span>
              <input
                style={{ ...inputStyle, marginBottom: 0, padding: '0.25rem', fontSize: '0.8rem' }}
                type="number"
                min="0"
                value={newQuest.reward.stats[stat] || 0}
                onChange={(e) => setNewQuest({
                  ...newQuest,
                  reward: {
                    ...newQuest.reward,
                    stats: {
                      ...newQuest.reward.stats,
                      [stat]: parseInt(e.target.value) || 0
                    }
                  }
                })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMissions = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#2d3748' }}>Your Missions</h2>
        <button 
          style={buttonStyle}
          onClick={() => setShowMissionForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
          New Mission
        </button>
      </div>

      {showMissionForm && (
        <div style={formStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Create New Mission</h3>
          <input
            style={inputStyle}
            type="text"
            placeholder="Mission Title"
            value={newMission.title}
            onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
          />
          <textarea
            style={{ ...inputStyle, minHeight: '80px' }}
            placeholder="Mission Description"
            value={newMission.description}
            onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                XP Reward
              </label>
              <input
                style={inputStyle}
                type="number"
                value={newMission.reward.xp}
                onChange={(e) => setNewMission({ 
                  ...newMission, 
                  reward: { ...newMission.reward, xp: parseInt(e.target.value) || 0 }
                })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Mission Type
              </label>
              <select
                style={inputStyle}
                value={newMission.type}
                onChange={(e) => setNewMission({ ...newMission, type: e.target.value })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="special">Special</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button style={secondaryButtonStyle} onClick={() => setShowMissionForm(false)}>
              Cancel
            </button>
            <button style={buttonStyle} onClick={handleAddMission}>
              Create Mission
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {missions.filter(m => !m.completed).map(mission => (
          <div key={mission.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: '#2d3748' }}>{mission.title}</h4>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    background: '#e0e7ff', 
                    color: '#4f46e5',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {mission.type}
                  </span>
                </div>
                <p style={{ margin: 0, color: '#64748b' }}>{mission.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  style={{ ...buttonStyle, padding: '0.5rem 1rem' }}
                  onClick={() => handleCompleteMission(mission.id)}
                >
                  Complete
                </button>
                <button 
                  style={{ ...dangerButtonStyle, padding: '0.5rem 1rem' }}
                  onClick={() => handleDeleteMission(mission.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '0.8rem',
              color: '#64748b'
            }}>
              <span>Reward: {mission.reward.xp} XP</span>
              {mission.deadline && (
                <span>Due: {new Date(mission.deadline).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}

        {missions.filter(m => !m.completed).length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', color: '#64748b' }}>
            <FontAwesomeIcon icon={faFlagCheckered} style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No Active Missions</h3>
            <p>Create your first mission to get started!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStats = () => (
    <div>
      <h2 style={{ marginBottom: '2rem', color: '#2d3748' }}>Character Stats & Attributes</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Core Stats */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Core Stats</h3>
          {Object.entries(statsConfig).map(([stat, config]) => (
            <div key={stat} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: config.color,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FontAwesomeIcon icon={config.icon} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.25rem'
                }}>
                  <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {stat}
                  </span>
                  <span style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: config.color
                  }}>
                    {userData.stats?.[stat] || 0}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {config.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Progress */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Skills Progress</h3>
          {availableSkills.map(skill => {
            const xpForNextLevel = skill.level * 100;
            const currentLevelXp = skill.xp % xpForNextLevel;
            const progress = (currentLevelXp / xpForNextLevel) * 100;
            
            return (
              <div key={skill.id} style={{ 
                padding: '1rem 0',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{skill.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {skill.description}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>Level {skill.level}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {currentLevelXp}/{xpForNextLevel} XP
                    </div>
                  </div>
                </div>
                <div style={{ 
                  height: '8px', 
                  background: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    background: '#4f46e5',
                    width: `${progress}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Adventure System</h1>
        <p style={{ color: '#64748b' }}>
          Embark on quests, complete missions, and grow your character!
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={tabContainerStyle}>
        <button 
          style={tabStyle(activeTab === 'overview')}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          style={tabStyle(activeTab === 'quests')}
          onClick={() => setActiveTab('quests')}
        >
          Quests
        </button>
        <button 
          style={tabStyle(activeTab === 'missions')}
          onClick={() => setActiveTab('missions')}
        >
          Missions
        </button>
        <button 
          style={tabStyle(activeTab === 'stats')}
          onClick={() => setActiveTab('stats')}
        >
          Stats & Skills
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'quests' && renderQuests()}
      {activeTab === 'missions' && renderMissions()}
      {activeTab === 'stats' && renderStats()}
    </div>
  );
};

export default LevelingSystem;