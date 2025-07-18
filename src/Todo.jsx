import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import Card3 from './Card3';
import Card2 from './Card2';
import Button from './Button/button';
import Confetti from 'react-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faFire, faStar, faMedal, faTrophy, faGem } from "@fortawesome/free-solid-svg-icons";

function ToDo() {
  const [task, setTask] = useState([]);
  const [newtask, setNewtask] = useState("");
  const [time, setTime] = useState(new Date());
  const [ind, setInd] = useState(0);
  const [show, setShow] = useState(-1);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [cato, setCato] = useState([]);
  const [fetcho, setFetcho] = useState('Todo');
  const [matcho, setMatcho] = useState('');
  const [isDailyTask, setIsDailyTask] = useState(false);
  const [categoryAddVisible, setCategoryAddVisible] = useState(false);
  const input = useRef(null);

  // Gamification state
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReward, setShowReward] = useState(null);
  const [todaysGoal, setTodaysGoal] = useState(3);
  const [completedToday, setCompletedToday] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem(fetcho);
    const storedCategories = localStorage.getItem('data');
    
    if (storedCategories) {
      setCato(JSON.parse(storedCategories));
    }

    if (storedData) {
      setTask(JSON.parse(storedData));
    } else {
      fetch('/data.json')
        .then((response) => response.json())
        .then((task) => {
          localStorage.setItem(fetcho, JSON.stringify(task));
          setTask(task);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [fetcho]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkForNewDay = () => {
      const now = new Date();
      const today = now.toDateString();
      const userData = JSON.parse(localStorage.getItem('userData')) || {};

      if (!userData.lastReset || userData.lastReset !== today) {
        const resetData = {
          completedToday: 0,
          lastReset: today
        };

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (userData.lastCompletedDate === yesterday.toDateString() && 
            userData.lastCompletedDate !== today) {
          const newStreak = (userData.streak || 0) + 1;
          resetData.streak = newStreak;
          
          if (newStreak % 3 === 0) {
            const bonus = Math.floor(newStreak / 3) * 50;
            resetData.xp = (userData.xp || 0) + bonus;
            showTemporaryReward(`Streak Bonus! +${bonus} XP`, 'fire');
          }
        } else if (userData.lastCompletedDate !== today) {
          resetData.streak = 0;
        }

        saveUserData(resetData);
      }
    };

    checkForNewDay();
  }, []);

  // Modified addItem with XP rewards
  const addItem = (newItem) => {
    const updatedData = [...task, newItem];
    setTask(updatedData);
    localStorage.setItem(fetcho, JSON.stringify(updatedData));

    if (!cato.includes(fetcho)) {
      const updatedCat = [...cato, fetcho];
      setCato(updatedCat);
      localStorage.setItem('data', JSON.stringify(updatedCat));
      addXp(50);
      showTemporaryReward('New Category! +50 XP', 'star');
    }
  };

  // Modified handleChecked function for Card component
  const handleChecked = (index, isChecked) => {
    const updatetask = [...task];
    const taskItem = updatetask[index];
    const wasCompleted = taskItem.status;
    taskItem.status = isChecked;
    
    if (isChecked && !wasCompleted) {
      const today = new Date().toDateString();
      let newCompleted = completedToday + 1;
      
      // Always mark as complete and set completion time
      taskItem.completionTime = new Date().toISOString();
      
      // Only reward XP if we haven't reached today's goal
      alert(newCompleted+" "+todaysGoal);
      if (newCompleted < todaysGoal) {
        let xpEarned = 50;
        
        if (taskItem.deadline) {
          const deadline = new Date(taskItem.deadline);
          const now = new Date();
          
          if (now < deadline) {
            const earlyFactor = (deadline - now) / (1000 * 60 * 60);
            xpEarned += Math.min(100, Math.floor(earlyFactor * 5));
          }
        }
        
        if (taskItem.isDaily) {
          xpEarned += 25;
        }
        
        if (streak > 0) {
          xpEarned = Math.floor(xpEarned * (1 + streak * 0.1));
        }
        
        addXp(xpEarned);
        showTemporaryReward(`Task Complete! +${xpEarned} XP`, 'star');
      } else {
        showTemporaryReward('Daily goal reached!', 'info');
      }
      
      // Update completed count and check streak
      setCompletedToday(newCompleted);
      
      // Check if we reached daily goal for the first time today
      if (newCompleted >= todaysGoal && lastCompletedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const newStreak = lastCompletedDate === yesterday.toDateString() 
          ? streak + 1 
          : 1; // Reset to 1 if streak was broken

        alert(streak+" "+newStreak+" "+lastCompletedDate+ " "+yesterday.toDateString());
        
        setStreak(newStreak);
        setLastCompletedDate(today);
        
        saveUserData({
          streak: newStreak,
          lastCompletedDate: today,
          completedToday: newCompleted
        });
        
        // Award streak bonus every 3 days
        if (newStreak % 3 === 0) {
          const bonus = Math.floor(newStreak / 3) * 50;
          addXp(bonus);
          showTemporaryReward(`Streak Bonus! +${bonus} XP`, 'fire');
        }
        
        showTemporaryReward(`New ${newStreak}-day streak!`, 'fire');
      } else {
        saveUserData({ completedToday: newCompleted });
      }
      
      // Check for random bonus
      if (Math.random() < 0.1) {
        const surpriseXp = Math.floor(Math.random() * 50) + 25;
        addXp(surpriseXp);
        showTemporaryReward(`Surprise Reward! +${surpriseXp} XP`, 'gem');
      }
    } else if (!isChecked && wasCompleted) {
      // Deduct double XP when unchecking
      const xpDeduction = 20;
      setXp(prev => Math.max(0, prev - xpDeduction));
      showTemporaryReward(`Task Unchecked! -${xpDeduction} XP`, 'warning');
      
      // Decrement completed today if it was counted and we haven't exceeded goal
      if (taskItem.completionTime) {
        const completionDate = new Date(taskItem.completionTime).toDateString();
        const today = new Date().toDateString();
        
        if (completionDate === today && completedToday > 0) {
          const newCompleted = Math.min(completedToday - 1, todaysGoal);
          setCompletedToday(newCompleted);
          saveUserData({ completedToday: newCompleted });
        }
      }
      
      taskItem.completionTime = null;
    }
    
    setTask(updatetask);
    localStorage.setItem(fetcho, JSON.stringify(updatetask));
  };

  const updateTask = () => {
    const storedData = localStorage.getItem(fetcho);
    if (storedData) {
      setTask(JSON.parse(storedData));
    } else {
      setTask([]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newtask.trim() !== "") {
      const deadlineValue = input.current ? input.current.value : null;
      addItem({
        name: newtask,
        para: time.toDateString(),
        time: time.toLocaleTimeString(),
        deadline: deadlineValue,
        status: false,
        isDaily: isDailyTask, // Add this line
      });
      setNewtask("");
      setIsDailyTask(false); // Reset the daily task checkbox
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem(matcho);
    if (matcho=="") {
      alert("Enter a category");
    }
    else if (storedData) {
      alert("Category already exists");
    }
    else{
      const updatedCat = [...cato, matcho];
      setCato(updatedCat);
      setFetcho(matcho);
      localStorage.setItem('data', JSON.stringify(updatedCat));
      localStorage.setItem(matcho,JSON.stringify([]));
      setTask([]);
      setCategoryAddVisible(false);
    }
  };

  const handleDeleteCategory = (category) => {
    if (category === 'Todo') {
      alert("Cannot delete default category");
      return;
    }
    const updatedCat = cato.filter(cat => cat !== category);
    setCato(updatedCat);
    localStorage.setItem('data', JSON.stringify(updatedCat));
    localStorage.removeItem(category);
    if (fetcho === category) {
      setFetcho('Todo');
      const todoData = localStorage.getItem('Todo');
      setTask(todoData ? JSON.parse(todoData) : []);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      xp: 0,
      level: 1,
      streak: 0,
      lastCompletedDate: '',
      achievements: [],
      todaysGoal: 3,
      completedToday: 0
    };
    
    setXp(userData.xp);
    setLevel(userData.level || 1);
    setStreak(userData.streak || 0);
    setLastCompletedDate(userData.lastCompletedDate);
    setAchievements(userData.achievements || []);
    setTodaysGoal(userData.todaysGoal || 2);
    setCompletedToday(userData.completedToday);

    checkStreak();
  }, []);

  // Check and update streak
  const checkStreak = () => {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastCompletedDate === today) return;
    
    if (lastCompletedDate === yesterday.toDateString()) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      checkStreakAchievements(newStreak);
      saveUserData({ streak: newStreak, lastCompletedDate: today });
      
      if (newStreak % 3 === 0) {
        const reward = Math.floor(newStreak / 3) * 50;
        addXp(reward);
        showTemporaryReward(`Streak Bonus! +${reward} XP`, 'fire');
      }
    } else if (lastCompletedDate !== today && streak > 0) {
      setStreak(0);
      saveUserData({ streak: 0 });
      showTemporaryReward('Streak Broken!', 'sad');
    }
  };

  // Check for achievements based on streak
  const checkStreakAchievements = (currentStreak) => {
    const newAchievements = [];
    const unlockedAchievements = [];
    
    if (currentStreak >= 3 && !achievements.includes('3-day Streak')) {
      newAchievements.push('3-day Streak');
      unlockedAchievements.push('3-day Streak');
    }
    if (currentStreak >= 7 && !achievements.includes('7-day Streak')) {
      newAchievements.push('7-day Streak');
      unlockedAchievements.push('7-day Streak');
    }
    if (currentStreak >= 30 && !achievements.includes('Monthly Streak')) {
      newAchievements.push('Monthly Streak');
      unlockedAchievements.push('Monthly Streak');
    }
    
    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements];
      setAchievements(updatedAchievements);
      saveUserData({ achievements: updatedAchievements });
      
      unlockedAchievements.forEach(ach => {
        showTemporaryReward(`Achievement: ${ach}`, 'trophy');
        addXp(100 * (ach === 'Monthly Streak' ? 5 : ach === '7-day Streak' ? 3 : 1));
      });
    }
  };

  const addXp = (amount) => {
    // Only allow XP gain if we haven't reached today's goal
    // Or if it's a streak/achievement bonus (which we'll track separately)
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const todayCompleted = userData.completedToday || 0;
    const todaysGoal = userData.todaysGoal || 3;
    
    if (todayCompleted < todaysGoal || amount > 100) { // Large amounts are probably bonuses
      let newXp = xp + amount;
      let newLevel = level;
      let xpNeeded = newLevel * 1000;
      let leveledUp = false;

      if (newXp >= xpNeeded) {
        newLevel += 1;
        newXp -= xpNeeded;
        leveledUp = true;
      }

      setXp(newXp);
      setLevel(newLevel);

      if (leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
        checkLevelAchievements(newLevel);
        showTemporaryReward(`Level Up! ${newLevel}`, 'medal');
      }

      saveUserData({ 
        xp: newXp,
        level: newLevel,
        ...(leveledUp && { level: newLevel })
      });
    }
  };

  // Check for level-based achievements
  const checkLevelAchievements = (currentLevel) => {
    const newAchievements = [];
    const unlockedAchievements = [];
    
    if (currentLevel >= 5 && !achievements.includes('Level 5')) {
      newAchievements.push('Level 5');
      unlockedAchievements.push('Level 5');
    }
    if (currentLevel >= 10 && !achievements.includes('Level 10')) {
      newAchievements.push('Level 10');
      unlockedAchievements.push('Level 10');
    }
    if (currentLevel >= 20 && !achievements.includes('Level 20')) {
      newAchievements.push('Level 20');
      unlockedAchievements.push('Level 20');
    }
    
    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements];
      setAchievements(updatedAchievements);
      saveUserData({ achievements: updatedAchievements });
      
      unlockedAchievements.forEach(ach => {
        showTemporaryReward(`Achievement: ${ach}`, 'trophy');
      });
    }
  };

  // Show temporary reward message
  const showTemporaryReward = (message, icon) => {
    setShowReward({ message, icon });
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    setTimeout(() => {
      setShowReward(null);
    }, 5000);
  };

  // Save user data to localStorage
  const saveUserData = (updates) => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const updatedData = { ...userData, ...updates };
    localStorage.setItem('userData', JSON.stringify(updatedData));
  };

  // Progress bar style
  const progressBarStyle = {
    height: '10px',
    borderRadius: '5px',
    backgroundColor: '#e0e0e0',
    margin: '10px 0',
    overflow: 'hidden'
  };

  const progressFillStyle = {
    height: '100%',
    borderRadius: '5px',
    backgroundColor: '#4f46e5',
    width: `${(xp / (level * 1000)) * 100}%`,
    transition: 'width 0.3s ease'
  };

  const userProgressStyle = {
    position: 'absolute',
    bottom: '10px',
    left: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
    fontSize: '14px'
  };

  const streakStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: streak > 0 ? '#fbbf24' : 'white'
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobileView ? 'column' : 'row',
    gap: '24px',
    width: isMobileView ? '90%' : '90%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isMobileView ? '16px' : '24px',
    backgroundColor: '#f5f7fa',
    minHeight: 'calc(100vh - 80px)',
    marginLeft: isMobileView? '-3px' : '52px',
  };

  const inputContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    marginBottom: '24px',
    width: isMobileView ? '88%' : '100%'
  };

  const taskListStyle = {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    width: isMobileView ? '89%' : '100%',
    maxHeight: isMobileView ? 'auto' : 'calc(100vh - 180px)',
    overflowY: 'auto',
    marginLeft: isMobileView? '0px' : '50px',
    marginTop: isMobileView? '-30px' : '0px'
  };

  const detailPaneStyle = {
    width: isMobileView ? '100%' : '380px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    height: isMobileView ? 'auto' : 'fit-content',
    position: isMobileView ? 'static' : 'sticky',
    top: '100px'
  };

  const dialogStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };

  const headerStyle = {
    backgroundColor: '#4f46e5',
    padding: '16px 24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const enhancedHeaderStyle = {
    ...headerStyle,
    position: 'relative',
    paddingBottom: '40px'
  };

  const timeStyle = {
    fontSize: '14px',
    fontWeight: 'normal',
    opacity: 0.9
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    '&:focus': {
      borderColor: '#4f46e5',
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)'
    }
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#4338ca'
    }
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '1em'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      {/* Level Up Modal */}
      {showLevelUp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <div>LEVEL UP!</div>
            <div style={{ fontSize: '3rem' }}>{level}</div>
          </div>
        </div>
      )}
      
      {/* Reward Notification */}
      {showReward && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 100,
          animation: 'slideIn 0.5s ease-out'
        }}>
          <FontAwesomeIcon 
            icon={
              showReward.icon === 'trophy' ? faTrophy :
              showReward.icon === 'fire' ? faFire :
              showReward.icon === 'star' ? faStar :
              showReward.icon === 'medal' ? faMedal :
              showReward.icon === 'gem' ? faGem : faStar
            } 
            style={{ fontSize: '20px' }}
          />
          <span>{showReward.message}</span>
        </div>
      )}
      {/* Header */}
      <div style={enhancedHeaderStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>TuDu</h1>
          <span style={{ 
            backgroundColor: '#4338ca',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '0.8rem'
          }}>
            Lvl {level}
          </span>
        </div>
        <div style={timeStyle}>
          {time.toLocaleDateString()} | {time.toLocaleTimeString()}
        </div>
        
        {/* User Progress Bar */}
        <div style={userProgressStyle}>
          <span>Progress</span>
          
          <div style={{ flex: 1, margin: '0 10px' }}>
            <div style={progressBarStyle}>
              <div style={progressFillStyle}></div>
            </div>
          </div>
          
          <span>{xp}/{level * 1000} XP</span>
          
          <div style={streakStyle}>
            <FontAwesomeIcon icon={faFire} />
            <span>{streak}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={containerStyle}>
        {/* Left Column - Inputs and Details */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          width: isMobileView ? '100%' : '40%',
          maxWidth: '500px'
        }}>
          {/* Task Input Section */}
          <div style={inputContainerStyle}>
            <h2 style={{ 
              marginBottom: '16px', 
              fontSize: '1.25rem', 
              color: '#2d3748',
              fontWeight: '600'
            }}>Add New Task</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <input
                style={inputStyle}
                type="text"
                value={newtask}
                placeholder="Enter task name"
                onChange={(e) => setNewtask(e.target.value)}
                required
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="dailyTask"
                  checked={isDailyTask}
                  onChange={(e) => setIsDailyTask(e.target.checked)}
                />
                <label htmlFor="dailyTask">Daily Task (no deadline)</label>
              </div>
              {!isDailyTask && (
                <input
                  style={inputStyle}
                  type="datetime-local"
                  ref={input}
                  required={!isDailyTask}
                />
              )}
              <button
                style={buttonStyle}
                type="submit"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Category Section */}
          <div style={{ ...inputContainerStyle, marginTop: '-30px' }}>
            <h2 style={{ 
              marginBottom: '16px', 
              fontSize: '1.25rem', 
              color: '#2d3748',
              fontWeight: '600'
            }}>Manage Categories</h2>
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select
                  style={{ ...selectStyle, flex: 1 }}
                  value={fetcho}
                  onChange={(e) => {
                    setFetcho(e.target.value);
                    updateTask(e.target.value);
                  }}
                >
                  <option value="" disabled>Select a category</option>
                  {cato.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                <Button
                  icon={faTrash}
                  onClick={() => handleDeleteCategory(fetcho)}
                  color="#ef4444"
                  width="36px"
                  tooltip="Delete category"
                />
                <Button
                  icon={faPlus}
                  onClick={() => setCategoryAddVisible(!categoryAddVisible)}
                  color="#4f46e5"
                  width="36px"
                  tooltip="Add Category"
                />
              </div>
              {categoryAddVisible && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    style={inputStyle}
                    type="text"
                    value={matcho}
                    placeholder="Enter new category"
                    onChange={(e) => setMatcho(e.target.value)}
                  />
                  <button
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#10b981',
                      '&:hover': {
                        backgroundColor: '#0d9f6e'
                      }
                    }}
                    onClick={handleClick}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Task Details Section */}
          {!isMobileView && (
            <div style={{...detailPaneStyle, marginTop: '-30px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <button
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '30%',
                  }}
                  onClick={() => setShow(-1)}
                >
                  Close
                </button>
              </div>
              {show === 1 ? (
                <Card2 name={task[ind]?.name} para={task[ind]?.para} time={task[ind]?.time} index={ind} isMobileView={isMobileView} status={task[ind]?.status} isDaily={task[ind]?.isDaily} />
              ) : show === 0 ? (
                <Card3 task={task} settask={setTask} index={ind} isMobileView={isMobileView} fetcho={fetcho} />
              ) : (
                <div style={{ 
                  color: '#64748b', 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <p style={{ margin: 0 }}>Select a task to view details</p>
                </div>
              )}
              <div style={{ marginTop: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>Your Achievements</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {achievements.map((ach, i) => (
                    <div key={i} style={{
                      backgroundColor: '#e0e7ff',
                      color: '#4f46e5',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '12px' }} />
                      {ach}
                    </div>
                  ))}
                  {achievements.length === 0 && (
                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                      Complete tasks to unlock achievements!
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Today's Progress</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, backgroundColor: '#e5e7eb', borderRadius: '10px', height: '10px' }}>
                      <div style={{ 
                        width: `${(completedToday / todaysGoal) * 100}%`, 
                        backgroundColor: completedToday >= todaysGoal ? '#10b981' : '#4f46e5',
                        height: '100%',
                        borderRadius: '10px'
                      }}></div>
                    </div>
                    <span>{completedToday}/{todaysGoal} tasks</span>
                  </div>
                  {completedToday >= todaysGoal && (
                    <div style={{ color: '#10b981', marginTop: '5px', fontSize: '0.9rem' }}>
                      Daily goal completed! 🎉
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Task List */}
        <div style={taskListStyle}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            paddingBottom: '16px',
            zIndex: 10
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              color: '#2d3748',
              fontWeight: '600'
            }}>{fetcho} Tasks</h2>
            <div style={{ 
              color: '#64748b',
              fontSize: '14px'
            }}>
              {task.length} {task.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>
          
          {task.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '40px 20px',
              color: '#64748b',
              textAlign: 'center'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 style={{ margin: '16px 0 8px' }}>No tasks found</h3>
              <p style={{ margin: 0 }}>Add a new task to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {task
                .sort((a, b) => {
                  const now = new Date();
                  
                  // Check if tasks are overdue
                  const aDeadline = a.deadline ? new Date(a.deadline) : null;
                  const bDeadline = b.deadline ? new Date(b.deadline) : null;
                  const aIsOverdue = aDeadline && aDeadline < now && !a.status;
                  const bIsOverdue = bDeadline && bDeadline < now && !b.status;
                  
                  // Both overdue - sort by how overdue they are (most overdue first)
                  if (aIsOverdue && bIsOverdue) {
                    return aDeadline - bDeadline;
                  }
                  
                  // One overdue, one not - overdue comes first
                  if (aIsOverdue && !bIsOverdue) return -1;
                  if (!aIsOverdue && bIsOverdue) return 1;
                  
                  // Both not completed and not overdue
                  if (!a.status && !b.status) {
                    // Sort by deadline (soonest first)
                    if (aDeadline && bDeadline) {
                      return aDeadline - bDeadline;
                    }
                    // Tasks with deadlines come first
                    if (aDeadline && !bDeadline) return -1;
                    if (!aDeadline && bDeadline) return 1;
                    return 0;
                  }
                  
                  // One completed, one not - not completed comes first
                  if (!a.status && b.status) return -1;
                  if (a.status && !b.status) return 1;
                  
                  // Both completed - sort by completion time (newest first)
                  return new Date(b.completionTime || 0) - new Date(a.completionTime || 0);
                })
                .map((item, index) => (
                  <Card
                    key={index}
                    name={item.name}
                    para={item.para}
                    time={item.time}
                    index={index}
                    settask={setTask}
                    tasks={task}
                    ded={item.deadline}
                    setInd={setInd}
                    setShow={setShow}
                    status={item.status}
                    isMobileView={isMobileView}
                    fetcho={fetcho}
                    onCheck={handleChecked}
                    streak={streak}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Mobile Dialog */}
        {isMobileView && show !== -1 && (
          <div style={dialogStyle}>
            <div style={{ 
              backgroundColor: '#ffffff', 
              color: '#000', 
              padding: '24px', 
              borderRadius: '12px', 
              width: '100%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              {show === 1 ? (
                <Card2 name={task[ind]?.name} para={task[ind]?.para} time={task[ind]?.time} index={ind} isMobileView={isMobileView} status={task[ind]?.status} isDaily={task[ind]?.isDaily} />
              ) : show === 0 ? (
                <Card3 task={task} settask={setTask} index={ind} isMobileView={isMobileView} fetcho={fetcho} />
              ) : (
                <div>No Task Selected</div>
              )}
              <button
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  '&:hover': {
                    backgroundColor: '#4338ca'
                  }
                }}
                onClick={() => setShow(-1)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDo;