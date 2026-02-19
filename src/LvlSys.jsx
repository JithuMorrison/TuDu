import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFire, faTrophy, faStar, faMedal, faGem, faCheckCircle,
  faFistRaised, faShieldAlt, faRunning, faBrain, faHeart, faMagic,
  faPlus, faTrash, faEdit, faList, faBullseye, faFlagCheckered,
  faCrown, faUser, faMagicWandSparkles, faBook, faGraduationCap,
  faTags, faRocket, faShield, faDragon, faWandSparkles,
  faRedo, faSync, faHistory, faCalendarDay, faCalendarWeek, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

const LevelingSystem = ({ userData, onUpdateUserData, availableSkills, setAvailableSkills }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quests, setQuests] = useState(localStorage.getItem('userQuests') ? JSON.parse(localStorage.getItem('userQuests')) : []);
  const [missions, setMissions] = useState(localStorage.getItem('userMissions') ? JSON.parse(localStorage.getItem('userMissions')) : []);
  const [achievements, setAchievements] = useState(localStorage.getItem('userAchievements') ? JSON.parse(localStorage.getItem('userAchievements')) : []);
  const [titles, setTitles] = useState(localStorage.getItem('userTitles') ? JSON.parse(localStorage.getItem('userTitles')) : []);
  const [talents, setTalents] = useState(localStorage.getItem('userTalents') ? JSON.parse(localStorage.getItem('userTalents')) : []);
  
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showTalentForm, setShowTalentForm] = useState(false);
  const [showTitleForm, setShowTitleForm] = useState(false);
  
  const [editingQuest, setEditingQuest] = useState(null);
  const [editingMission, setEditingMission] = useState(null);
  
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    subtasks: [],
    reward: { xp: 0, stats: {}, skills: [], talents: [] },
    requiredSkills: [],
    deadline: '',
    difficulty: 'medium'
  });
  
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    reward: { xp: 0, stats: {}, skills: [], talents: [] },
    requiredSkills: [],
    deadline: '',
    type: 'daily'
  });
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    category: 'combat',
    maxLevel: 10,
    icon: 'star'
  });
  
  const [newTalent, setNewTalent] = useState({
    name: '',
    description: '',
    tree: 'general',
    requiredLevel: 1,
    cost: 1,
    effects: {}
  });
  
  const [newTitle, setNewTitle] = useState({
    name: '',
    description: '',
    type: 'custom',
    requirements: {}
  });
  
  const [newSubtask, setNewSubtask] = useState('');
  const [playerClass, setPlayerClass] = useState(localStorage.getItem('playerClass') || 'Adventurer');
  const [playerDescription, setPlayerDescription] = useState(localStorage.getItem('playerDescription') || 'A brave adventurer starting their journey');

  // Mission templates for manual application
  const missionTemplates = {
    daily: [
      {
        title: 'Morning Routine',
        description: 'Complete your daily morning tasks and set intentions for the day',
        reward: { xp: 100, stats: { endurance: 1 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'daily'
      },
      {
        title: 'Daily Exercise',
        description: 'Get some physical activity to boost your energy and health',
        reward: { xp: 150, stats: { strength: 1, agility: 1 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'daily'
      },
      {
        title: 'Learning Session',
        description: 'Spend time learning something new or improving your skills',
        reward: { xp: 120, stats: { intelligence: 1 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'daily'
      },
      {
        title: 'Evening Reflection',
        description: 'Review your day and plan for tomorrow',
        reward: { xp: 80, stats: { intelligence: 1 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'daily'
      }
    ],
    weekly: [
      {
        title: 'Weekly Planning',
        description: 'Set your goals and priorities for the upcoming week',
        reward: { xp: 300, stats: { intelligence: 2 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'weekly'
      },
      {
        title: 'Skill Development',
        description: 'Dedicate time to improve a specific skill',
        reward: { xp: 400, stats: { intelligence: 3 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'weekly'
      },
      {
        title: 'Social Connection',
        description: 'Connect with friends, family, or community',
        reward: { xp: 250, stats: { endurance: 2 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'weekly'
      },
      {
        title: 'Creative Project',
        description: 'Work on a creative or personal project',
        reward: { xp: 350, stats: { intelligence: 2, agility: 1 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'weekly'
      }
    ],
    monthly: [
      {
        title: 'Monthly Review',
        description: 'Reflect on your progress and achievements this month',
        reward: { xp: 800, stats: { intelligence: 5, endurance: 3 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'monthly'
      },
      {
        title: 'Goal Setting',
        description: 'Set new goals and objectives for the coming month',
        reward: { xp: 600, stats: { intelligence: 4 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'monthly'
      },
      {
        title: 'Skill Mastery',
        description: 'Reach a new level in one of your key skills',
        reward: { xp: 1000, stats: { intelligence: 6, strength: 2 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'monthly'
      },
      {
        title: 'Personal Growth',
        description: 'Challenge yourself with something outside your comfort zone',
        reward: { xp: 900, stats: { endurance: 4, agility: 3 }, skills: [], talents: [] },
        requiredSkills: [],
        type: 'monthly'
      }
    ]
  };

  // Available icons for skills
  const skillIcons = {
    star: faStar,
    fire: faFire,
    trophy: faTrophy,
    medal: faMedal,
    gem: faGem,
    fist: faFistRaised,
    shield: faShieldAlt,
    running: faRunning,
    brain: faBrain,
    heart: faHeart,
    magic: faMagic,
    crown: faCrown,
    wand: faWandSparkles,
    book: faBook,
    graduation: faGraduationCap
  };

  // Talent trees
  const talentTrees = {
    general: 'General',
    combat: 'Combat',
    magic: 'Magic',
    crafting: 'Crafting',
    stealth: 'Stealth',
    leadership: 'Leadership'
  };

  // Player classes
  const playerClasses = {
    Adventurer: { description: 'A versatile explorer of the unknown', stats: { strength: 10, agility: 12, endurance: 10, intelligence: 8 } },
    Warrior: { description: 'A master of weapons and combat', stats: { strength: 15, agility: 8, endurance: 12, intelligence: 5 } },
    Mage: { description: 'A wielder of arcane powers', stats: { strength: 5, agility: 8, endurance: 6, intelligence: 18 } },
    Rogue: { description: 'A stealthy and agile specialist', stats: { strength: 8, agility: 15, endurance: 8, intelligence: 9 } },
    Cleric: { description: 'A divine servant with healing powers', stats: { strength: 10, agility: 8, endurance: 12, intelligence: 10 } },
    Ranger: { description: 'A wilderness expert and tracker', stats: { strength: 10, agility: 14, endurance: 10, intelligence: 6 } }
  };

  const statsConfig = {
    strength: { icon: faFistRaised, color: '#dc2626', description: 'Physical power and capability' },
    agility: { icon: faRunning, color: '#16a34a', description: 'Speed and flexibility' },
    endurance: { icon: faShieldAlt, color: '#ca8a04', description: 'Stamina and resilience' },
    intelligence: { icon: faBrain, color: '#2563eb', description: 'Mental capacity and learning' },
    hp: { icon: faHeart, color: '#dc2626', description: 'Health Points' },
    mp: { icon: faMagic, color: '#7c3aed', description: 'Mana Points' }
  };

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('userQuests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('userMissions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('userAchievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('userTitles', JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    localStorage.setItem('userTalents', JSON.stringify(talents));
  }, [talents]);

  useEffect(() => {
    localStorage.setItem('playerClass', playerClass);
  }, [playerClass]);

  useEffect(() => {
    localStorage.setItem('playerDescription', playerDescription);
  }, [playerDescription]);

  // Initialize default skills if none exist
  useEffect(() => {
    if (availableSkills.length === 0) {
      const defaultSkills = [
        { id: 1, name: 'Time Management', description: 'Complete tasks faster', level: 1, xp: 0, category: 'general', maxLevel: 10, icon: 'star' },
        { id: 2, name: 'Focus', description: 'Longer task sessions', level: 1, xp: 0, category: 'mental', maxLevel: 10, icon: 'brain' },
        { id: 3, name: 'Organization', description: 'Better task organization', level: 1, xp: 0, category: 'general', maxLevel: 10, icon: 'shield' },
        { id: 4, name: 'Planning', description: 'Better deadline management', level: 1, xp: 0, category: 'mental', maxLevel: 10, icon: 'book' }
      ];
      setAvailableSkills(defaultSkills);
    }
  }, [availableSkills.length, setAvailableSkills]);

  // Initialize default titles
  useEffect(() => {
    if (titles.length === 0) {
      const defaultTitles = [
        { id: 1, name: 'Newbie Adventurer', description: 'Completed first quest', type: 'auto', requirements: { questsCompleted: 1 } },
        { id: 2, name: 'Random Explorer', description: 'Completed first mission', type: 'auto', requirements: { missionsCompleted: 1 } },
        { id: 3, name: 'Quest Novice', description: 'Completed 10 quests', type: 'auto', requirements: { questsCompleted: 10 } },
        { id: 4, name: 'Mission Specialist', description: 'Completed 25 missions', type: 'auto', requirements: { missionsCompleted: 25 } },
        { id: 5, name: 'Master Adventurer', description: 'Completed 50 quests', type: 'auto', requirements: { questsCompleted: 50 } },
        { id: 6, name: 'Legendary Hero', description: 'Completed 100 quests', type: 'auto', requirements: { questsCompleted: 100 } }
      ];
      setTitles(defaultTitles);
    }
  }, [titles.length]);

  // Check and regenerate recurring missions based on their deadlines
  useEffect(() => {
    const checkMissionRegeneration = () => {
      const now = new Date();
      let missionsUpdated = false;
      
      const updatedMissions = missions.map(mission => {
        // Only regenerate completed recurring missions that have passed their deadline
        if (mission.completed && ['daily', 'weekly', 'monthly'].includes(mission.type) && mission.deadline) {
          const deadline = new Date(mission.deadline);
          
          if (now > deadline) {
            missionsUpdated = true;
            
            // Calculate new deadline based on mission type
            let newDeadline = new Date(now);
            switch (mission.type) {
              case 'daily':
                newDeadline.setDate(newDeadline.getDate() + 1);
                break;
              case 'weekly':
                newDeadline.setDate(newDeadline.getDate() + 7);
                break;
              case 'monthly':
                newDeadline.setMonth(newDeadline.getMonth() + 1);
                break;
              default:
                newDeadline.setDate(newDeadline.getDate() + 1);
            }
            
            // Reset mission as incomplete with new deadline
            return {
              ...mission,
              completed: false,
              deadline: newDeadline.toISOString(),
              createdAt: now.toISOString()
            };
          }
        }
        return mission;
      });
      
      if (missionsUpdated) {
        setMissions(updatedMissions);
      }
    };

    // Check for regeneration every minute
    const interval = setInterval(checkMissionRegeneration, 60000);
    
    // Initial check
    checkMissionRegeneration();
    
    return () => clearInterval(interval);
  }, [missions]);

  // Single source of truth for achievements - use userData.achievements
  const currentAchievements = userData.achievements || [];

  // Check for title unlocks when quests or missions change
  useEffect(() => {
    const newAchievements = checkTitleUnlocks();
    if (newAchievements.length > 0 && onUpdateUserData) {
      const updatedAchievements = [...currentAchievements, ...newAchievements];
      
      const updatedUserData = {
        ...userData,
        achievements: updatedAchievements
      };
      
      onUpdateUserData(updatedUserData);
      
      // Also update local state for display
      setAchievements(updatedAchievements);
    }
  }, [quests, missions]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkTitleUnlocks = () => {
    const completedQuests = quests.filter(q => q.completed).length;
    const completedMissions = missions.filter(m => m.completed).length;
    const newAchievements = [];

    titles.forEach(title => {
      if (title.type === 'auto') {
        const alreadyUnlocked = currentAchievements.find(a => a.id === title.id);
        
        if (!alreadyUnlocked) {
          let shouldUnlock = false;
          
          if (title.requirements.questsCompleted && completedQuests >= title.requirements.questsCompleted) {
            shouldUnlock = true;
          }
          if (title.requirements.missionsCompleted && completedMissions >= title.requirements.missionsCompleted) {
            shouldUnlock = true;
          }
          
          if (shouldUnlock) {
            const newAchievement = {
              id: title.id,
              name: title.name,
              description: title.description,
              type: 'title',
              unlockedAt: new Date().toISOString(),
              title: title
            };
            
            newAchievements.push(newAchievement);
            showTemporaryReward(`Title Unlocked: ${title.name}`, 'crown');
          }
        }
      }
    });

    return newAchievements;
  };

  const checkQuestAchievements = () => {
    const completedQuests = quests.filter(q => q.completed).length;
    const newAchievements = [];

    // Check for quest count achievements
    if (completedQuests >= 1 && !currentAchievements.find(a => a.name === 'Newbie Adventurer')) {
      const achievement = {
        id: Date.now(),
        name: 'Newbie Adventurer',
        description: 'Completed 1 quest',
        type: 'quest',
        unlockedAt: new Date().toISOString()
      };
      newAchievements.push(achievement);
      showTemporaryReward('Achievement Unlocked: Newbie Adventurer', 'trophy');
    }

    if (completedQuests >= 10 && !currentAchievements.find(a => a.name === 'Quest Novice')) {
      const achievement = {
        id: Date.now(),
        name: 'Quest Novice',
        description: 'Completed 10 quests',
        type: 'quest',
        unlockedAt: new Date().toISOString()
      };
      newAchievements.push(achievement);
      showTemporaryReward('Achievement Unlocked: Quest Novice', 'trophy');
    }
    
    if (completedQuests >= 50 && !currentAchievements.find(a => a.name === 'Master Adventurer')) {
      const achievement = {
        id: Date.now(),
        name: 'Master Adventurer',
        description: 'Completed 50 quests',
        type: 'quest',
        unlockedAt: new Date().toISOString()
      };
      newAchievements.push(achievement);
      showTemporaryReward('Achievement Unlocked: Master Adventurer', 'trophy');
    }

    return newAchievements;
  };

  const checkMissionAchievements = () => {
    const completedMissions = missions.filter(m => m.completed).length;
    const newAchievements = [];

    if (completedMissions >= 1 && !currentAchievements.find(a => a.name === 'Random Explorer')) {
      const achievement = {
        id: Date.now(),
        name: 'Random Explorer',
        description: 'Completed 1 mission',
        type: 'mission',
        unlockedAt: new Date().toISOString()
      };
      newAchievements.push(achievement);
      showTemporaryReward('Achievement Unlocked: Random Explorer', 'trophy');
    }

    if (completedMissions >= 25 && !currentAchievements.find(a => a.name === 'Mission Specialist')) {
      const achievement = {
        id: Date.now(),
        name: 'Mission Specialist',
        description: 'Completed 25 missions',
        type: 'mission',
        unlockedAt: new Date().toISOString()
      };
      newAchievements.push(achievement);
      showTemporaryReward('Achievement Unlocked: Mission Specialist', 'trophy');
    }

    return newAchievements;
  };

  const showTemporaryReward = (message, icon) => {
    console.log(`Reward: ${message}`);
    // In a real app, you would show a toast notification here
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
      reward: { xp: 0, stats: {}, skills: [], talents: [] },
      requiredSkills: [],
      deadline: '',
      difficulty: 'medium'
    });
    setShowQuestForm(false);
  };

  const handleAddMission = () => {
    if (newMission.title.trim() === '') return;

    const now = new Date();
    let deadline = new Date(now);
    
    // Set appropriate deadline based on mission type
    switch (newMission.type) {
      case 'daily':
        deadline.setDate(deadline.getDate() + 1);
        break;
      case 'weekly':
        deadline.setDate(deadline.getDate() + 7);
        break;
      case 'monthly':
        deadline.setMonth(deadline.getMonth() + 1);
        break;
      default:
        // For special missions, use the provided deadline or set to 30 days default
        if (newMission.deadline) {
          deadline = new Date(newMission.deadline);
        } else {
          deadline.setDate(deadline.getDate() + 30);
        }
    }

    const mission = {
      id: Date.now(),
      ...newMission,
      completed: false,
      createdAt: now.toISOString(),
      deadline: deadline.toISOString()
    };

    setMissions([...missions, mission]);
    setNewMission({
      title: '',
      description: '',
      reward: { xp: 0, stats: {}, skills: [], talents: [] },
      requiredSkills: [],
      deadline: '',
      type: 'daily'
    });
    setShowMissionForm(false);
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim() === '') return;

    const skill = {
      id: Date.now(),
      ...newSkill,
      level: 1,
      xp: 0
    };

    const updatedSkills = [...availableSkills, skill];
    setAvailableSkills(updatedSkills);
    
    setNewSkill({
      name: '',
      description: '',
      category: 'combat',
      maxLevel: 10,
      icon: 'star'
    });
    setShowSkillForm(false);

    if (onUpdateUserData) {
      const updatedUserData = {
        ...userData,
        skills: updatedSkills
      };
      onUpdateUserData(updatedUserData);
    }
  };

  const handleAddTalent = () => {
    if (newTalent.name.trim() === '') return;

    const talent = {
      id: Date.now(),
      ...newTalent,
      unlocked: false
    };

    setTalents([...talents, talent]);
    setNewTalent({
      name: '',
      description: '',
      tree: 'general',
      requiredLevel: 1,
      cost: 1,
      effects: {}
    });
    setShowTalentForm(false);
  };

  const handleAddTitle = () => {
    if (newTitle.name.trim() === '') return;

    const title = {
      id: Date.now(),
      ...newTitle
    };

    setTitles([...titles, title]);

    if (newTitle.type === 'custom') {
      const newAchievement = {
        id: Date.now(),
        name: newTitle.name,
        description: newTitle.description || 'Custom achievement unlocked',
        type: 'title',
        unlockedAt: new Date().toISOString(),
        title: title,
      };

      const updatedAchievements = [...achievements, newAchievement];
      setAchievements(updatedAchievements);

      // Persist the updated achievements to user data
      onUpdateUserData({
        achievements: updatedAchievements,
      });
    }

    setNewTitle({
      name: '',
      description: '',
      type: 'custom',
      requirements: {}
    });
    setShowTitleForm(false);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() === '') return;
    setNewQuest({
      ...newQuest,
      subtasks: [...newQuest.subtasks, { text: newSubtask, completed: false }]
    });
    setNewSubtask('');
  };

  const handleUpdateSubtask = (questId, subtaskIndex, completed) => {
    setQuests(quests.map(quest => {
      if (quest.id === questId) {
        const updatedSubtasks = quest.subtasks.map((subtask, index) =>
          index === subtaskIndex ? { ...subtask, completed } : subtask
        );

        const progress = updatedSubtasks.length > 0 
          ? (updatedSubtasks.filter(st => st.completed).length / updatedSubtasks.length) * 100
          : 0;

        return { ...quest, subtasks: updatedSubtasks, progress };
      }
      return quest;
    }));
  };

  const handleCompleteQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && onUpdateUserData) {
      let newXp = userData.xp + quest.reward.xp;
      let newLevel = userData.level;
      const xpNeeded = newLevel * 1000;

      if (newXp >= xpNeeded) {
        newLevel += 1;
        newXp -= xpNeeded;
      }

      const newStats = { ...userData.stats };
      if (quest.reward.stats) {
        Object.keys(quest.reward.stats).forEach(stat => {
          newStats[stat] = (newStats[stat] || 0) + quest.reward.stats[stat];
        });
      }

      let updatedSkills = [...availableSkills];
      if (quest.reward.skills && quest.reward.skills.length > 0) {
        updatedSkills = availableSkills.map(skill => {
          const improvement = quest.reward.skills.find(s => s === skill.id);
          if (improvement) {
            const newSkillXp = skill.xp + quest.reward.xp;
            const xpForNextLevel = skill.level * 100;
            let newSkillLevel = skill.level;
            let remainingXp = newSkillXp;

            while (remainingXp >= xpForNextLevel && newSkillLevel < skill.maxLevel) {
              newSkillLevel += 1;
              remainingXp -= xpForNextLevel;
            }

            return {
              ...skill,
              xp: remainingXp,
              level: newSkillLevel
            };
          }
          return skill;
        });
        setAvailableSkills(updatedSkills);
      }

      if (quest.reward.talents && quest.reward.talents.length > 0) {
        quest.reward.talents.forEach(talentId => {
          const talent = talents.find(t => t.id === talentId);
          if (talent && !talent.unlocked) {
            handleUnlockTalent(talentId);
          }
        });
      }

      // Check for achievements
      const questAchievements = checkQuestAchievements();
      if (questAchievements.length > 0) {
        const updatedAchievements = [...currentAchievements, ...questAchievements];
        
        const updatedUserData = {
          xp: newXp,
          level: newLevel,
          stats: newStats,
          skills: updatedSkills,
          achievements: updatedAchievements
        };

        onUpdateUserData(updatedUserData);
        setAchievements(updatedAchievements);
      } else {
        const updatedUserData = {
          xp: newXp,
          level: newLevel,
          stats: newStats,
          skills: updatedSkills,
          achievements: currentAchievements
        };

        onUpdateUserData(updatedUserData);
      }

      setQuests(quests.map(q => q.id === questId ? { ...q, completed: true } : q));
    }
  };

  const handleCompleteMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission && onUpdateUserData) {
      let newXp = userData.xp + mission.reward.xp;
      let newLevel = userData.level;
      const xpNeeded = newLevel * 1000;

      if (newXp >= xpNeeded) {
        newLevel += 1;
        newXp -= xpNeeded;
      }

      const newStats = { ...userData.stats };
      if (mission.reward.stats) {
        Object.keys(mission.reward.stats).forEach(stat => {
          newStats[stat] = (newStats[stat] || 0) + mission.reward.stats[stat];
        });
      }

      let updatedSkills = [...availableSkills];
      if (mission.reward.skills && mission.reward.skills.length > 0) {
        updatedSkills = availableSkills.map(skill => {
          const improvement = mission.reward.skills.find(s => s === skill.id);
          if (improvement) {
            const newSkillXp = skill.xp + mission.reward.xp;
            const xpForNextLevel = skill.level * 100;
            let newSkillLevel = skill.level;
            let remainingXp = newSkillXp;

            while (remainingXp >= xpForNextLevel && newSkillLevel < skill.maxLevel) {
              newSkillLevel += 1;
              remainingXp -= xpForNextLevel;
            }

            return {
              ...skill,
              xp: remainingXp,
              level: newSkillLevel
            };
          }
          return skill;
        });
        setAvailableSkills(updatedSkills);
      }

      if (mission.reward.talents && mission.reward.talents.length > 0) {
        mission.reward.talents.forEach(talentId => {
          const talent = talents.find(t => t.id === talentId);
          if (talent && !talent.unlocked) {
            handleUnlockTalent(talentId);
          }
        });
      }

      // Check for achievements
      const missionAchievements = checkMissionAchievements();
      if (missionAchievements.length > 0) {
        const updatedAchievements = [...currentAchievements, ...missionAchievements];
        
        const updatedUserData = {
          xp: newXp,
          level: newLevel,
          stats: newStats,
          skills: updatedSkills,
          achievements: updatedAchievements
        };

        onUpdateUserData(updatedUserData);
        setAchievements(updatedAchievements);
      } else {
        const updatedUserData = {
          xp: newXp,
          level: newLevel,
          stats: newStats,
          skills: updatedSkills,
          achievements: currentAchievements
        };

        onUpdateUserData(updatedUserData);
      }

      // Mark mission as completed (it will auto-regenerate after deadline)
      setMissions(missions.map(m => m.id === missionId ? { ...m, completed: true } : m));
    }
  };

  const handleDeleteQuest = (questId) => {
    setQuests(quests.filter(q => q.id !== questId));
  };

  const handleDeleteMission = (missionId) => {
    setMissions(missions.filter(m => m.id !== missionId));
  };

  const handleDeleteSkill = (skillId) => {
    const updatedSkills = availableSkills.filter(s => s.id !== skillId);
    setAvailableSkills(updatedSkills);
    
    if (onUpdateUserData) {
      const updatedUserData = {
        ...userData,
        skills: updatedSkills
      };
      onUpdateUserData(updatedUserData);
    }
  };

  const handleDeleteTalent = (talentId) => {
    setTalents(talents.filter(t => t.id !== talentId));
  };

  const handleDeleteTitle = (titleId) => {
    setTitles(titles.filter(t => t.id !== titleId));
    
    // Also remove from achievements if it was unlocked
    const updatedAchievements = currentAchievements.filter(a => a.title?.id !== titleId);
    setAchievements(updatedAchievements);
    
    if (onUpdateUserData) {
      const updatedUserData = {
        ...userData,
        achievements: updatedAchievements
      };
      onUpdateUserData(updatedUserData);
    }
  };

  const handleUnlockTalent = (talentId) => {
    const talent = talents.find(t => t.id === talentId);
    if (talent && userData.level >= talent.requiredLevel && !talent.unlocked) {
      setTalents(talents.map(t => 
        t.id === talentId ? { ...t, unlocked: true } : t
      ));
      
      // Apply talent effects to user stats
      if (talent.effects) {
        const newStats = { ...userData.stats };
        Object.keys(talent.effects).forEach(stat => {
          newStats[stat] = (newStats[stat] || 0) + talent.effects[stat];
        });
        
        const updatedUserData = {
          ...userData,
          stats: newStats
        };
        
        onUpdateUserData(updatedUserData);
      }
      
      showTemporaryReward(`Talent Unlocked: ${talent.name}`, 'magic');
    }
  };

  const handleClassChange = (newClass) => {
    const currentStats = playerClasses[playerClass]?.stats || {};
    const newClassStats = playerClasses[newClass].stats;

    const updatedStats = {};
    for (const key in userData.stats) {
      const baseValue = userData.stats[key] || 0;
      const currentClassValue = currentStats[key] || 0;
      const newClassValue = newClassStats[key] || 0;

      updatedStats[key] = baseValue - currentClassValue + newClassValue;
    }

    setPlayerClass(newClass);
    setPlayerDescription(playerClasses[newClass].description);

    const updatedUserData = {
      ...userData,
      stats: updatedStats
    };

    onUpdateUserData(updatedUserData);
  };

  const toggleSkillSelection = (skillId) => {
    setNewQuest(prev => {
      const isSelected = prev.requiredSkills.includes(skillId);
      const updatedSkills = isSelected
        ? prev.requiredSkills.filter(id => id !== skillId)
        : [...prev.requiredSkills, skillId];

      return {
        ...prev,
        requiredSkills: updatedSkills,
        reward: {
          ...prev.reward,
          skills: updatedSkills
        }
      };
    });
  };

  const toggleMissionSkillSelection = (skillId) => {
    setNewMission(prev => {
      const isSelected = prev.requiredSkills.includes(skillId);
      const updatedSkills = isSelected
        ? prev.requiredSkills.filter(id => id !== skillId)
        : [...prev.requiredSkills, skillId];

      return {
        ...prev,
        requiredSkills: updatedSkills,
        reward: {
          ...prev.reward,
          skills: updatedSkills
        }
      };
    });
  };

  const toggleTalentSelection = (talentId) => {
    setNewQuest(prev => {
      const isSelected = prev.reward.talents.includes(talentId);
      const updatedTalents = isSelected
        ? prev.reward.talents.filter(id => id !== talentId)
        : [...prev.reward.talents, talentId];

      return {
        ...prev,
        reward: {
          ...prev.reward,
          talents: updatedTalents
        }
      };
    });
  };

  const toggleMissionTalentSelection = (talentId) => {
    setNewMission(prev => {
      const isSelected = prev.reward.talents.includes(talentId);
      const updatedTalents = isSelected
        ? prev.reward.talents.filter(id => id !== talentId)
        : [...prev.reward.talents, talentId];

      return {
        ...prev,
        reward: {
          ...prev.reward,
          talents: updatedTalents
        }
      };
    });
  };

  const applyMissionTemplate = (type) => {
    const now = new Date();
    const templateMissions = missionTemplates[type] || [];
    
    // Check if any of these template missions already exist (by title)
    const existingMissionTitles = missions.map(mission => mission.title);
    const existingTemplateTitles = templateMissions.map(template => template.title);
    
    // Find which template missions are already applied
    const alreadyAppliedTitles = existingTemplateTitles.filter(title => 
      existingMissionTitles.includes(title)
    );
    
    // If all template missions are already applied, show message and return
    if (alreadyAppliedTitles.length === templateMissions.length) {
      showTemporaryReward(`${type.charAt(0).toUpperCase() + type.slice(1)} template already applied!`, 'info');
      return;
    }
    
    // Filter out templates that are already applied
    const newTemplates = templateMissions.filter(template => 
      !existingMissionTitles.includes(template.title)
    );
    
    const newMissions = newTemplates.map(template => {
      let deadline = new Date(now);
      
      switch (type) {
        case 'daily':
          deadline.setDate(deadline.getDate() + 1);
          break;
        case 'weekly':
          deadline.setDate(deadline.getDate() + 7);
          break;
        case 'monthly':
          deadline.setMonth(deadline.getMonth() + 1);
          break;
        default:
          deadline.setDate(deadline.getDate() + 1);
      }
      
      return {
        ...template,
        id: Date.now() + Math.random(),
        completed: false,
        createdAt: now.toISOString(),
        deadline: deadline.toISOString()
      };
    });
    
    // Add new template missions to existing missions
    setMissions(prev => [...prev, ...newMissions]);
    
    if (newTemplates.length === templateMissions.length) {
      showTemporaryReward(`Applied ${type} mission template!`, 'calendar-day');
    } else if (newTemplates.length > 0) {
      showTemporaryReward(`Added ${newTemplates.length} new missions from ${type} template!`, 'calendar-day');
    } else {
      showTemporaryReward(`${type.charAt(0).toUpperCase() + type.slice(1)} template already applied!`, 'info');
    }
  };

  const manuallyRegenerateMissions = () => {
    const now = new Date();
    let missionsUpdated = false;
    
    const updatedMissions = missions.map(mission => {
      // Only regenerate completed recurring missions
      if (mission.completed && ['daily', 'weekly', 'monthly'].includes(mission.type)) {
        missionsUpdated = true;
        
        // Calculate new deadline based on mission type
        let newDeadline = new Date(now);
        switch (mission.type) {
          case 'daily':
            newDeadline.setDate(newDeadline.getDate() + 1);
            break;
          case 'weekly':
            newDeadline.setDate(newDeadline.getDate() + 7);
            break;
          case 'monthly':
            newDeadline.setMonth(newDeadline.getMonth() + 1);
            break;
          default:
            newDeadline.setDate(newDeadline.getDate() + 1);
        }
        
        // Reset mission as incomplete with new deadline
        return {
          ...mission,
          completed: false,
          deadline: newDeadline.toISOString(),
          createdAt: now.toISOString()
        };
      }
      return mission;
    });
    
    if (missionsUpdated) {
      setMissions(updatedMissions);
      showTemporaryReward('Missions regenerated!', 'sync');
    } else {
      showTemporaryReward('No completed missions to regenerate', 'info');
    }
  };

  // Styles
  const containerStyle = {
    padding: '2rem',
    maxWidth: '1400px',
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
    paddingBottom: '1rem',
    overflowX: 'auto'
  };

  const tabStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    background: isActive ? '#4f46e5' : 'transparent',
    color: isActive ? 'white' : '#64748b',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
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
    marginBottom: '1rem',
    boxSizing: 'border-box'
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

  const successButtonStyle = {
    ...buttonStyle,
    background: '#10b981'
  };

  const warningButtonStyle = {
    ...buttonStyle,
    background: '#f59e0b'
  };

  const infoButtonStyle = {
    ...buttonStyle,
    background: '#3b82f6'
  };

  const renderOverview = () => (
    <div>
      <div style={levelCardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>{playerClass}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{playerDescription}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Level {userData.level}
            </div>
            <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>
              {userData.xp} / {userData.level * 1000} XP
            </div>
          </div>
        </div>
        
        <div style={progressBarStyle}>
          <div style={progressFillStyle}></div>
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {Math.max(0, userData.level * 1000 - userData.xp)} XP to next level
        </div>
      </div>

      <div style={statsGridStyle}>
        <div style={statItemStyle}>
          <FontAwesomeIcon icon={faFire} style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
            {userData.streak || 0}
          </div>
          <div style={{ color: '#64748b' }}>Day Streak</div>
        </div>

        <div style={statItemStyle}>
          <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748' }}>
            {currentAchievements.length}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
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

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#2d3748', margin: 0 }}>Skills</h3>
              <button style={buttonStyle} onClick={() => setShowSkillForm(true)}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
                New Skill
              </button>
            </div>
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
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FontAwesomeIcon 
                        icon={skillIcons[skill.icon] || faStar} 
                        style={{ color: '#4f46e5' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{skill.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          Level {skill.level}/{skill.maxLevel} • {skill.category}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{currentLevelXp}/{xpForNextLevel} XP</div>
                      <div style={{
                        width: '80px',
                        height: '6px',
                        background: '#e2e8f0',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        marginTop: '2px'
                      }}>
                        <div style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: '#4f46e5'
                        }}></div>
                      </div>
                    </div>
                    <button
                      style={{ ...dangerButtonStyle, padding: '0.25rem 0.5rem', fontSize: '0.7rem', marginRight: 0 }}
                      onClick={() => handleDeleteSkill(skill.id)}
                      title="Delete skill"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#2d3748', margin: 0 }}>Your Quests</h2>
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
            style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
            placeholder="Quest Description"
            value={newQuest.description}
            onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
          />

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Required Skills
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableSkills.map(skill => (
                <button
                  key={skill.id}
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    background: newQuest.requiredSkills.includes(skill.id) ? '#4f46e5' : '#e5e7eb',
                    color: newQuest.requiredSkills.includes(skill.id) ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => toggleSkillSelection(skill.id)}
                >
                  <FontAwesomeIcon icon={skillIcons[skill.icon] || faStar} />
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Talent Rewards
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {talents.map(talent => (
                <button
                  key={talent.id}
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    background: newQuest.reward.talents.includes(talent.id) ? '#10b981' : '#e5e7eb',
                    color: newQuest.reward.talents.includes(talent.id) ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => toggleTalentSelection(talent.id)}
                >
                  <FontAwesomeIcon icon={faMagicWandSparkles} />
                  {talent.name}
                </button>
              ))}
            </div>
            {talents.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                No talents available. Create talents first in the Stats & Skills tab.
              </p>
            )}
          </div>

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
              <button style={{ ...secondaryButtonStyle, marginRight: 0, marginBottom: 0 }} onClick={handleAddSubtask}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Stat Rewards
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {Object.keys(statsConfig).map(stat => (
                <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', width: '60px' }}>
                    {stat}:
                  </span>
                  <input
                    style={{ ...inputStyle, marginBottom: 0, padding: '0.5rem', fontSize: '0.9rem', flex: 1 }}
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

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>{quest.title}</h4>
                <p style={{ margin: 0, color: '#64748b' }}>{quest.description}</p>
                
                {quest.requiredSkills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {quest.requiredSkills.map(skillId => {
                      const skill = availableSkills.find(s => s.id === skillId);
                      return skill ? (
                        <span key={skillId} style={{
                          padding: '0.25rem 0.5rem',
                          background: '#e0e7ff',
                          color: '#4f46e5',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <FontAwesomeIcon icon={skillIcons[skill.icon] || faStar} />
                          {skill.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                {quest.reward.talents.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {quest.reward.talents.map(talentId => {
                      const talent = talents.find(t => t.id === talentId);
                      return talent ? (
                        <span key={talentId} style={{
                          padding: '0.25rem 0.5rem',
                          background: '#d1fae5',
                          color: '#065f46',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <FontAwesomeIcon icon={faMagicWandSparkles} />
                          {talent.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{ ...buttonStyle, padding: '0.5rem 1rem', marginRight: 0 }}
                  onClick={() => handleCompleteQuest(quest.id)}
                >
                  Complete
                </button>
                <button
                  style={{ ...dangerButtonStyle, padding: '0.5rem 1rem', marginRight: 0 }}
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
                        style={{ cursor: 'pointer' }}
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
              color: '#64748b',
              flexWrap: 'wrap',
              gap: '0.5rem'
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
    </div>
  );

  const renderMissions = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#2d3748', margin: 0 }}>Your Missions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            style={warningButtonStyle}
            onClick={manuallyRegenerateMissions}
          >
            <FontAwesomeIcon icon={faSync} style={{ marginRight: '0.5rem' }} />
            Regenerate Completed
          </button>
          <button
            style={buttonStyle}
            onClick={() => setShowMissionForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
            New Mission
          </button>
        </div>
      </div>

      {/* Mission Templates Section */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Mission Templates</h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Apply pre-made mission templates to quickly add recurring missions
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            style={{ ...infoButtonStyle, background: '#10b981' }}
            onClick={() => applyMissionTemplate('daily')}
          >
            <FontAwesomeIcon icon={faCalendarDay} style={{ marginRight: '0.5rem' }} />
            Apply Daily Template
          </button>
          <button
            style={{ ...infoButtonStyle, background: '#3b82f6' }}
            onClick={() => applyMissionTemplate('weekly')}
          >
            <FontAwesomeIcon icon={faCalendarWeek} style={{ marginRight: '0.5rem' }} />
            Apply Weekly Template
          </button>
          <button
            style={{ ...infoButtonStyle, background: '#8b5cf6' }}
            onClick={() => applyMissionTemplate('monthly')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.5rem' }} />
            Apply Monthly Template
          </button>
        </div>
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
            style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
            placeholder="Mission Description"
            value={newMission.description}
            onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
          />

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Required Skills
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableSkills.map(skill => (
                <button
                  key={skill.id}
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    background: newMission.requiredSkills.includes(skill.id) ? '#4f46e5' : '#e5e7eb',
                    color: newMission.requiredSkills.includes(skill.id) ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => toggleMissionSkillSelection(skill.id)}
                >
                  <FontAwesomeIcon icon={skillIcons[skill.icon] || faStar} />
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Talent Rewards
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {talents.map(talent => (
                <button
                  key={talent.id}
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    background: newMission.reward.talents.includes(talent.id) ? '#10b981' : '#e5e7eb',
                    color: newMission.reward.talents.includes(talent.id) ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => toggleMissionTalentSelection(talent.id)}
                >
                  <FontAwesomeIcon icon={faMagicWandSparkles} />
                  {talent.name}
                </button>
              ))}
            </div>
            {talents.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                No talents available. Create talents first in the Stats & Skills tab.
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Stat Rewards
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {Object.keys(statsConfig).map(stat => (
                <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', width: '60px' }}>
                    {stat}:
                  </span>
                  <input
                    style={{ ...inputStyle, marginBottom: 0, padding: '0.5rem', fontSize: '0.9rem', flex: 1 }}
                    type="number"
                    min="0"
                    value={newMission.reward.stats[stat] || 0}
                    onChange={(e) => setNewMission({
                      ...newMission,
                      reward: {
                        ...newMission.reward,
                        stats: {
                          ...newMission.reward.stats,
                          [stat]: parseInt(e.target.value) || 0
                        }
                      }
                    })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button style={secondaryButtonStyle} onClick={() => setShowMissionForm(false)}>
              Cancel
            </button>
            <button style={buttonStyle} onClick={handleAddMission}>
              Create Mission
            </button>
          </div>
        </div>
      )}

      {/* Mission type sections */}
      {['daily', 'weekly', 'monthly', 'special'].map(missionType => {
        const typeMissions = missions.filter(m => m.type === missionType && !m.completed);
        const typeLabel = missionType.charAt(0).toUpperCase() + missionType.slice(1);
        
        return (
          <div key={missionType} style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: '1rem',
              padding: '0.5rem 0',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <FontAwesomeIcon 
                icon={missionType === 'daily' ? faCalendarDay : missionType === 'weekly' ? faCalendarWeek : missionType === 'monthly' ? faCalendarAlt : faStar} 
                style={{ color: missionType === 'daily' ? '#10b981' : missionType === 'weekly' ? '#3b82f6' : missionType === 'monthly' ? '#8b5cf6' : '#f59e0b' }} 
              />
              <h3 style={{ margin: 0, color: '#2d3748' }}>{typeLabel} Missions</h3>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: missionType === 'daily' ? '#d1fae5' : missionType === 'weekly' ? '#dbeafe' : missionType === 'monthly' ? '#e0e7ff' : '#fef3c7',
                color: missionType === 'daily' ? '#065f46' : (missionType === 'weekly' ? '#1e40af' : (missionType === 'monthly' ? '#3730a3' : '#92400e')),
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {typeMissions.length} active
              </span>
            </div>
            
            {typeMissions.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {typeMissions.map(mission => (
                  <div key={mission.id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, color: '#2d3748' }}>{mission.title}</h4>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            background: missionType === 'daily' ? '#d1fae5' : missionType === 'weekly' ? '#dbeafe' : missionType === 'monthly' ? '#e0e7ff' : '#fef3c7',
                            color: missionType === 'daily' ? '#065f46' : missionType === 'weekly' ? '#1e40af' : missionType === 'monthly' ? '#3730a3' : '#92400e',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}>
                            {mission.type}
                          </span>
                        </div>
                        <p style={{ margin: 0, color: '#64748b' }}>{mission.description}</p>
                        
                        {mission.requiredSkills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {mission.requiredSkills.map(skillId => {
                              const skill = availableSkills.find(s => s.id === skillId);
                              return skill ? (
                                <span key={skillId} style={{
                                  padding: '0.25rem 0.5rem',
                                  background: '#e0e7ff',
                                  color: '#4f46e5',
                                  borderRadius: '12px',
                                  fontSize: '0.7rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <FontAwesomeIcon icon={skillIcons[skill.icon] || faStar} />
                                  {skill.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}

                        {mission.reward.talents.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {mission.reward.talents.map(talentId => {
                              const talent = talents.find(t => t.id === talentId);
                              return talent ? (
                                <span key={talentId} style={{
                                  padding: '0.25rem 0.5rem',
                                  background: '#d1fae5',
                                  color: '#065f46',
                                  borderRadius: '12px',
                                  fontSize: '0.7rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <FontAwesomeIcon icon={faMagicWandSparkles} />
                                  {talent.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          style={{ ...buttonStyle, padding: '0.5rem 1rem', marginRight: 0 }}
                          onClick={() => handleCompleteMission(mission.id)}
                        >
                          Complete
                        </button>
                        <button
                          style={{ ...dangerButtonStyle, padding: '0.5rem 1rem', marginRight: 0 }}
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
                      color: '#64748b',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <span>Reward: {mission.reward.xp} XP</span>
                      {mission.deadline && (
                        <span>Due: {new Date(mission.deadline).toLocaleDateString()}</span>
                      )}
                      {mission.type !== 'special' && (
                        <span style={{ 
                          color: missionType === 'daily' ? '#10b981' : missionType === 'weekly' ? '#3b82f6' : '#8b5cf6',
                          fontWeight: 'bold'
                        }}>
                          Auto-regenerates after deadline
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ ...cardStyle, textAlign: 'center', color: '#64748b' }}>
                <FontAwesomeIcon 
                  icon={missionType === 'daily' ? faCalendarDay : missionType === 'weekly' ? faCalendarWeek : missionType === 'monthly' ? faCalendarAlt : faStar} 
                  style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} 
                />
                <p>No active {missionType} missions. {missionType !== 'special' && 'Completed missions will regenerate automatically after their deadline.'}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStats = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#2d3748', margin: 0 }}>Character Development</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={buttonStyle} onClick={() => setShowSkillForm(true)}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
            New Skill
          </button>
          <button style={successButtonStyle} onClick={() => setShowTalentForm(true)}>
            <FontAwesomeIcon icon={faMagicWandSparkles} style={{ marginRight: '0.5rem' }} />
            New Talent
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Player Class</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Select Class
            </label>
            <select
              style={inputStyle}
              value={playerClass}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              {Object.keys(playerClasses).map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Character Description
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
              value={playerDescription}
              onChange={(e) => setPlayerDescription(e.target.value)}
              placeholder="Describe your character..."
            />
          </div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Class Bonuses</h4>
            {Object.entries(playerClasses[playerClass].stats).map(([stat, value]) => (
              <div key={stat} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ textTransform: 'capitalize' }}>{stat}:</span>
                <span style={{ fontWeight: 'bold' }}>+{value}</span>
              </div>
            ))}
          </div>
        </div>

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
                color: 'white',
                flexShrink: 0
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
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon 
                      icon={skillIcons[skill.icon] || faStar} 
                      style={{ color: '#4f46e5' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{skill.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {skill.description}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {skill.category} • Level {skill.level}/{skill.maxLevel}
                      </div>
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

      {/* Talent Trees */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: '#2d3748', margin: 0 }}>Talent Trees</h3>
          <button style={successButtonStyle} onClick={() => setShowTalentForm(true)}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
            New Talent
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {Object.entries(talentTrees).map(([treeKey, treeName]) => {
            const treeTalents = talents.filter(t => t.tree === treeKey);
            return treeTalents.length > 0 ? (
              <div key={treeKey} style={cardStyle}>
                <h4 style={{ marginBottom: '1rem', color: '#4f46e5' }}>{treeName}</h4>
                {treeTalents.map(talent => (
                  <div key={talent.id} style={{
                    padding: '0.75rem',
                    background: talent.unlocked ? '#d1fae5' : '#f8fafc',
                    border: `2px solid ${talent.unlocked ? '#10b981' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>{talent.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{talent.description}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Level {talent.requiredLevel}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
                            Cost: {talent.cost} points
                          </div>
                        </div>
                        <button
                          style={{ ...dangerButtonStyle, padding: '0.25rem 0.5rem', fontSize: '0.7rem', marginRight: 0 }}
                          onClick={() => handleDeleteTalent(talent.id)}
                          title="Delete talent"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    {!talent.unlocked && userData.level >= talent.requiredLevel && (
                      <button
                        style={{ ...successButtonStyle, padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        onClick={() => handleUnlockTalent(talent.id)}
                      >
                        Unlock Talent
                      </button>
                    )}
                    {talent.unlocked && (
                      <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>
                        ✓ Unlocked
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#2d3748', margin: 0 }}>Achievements & Titles</h2>
        <button style={buttonStyle} onClick={() => setShowTitleForm(true)}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
          Add Custom Title
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Your Achievements</h3>
          {currentAchievements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentAchievements.map(achievement => (
                <div key={achievement.id} style={{
                  padding: '1rem',
                  background: '#f0f9ff',
                  border: '2px solid #0ea5e9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <FontAwesomeIcon icon={faTrophy} style={{ color: '#f59e0b', fontSize: '1.5rem' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: '#0ea5e9' }}>{achievement.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{achievement.description}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
              <p>No achievements yet. Complete quests and missions to earn achievements!</p>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Available Titles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {titles.map(title => {
              const isUnlocked = currentAchievements.find(a => a.title?.id === title.id);
              return (
                <div key={title.id} style={{
                  padding: '1rem',
                  background: isUnlocked ? '#f0fdf4' : '#f8fafc',
                  border: `2px solid ${isUnlocked ? '#10b981' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <FontAwesomeIcon 
                    icon={faCrown} 
                    style={{ 
                      color: isUnlocked ? '#f59e0b' : '#94a3b8',
                      fontSize: '1.5rem'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: isUnlocked ? '#059669' : '#64748b' 
                    }}>
                      {title.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{title.description}</div>
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: title.type === 'auto' ? '#f59e0b' : '#8b5cf6',
                      fontWeight: 'bold'
                    }}>
                      {title.type === 'auto' ? 'Auto-generated' : 'Custom'}
                    </div>
                    {!isUnlocked && title.type === 'auto' && (
                      <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>
                        Requirements: {Object.entries(title.requirements).map(([key, value]) => 
                          `${key}: ${value}`
                        ).join(', ')}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isUnlocked && (
                      <div style={{
                        padding: '0.25rem 0.5rem',
                        background: '#10b981',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        UNLOCKED
                      </div>
                    )}
                    <button
                      style={{ ...dangerButtonStyle, padding: '0.25rem 0.5rem', fontSize: '0.7rem', marginRight: 0 }}
                      onClick={() => handleDeleteTitle(title.id)}
                      title="Delete title"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Skill Creation Form
  const renderSkillForm = () => (
    <div style={formStyle}>
      <h3 style={{ marginBottom: '1rem' }}>Create New Skill</h3>
      <input
        style={inputStyle}
        type="text"
        placeholder="Skill Name"
        value={newSkill.name}
        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
      />
      <textarea
        style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
        placeholder="Skill Description"
        value={newSkill.description}
        onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Category
          </label>
          <select
            style={inputStyle}
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
          >
            <option value="combat">Combat</option>
            <option value="magic">Magic</option>
            <option value="crafting">Crafting</option>
            <option value="stealth">Stealth</option>
            <option value="general">General</option>
            <option value="mental">Mental</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Max Level
          </label>
          <input
            style={inputStyle}
            type="number"
            min="1"
            max="100"
            value={newSkill.maxLevel}
            onChange={(e) => setNewSkill({ ...newSkill, maxLevel: parseInt(e.target.value) })}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Icon
          </label>
          <select
            style={inputStyle}
            value={newSkill.icon}
            onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
          >
            {Object.keys(skillIcons).map(iconKey => (
              <option key={iconKey} value={iconKey}>{iconKey}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button style={secondaryButtonStyle} onClick={() => setShowSkillForm(false)}>
          Cancel
        </button>
        <button style={buttonStyle} onClick={handleAddSkill}>
          Create Skill
        </button>
      </div>
    </div>
  );

  // Talent Creation Form
  const renderTalentForm = () => (
    <div style={formStyle}>
      <h3 style={{ marginBottom: '1rem' }}>Create New Talent</h3>
      <input
        style={inputStyle}
        type="text"
        placeholder="Talent Name"
        value={newTalent.name}
        onChange={(e) => setNewTalent({ ...newTalent, name: e.target.value })}
      />
      <textarea
        style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
        placeholder="Talent Description"
        value={newTalent.description}
        onChange={(e) => setNewTalent({ ...newTalent, description: e.target.value })}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Talent Tree
          </label>
          <select
            style={inputStyle}
            value={newTalent.tree}
            onChange={(e) => setNewTalent({ ...newTalent, tree: e.target.value })}
          >
            {Object.entries(talentTrees).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Required Level
          </label>
          <input
            style={inputStyle}
            type="number"
            min="1"
            value={newTalent.requiredLevel}
            onChange={(e) => setNewTalent({ ...newTalent, requiredLevel: parseInt(e.target.value) })}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Talent Cost
          </label>
          <input
            style={inputStyle}
            type="number"
            min="1"
            value={newTalent.cost}
            onChange={(e) => setNewTalent({ ...newTalent, cost: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Stat Effects
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
          {Object.keys(statsConfig).map(stat => (
            <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'capitalize', width: '60px' }}>
                {stat}:
              </span>
              <input
                style={{ ...inputStyle, marginBottom: 0, padding: '0.5rem', fontSize: '0.9rem', flex: 1 }}
                type="number"
                value={newTalent.effects[stat] || 0}
                onChange={(e) => setNewTalent({
                  ...newTalent,
                  effects: {
                    ...newTalent.effects,
                    [stat]: parseInt(e.target.value) || 0
                  }
                })}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button style={secondaryButtonStyle} onClick={() => setShowTalentForm(false)}>
          Cancel
        </button>
        <button style={successButtonStyle} onClick={handleAddTalent}>
          Create Talent
        </button>
      </div>
    </div>
  );

  // Title Creation Form
  const renderTitleForm = () => (
    <div style={formStyle}>
      <h3 style={{ marginBottom: '1rem' }}>Create Custom Title</h3>
      <input
        style={inputStyle}
        type="text"
        placeholder="Title Name"
        value={newTitle.name}
        onChange={(e) => setNewTitle({ ...newTitle, name: e.target.value })}
      />
      <textarea
        style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
        placeholder="Title Description"
        value={newTitle.description}
        onChange={(e) => setNewTitle({ ...newTitle, description: e.target.value })}
      />
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Title Type
        </label>
        <select
          style={inputStyle}
          value={newTitle.type}
          onChange={(e) => setNewTitle({ ...newTitle, type: e.target.value })}
        >
          <option value="custom">Custom</option>
          <option value="auto">Auto-generated</option>
        </select>
      </div>

      {newTitle.type === 'auto' && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Unlock Requirements
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                Quests Completed
              </label>
              <input
                style={inputStyle}
                type="number"
                min="0"
                value={newTitle.requirements.questsCompleted || 0}
                onChange={(e) => setNewTitle({
                  ...newTitle,
                  requirements: {
                    ...newTitle.requirements,
                    questsCompleted: parseInt(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                Missions Completed
              </label>
              <input
                style={inputStyle}
                type="number"
                min="0"
                value={newTitle.requirements.missionsCompleted || 0}
                onChange={(e) => setNewTitle({
                  ...newTitle,
                  requirements: {
                    ...newTitle.requirements,
                    missionsCompleted: parseInt(e.target.value) || 0
                  }
                })}
              />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button style={secondaryButtonStyle} onClick={() => setShowTitleForm(false)}>
          Cancel
        </button>
        <button style={buttonStyle} onClick={handleAddTitle}>
          Create Title
        </button>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Adventure System</h1>
        <p style={{ color: '#64748b' }}>
          Embark on quests, complete missions, and grow your character!
        </p>
      </div>

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
        <button
          style={tabStyle(activeTab === 'achievements')}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
      </div>

      {showSkillForm && renderSkillForm()}
      {showTalentForm && renderTalentForm()}
      {showTitleForm && renderTitleForm()}

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'quests' && renderQuests()}
      {activeTab === 'missions' && renderMissions()}
      {activeTab === 'stats' && renderStats()}
      {activeTab === 'achievements' && renderAchievements()}
    </div>
  );
};

export default LevelingSystem;