import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGripVertical,
  faCheckCircle,
  faCircle,
  faPlus,
  faTrash,
  faEdit,
  faChevronLeft,
  faChevronRight,
  faCalendar,
  faClock,
  faFlag,
  faCalendarDay,
  faSync,
  faTags,
  faSearch,
  faTimes,
  faCalendarWeek,
  faThLarge,
  faListUl,
  faPalette,
  faRedo,
  faMagic,
  faCheck,
  faEllipsisV,
  faStar,
  faArrowRight,
  faMoon,
  faSun,
} from '@fortawesome/free-solid-svg-icons';

// ─── Default categories ───────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { id: 'cat-work', name: 'Work', color: '#6366f1' },
  { id: 'cat-personal', name: 'Personal', color: '#a855f7' },
  { id: 'cat-health', name: 'Health', color: '#10b981' },
  { id: 'cat-study', name: 'Study', color: '#f59e0b' },
];

// ─── Color presets for category picker ────────────────────────
const COLOR_PRESETS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#78716c', '#64748b', '#475569',
];

// ─── Priority helper ──────────────────────────────────────────
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Urgent': return '#ef4444';
    case 'High': return '#f59e0b';
    case 'Medium': return '#6366f1';
    case 'Low': return '#10b981';
    default: return '#64748b';
  }
};

const getPriorityDot = (priority, size = 8) => (
  <div style={{
    width: `${size}px`, height: `${size}px`,
    borderRadius: '50%',
    background: getPriorityColor(priority),
    boxShadow: `0 0 ${size}px ${getPriorityColor(priority)}60`,
    flexShrink: 0,
  }} />
);

// ─── Time helpers ─────────────────────────────────────────────
const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const formatTime12 = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ─── Theme generator ─────────────────────────────────────────
const makeTheme = (isDark) => {
  if (isDark) {
    return {
      isDark: true,
      // Root
      rootBg: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16132e 100%)',
      textPrimary: '#e2e8f0',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      textHeading: '#f1f5f9',
      // Glass
      glassBg: 'rgba(255,255,255,0.04)',
      glassBorder: 'rgba(255,255,255,0.08)',
      glassHover: 'rgba(255,255,255,0.06)',
      // Input
      inputBg: 'rgba(255,255,255,0.06)',
      inputBorder: 'rgba(255,255,255,0.12)',
      inputColor: '#e2e8f0',
      // Buttons
      btnGhostBg: 'rgba(255,255,255,0.06)',
      btnGhostColor: '#94a3b8',
      btnGhostBorder: 'rgba(255,255,255,0.1)',
      // Modal
      modalOverlayBg: 'rgba(0,0,0,0.6)',
      modalBg: 'rgba(15,15,30,0.95)',
      // Cards / accents
      accent: '#6366f1',
      accentActive: 'rgba(99,102,241,0.3)',
      accentSoft: 'rgba(99,102,241,0.2)',
      accentSofter: 'rgba(99,102,241,0.1)',
      accentText: '#a5b4fc',
      // Timeline
      slotBorder: 'rgba(255,255,255,0.03)',
      slotBg: 'rgba(255,255,255,0.01)',
      timeLabelBg: 'rgba(255,255,255,0.02)',
      timeLabelBorder: 'rgba(255,255,255,0.04)',
      dayHeaderBg: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)',
      dayColBorder: 'rgba(255,255,255,0.06)',
      workHourBg: 'rgba(255,255,255,0.008)',
      // Drop
      dropBorder: 'rgba(255,255,255,0.1)',
      // Select option
      selectOptionBg: '#1e1b4b',
      // Month sticky header bg
      stickyBg: 'rgba(15,15,30,0.95)',
      // Progress bar bg
      progressBg: 'rgba(255,255,255,0.08)',
      // Scroll
      scrollTrack: 'rgba(255,255,255,0.02)',
      scrollThumb: 'rgba(99,102,241,0.3)',
      // shadows
      cardShadow: '0 25px 60px rgba(0,0,0,0.5)',
      // Empty state
      emptyBorder: 'rgba(255,255,255,0.08)',
      emptyColor: '#475569',
    };
  }
  return {
    isDark: false,
    rootBg: 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%)',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    textHeading: '#0f172a',
    glassBg: 'rgba(255,255,255,0.7)',
    glassBorder: 'rgba(99,102,241,0.12)',
    glassHover: 'rgba(255,255,255,0.85)',
    inputBg: 'rgba(255,255,255,0.9)',
    inputBorder: 'rgba(99,102,241,0.2)',
    inputColor: '#1e293b',
    btnGhostBg: 'rgba(99,102,241,0.06)',
    btnGhostColor: '#475569',
    btnGhostBorder: 'rgba(99,102,241,0.15)',
    modalOverlayBg: 'rgba(0,0,0,0.3)',
    modalBg: 'rgba(255,255,255,0.97)',
    accent: '#6366f1',
    accentActive: 'rgba(99,102,241,0.2)',
    accentSoft: 'rgba(99,102,241,0.12)',
    accentSofter: 'rgba(99,102,241,0.06)',
    accentText: '#4f46e5',
    slotBorder: 'rgba(99,102,241,0.06)',
    slotBg: 'rgba(99,102,241,0.02)',
    timeLabelBg: 'rgba(99,102,241,0.04)',
    timeLabelBorder: 'rgba(99,102,241,0.08)',
    dayHeaderBg: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.08) 100%)',
    dayColBorder: 'rgba(99,102,241,0.1)',
    workHourBg: 'rgba(99,102,241,0.02)',
    dropBorder: 'rgba(99,102,241,0.15)',
    selectOptionBg: '#ffffff',
    stickyBg: 'rgba(245,245,255,0.97)',
    progressBg: 'rgba(99,102,241,0.1)',
    scrollTrack: 'rgba(99,102,241,0.04)',
    scrollThumb: 'rgba(99,102,241,0.25)',
    cardShadow: '0 15px 40px rgba(99,102,241,0.1)',
    emptyBorder: 'rgba(99,102,241,0.12)',
    emptyColor: '#94a3b8',
  };
};

// ─── Style factories (theme-aware) ────────────────────────────
const makeGlass = (t) => ({
  background: t.glassBg,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${t.glassBorder}`,
  borderRadius: '16px',
});

const makeGlassCard = (t) => ({
  ...makeGlass(t),
  padding: '1.25rem',
  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
});

const makeInputStyle = (t) => ({
  width: '100%',
  padding: '0.65rem 0.85rem',
  background: t.inputBg,
  border: `1px solid ${t.inputBorder}`,
  borderRadius: '10px',
  color: t.inputColor,
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
});

const makeLabelStyle = (t) => ({
  display: 'block',
  marginBottom: '0.4rem',
  fontWeight: '500',
  fontSize: '0.82rem',
  color: t.textSecondary,
  letterSpacing: '0.02em',
});

const btnPrimary = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
  color: 'white',
  border: 'none',
  padding: '0.65rem 1.25rem',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.85rem',
  transition: 'all 0.2s',
  boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
};

const makeBtnGhost = (t) => ({
  background: t.btnGhostBg,
  color: t.btnGhostColor,
  border: `1px solid ${t.btnGhostBorder}`,
  padding: '0.65rem 1.25rem',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.85rem',
  transition: 'all 0.2s',
});

const makeModalOverlay = (t) => ({
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: t.modalOverlayBg,
  backdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
  animation: 'resysFadeIn 0.25s ease',
});

const makeModalBox = (t) => ({
  ...makeGlass(t),
  background: t.modalBg,
  padding: '2rem',
  width: '92%',
  maxWidth: '560px',
  maxHeight: '88vh',
  overflowY: 'auto',
  boxShadow: t.cardShadow,
  animation: 'resysSlideUp 0.3s ease',
  color: t.textPrimary,
});

// Legacy aliases used in sub-components that don't receive theme yet
const glass = makeGlass(makeTheme(true));
const glassCard = makeGlassCard(makeTheme(true));
const inputStyle = makeInputStyle(makeTheme(true));
const labelStyle = makeLabelStyle(makeTheme(true));
const btnGhost = makeBtnGhost(makeTheme(true));
const modalOverlay = makeModalOverlay(makeTheme(true));
const modalBox = makeModalBox(makeTheme(true));

// ═══════════════════════════════════════════════════════════════
//  CATEGORY MANAGER MODAL
// ═══════════════════════════════════════════════════════════════
const CategoryManager = ({ categories, onSave, onClose, theme: t }) => {
  const glass = makeGlass(t);
  const glassCard = makeGlassCard(t);
  const inputStyle = makeInputStyle(t);
  const labelStyle = makeLabelStyle(t);
  const btnGhost = makeBtnGhost(t);
  const modalOverlay = makeModalOverlay(t);
  const modalBox = makeModalBox(t);
  const [cats, setCats] = useState([...categories]);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');
  const [editingId, setEditingId] = useState(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const cat = { id: generateId(), name: newName.trim(), color: newColor };
    setCats(prev => [...prev, cat]);
    setNewName('');
    setNewColor('#6366f1');
  };

  const handleDelete = (id) => {
    setCats(prev => prev.filter(c => c.id !== id));
  };

  const handleEditColor = (id, color) => {
    setCats(prev => prev.map(c => c.id === id ? { ...c, color } : c));
  };

  const handleEditName = (id, name) => {
    setCats(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: t.textHeading, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FontAwesomeIcon icon={faPalette} style={{ color: '#a855f7' }} />
            Manage Categories
          </h3>
          <button onClick={onClose} style={{ ...btnGhost, padding: '0.4rem 0.7rem' }}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Existing categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {cats.map(cat => (
            <div key={cat.id} style={{
              ...glassCard,
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem',
            }}>
              <div
                style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: cat.color, cursor: 'pointer',
                  boxShadow: `0 0 12px ${cat.color}50`,
                  flexShrink: 0, position: 'relative',
                }}
                onClick={() => setEditingId(editingId === cat.id ? null : cat.id)}
                title="Change color"
              />
              {editingId === cat.id ? (
                <input
                  value={cat.name}
                  onChange={e => handleEditName(cat.id, e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                  autoFocus
                  onBlur={() => setEditingId(null)}
                  onKeyDown={e => e.key === 'Enter' && setEditingId(null)}
                />
              ) : (
                <span style={{ flex: 1, color: t.textPrimary, fontWeight: '500', cursor: 'pointer' }}
                  onClick={() => setEditingId(cat.id)}>
                  {cat.name}
                </span>
              )}
              <button onClick={() => handleDelete(cat.id)}
                style={{ background: 'none', border: 'none', color: '#ef444480', cursor: 'pointer', padding: '0.25rem' }}>
                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.8rem' }} />
              </button>
            </div>
          ))}
          {/* color grid for editing */}
          {editingId && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0.5rem', ...glassCard }}>
              {COLOR_PRESETS.map(c => (
                <div key={c} onClick={() => { handleEditColor(editingId, c); }}
                  style={{
                    width: '26px', height: '26px', borderRadius: '6px',
                    background: c, cursor: 'pointer',
                    border: cats.find(x => x.id === editingId)?.color === c ? '2px solid white' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }} />
              ))}
            </div>
          )}
        </div>

        {/* Add new */}
        <div style={{ ...glassCard, padding: '1rem' }}>
          <label style={labelStyle}>New Category</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Category name..."
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              style={{ ...inputStyle, flex: 1 }} />
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: newColor, cursor: 'pointer', flexShrink: 0,
              boxShadow: `0 0 12px ${newColor}50`,
            }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '0.75rem' }}>
            {COLOR_PRESETS.map(c => (
              <div key={c} onClick={() => setNewColor(c)}
                style={{
                  width: '24px', height: '24px', borderRadius: '6px',
                  background: c, cursor: 'pointer',
                  border: newColor === c ? '2px solid white' : '2px solid transparent',
                  transition: 'all 0.15s',
                }} />
            ))}
          </div>
          <button onClick={handleAdd} style={{ ...btnPrimary, width: '100%' }}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.4rem' }} />
            Add Category
          </button>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={btnGhost}>Cancel</button>
          <button onClick={() => { onSave(cats); onClose(); }} style={btnPrimary}>Save Categories</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  RECURRING EVENT FORM MODAL
// ═══════════════════════════════════════════════════════════════
const RecurringEventForm = ({ event, categories, onSave, onClose, theme: t }) => {
  const inputStyle = makeInputStyle(t);
  const labelStyle = makeLabelStyle(t);
  const btnGhost = makeBtnGhost(t);
  const modalOverlay = makeModalOverlay(t);
  const modalBox = makeModalBox(t);
  const [form, setForm] = useState({
    content: event?.content || '',
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '10:00',
    recurrence: event?.recurrence || 'weekly',
    customDays: event?.customDays || [],
    categoryId: event?.categoryId || (categories[0]?.id || ''),
    priority: event?.priority || 'Medium',
  });

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleCustomDay = (dayIndex) => {
    setForm(prev => ({
      ...prev,
      customDays: prev.customDays.includes(dayIndex)
        ? prev.customDays.filter(d => d !== dayIndex)
        : [...prev.customDays, dayIndex],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    onSave({
      id: event?.id || generateId(),
      ...form,
      content: form.content.trim(),
    });
  };

  const selectedCat = categories.find(c => c.id === form.categoryId);

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: t.textHeading, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FontAwesomeIcon icon={faSync} style={{ color: '#8b5cf6' }} />
            {event ? 'Edit Recurring Event' : 'New Recurring Event'}
          </h3>
          <button onClick={onClose} style={{ ...btnGhost, padding: '0.4rem 0.7rem' }}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Event Title *</label>
            <input value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="What repeats?" style={inputStyle} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="time" value={form.startTime}
                onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input type="time" value={form.endTime}
                onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Recurrence Pattern</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['daily', 'weekdays', 'weekly', 'monthly', 'custom'].map(r => (
                <button key={r} type="button"
                  onClick={() => setForm(p => ({ ...p, recurrence: r }))}
                  style={{
                    ...btnGhost,
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem',
                    background: form.recurrence === r ? t.accentActive : t.btnGhostBg,
                    color: form.recurrence === r ? t.accentText : t.textMuted,
                    borderColor: form.recurrence === r ? t.accent : t.btnGhostBorder,
                  }}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {form.recurrence === 'custom' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Select Days</label>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {dayLabels.map((d, i) => (
                  <button key={d} type="button" onClick={() => toggleCustomDay(i)}
                    style={{
                      ...btnGhost,
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.78rem',
                      minWidth: '42px',
                      background: form.customDays.includes(i) ? t.accentActive : t.btnGhostBg,
                      color: form.customDays.includes(i) ? t.accentText : t.textMuted,
                      borderColor: form.customDays.includes(i) ? t.accent : t.btnGhostBorder,
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.categoryId}
                onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                {categories.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#1e1b4b' }}>{c.name}</option>
                ))}
              </select>
              {selectedCat && (
                <div style={{
                  width: '100%', height: '3px', borderRadius: '2px',
                  background: selectedCat.color, marginTop: '4px',
                }} />
              )}
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                  <option key={p} value={p} style={{ background: '#1e1b4b' }}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
            <button type="submit" style={btnPrimary}>
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  RECURRING EVENTS MANAGER PANEL
// ═══════════════════════════════════════════════════════════════
const RecurringManager = ({ events, categories, onAdd, onEdit, onDelete, onClose, theme: t }) => {
  const glassCard = makeGlassCard(t);
  const btnGhost = makeBtnGhost(t);
  const modalOverlay = makeModalOverlay(t);
  const modalBox = makeModalBox(t);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const getCat = (catId) => categories.find(c => c.id === catId);

  const getRecurrenceLabel = (ev) => {
    switch (ev.recurrence) {
      case 'daily': return 'Every day';
      case 'weekdays': return 'Mon–Fri';
      case 'weekly': return 'Every week';
      case 'monthly': return 'Every month';
      case 'custom': {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (ev.customDays || []).map(d => days[d]).join(', ') || 'Custom';
      }
      default: return ev.recurrence;
    }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={{ ...modalBox, maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: t.textHeading, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FontAwesomeIcon icon={faRedo} style={{ color: '#8b5cf6' }} />
            Recurring Events
            <span style={{
              background: 'rgba(139,92,246,0.2)', color: '#a78bfa',
              padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem',
            }}>{events.length}</span>
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => { setEditingEvent(null); setShowForm(true); }} style={{ ...btnPrimary, padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.3rem' }} /> Add
            </button>
            <button onClick={onClose} style={{ ...btnGhost, padding: '0.5rem 0.7rem' }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔁</div>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>No recurring events yet</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#475569' }}>
              Create events that repeat automatically on your schedule
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {events.map(ev => {
              const cat = getCat(ev.categoryId);
              return (
                <div key={ev.id} style={{
                  ...glassCard,
                  padding: '0.85rem 1rem',
                  borderLeft: `3px solid ${cat?.color || '#6366f1'}`,
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  {getPriorityDot(ev.priority, 10)}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: t.textPrimary, fontWeight: '600', fontSize: '0.92rem', marginBottom: '0.25rem' }}>
                      {ev.content}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem', color: t.textSecondary }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.65rem' }} />
                        {formatTime12(ev.startTime)} – {formatTime12(ev.endTime)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FontAwesomeIcon icon={faSync} style={{ fontSize: '0.65rem' }} />
                        {getRecurrenceLabel(ev)}
                      </span>
                      {cat && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: cat.color }} />
                          {cat.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => { setEditingEvent(ev); setShowForm(true); }}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.3rem' }}>
                    <FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.85rem' }} />
                  </button>
                  <button onClick={() => onDelete(ev.id)}
                    style={{ background: 'none', border: 'none', color: '#ef444480', cursor: 'pointer', padding: '0.3rem' }}>
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.85rem' }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {showForm && (
          <RecurringEventForm
            event={editingEvent}
            categories={categories}
            theme={t}
            onSave={(ev) => {
              if (editingEvent) onEdit(ev);
              else onAdd(ev);
              setShowForm(false);
              setEditingEvent(null);
            }}
            onClose={() => { setShowForm(false); setEditingEvent(null); }}
          />
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  FREE TIME FINDER MODAL
// ═══════════════════════════════════════════════════════════════
const FreeTimeFinder = ({ dayTasks, recurringEvents, categories, onClose, theme: t }) => {
  const glassCard = makeGlassCard(t);
  const inputStyle = makeInputStyle(t);
  const labelStyle = makeLabelStyle(t);
  const btnGhost = makeBtnGhost(t);
  const modalOverlay = makeModalOverlay(t);
  const modalBox = makeModalBox(t);
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 6);
    return d.toISOString().split('T')[0];
  });
  const [timeFrom, setTimeFrom] = useState('08:00');
  const [timeTo, setTimeTo] = useState('20:00');
  const [duration, setDuration] = useState(60);
  const [results, setResults] = useState(null);

  const isEventOnDate = (ev, date) => {
    const dow = date.getDay();
    switch (ev.recurrence) {
      case 'daily': return true;
      case 'weekdays': return dow >= 1 && dow <= 5;
      case 'weekly': return true; // simplified – every week
      case 'monthly': return true; // simplified
      case 'custom': return (ev.customDays || []).includes(dow);
      default: return false;
    }
  };

  const findSlots = () => {
    const slots = [];
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    const rangeStart = timeToMinutes(timeFrom);
    const rangeEnd = timeToMinutes(timeTo);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toDateString();
      // Collect all occupied intervals
      const occupied = [];

      // Day tasks
      const tasks = dayTasks[dateStr] || [];
      tasks.forEach(t => {
        if (t.startTime && t.endTime) {
          occupied.push([timeToMinutes(t.startTime), timeToMinutes(t.endTime)]);
        } else if (t.time) {
          // Legacy: just a time slot, assume 30 min
          const s = timeToMinutes(t.time);
          occupied.push([s, s + 30]);
        }
      });

      // Recurring events
      recurringEvents.forEach(ev => {
        if (isEventOnDate(ev, new Date(d))) {
          occupied.push([timeToMinutes(ev.startTime), timeToMinutes(ev.endTime)]);
        }
      });

      // Sort and merge
      occupied.sort((a, b) => a[0] - b[0]);
      const merged = [];
      occupied.forEach(([s, e]) => {
        if (merged.length && s <= merged[merged.length - 1][1]) {
          merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
        } else {
          merged.push([s, e]);
        }
      });

      // Find gaps
      let cursor = rangeStart;
      merged.forEach(([s, e]) => {
        if (s > cursor && s - cursor >= duration) {
          slots.push({ date: new Date(d), start: minutesToTime(cursor), end: minutesToTime(Math.min(s, rangeEnd)) });
        }
        cursor = Math.max(cursor, e);
      });
      if (rangeEnd - cursor >= duration) {
        slots.push({ date: new Date(d), start: minutesToTime(cursor), end: minutesToTime(rangeEnd) });
      }
    }
    setResults(slots);
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={{ ...modalBox, maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: t.textHeading, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FontAwesomeIcon icon={faSearch} style={{ color: '#22c55e' }} />
            Find Free Time
          </h3>
          <button onClick={onClose} style={{ ...btnGhost, padding: '0.4rem 0.7rem' }}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>From Date</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>To Date</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>From Time</label>
            <input type="time" value={timeFrom} onChange={e => setTimeFrom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>To Time</label>
            <input type="time" value={timeTo} onChange={e => setTimeTo(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Need (min)</label>
            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))}
              min="15" step="15" style={inputStyle} />
          </div>
        </div>

        <button onClick={findSlots} style={{ ...btnPrimary, width: '100%', marginBottom: '1rem' }}>
          <FontAwesomeIcon icon={faMagic} style={{ marginRight: '0.4rem' }} />
          Find Available Slots
        </button>

        {results !== null && (
          <div style={{ ...glassCard }}>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#f87171', padding: '1rem' }}>
                No free slots found for the given criteria
              </div>
            ) : (
              <>
                <div style={{ color: '#22c55e', fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  Found {results.length} free slot{results.length !== 1 ? 's' : ''}
                </div>
                <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {results.map((slot, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0.8rem',
                      background: 'rgba(34,197,94,0.08)',
                      borderRadius: '8px',
                      border: '1px solid rgba(34,197,94,0.15)',
                    }}>
                      <FontAwesomeIcon icon={faCalendar} style={{ color: '#22c55e', fontSize: '0.8rem' }} />
                      <span style={{ color: t.textPrimary, fontSize: '0.85rem', fontWeight: '500' }}>
                        {slot.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <FontAwesomeIcon icon={faArrowRight} style={{ color: t.textSecondary, fontSize: '0.65rem' }} />
                      <span style={{ color: t.textSecondary, fontSize: '0.85rem' }}>
                        {formatTime12(slot.start)} – {formatTime12(slot.end)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  TASK FORM MODAL (Enhanced with start/end time, category, recurring)
// ═══════════════════════════════════════════════════════════════
const TaskForm = ({ isOpen, onClose, onSave, task, dayId, categories, theme: t }) => {
  const inputStyle = t ? makeInputStyle(t) : makeInputStyle(makeTheme(true));
  const labelStyle = t ? makeLabelStyle(t) : makeLabelStyle(makeTheme(true));
  const btnGhost = t ? makeBtnGhost(t) : makeBtnGhost(makeTheme(true));
  const modalOverlay = t ? makeModalOverlay(t) : makeModalOverlay(makeTheme(true));
  const modalBox = t ? makeModalBox(t) : makeModalBox(makeTheme(true));
  const textHeading = t ? t.textHeading : '#f1f5f9';
  const selectBg = t ? t.selectOptionBg : '#1e1b4b';
  const selectColor = t ? t.inputColor : '#e2e8f0';
  const [form, setForm] = useState({
    content: task?.content || '',
    startTime: task?.startTime || '09:00',
    endTime: task?.endTime || '10:00',
    priority: task?.priority || 'Medium',
    categoryId: task?.categoryId || (categories[0]?.id || ''),
    description: task?.description || '',
    date: task?.date || new Date().toDateString(),
  });

  useEffect(() => {
    if (task) {
      setForm({
        content: task.content || '',
        startTime: task.startTime || '09:00',
        endTime: task.endTime || '10:00',
        priority: task.priority || 'Medium',
        categoryId: task.categoryId || (categories[0]?.id || ''),
        description: task.description || '',
        date: task.date || new Date().toDateString(),
      });
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    onSave(form, dayId);
  };

  const selectedCat = categories.find(c => c.id === form.categoryId);

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: textHeading, fontSize: '1.2rem' }}>
            {task ? '✏️ Edit Task' : '✨ New Task'}
          </h3>
          <button onClick={onClose} style={{ ...btnGhost, padding: '0.4rem 0.7rem' }}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Task Title *</label>
            <input value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="What needs to be done?" style={inputStyle} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Start Time</label>
              <input type="time" value={form.startTime}
                onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input type="time" value={form.endTime}
                onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.categoryId}
                onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                {categories.map(c => (
                  <option key={c.id} value={c.id} style={{ background: selectBg, color: selectColor }}>{c.name}</option>
                ))}
              </select>
              {selectedCat && (
                <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: selectedCat.color, marginTop: '4px' }} />
              )}
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                  <option key={p} value={p} style={{ background: selectBg, color: selectColor }}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Date</label>
            <input type="date"
              value={form.date ? (() => { try { return new Date(form.date).toISOString().split('T')[0]; } catch { return ''; } })() : ''}
              onChange={e => setForm(p => ({ ...p, date: new Date(e.target.value).toDateString() }))}
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Notes (Optional)</label>
            <textarea value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Additional notes…"
              rows="2"
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
            <button type="submit" style={btnPrimary}>
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  SORTABLE TASK (My Tasks panel)
// ═══════════════════════════════════════════════════════════════
const SortableTask = ({ task, onToggle, onEdit, onDelete, categories, theme: t }) => {
  const glassCard = t ? makeGlassCard(t) : makeGlassCard(makeTheme(true));
  const btnGhost = t ? makeBtnGhost(t) : makeBtnGhost(makeTheme(true));
  const textPrimary = t ? t.textPrimary : '#e2e8f0';
  const textMuted = t ? t.textMuted : '#64748b';
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const cat = categories.find(c => c.id === task.categoryId);

  return (
    <div ref={setNodeRef} style={{
      ...glassCard,
      margin: '0.4rem 0',
      padding: '0.7rem 0.85rem',
      borderLeft: `3px solid ${cat?.color || '#6366f1'}`,
      opacity: isDragging ? 0.5 : task.completed ? 0.6 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', paddingTop: '2px' }}>
          <FontAwesomeIcon icon={faGripVertical} style={{ color: '#475569', fontSize: '0.75rem' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem',
          }}>
            {getPriorityDot(task.priority)}
            <span style={{
              color: textPrimary, fontWeight: '500', fontSize: '0.88rem',
              textDecoration: task.completed ? 'line-through' : 'none',
              opacity: task.completed ? 0.7 : 1,
              wordBreak: 'break-word',
            }}>
              {task.content}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.72rem', color: textMuted }}>
            {task.startTime && task.endTime && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.6rem' }} />
                {formatTime12(task.startTime)} – {formatTime12(task.endTime)}
              </span>
            )}
            {cat && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: cat.color }} />
                {cat.name}
              </span>
            )}
            <span style={{ color: getPriorityColor(task.priority), fontWeight: '600' }}>
              {task.priority}
            </span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button onClick={e => { e.stopPropagation(); onEdit(task, null); }}
          style={{ ...btnGhost, padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.2rem' }} /> Edit
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(task.id, null); }}
          style={{ ...btnGhost, padding: '0.25rem 0.5rem', fontSize: '0.72rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}>
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: '0.2rem' }} /> Del
        </button>
        <button onClick={e => { e.stopPropagation(); onToggle(task.id, null); }}
          style={{
            ...btnGhost, padding: '0.25rem 0.5rem', fontSize: '0.72rem',
            color: task.completed ? '#10b981' : '#94a3b8',
            background: task.completed ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
            borderColor: task.completed ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)',
          }}>
          <FontAwesomeIcon icon={task.completed ? faCheckCircle : faCircle} style={{ marginRight: '0.2rem' }} />
          {task.completed ? 'Done' : 'Mark'}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  TIMELINE TASK (in day columns)
// ═══════════════════════════════════════════════════════════════
const TimelineTask = ({ task, onToggle, onDelete, onMoveToTasks, dayId, categories, isRecurring, theme: t }) => {
  const glassCard = t ? makeGlassCard(t) : makeGlassCard(makeTheme(true));
  const btnGhost = t ? makeBtnGhost(t) : makeBtnGhost(makeTheme(true));
  const textPrimary = t ? t.textPrimary : '#e2e8f0';
  const textMuted = t ? t.textMuted : '#64748b';
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: isRecurring,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const cat = categories.find(c => c.id === task.categoryId);

  return (
    <div ref={setNodeRef} style={{
      ...glassCard,
      margin: '0.2rem 0',
      padding: '0.5rem 0.65rem',
      borderLeft: `3px solid ${cat?.color || '#6366f1'}`,
      opacity: isDragging ? 0.5 : task.completed ? 0.5 : 1,
      cursor: isRecurring ? 'default' : (isDragging ? 'grabbing' : 'grab'),
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        {!isRecurring && (
          <div {...attributes} {...listeners} style={{ cursor: 'grab', paddingTop: '2px' }}>
            <FontAwesomeIcon icon={faGripVertical} style={{ color: '#475569', fontSize: '0.65rem' }} />
          </div>
        )}
        {isRecurring && (
          <FontAwesomeIcon icon={faSync} style={{ color: '#8b5cf6', fontSize: '0.6rem', marginTop: '4px' }} title="Recurring" />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
            {getPriorityDot(task.priority, 6)}
            <span style={{
              color: textPrimary, fontWeight: '500', fontSize: '0.82rem',
              textDecoration: task.completed ? 'line-through' : 'none',
              wordBreak: 'break-word',
            }}>
              {task.content}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.68rem', color: textMuted, flexWrap: 'wrap' }}>
            {task.startTime && task.endTime && (
              <span><FontAwesomeIcon icon={faClock} style={{ fontSize: '0.55rem', marginRight: '2px' }} />
                {formatTime12(task.startTime)}–{formatTime12(task.endTime)}</span>
            )}
            {cat && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '2px', background: cat.color }} />{cat.name}
              </span>
            )}
          </div>
        </div>
      </div>
      {!isRecurring && (
        <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
          <button onClick={e => { e.stopPropagation(); onMoveToTasks(task.id, dayId); }}
            style={{ ...btnGhost, padding: '0.2rem 0.4rem', fontSize: '0.68rem' }}>
            📋 Back
          </button>
          <button onClick={e => { e.stopPropagation(); onToggle(task.id, dayId); }}
            style={{
              ...btnGhost, padding: '0.2rem 0.4rem', fontSize: '0.68rem',
              color: task.completed ? '#10b981' : '#94a3b8',
              background: task.completed ? 'rgba(16,185,129,0.15)' : undefined,
            }}>
            {task.completed ? '✓' : '○'}
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(task.id, dayId); }}
            style={{ background: 'none', border: 'none', color: '#ef444460', cursor: 'pointer', padding: '0.2rem', fontSize: '0.72rem' }}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  TIMELINE SLOT (Droppable)
// ═══════════════════════════════════════════════════════════════
const TimelineSlot = ({ dayId, time, tasks, recurringTasks, onToggle, onDelete, onMoveToTasks, categories }) => {
  const { isOver, setNodeRef } = useDroppable({ id: `timeline-${dayId}-${time}` });

  return (
    <div ref={setNodeRef} style={{
      minHeight: '48px',
      padding: '0.25rem 0.35rem',
      background: isOver ? 'rgba(99,102,241,0.1)' : 'transparent',
      border: isOver ? '1px dashed rgba(99,102,241,0.4)' : '1px dashed transparent',
      borderRadius: '8px',
      transition: 'all 0.2s',
    }}>
      {recurringTasks.map(t => (
        <TimelineTask key={`r-${t.id}`} task={t} onToggle={() => { }} onDelete={() => { }} onMoveToTasks={() => { }}
          dayId={dayId} categories={categories} isRecurring />
      ))}
      {tasks.map(t => (
        <TimelineTask key={t.id} task={t} onToggle={onToggle} onDelete={onDelete}
          onMoveToTasks={onMoveToTasks} dayId={dayId} categories={categories} isRecurring={false} />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MY TASKS DROP ZONE
// ═══════════════════════════════════════════════════════════════
const MyTasksDropZone = ({ isOver }) => (
  <div style={{
    padding: '0.25rem',
    marginTop: '0.25rem',
    border: isOver ? '2px dashed rgba(99,102,241,0.5)' : '1px dashed rgba(255,255,255,0.1)',
    borderRadius: '8px',
    background: isOver ? 'rgba(99,102,241,0.1)' : 'transparent',
    textAlign: 'center',
    color: isOver ? '#a5b4fc' : '#475569',
    fontSize: '0.7rem',
    transition: 'all 0.2s',
    fontWeight: isOver ? '600' : '400',
  }}>
    {isOver ? '📥 Drop here!' : '↕ Move to My Tasks'}
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  DRAG OVERLAY TASK
// ═══════════════════════════════════════════════════════════════
const DragOverlayTask = ({ task, categories }) => {
  const cat = categories.find(c => c.id === task.categoryId);
  return (
    <div style={{
      ...glassCard,
      background: 'rgba(99,102,241,0.15)',
      border: '2px solid rgba(99,102,241,0.4)',
      padding: '0.7rem',
      maxWidth: '280px',
      cursor: 'grabbing',
      transform: 'rotate(3deg)',
      boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FontAwesomeIcon icon={faGripVertical} style={{ color: '#a5b4fc' }} />
        <div>
          <div style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.88rem' }}>{task.content}</div>
          {task.startTime && (
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              ⏰ {formatTime12(task.startTime)} – {formatTime12(task.endTime)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  VIEW TOGGLE
// ═══════════════════════════════════════════════════════════════
const ViewToggle = ({ viewMode, setViewMode, theme: t }) => {
  const glassCard = t ? makeGlassCard(t) : makeGlassCard(makeTheme(true));
  const btnGhost = t ? makeBtnGhost(t) : makeBtnGhost(makeTheme(true));
  const activeText = t ? t.accentText : '#a5b4fc';
  const inactiveText = t ? t.textMuted : '#64748b';
  const views = [
    { key: 'day', icon: faListUl, label: 'Day' },
    { key: 'week', icon: faCalendarWeek, label: 'Week' },
    { key: 'month', icon: faThLarge, label: 'Month' },
  ];
  return (
    <div style={{ display: 'flex', gap: '0.25rem', ...glassCard, padding: '0.3rem', borderRadius: '12px' }}>
      {views.map(v => (
        <button key={v.key} onClick={() => setViewMode(v.key)}
          style={{
            ...btnGhost,
            padding: '0.45rem 0.9rem',
            fontSize: '0.8rem',
            borderRadius: '9px',
            border: 'none',
            background: viewMode === v.key ? (t ? t.accentActive : 'rgba(99,102,241,0.3)') : 'transparent',
            color: viewMode === v.key ? activeText : inactiveText,
            fontWeight: viewMode === v.key ? '600' : '400',
          }}>
          <FontAwesomeIcon icon={v.icon} style={{ marginRight: '0.3rem' }} />
          {v.label}
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  WEEKLY VIEW
// ═══════════════════════════════════════════════════════════════
const WeeklyView = ({ weekDays, dayTasks, recurringEvents, categories, onDateClick, theme: t }) => {
  const glassCard = t ? makeGlassCard(t) : makeGlassCard(makeTheme(true));
  const textHeading = t ? t.textHeading : '#f1f5f9';
  const textMuted = t ? t.textMuted : '#64748b';
  const isEventOnDate = (ev, date) => {
    const dow = date.getDay();
    switch (ev.recurrence) {
      case 'daily': return true;
      case 'weekdays': return dow >= 1 && dow <= 5;
      case 'weekly': return true;
      case 'monthly': return true;
      case 'custom': return (ev.customDays || []).includes(dow);
      default: return false;
    }
  };

  const today = new Date().toDateString();

  return (
    <div style={{ ...glassCard, padding: '1.25rem' }}>
      <h3 style={{ color: textHeading, margin: '0 0 1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FontAwesomeIcon icon={faCalendarWeek} style={{ color: '#6366f1' }} />
        Weekly Overview
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {weekDays.map(day => {
          const dateStr = day.date.toDateString();
          const tasks = dayTasks[dateStr] || [];
          const rTasks = recurringEvents.filter(ev => isEventOnDate(ev, day.date));
          const allTasks = [...tasks, ...rTasks];
          const isToday = dateStr === today;
          return (
            <div key={dateStr} onClick={() => onDateClick(day.date)}
              style={{
                ...glassCard,
                cursor: 'pointer',
                minHeight: '140px',
                padding: '0.75rem',
                background: isToday ? (t ? t.accentSoft : 'rgba(99,102,241,0.12)') : (t ? t.glassBg : 'rgba(255,255,255,0.03)'),
                borderColor: isToday ? (t ? t.accent + '55' : 'rgba(99,102,241,0.3)') : (t ? t.glassBorder : 'rgba(255,255,255,0.06)'),
              }}>
              <div style={{
                fontSize: '0.75rem', color: textMuted, fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem',
              }}>
                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div style={{
                fontSize: '1.3rem', fontWeight: '700',
                color: isToday ? (t ? t.accentText : '#a5b4fc') : (t ? t.textPrimary : '#e2e8f0'),
                marginBottom: '0.5rem',
              }}>
                {day.date.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {allTasks.slice(0, 4).map((t, i) => {
                  const cat = categories.find(c => c.id === t.categoryId);
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.15rem 0.3rem',
                      background: `${cat?.color || '#6366f1'}15`,
                      borderRadius: '4px',
                      borderLeft: `2px solid ${cat?.color || '#6366f1'}`,
                    }}>
                      {getPriorityDot(t.priority, 4)}
                      <span style={{
                        fontSize: '0.65rem', color: t ? t.textSecondary : '#cbd5e1',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {t.content}
                      </span>
                    </div>
                  );
                })}
                {allTasks.length > 4 && (
                  <span style={{ fontSize: '0.65rem', color: '#64748b', paddingLeft: '0.3rem' }}>
                    +{allTasks.length - 4} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MONTHLY VIEW (Calendar)
// ═══════════════════════════════════════════════════════════════
const MonthlyView = ({ dayTasks, recurringEvents, categories, selectedDates, onDateSelect, theme: t }) => {
  const glassCard = t ? makeGlassCard(t) : makeGlassCard(makeTheme(true));
  const btnGhost = t ? makeBtnGhost(t) : makeBtnGhost(makeTheme(true));
  const textHeading = t ? t.textHeading : '#f1f5f9';
  const textMuted = t ? t.textMuted : '#64748b';
  const textSecondary = t ? t.textSecondary : '#94a3b8';
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const isEventOnDate = (ev, date) => {
    const dow = date.getDay();
    switch (ev.recurrence) {
      case 'daily': return true;
      case 'weekdays': return dow >= 1 && dow <= 5;
      case 'weekly': return true;
      case 'monthly': return true;
      case 'custom': return (ev.customDays || []).includes(dow);
      default: return false;
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDate = (date) => {
    const ds = date.toDateString();
    const regular = dayTasks[ds] || [];
    const recurring = recurringEvents.filter(ev => isEventOnDate(ev, date));
    return [...regular, ...recurring];
  };

  return (
    <div style={{ ...glassCard, padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
          style={{ ...btnGhost, padding: '0.5rem 0.8rem' }}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, color: textHeading, fontSize: '1.15rem' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={() => setCurrentDate(new Date())}
            style={{ ...btnGhost, padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}>
            Today
          </button>
        </div>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
          style={{ ...btnGhost, padding: '0.5rem 0.8rem' }}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', marginBottom: '0.35rem' }}>
        {dayNames.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: '0.75rem', fontWeight: '600',
            color: '#6366f1', padding: '0.4rem', textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem' }}>
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`e-${i}`} style={{ minHeight: '70px' }} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateStr = date.toDateString();
          const isToday = dateStr === today.toDateString();
          const isSelected = selectedDates.some(d => d.toDateString() === dateStr);
          const tasks = getTasksForDate(date);
          const uniqueCats = [...new Set(tasks.map(t => t.categoryId).filter(Boolean))];

          return (
            <div key={day} onClick={() => onDateSelect(date)}
              style={{
                minHeight: '70px', padding: '0.5rem',
                borderRadius: '10px', cursor: 'pointer',
                background: isSelected ? (t ? t.accentActive : 'rgba(99,102,241,0.2)') : isToday ? (t ? t.accentSofter : 'rgba(99,102,241,0.08)') : (t ? t.glassBg : 'rgba(255,255,255,0.02)'),
                border: isSelected ? `1px solid ${t ? t.accent + '66' : 'rgba(99,102,241,0.4)'}` : isToday ? `1px solid ${t ? t.accent + '33' : 'rgba(99,102,241,0.2)'}` : `1px solid ${t ? t.glassBorder : 'rgba(255,255,255,0.04)'}`,
                transition: 'all 0.2s',
                position: 'relative',
              }}>
              <div style={{
                fontSize: '0.88rem',
                fontWeight: isToday || isSelected ? '700' : '500',
                color: isSelected ? (t ? t.accentText : '#a5b4fc') : isToday ? '#818cf8' : (t ? t.textSecondary : '#cbd5e1'),
                marginBottom: '0.3rem',
              }}>
                {day}
              </div>
              {/* Priority dots */}
              {tasks.length > 0 && (
                <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                  {tasks.slice(0, 5).map((t, idx) => (
                    <div key={idx} style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: getPriorityColor(t.priority),
                      boxShadow: `0 0 4px ${getPriorityColor(t.priority)}40`,
                    }} />
                  ))}
                </div>
              )}
              {/* Category indicator bars */}
              {uniqueCats.length > 0 && (
                <div style={{ display: 'flex', gap: '1px', marginTop: '0.15rem' }}>
                  {uniqueCats.slice(0, 4).map(catId => {
                    const cat = categories.find(c => c.id === catId);
                    return cat ? (
                      <div key={catId} style={{
                        flex: 1, height: '2px', borderRadius: '1px',
                        background: cat.color, opacity: 0.7,
                      }} />
                    ) : null;
                  })}
                </div>
              )}
              {tasks.length > 0 && (
                <div style={{
                  fontSize: '0.6rem', color: isSelected ? (t ? t.accentText : '#a5b4fc') : textMuted,
                  marginTop: '0.15rem',
                }}>
                  {tasks.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['Urgent', 'High', 'Medium', 'Low'].map(p => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: textSecondary }}>
            {getPriorityDot(p, 6)}
            <span>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MONTHLY TIMELINE VIEW (horizontal scrollable, continuous blocks)
// ═══════════════════════════════════════════════════════════════
const HOUR_HEIGHT = 60;
const MONTH_HOUR_HEIGHT = 60;
const MonthlyTimelineView = ({ dayTasks, recurringEvents, categories, onDateClick, theme: t }) => {
  const glassCard = t ? makeGlassCard(t) : makeGlassCard(makeTheme(true));
  const btnGhost = t ? makeBtnGhost(t) : makeBtnGhost(makeTheme(true));
  const textHeading = t ? t.textHeading : '#f1f5f9';
  const textMuted = t ? t.textMuted : '#64748b';
  const stickyBg = t ? t.stickyBg : 'rgba(15,15,30,0.95)';
  const [currentDate, setCurrentDate] = useState(new Date());
  const scrollRef = useRef(null);
  const today = new Date().toDateString();

  const isEventOnDate = (ev, date) => {
    const dow = date.getDay();
    switch (ev.recurrence) {
      case 'daily': return true;
      case 'weekdays': return dow >= 1 && dow <= 5;
      case 'weekly': return true;
      case 'monthly': return true;
      case 'custom': return (ev.customDays || []).includes(dow);
      default: return false;
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    return { date: d, dateStr: d.toDateString(), dayNum: i + 1 };
  });

  // Scroll to today on mount
  useEffect(() => {
    if (scrollRef.current) {
      const todayIdx = monthDays.findIndex(d => d.dateStr === today);
      if (todayIdx > 0) {
        scrollRef.current.scrollLeft = Math.max(0, todayIdx * 150 - 200);
      }
    }
  }, [currentDate]);

  const getAllBlocksForDay = (dateStr, date) => {
    const blocks = [];
    // Regular tasks
    (dayTasks[dateStr] || []).forEach(t => {
      if (t.startTime && t.endTime) {
        blocks.push({ ...t, isRecurring: false });
      }
    });
    // Recurring events
    recurringEvents.forEach(ev => {
      if (isEventOnDate(ev, date) && ev.startTime && ev.endTime) {
        blocks.push({ ...ev, isRecurring: true });
      }
    });
    return blocks;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div style={{ ...glassCard, padding: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
          style={{ ...btnGhost, padding: '0.5rem 0.8rem' }}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h3 style={{ margin: 0, color: textHeading, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FontAwesomeIcon icon={faThLarge} style={{ color: '#6366f1' }} />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} — Timeline
          </h3>
          <button onClick={() => setCurrentDate(new Date())}
            style={{ ...btnGhost, padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}>Today</button>
        </div>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
          style={{ ...btnGhost, padding: '0.5rem 0.8rem' }}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Scrollable timeline */}
      <div ref={scrollRef} className="resys-scrollbar" style={{
        overflowX: 'auto', overflowY: 'auto',
        maxHeight: 'calc(100vh - 300px)',
        borderRadius: '10px',
        border: `1px solid ${t ? t.glassBorder : 'rgba(255,255,255,0.06)'}`,
      }}>
        <div style={{ display: 'flex', minWidth: `${70 + daysInMonth * 150}px` }}>
          {/* Time labels column */}
          <div style={{ width: '70px', flexShrink: 0, position: 'sticky', left: 0, zIndex: 2, background: stickyBg }}>
            <div style={{
              height: '48px', borderBottom: `1px solid ${t ? t.glassBorder : 'rgba(255,255,255,0.06)'}`,
              background: stickyBg,
            }} />
            {hours.map(h => (
              <div key={h} style={{
                height: `${MONTH_HOUR_HEIGHT}px`, display: 'flex', alignItems: 'flex-start',
                justifyContent: 'center', paddingTop: '2px',
                fontSize: '0.7rem', color: textMuted, fontWeight: '600',
                borderBottom: `1px solid ${t ? t.slotBorder : 'rgba(255,255,255,0.03)'}`,
                background: stickyBg,
              }}>
                {formatTime12(`${h.toString().padStart(2, '0')}:00`).replace(':00 ', ' ')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {monthDays.map(day => {
            const isToday = day.dateStr === today;
            const blocks = getAllBlocksForDay(day.dateStr, day.date);
            return (
              <div key={day.dayNum} style={{
                width: '150px', flexShrink: 0,
                borderLeft: '1px solid rgba(255,255,255,0.04)',
              }}>
                {/* Day header */}
                <div style={{
                  height: '48px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  position: 'sticky', top: 0, zIndex: 1,
                  background: isToday ? (t ? t.accentSoft : 'rgba(99,102,241,0.2)') : stickyBg,
                  borderBottom: `1px solid ${t ? t.glassBorder : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: '0.68rem', color: textMuted, fontWeight: '600', textTransform: 'uppercase' }}>
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div style={{
                    fontSize: '1rem', fontWeight: '700',
                    color: isToday ? (t ? t.accentText : '#a5b4fc') : (t ? t.textPrimary : '#e2e8f0'),
                  }}>
                    {day.dayNum}
                  </div>
                </div>
                {/* Time grid + blocks */}
                <div style={{ position: 'relative', height: `${24 * MONTH_HOUR_HEIGHT}px` }}>
                  {/* Hour lines */}
                  {hours.map(h => (
                    <div key={h} style={{
                      position: 'absolute', top: `${h * MONTH_HOUR_HEIGHT}px`,
                      width: '100%', height: `${MONTH_HOUR_HEIGHT}px`,
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      background: (h >= 8 && h < 18) ? 'rgba(255,255,255,0.008)' : 'transparent',
                    }} />
                  ))}
                  {/* Task blocks */}
                  {blocks.map((block, idx) => {
                    const startMin = timeToMinutes(block.startTime);
                    const endMin = timeToMinutes(block.endTime);
                    const top = (startMin / 60) * MONTH_HOUR_HEIGHT;
                    const height = Math.max(((endMin - startMin) / 60) * MONTH_HOUR_HEIGHT, 18);
                    const cat = categories.find(c => c.id === block.categoryId);
                    const color = cat?.color || '#6366f1';
                    return (
                      <div key={`${block.id}-${idx}`}
                        style={{
                          position: 'absolute',
                          top: `${top}px`,
                          left: '3px', right: '3px',
                          height: `${height}px`,
                          background: `${color}25`,
                          borderLeft: `3px solid ${color}`,
                          borderRadius: '4px',
                          padding: '2px 4px',
                          overflow: 'hidden',
                          cursor: 'default',
                          transition: 'all 0.15s',
                          zIndex: 1,
                          display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        }}
                        title={`${block.content}\n${formatTime12(block.startTime)} – ${formatTime12(block.endTime)}`}
                      >
                        <div style={{
                          fontSize: '0.62rem', fontWeight: '600',
                          color: t ? t.textPrimary : '#e2e8f0', lineHeight: '1.2',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {block.isRecurring && <span style={{ marginRight: '2px' }}>🔁</span>}
                          {block.content}
                        </div>
                        {height > 22 && (
                          <div style={{ fontSize: '0.55rem', color: t ? t.textSecondary : '#94a3b8', marginTop: '1px' }}>
                            {formatTime12(block.startTime)}–{formatTime12(block.endTime)}
                          </div>
                        )}
                        {height > 36 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '1px' }}>
                            {getPriorityDot(block.priority, 4)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const RearrangePage = ({ userData, setXp, saveUserData }) => {
  // ── State ────────────────────────────────────────
  const [dailyTasks, setDailyTasks] = useState(() => {
    try { const s = localStorage.getItem('dailyTasks'); const p = s ? JSON.parse(s) : []; return Array.isArray(p) ? p : []; }
    catch { return []; }
  });

  const [dayTasks, setDayTasks] = useState(() => {
    try {
      const s = localStorage.getItem('dayTasks'); const p = s ? JSON.parse(s) : {};
      if (typeof p !== 'object' || p === null || Array.isArray(p)) return {};
      const san = {};
      Object.keys(p).forEach(k => { san[k] = Array.isArray(p[k]) ? p[k] : []; });
      return san;
    } catch { return {}; }
  });

  const [categories, setCategories] = useState(() => {
    try { const s = localStorage.getItem('resys_categories'); return s ? JSON.parse(s) : DEFAULT_CATEGORIES; }
    catch { return DEFAULT_CATEGORIES; }
  });

  const [recurringEvents, setRecurringEvents] = useState(() => {
    try { const s = localStorage.getItem('resys_recurring'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [viewMode, setViewMode] = useState('day');
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [activeTask, setActiveTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingDayId, setEditingDayId] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showRecurringManager, setShowRecurringManager] = useState(false);
  const [showFreeTimeFinder, setShowFreeTimeFinder] = useState(false);
  const [showAllocatedTasks, setShowAllocatedTasks] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try { const s = localStorage.getItem('resys_dark_mode'); return s !== null ? JSON.parse(s) : true; }
    catch { return true; }
  });

  const theme = useMemo(() => makeTheme(isDarkMode), [isDarkMode]);
  const T = theme;
  const tGlass = useMemo(() => makeGlass(T), [T]);
  const tGlassCard = useMemo(() => makeGlassCard(T), [T]);
  const tInput = useMemo(() => makeInputStyle(T), [T]);
  const tLabel = useMemo(() => makeLabelStyle(T), [T]);
  const tBtnGhost = useMemo(() => makeBtnGhost(T), [T]);
  const tModalOverlay = useMemo(() => makeModalOverlay(T), [T]);
  const tModalBox = useMemo(() => makeModalBox(T), [T]);

  useEffect(() => { localStorage.setItem('resys_dark_mode', JSON.stringify(isDarkMode)); }, [isDarkMode]);

  // ── Sensors ──────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Persist ──────────────────────────────────────
  useEffect(() => { localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks)); }, [dailyTasks]);
  useEffect(() => { localStorage.setItem('dayTasks', JSON.stringify(dayTasks)); }, [dayTasks]);
  useEffect(() => { localStorage.setItem('resys_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('resys_recurring', JSON.stringify(recurringEvents)); }, [recurringEvents]);

  // ── Day generation ───────────────────────────────
  const getDays = useCallback(() => {
    if (selectedDates.length > 0) {
      return selectedDates.map(d => ({ id: d.toDateString(), name: d.toLocaleDateString('en-US', { weekday: 'long' }), date: d }));
    }
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      return { id: d.toDateString(), name: d.toLocaleDateString('en-US', { weekday: 'long' }), date: d };
    });
  }, [selectedDates]);

  const days = getDays();
  const isFullWeekView = selectedDates.length === 0;

  const timeSlots = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
    []);

  // ── Recurring events for a date ──────────────────
  const getRecurringForDate = useCallback((date) => {
    const dow = date.getDay();
    return recurringEvents.filter(ev => {
      switch (ev.recurrence) {
        case 'daily': return true;
        case 'weekdays': return dow >= 1 && dow <= 5;
        case 'weekly': return true;
        case 'monthly': return true;
        case 'custom': return (ev.customDays || []).includes(dow);
        default: return false;
      }
    });
  }, [recurringEvents]);

  const getRecurringForTimeSlot = useCallback((date, time) => {
    const slotMin = timeToMinutes(time);
    return getRecurringForDate(date).filter(ev => {
      const s = timeToMinutes(ev.startTime);
      const e = timeToMinutes(ev.endTime);
      return slotMin >= s && slotMin < e;
    });
  }, [getRecurringForDate]);

  // ── Task helpers ─────────────────────────────────
  const findTask = (id) => {
    const t = dailyTasks.find(x => x.id === id);
    if (t) return { task: t, container: 'timeline' };
    for (const dId in dayTasks) {
      const t2 = dayTasks[dId].find(x => x.id === id);
      if (t2) return { task: t2, container: `day-${dId}` };
    }
    return null;
  };

  const getAllTaskIds = () => {
    const tIds = Array.isArray(dailyTasks) ? dailyTasks.map(t => t.id) : [];
    const dIds = typeof dayTasks === 'object' && dayTasks ? Object.values(dayTasks).flat().map(t => t.id) : [];
    return [...tIds, ...dIds];
  };

  const getTasksForTimeSlot = (dayId, time) =>
    (dayTasks[dayId] || []).filter(t => {
      if (t.startTime && t.endTime) {
        const slotMin = timeToMinutes(time);
        return slotMin >= timeToMinutes(t.startTime) && slotMin < timeToMinutes(t.endTime);
      }
      return t.time === time;
    });

  // ── Date select ──────────────────────────────────
  const handleDateSelect = (date) => {
    setSelectedDates(prev => {
      const ds = date.toDateString();
      const exists = prev.some(d => d.toDateString() === ds);
      if (exists) return prev.filter(d => d.toDateString() !== ds);
      if (prev.length < 2) return [...prev, date];
      return [prev[1], date];
    });
    setCurrentDayIndex(0);
    setViewMode('day');
  };

  // ── CRUD ─────────────────────────────────────────
  const createTask = (data, dayId = null) => {
    const newTask = {
      id: generateId(),
      content: data.content,
      startTime: data.startTime,
      endTime: data.endTime,
      priority: data.priority,
      categoryId: data.categoryId,
      description: data.description,
      date: data.date,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    if (dayId) {
      setDayTasks(prev => ({ ...prev, [dayId]: [...(prev[dayId] || []), newTask] }));
    } else {
      setDailyTasks(prev => [...prev, newTask]);
    }
    setShowTaskForm(false);
    setEditingDayId(null);
  };

  const updateTask = (data, dayId = null) => {
    const updated = { ...editingTask, ...data };
    if (dayId) {
      setDayTasks(prev => ({
        ...prev,
        [dayId]: prev[dayId].map(t => t.id === editingTask.id ? updated : t),
      }));
    } else {
      setDailyTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
    }
    setEditingTask(null);
    setEditingDayId(null);
  };

  const deleteTask = (taskId, dayId = null) => {
    if (dayId) {
      setDayTasks(prev => ({ ...prev, [dayId]: prev[dayId].filter(t => t.id !== taskId) }));
    } else {
      setDailyTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const toggleTaskCompletion = (taskId, dayId = null) => {
    if (dayId) {
      setDayTasks(prev => ({
        ...prev,
        [dayId]: prev[dayId].map(t => t.id === taskId ? { ...t, completed: !t.completed } : t),
      }));
    } else {
      setDailyTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    }
    if (setXp && userData && saveUserData) {
      setXp(userData.xp + 10);
      saveUserData({ ...userData, xp: userData.xp + 10 });
    }
  };

  const editTask = (task, dayId = null) => {
    setEditingTask(task);
    setEditingDayId(dayId);
  };

  const moveTaskToMyTasks = (taskId, dayId) => {
    if (!dayId) return;
    const task = dayTasks[dayId]?.find(t => t.id === taskId);
    if (!task) return;
    const { time, ...rest } = task;
    setDayTasks(prev => ({ ...prev, [dayId]: (prev[dayId] || []).filter(t => t.id !== taskId) }));
    setDailyTasks(prev => [...prev, { ...rest, id: generateId() }]);
  };

  // ── Recurring CRUD ───────────────────────────────
  const addRecurring = (ev) => setRecurringEvents(prev => [...prev, ev]);
  const editRecurring = (ev) => setRecurringEvents(prev => prev.map(e => e.id === ev.id ? ev : e));
  const deleteRecurring = (id) => setRecurringEvents(prev => prev.filter(e => e.id !== id));

  // ── Drag & Drop ──────────────────────────────────
  const handleDragStart = (e) => {
    const info = findTask(e.active.id);
    if (info) setActiveTask(info.task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (overId.startsWith('timeline-')) {
      const parts = overId.split('-');
      const targetDayId = parts.slice(1, -1).join('-');
      const timeSlot = parts[parts.length - 1] + ':00';
      // Actually the format is `timeline-${dayId}-${time}` where dayId can contain hyphens
      // Let's re-parse properly:
      const prefix = 'timeline-';
      const rest = overId.slice(prefix.length);
      const lastDash = rest.lastIndexOf('-');
      const tDayId = rest.substring(0, lastDash);
      const tTime = rest.substring(lastDash + 1);

      const info = findTask(activeId);
      if (!info) return;

      const targetDate = new Date(tDayId);
      const taskToMove = { ...info.task, time: tTime, startTime: info.task.startTime || tTime, date: targetDate.toDateString() };

      if (info.container === 'timeline') {
        setDailyTasks(prev => prev.filter(t => t.id !== activeId));
      } else if (info.container.startsWith('day-')) {
        const srcDay = info.container.replace('day-', '');
        setDayTasks(prev => ({ ...prev, [srcDay]: (prev[srcDay] || []).filter(t => t.id !== activeId) }));
      }

      setDayTasks(prev => ({
        ...prev,
        [tDayId]: [...(prev[tDayId] || []), { ...taskToMove, id: generateId() }]
          .sort((a, b) => (a.startTime || a.time || '').localeCompare(b.startTime || b.time || '')),
      }));
      return;
    }

    if (overId === 'my-tasks-drop-zone') {
      const info = findTask(activeId);
      if (!info || !info.container.startsWith('day-')) return;
      const srcDay = info.container.replace('day-', '');
      const { time, ...rest } = info.task;
      setDayTasks(prev => ({ ...prev, [srcDay]: (prev[srcDay] || []).filter(t => t.id !== activeId) }));
      setDailyTasks(prev => [...prev, { ...rest, id: generateId() }]);
      return;
    }

    // Reorder within same container
    const aInfo = findTask(activeId);
    const oInfo = findTask(overId);
    if (!aInfo || !oInfo) return;

    if (aInfo.container === 'timeline' && oInfo.container === 'timeline') {
      const oldIdx = dailyTasks.findIndex(t => t.id === activeId);
      const newIdx = dailyTasks.findIndex(t => t.id === overId);
      if (oldIdx !== newIdx) setDailyTasks(items => arrayMove(items, oldIdx, newIdx));
    } else if (aInfo.container.startsWith('day-') && oInfo.container.startsWith('day-') && aInfo.container === oInfo.container) {
      const dId = aInfo.container.replace('day-', '');
      const list = dayTasks[dId] || [];
      const oldIdx = list.findIndex(t => t.id === activeId);
      const newIdx = list.findIndex(t => t.id === overId);
      if (oldIdx !== newIdx && oldIdx !== -1 && newIdx !== -1) {
        setDayTasks(prev => ({ ...prev, [dId]: arrayMove(list, oldIdx, newIdx) }));
      }
    }
  };

  // ── Stats ────────────────────────────────────────
  const completedCount = dailyTasks.filter(t => t.completed).length + Object.values(dayTasks).flat().filter(t => t.completed).length;
  const totalCount = dailyTasks.length + Object.values(dayTasks).flat().length;

  // ── Navigation ───────────────────────────────────
  const visibleDays = isFullWeekView ? days.slice(currentDayIndex, currentDayIndex + 2) : days;
  const nextDays = () => { if (isFullWeekView && currentDayIndex < days.length - 2) setCurrentDayIndex(p => p + 2); };
  const prevDays = () => { if (isFullWeekView && currentDayIndex > 0) setCurrentDayIndex(p => p - 2); };

  const { setNodeRef: setMyTasksRef, isOver: isOverMyTasks } = useDroppable({ id: 'my-tasks-drop-zone' });

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className={isDarkMode ? 'resys-root' : 'resys-root resys-light'} style={{ background: T.rootBg, color: T.textPrimary }}>
      {/* ── HEADER ───────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 40%, #ec4899 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem', letterSpacing: '-0.02em',
        }}>
          Task Planner
        </h1>
        <p style={{ color: T.textMuted, fontSize: '1rem', margin: 0 }}>
          Schedule, organize, and master your time
        </p>
      </div>

      {/* ── TOOLBAR ──────────────────────────────── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} theme={T} />
          {/* Theme toggle */}
          <button onClick={() => setIsDarkMode(p => !p)}
            style={{
              ...tBtnGhost, padding: '0.5rem 0.75rem', fontSize: '0.8rem',
              display: 'flex', alignItems: 'center', gap: '0.35rem',
            }}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon}
              style={{ color: isDarkMode ? '#fbbf24' : '#6366f1' }} />
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowCategoryManager(true)}
            style={{ ...tBtnGhost, padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}>
            <FontAwesomeIcon icon={faPalette} style={{ marginRight: '0.3rem', color: '#a855f7' }} />
            Categories
          </button>
          <button onClick={() => setShowRecurringManager(true)}
            style={{ ...tBtnGhost, padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}>
            <FontAwesomeIcon icon={faRedo} style={{ marginRight: '0.3rem', color: '#8b5cf6' }} />
            Recurring
            {recurringEvents.length > 0 && (
              <span style={{
                marginLeft: '0.3rem', background: 'rgba(139,92,246,0.25)', color: '#a78bfa',
                padding: '0.1rem 0.4rem', borderRadius: '8px', fontSize: '0.72rem',
              }}>{recurringEvents.length}</span>
            )}
          </button>
          <button onClick={() => setShowFreeTimeFinder(true)}
            style={{ ...tBtnGhost, padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}>
            <FontAwesomeIcon icon={faSearch} style={{ marginRight: '0.3rem', color: '#22c55e' }} />
            Free Time
          </button>
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────── */}
      <div style={{ ...tGlassCard, marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ color: T.textHeading, fontWeight: '600', fontSize: '0.95rem' }}>Progress</div>
            <div style={{ color: T.textSecondary, fontSize: '0.82rem' }}>
              {completedCount} of {totalCount} tasks • {Math.round((completedCount / Math.max(totalCount, 1)) * 100)}%
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white', padding: '0.35rem 0.8rem', borderRadius: '20px',
            fontWeight: 'bold', fontSize: '0.85rem',
          }}>
            Level {userData?.level || 1}
          </div>
        </div>
        <div style={{
          height: '6px', background: T.progressBg, borderRadius: '3px',
          marginTop: '0.75rem', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
            width: `${(completedCount / Math.max(totalCount, 1)) * 100}%`,
            transition: 'width 0.5s ease',
            borderRadius: '3px',
          }} />
        </div>
      </div>

      {/* ── MONTHLY CALENDAR (always visible for date picking) ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <MonthlyView
          dayTasks={dayTasks} recurringEvents={recurringEvents} categories={categories}
          selectedDates={selectedDates} onDateSelect={handleDateSelect} theme={T}
        />
      </div>

      {/* ── MONTHLY TIMELINE VIEW ────────────────── */}
      {viewMode === 'month' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <MonthlyTimelineView
            dayTasks={dayTasks} recurringEvents={recurringEvents}
            categories={categories} onDateClick={handleDateSelect} theme={T}
          />
        </div>
      )}

      {/* ── WEEKLY VIEW ──────────────────────────── */}
      {viewMode === 'week' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <WeeklyView
            weekDays={days} dayTasks={dayTasks} recurringEvents={recurringEvents}
            categories={categories} onDateClick={handleDateSelect} theme={T}
          />
        </div>
      )}

      {/* ── DAY VIEW (Main planner with continuous blocks) ── */}
      {viewMode === 'day' && (
        <DndContext sensors={sensors} collisionDetection={closestCenter}
          onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={getAllTaskIds()} strategy={verticalListSortingStrategy}>
            <div style={{
              display: 'grid', gridTemplateColumns: '300px 1fr',
              gap: '1.5rem', minHeight: '600px',
            }}>
              {/* ── MY TASKS SIDEBAR ────────────── */}
              <div style={{
                ...tGlassCard, display: 'flex', flexDirection: 'column',
                maxHeight: 'calc(100vh - 280px)', position: 'sticky', top: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, color: T.textHeading, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    📋 My Tasks
                    <span style={{
                      background: T.accentSoft, color: T.accentText,
                      padding: '0.1rem 0.4rem', borderRadius: '8px', fontSize: '0.75rem',
                    }}>{dailyTasks.length}</span>
                  </h3>
                  <button onClick={() => setShowAllocatedTasks(true)}
                    style={{ ...tBtnGhost, padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}>
                    📅 Allocated ({Object.values(dayTasks).flat().length})
                  </button>
                </div>

                <button onClick={() => setShowTaskForm(true)}
                  style={{ ...btnPrimary, width: '100%', marginBottom: '0.75rem', padding: '0.6rem' }}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.3rem' }} />
                  New Task
                </button>

                <div ref={setMyTasksRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <MyTasksDropZone isOver={isOverMyTasks} />
                  <div style={{ flex: 1, overflowY: 'auto', marginTop: '0.4rem' }}
                    className="resys-scrollbar">
                    {dailyTasks.map(t => (
                      <SortableTask key={t.id} task={t} onToggle={toggleTaskCompletion}
                        onEdit={editTask} onDelete={deleteTask} categories={categories} theme={T} />
                    ))}
                    {dailyTasks.length === 0 && (
                      <div style={{
                        textAlign: 'center', color: T.emptyColor, padding: '2rem 0.75rem',
                        border: `1px dashed ${T.emptyBorder}`, borderRadius: '10px',
                      }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.4rem', opacity: 0.5 }}>📝</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>No tasks yet</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Create or drag tasks here</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── TIMELINE AREA (continuous blocks) ── */}
              <div style={{ ...tGlassCard }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem',
                }}>
                  {isFullWeekView && (
                    <button onClick={prevDays} disabled={currentDayIndex === 0}
                      style={{
                        ...tBtnGhost, padding: '0.5rem 0.8rem',
                        opacity: currentDayIndex === 0 ? 0.4 : 1,
                        cursor: currentDayIndex === 0 ? 'not-allowed' : 'pointer',
                      }}>
                      <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '0.3rem' }} /> Prev
                    </button>
                  )}
                  <h3 style={{ margin: 0, color: T.textHeading, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faCalendarDay} style={{ color: T.accent }} />
                    {visibleDays.map((d, i) => (
                      <span key={d.id}>
                        {d.name} ({d.date.toLocaleDateString()})
                        {i < visibleDays.length - 1 && ' & '}
                      </span>
                    ))}
                  </h3>
                  {isFullWeekView && (
                    <button onClick={nextDays} disabled={currentDayIndex >= days.length - 2}
                      style={{
                        ...tBtnGhost, padding: '0.5rem 0.8rem',
                        opacity: currentDayIndex >= days.length - 2 ? 0.4 : 1,
                        cursor: currentDayIndex >= days.length - 2 ? 'not-allowed' : 'pointer',
                      }}>
                      Next <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: '0.3rem' }} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {visibleDays.map(day => {
                    // Collect all blocks for continuous rendering
                    const allDayTasks = dayTasks[day.id] || [];
                    const dayRecurring = getRecurringForDate(day.date);
                    // Deduplicate: only show each task once as a continuous block
                    const seenIds = new Set();
                    const continuousBlocks = [];
                    allDayTasks.forEach(t => {
                      if (!seenIds.has(t.id) && t.startTime && t.endTime) {
                        seenIds.add(t.id);
                        continuousBlocks.push({ ...t, isRecurring: false });
                      }
                    });
                    dayRecurring.forEach(ev => {
                      if (ev.startTime && ev.endTime) {
                        continuousBlocks.push({ ...ev, isRecurring: true });
                      }
                    });
                    // Also keep tasks without proper times for the drop slots
                    const untimedTasks = allDayTasks.filter(t => !t.startTime || !t.endTime);

                    return (
                      <div key={day.id} style={{
                        flex: 1, border: `1px solid ${T.dayColBorder}`,
                        borderRadius: '12px', overflow: 'hidden',
                      }}>
                        <div style={{
                          textAlign: 'center', padding: '0.8rem',
                          background: T.dayHeaderBg,
                          color: T.textPrimary, fontWeight: '700', fontSize: '0.95rem',
                          borderBottom: `1px solid ${T.dayColBorder}`,
                        }}>
                          {day.name}
                          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.15rem', fontWeight: '400' }}>
                            {day.date.toLocaleDateString()} • {continuousBlocks.length + untimedTasks.length} items
                          </div>
                        </div>
                        <div style={{ maxHeight: 'calc(100vh - 420px)', overflowY: 'auto', position: 'relative' }}
                          className="resys-scrollbar">
                          {/* Hour grid lines + droppable slots */}
                          {timeSlots.map(time => {
                            const hour = parseInt(time);
                            const isWorkHour = hour >= 8 && hour < 18;
                            // Only show untimed tasks in slots
                            const slotUntimed = untimedTasks.filter(t => t.time === time);
                            return (
                              <div key={time} style={{
                                display: 'flex', height: `${HOUR_HEIGHT}px`,
                                borderBottom: `1px solid ${T.slotBorder}`,
                                background: isWorkHour ? T.workHourBg : 'transparent',
                                position: 'relative',
                              }}>
                                <div style={{
                                  width: '65px', padding: '2px 0.5rem 0',
                                  background: T.timeLabelBg,
                                  borderRight: `1px solid ${T.timeLabelBorder}`,
                                  fontWeight: '600', fontSize: '0.7rem',
                                  color: T.textMuted, textAlign: 'center', flexShrink: 0,
                                }}>
                                  {formatTime12(time).replace(':00 ', ' ')}
                                </div>
                                <div style={{ flex: 1, position: 'relative' }}>
                                  <TimelineSlot
                                    dayId={day.id} time={time}
                                    tasks={slotUntimed}
                                    recurringTasks={[]}
                                    onToggle={toggleTaskCompletion}
                                    onDelete={deleteTask}
                                    onMoveToTasks={moveTaskToMyTasks}
                                    categories={categories}
                                  />
                                </div>
                              </div>
                            );
                          })}
                          {/* Continuous blocks overlaid */}
                          {continuousBlocks.map((block, idx) => {
                            const startMin = timeToMinutes(block.startTime);
                            const endMin = timeToMinutes(block.endTime);
                            const top = (startMin / 60) * HOUR_HEIGHT;
                            const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 20);
                            const cat = categories.find(c => c.id === block.categoryId);
                            const color = cat?.color || '#6366f1';
                            return (
                              <div key={`cb-${block.id}-${idx}`} style={{
                                position: 'absolute',
                                top: `${top}px`,
                                left: '70px', right: '6px',
                                height: `${height}px`,
                                background: `${color}20`,
                                borderLeft: `3px solid ${color}`,
                                borderRadius: '6px',
                                padding: '3px 6px',
                                overflow: 'hidden',
                                zIndex: 2,
                                backdropFilter: 'blur(4px)',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                cursor: 'default',
                                boxShadow: `0 2px 8px ${color}15`,
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  {getPriorityDot(block.priority, 6)}
                                  {block.isRecurring && (
                                    <FontAwesomeIcon icon={faSync} style={{ fontSize: '0.55rem', color: '#a78bfa' }} />
                                  )}
                                  <span style={{
                                    fontSize: '0.75rem', fontWeight: '600', color: T.textPrimary,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    textDecoration: block.completed ? 'line-through' : 'none',
                                    opacity: block.completed ? 0.6 : 1,
                                  }}>
                                    {block.content}
                                  </span>
                                </div>
                                {height > 28 && (
                                  <div style={{ fontSize: '0.62rem', color: T.textSecondary, marginTop: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.5rem' }} />
                                    {formatTime12(block.startTime)} – {formatTime12(block.endTime)}
                                    {cat && (
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: '4px' }}>
                                        <div style={{ width: '5px', height: '5px', borderRadius: '2px', background: cat.color }} />
                                        {cat.name}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {!block.isRecurring && (
                                  <div style={{ display: 'flex', gap: '3px', marginTop: height > 30 ? '2px' : '0' }}>
                                    <button onClick={() => toggleTaskCompletion(block.id, day.id)}
                                      style={{
                                        background: block.completed ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                                        border: 'none', borderRadius: '4px', padding: '1px 5px',
                                        color: block.completed ? '#10b981' : '#94a3b8',
                                        fontSize: '0.58rem', cursor: 'pointer', lineHeight: 1,
                                      }}>
                                      {block.completed ? '✓' : '○'}
                                    </button>
                                    <button onClick={() => moveTaskToMyTasks(block.id, day.id)}
                                      style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        border: 'none', borderRadius: '4px', padding: '1px 5px',
                                        color: '#94a3b8', fontSize: '0.58rem', cursor: 'pointer', lineHeight: 1,
                                      }}>
                                      📋
                                    </button>
                                    <button onClick={() => deleteTask(block.id, day.id)}
                                      style={{
                                        background: 'rgba(239,68,68,0.1)',
                                        border: 'none', borderRadius: '4px', padding: '1px 5px',
                                        color: '#ef444480', fontSize: '0.58rem', cursor: 'pointer', lineHeight: 1,
                                      }}>
                                      ✕
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </SortableContext>

          <DragOverlay>
            {activeTask ? <DragOverlayTask task={activeTask} categories={categories} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── MODALS ───────────────────────────────── */}
      {showCategoryManager && (
        <CategoryManager categories={categories}
          onSave={setCategories} onClose={() => setShowCategoryManager(false)} theme={T} />
      )}

      {showRecurringManager && (
        <RecurringManager events={recurringEvents} categories={categories}
          onAdd={addRecurring} onEdit={editRecurring} onDelete={deleteRecurring}
          onClose={() => setShowRecurringManager(false)} theme={T} />
      )}

      {showFreeTimeFinder && (
        <FreeTimeFinder dayTasks={dayTasks} recurringEvents={recurringEvents}
          categories={categories} onClose={() => setShowFreeTimeFinder(false)} theme={T} />
      )}

      {/* ── ALLOCATED TASKS MODAL ────────────────── */}
      {showAllocatedTasks && (
        <div style={tModalOverlay} onClick={() => setShowAllocatedTasks(false)}>
          <div style={{ ...tModalBox, maxWidth: '600px', maxHeight: '80vh', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: T.textHeading, fontSize: '1.2rem' }}>📅 Allocated Tasks</h3>
              <button onClick={() => setShowAllocatedTasks(false)} style={{ ...tBtnGhost, padding: '0.4rem 0.7rem' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 'calc(80vh - 80px)' }} className="resys-scrollbar">
              {Object.keys(dayTasks).length === 0 || Object.values(dayTasks).flat().length === 0 ? (
                <div style={{ textAlign: 'center', color: T.textMuted, padding: '2rem' }}>
                  No allocated tasks yet. Drag tasks from My Tasks to the timeline.
                </div>
              ) : (
                Object.entries(dayTasks)
                  .filter(([, tasks]) => tasks.length > 0)
                  .sort(([a], [b]) => new Date(a) - new Date(b))
                  .map(([dateStr, tasks]) => (
                    <div key={dateStr} style={{ marginBottom: '1rem' }}>
                      <div style={{
                        fontSize: '0.82rem', fontWeight: '700', color: T.accentText,
                        marginBottom: '0.4rem', padding: '0.3rem 0.5rem',
                        background: T.accentSofter, borderRadius: '6px',
                      }}>
                        📆 {new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: T.textSecondary, fontWeight: '400' }}>
                          ({tasks.length} task{tasks.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                      {tasks.map(t => {
                        const cat = categories.find(c => c.id === t.categoryId);
                        return (
                          <div key={t.id} style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 0.6rem', marginBottom: '0.2rem',
                            background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
                            borderLeft: `3px solid ${cat?.color || '#6366f1'}`,
                          }}>
                            {getPriorityDot(t.priority, 6)}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: '0.85rem', fontWeight: '600', color: T.textPrimary,
                                textDecoration: t.completed ? 'line-through' : 'none',
                                opacity: t.completed ? 0.6 : 1,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>{t.content}</div>
                              {t.startTime && (
                                <div style={{ fontSize: '0.7rem', color: T.textSecondary }}>
                                  ⏰ {formatTime12(t.startTime)} – {formatTime12(t.endTime)}
                                  {cat && <span style={{ marginLeft: '0.4rem' }}>• {cat.name}</span>}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                              <button onClick={() => editTask(t, dateStr)}
                                style={{
                                  ...tBtnGhost, padding: '0.25rem 0.4rem', fontSize: '0.7rem',
                                  color: T.textSecondary,
                                }}>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button onClick={() => deleteTask(t.id, dateStr)}
                                style={{
                                  ...tBtnGhost, padding: '0.25rem 0.4rem', fontSize: '0.7rem',
                                  color: '#ef4444',
                                }}>
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                              <button onClick={() => { toggleTaskCompletion(t.id, dateStr); }}
                                style={{
                                  ...tBtnGhost, padding: '0.25rem 0.4rem', fontSize: '0.7rem',
                                  color: t.completed ? '#10b981' : T.textSecondary,
                                }}>
                                <FontAwesomeIcon icon={t.completed ? faCheckCircle : faCircle} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      <TaskForm
        isOpen={showTaskForm || !!editingTask}
        onClose={() => { setShowTaskForm(false); setEditingTask(null); setEditingDayId(null); }}
        onSave={editingTask ? updateTask : createTask}
        task={editingTask}
        dayId={editingDayId}
        categories={categories}
        theme={T}
      />
    </div>
  );
};

export default RearrangePage;