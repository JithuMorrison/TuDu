import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faTrash, faEdit, faTimes, faSearch, faFileExport,
  faFileImport, faCalendarDay, faStar, faChevronDown, faChevronUp,
  faBell, faBellSlash, faSun, faMoon, faTags, faEllipsisV,
  faCheck, faSort, faFilter, faGift, faHeart,
} from '@fortawesome/free-solid-svg-icons';
import {
  getAllBirthdays, addBirthday, updateBirthday, deleteBirthday,
  clearAllBirthdays, exportBirthdays, importBirthdays, triggerSWCheck,
} from './birthdayDB';

// ─── Helpers ──────────────────────────────────────────────────
const generateId = () => `bd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const DEFAULT_CATEGORIES = ['Family', 'Friends', 'Work', 'School'];

const CATEGORY_COLORS = {
  'Family': '#ef4444',
  'Friends': '#3b82f6',
  'Work': '#f59e0b',
  'School': '#10b981',
  'Uncategorized': '#6b7280',
};

const getCategoryColor = (cat) => {
  if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  // Generate a deterministic color from name
  let hash = 0;
  for (let i = 0; i < cat.length; i++) {
    hash = cat.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

const formatBirthdayDisplay = (birthday, year) => {
  if (!birthday) return '';
  const [m, d] = birthday.split('-').map(Number);
  const monthName = MONTH_NAMES[m - 1] || '';
  const yearStr = year ? `, ${year}` : '';
  return `${monthName} ${d}${yearStr}`;
};

const getDaysUntil = (birthday) => {
  if (!birthday) return Infinity;
  const [m, d] = birthday.split('-').map(Number);
  const today = new Date();
  const thisYear = today.getFullYear();

  let next = new Date(thisYear, m - 1, d);
  if (next < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    next = new Date(thisYear + 1, m - 1, d);
  }

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = next - todayStart;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getAge = (year) => {
  if (!year) return null;
  return new Date().getFullYear() - year;
};

const getZodiacSign = (birthday) => {
  if (!birthday) return '';
  const [m, d] = birthday.split('-').map(Number);
  const signs = [
    { sign: '♑ Capricorn', end: [1, 19] }, { sign: '♒ Aquarius', end: [2, 18] },
    { sign: '♓ Pisces', end: [3, 20] }, { sign: '♈ Aries', end: [4, 19] },
    { sign: '♉ Taurus', end: [5, 20] }, { sign: '♊ Gemini', end: [6, 20] },
    { sign: '♋ Cancer', end: [7, 22] }, { sign: '♌ Leo', end: [8, 22] },
    { sign: '♍ Virgo', end: [9, 22] }, { sign: '♎ Libra', end: [10, 22] },
    { sign: '♏ Scorpio', end: [11, 21] }, { sign: '♐ Sagittarius', end: [12, 21] },
    { sign: '♑ Capricorn', end: [12, 31] },
  ];
  for (const s of signs) {
    if (m < s.end[0] || (m === s.end[0] && d <= s.end[1])) return s.sign;
  }
  return '♑ Capricorn';
};

// ─── Theme ────────────────────────────────────────────────────
const makeTheme = (isDark) => {
  if (isDark) {
    return {
      isDark: true,
      rootBg: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16132e 100%)',
      textPrimary: '#e2e8f0',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      textHeading: '#f1f5f9',
      glassBg: 'rgba(255,255,255,0.04)',
      glassBorder: 'rgba(255,255,255,0.08)',
      glassHover: 'rgba(255,255,255,0.06)',
      inputBg: 'rgba(255,255,255,0.06)',
      inputBorder: 'rgba(255,255,255,0.12)',
      inputColor: '#e2e8f0',
      btnGhostBg: 'rgba(255,255,255,0.06)',
      btnGhostColor: '#94a3b8',
      btnGhostBorder: 'rgba(255,255,255,0.1)',
      modalOverlayBg: 'rgba(0,0,0,0.6)',
      modalBg: 'rgba(15,15,30,0.95)',
      accent: '#ec4899',
      accentAlt: '#f472b6',
      accentSoft: 'rgba(236,72,153,0.2)',
      accentSofter: 'rgba(236,72,153,0.1)',
      accentText: '#f9a8d4',
      cardShadow: '0 25px 60px rgba(0,0,0,0.5)',
      emptyColor: '#475569',
      todayHighlight: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.15))',
      todayBorder: 'rgba(236,72,153,0.4)',
      selectOptionBg: '#1e1b4b',
    };
  }
  return {
    isDark: false,
    rootBg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f0ff 100%)',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    textHeading: '#0f172a',
    glassBg: 'rgba(255,255,255,0.7)',
    glassBorder: 'rgba(236,72,153,0.12)',
    glassHover: 'rgba(255,255,255,0.85)',
    inputBg: 'rgba(255,255,255,0.9)',
    inputBorder: 'rgba(236,72,153,0.2)',
    inputColor: '#1e293b',
    btnGhostBg: 'rgba(236,72,153,0.06)',
    btnGhostColor: '#475569',
    btnGhostBorder: 'rgba(236,72,153,0.15)',
    modalOverlayBg: 'rgba(0,0,0,0.3)',
    modalBg: 'rgba(255,255,255,0.97)',
    accent: '#ec4899',
    accentAlt: '#db2777',
    accentSoft: 'rgba(236,72,153,0.12)',
    accentSofter: 'rgba(236,72,153,0.06)',
    accentText: '#be185d',
    cardShadow: '0 15px 40px rgba(236,72,153,0.1)',
    emptyColor: '#94a3b8',
    todayHighlight: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(168,85,247,0.06))',
    todayBorder: 'rgba(236,72,153,0.3)',
    selectOptionBg: '#ffffff',
  };
};

// ─── Style factories ──────────────────────────────────────────
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
  background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
  color: 'white',
  border: 'none',
  padding: '0.65rem 1.25rem',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.85rem',
  transition: 'all 0.2s',
  boxShadow: '0 4px 15px rgba(236,72,153,0.3)',
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
  animation: 'bdayFadeIn 0.25s ease',
});

const makeModalBox = (t) => ({
  ...makeGlass(t),
  background: t.modalBg,
  padding: '2rem',
  width: '92%',
  maxWidth: '520px',
  maxHeight: '88vh',
  overflowY: 'auto',
  boxShadow: t.cardShadow,
  animation: 'bdaySlideUp 0.3s ease',
  color: t.textPrimary,
});


// ═══════════════════════════════════════════════════════════════
//  ADD / EDIT BIRTHDAY MODAL
// ═══════════════════════════════════════════════════════════════
const BirthdayFormModal = ({ birthday, categories, onSave, onClose, theme: t }) => {
  const inputStyle = makeInputStyle(t);
  const labelStyle = makeLabelStyle(t);
  const btnGhost = makeBtnGhost(t);
  const modalOverlay = makeModalOverlay(t);
  const modalBox = makeModalBox(t);

  const [form, setForm] = useState({
    name: birthday?.name || '',
    month: birthday ? parseInt(birthday.birthday.split('-')[0]) : (new Date().getMonth() + 1),
    day: birthday ? parseInt(birthday.birthday.split('-')[1]) : new Date().getDate(),
    year: birthday?.year || '',
    category: birthday?.category || (categories[0] || 'Family'),
    notes: birthday?.notes || '',
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);

  const daysInMonth = new Date(2000, form.month, 0).getDate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const mm = form.month.toString().padStart(2, '0');
    const dd = Math.min(form.day, daysInMonth).toString().padStart(2, '0');
    onSave({
      id: birthday?.id || generateId(),
      name: form.name.trim(),
      birthday: `${mm}-${dd}`,
      year: form.year ? parseInt(form.year) : null,
      category: showNewCat && newCategory.trim() ? newCategory.trim() : form.category,
      notes: form.notes,
      lastNotifiedYear: birthday?.lastNotifiedYear || null,
      createdAt: birthday?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: t.textHeading, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🎂</span>
            {birthday ? 'Edit Birthday' : 'Add Birthday'}
          </h3>
          <button onClick={onClose} style={{ ...btnGhost, padding: '0.4rem 0.7rem' }}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Name *</label>
            <input value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Who's birthday?" style={inputStyle} required autoFocus />
          </div>

          {/* Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Month *</label>
              <select value={form.month}
                onChange={e => setForm(p => ({ ...p, month: parseInt(e.target.value) }))}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                {MONTH_NAMES.map((m, i) => (
                  <option key={i} value={i + 1} style={{ background: t.selectOptionBg }}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Day *</label>
              <select value={Math.min(form.day, daysInMonth)}
                onChange={e => setForm(p => ({ ...p, day: parseInt(e.target.value) }))}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d} style={{ background: t.selectOptionBg }}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Year <span style={{ color: t.textMuted, fontSize: '0.7rem' }}>(optional)</span></label>
              <input type="number" value={form.year}
                onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                placeholder="e.g., 1995" style={inputStyle}
                min="1900" max={new Date().getFullYear()} />
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Category</label>
            {!showNewCat ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ ...inputStyle, flex: 1, cursor: 'pointer' }}>
                  {[...new Set([...DEFAULT_CATEGORIES, ...categories])].map(c => (
                    <option key={c} value={c} style={{ background: t.selectOptionBg }}>{c}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setShowNewCat(true)}
                  style={{ ...btnGhost, padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.3rem' }} />
                  New
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category name..." style={{ ...inputStyle, flex: 1 }} autoFocus />
                <button type="button" onClick={() => setShowNewCat(false)}
                  style={{ ...btnGhost, padding: '0.5rem 0.75rem' }}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Gift ideas, reminders..."
              style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
            <button type="submit" style={btnPrimary}>
              {birthday ? 'Update' : 'Add Birthday'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
//  IMPORT / EXPORT MODAL
// ═══════════════════════════════════════════════════════════════
const ImportExportModal = ({ onClose, onImportDone, theme: t }) => {
  const btnGhost = makeBtnGhost(t);
  const modalOverlay = makeModalOverlay(t);
  const modalBox = makeModalBox(t);
  const glassCard = makeGlassCard(t);
  const inputStyle = makeInputStyle(t);
  const labelStyle = makeLabelStyle(t);

  const [importMode, setImportMode] = useState('merge');
  const [importPreview, setImportPreview] = useState(null);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileRef = useRef(null);

  const handleExport = async () => {
    try {
      const json = await exportBirthdays();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tudu-birthdays-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleFileSelect = (e) => {
    setImportError('');
    setImportSuccess('');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('JSON must be an array of birthday objects');
        // Validate structure
        const valid = data.every(d => d.name && d.birthday);
        if (!valid) throw new Error('Each entry must have "name" and "birthday" fields');
        setImportPreview(data);
      } catch (err) {
        setImportError(err.message);
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importPreview) return;
    try {
      const result = await importBirthdays(importPreview, importMode);
      setImportSuccess(`Imported ${result.total} birthdays (${result.added} new, ${result.skipped} updated)`);
      setImportPreview(null);
      onImportDone();
      triggerSWCheck();
    } catch (err) {
      setImportError('Import failed: ' + err.message);
    }
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: t.textHeading, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📦 Import / Export
          </h3>
          <button onClick={onClose} style={{ ...btnGhost, padding: '0.4rem 0.7rem' }}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Export */}
        <div style={{ ...glassCard, marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <FontAwesomeIcon icon={faFileExport} style={{ color: '#10b981', fontSize: '1.1rem' }} />
            <span style={{ fontWeight: '600', color: t.textPrimary }}>Export Birthdays</span>
          </div>
          <p style={{ color: t.textSecondary, fontSize: '0.85rem', margin: '0 0 0.75rem' }}>
            Download all your birthdays as a JSON file for backup or sharing.
          </p>
          <button onClick={handleExport} style={{ ...btnPrimary, width: '100%', background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
            <FontAwesomeIcon icon={faFileExport} style={{ marginRight: '0.4rem' }} />
            Download JSON
          </button>
        </div>

        {/* Import */}
        <div style={{ ...glassCard }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <FontAwesomeIcon icon={faFileImport} style={{ color: '#8b5cf6', fontSize: '1.1rem' }} />
            <span style={{ fontWeight: '600', color: t.textPrimary }}>Import Birthdays</span>
          </div>
          <p style={{ color: t.textSecondary, fontSize: '0.85rem', margin: '0 0 0.75rem' }}>
            Upload a JSON file to import birthdays. Each entry needs <code style={{ color: t.accentText }}>"name"</code> and <code style={{ color: t.accentText }}>"birthday"</code> (MM-DD).
          </p>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {['merge', 'replace'].map(mode => (
              <button key={mode} onClick={() => setImportMode(mode)}
                style={{
                  ...btnGhost,
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  background: importMode === mode ? t.accentSoft : t.btnGhostBg,
                  color: importMode === mode ? t.accentText : t.textMuted,
                  borderColor: importMode === mode ? t.accent : t.btnGhostBorder,
                }}>
                {mode === 'merge' ? '🔀 Merge' : '🔄 Replace All'}
              </button>
            ))}
          </div>
          {importMode === 'replace' && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '0.75rem',
              fontSize: '0.8rem', color: '#ef4444',
            }}>
              ⚠️ Replace will delete ALL existing birthdays before importing!
            </div>
          )}

          <input type="file" accept=".json" ref={fileRef} onChange={handleFileSelect}
            style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()}
            style={{ ...btnGhost, width: '100%', marginBottom: '0.75rem' }}>
            <FontAwesomeIcon icon={faFileImport} style={{ marginRight: '0.4rem' }} />
            Choose JSON File
          </button>

          {importError && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', borderRadius: '8px', padding: '0.5rem 0.75rem',
              fontSize: '0.82rem', color: '#ef4444', marginBottom: '0.5rem',
            }}>
              ❌ {importError}
            </div>
          )}

          {importSuccess && (
            <div style={{
              background: 'rgba(16,185,129,0.1)', borderRadius: '8px', padding: '0.5rem 0.75rem',
              fontSize: '0.82rem', color: '#10b981', marginBottom: '0.5rem',
            }}>
              ✅ {importSuccess}
            </div>
          )}

          {importPreview && (
            <div>
              <div style={{
                ...makeGlassCard(t), padding: '0.75rem', marginBottom: '0.75rem',
                maxHeight: '150px', overflowY: 'auto',
              }}>
                <div style={{ fontSize: '0.8rem', color: t.textSecondary, marginBottom: '0.5rem' }}>
                  Preview: {importPreview.length} entries
                </div>
                {importPreview.slice(0, 5).map((b, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem',
                    padding: '0.25rem 0', borderBottom: `1px solid ${t.glassBorder}`,
                    color: t.textPrimary,
                  }}>
                    <span>{b.name}</span>
                    <span style={{ color: t.textMuted }}>{b.birthday}</span>
                  </div>
                ))}
                {importPreview.length > 5 && (
                  <div style={{ fontSize: '0.78rem', color: t.textMuted, paddingTop: '0.25rem' }}>
                    ...and {importPreview.length - 5} more
                  </div>
                )}
              </div>
              <button onClick={handleImport} style={{ ...btnPrimary, width: '100%' }}>
                <FontAwesomeIcon icon={faCheck} style={{ marginRight: '0.4rem' }} />
                Import {importPreview.length} Birthdays
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button onClick={onClose} style={btnGhost}>Close</button>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
//  DELETE CONFIRM MODAL
// ═══════════════════════════════════════════════════════════════
const ConfirmModal = ({ message, onConfirm, onClose, theme: t }) => {
  const btnGhost = makeBtnGhost(t);
  return (
    <div style={makeModalOverlay(t)} onClick={onClose}>
      <div style={{ ...makeModalBox(t), maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⚠️</div>
        <p style={{ color: t.textPrimary, fontSize: '1rem', marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={onClose} style={btnGhost}>Cancel</button>
          <button onClick={onConfirm} style={{ ...btnPrimary, background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
//  MAIN BIRTHDAY SYSTEM COMPONENT
// ═══════════════════════════════════════════════════════════════
const BirthdaySys = () => {
  // ─── State ────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('birthdayTheme');
    return saved ? saved === 'dark' : true;
  });
  const t = useMemo(() => makeTheme(isDark), [isDark]);

  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('upcoming'); // 'upcoming', 'name', 'category'
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [notifPermission, setNotifPermission] = useState(Notification?.permission || 'default');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showUpcomingExpanded, setShowUpcomingExpanded] = useState(false);

  // ─── Load data ────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const data = await getAllBirthdays();
      setBirthdays(data);
      const cats = [...new Set(data.map(b => b.category).filter(Boolean))];
      const mergedCats = [...new Set([...DEFAULT_CATEGORIES, ...cats])];
      setCategories(mergedCats);
    } catch (err) {
      console.error('Failed to load birthdays:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // On mount check — Trick 3: Handle browser kill recovery
    triggerSWCheck();
  }, [loadData]);

  useEffect(() => {
    localStorage.setItem('birthdayTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Listen for SW messages (navigate to birthdays on notification click)
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === 'NAVIGATE_BIRTHDAYS') {
        // Already on this page, just refresh
        loadData();
      }
    };
    navigator.serviceWorker?.addEventListener('message', handler);
    return () => navigator.serviceWorker?.removeEventListener('message', handler);
  }, [loadData]);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleSaveBirthday = async (data) => {
    try {
      if (editingBirthday) {
        await updateBirthday(data.id, data);
      } else {
        await addBirthday(data);
      }
      await loadData();
      setShowAddModal(false);
      setEditingBirthday(null);
      triggerSWCheck();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleDeleteBirthday = async (id) => {
    try {
      await deleteBirthday(id);
      await loadData();
      setConfirmDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const requestNotifPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
  };

  // ─── Computed / filtered data ─────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...birthdays];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        (b.notes || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(b => b.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'upcoming') {
        return getDaysUntil(a.birthday) - getDaysUntil(b.birthday);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '');
      }
      return 0;
    });

    return result;
  }, [birthdays, searchQuery, selectedCategory, sortBy]);

  const todayBirthdays = useMemo(() => {
    const today = new Date();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    const todayStr = `${mm}-${dd}`;
    return birthdays.filter(b => b.birthday === todayStr);
  }, [birthdays]);

  const upcomingWeek = useMemo(() => {
    return birthdays
      .map(b => ({ ...b, daysUntil: getDaysUntil(b.birthday) }))
      .filter(b => b.daysUntil > 0 && b.daysUntil <= 7)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [birthdays]);

  const upcomingMonth = useMemo(() => {
    return birthdays
      .map(b => ({ ...b, daysUntil: getDaysUntil(b.birthday) }))
      .filter(b => b.daysUntil > 0 && b.daysUntil <= 30)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [birthdays]);

  // ─── Styles ───────────────────────────────────────────────────
  const glassCard = makeGlassCard(t);
  const btnGhost = makeBtnGhost(t);
  const inputStyle = makeInputStyle(t);

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className={`birthday-root ${isDark ? '' : 'birthday-light'}`}
        style={{ background: t.rootBg, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', color: t.textMuted }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'bdayBounce 1s ease infinite' }}>🎂</div>
          <p>Loading birthdays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`birthday-root ${isDark ? '' : 'birthday-light'} resys-scrollbar`}
      style={{ background: t.rootBg, minHeight: '100vh' }}>

      {/* ═══════ HEADER ═══════ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800',
            background: 'linear-gradient(135deg, #ec4899, #a855f7, #6366f1)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: '1.2', letterSpacing: '-0.02em',
          }}>
            🎂 Birthday Hub
          </h1>
          <p style={{ color: t.textSecondary, margin: '0.5rem 0 0', fontSize: '0.95rem' }}>
            Never forget a birthday again
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Notification permission */}
          <button onClick={requestNotifPermission}
            style={{
              ...btnGhost,
              padding: '0.5rem 0.85rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: notifPermission === 'granted' ? 'rgba(16,185,129,0.15)' : (notifPermission === 'denied' ? 'rgba(239,68,68,0.15)' : t.btnGhostBg),
              color: notifPermission === 'granted' ? '#10b981' : (notifPermission === 'denied' ? '#ef4444' : t.btnGhostColor),
              borderColor: notifPermission === 'granted' ? 'rgba(16,185,129,0.3)' : (notifPermission === 'denied' ? 'rgba(239,68,68,0.3)' : t.btnGhostBorder),
            }}
            title={notifPermission === 'granted' ? 'Notifications enabled' : 'Click to enable notifications'}>
            <FontAwesomeIcon icon={notifPermission === 'granted' ? faBell : faBellSlash} />
            <span style={{ fontSize: '0.78rem' }}>{notifPermission === 'granted' ? 'On' : notifPermission === 'denied' ? 'Blocked' : 'Enable'}</span>
          </button>

          {/* Import/Export */}
          <button onClick={() => setShowImportExport(true)} style={{ ...btnGhost, padding: '0.5rem 0.85rem' }}
            title="Import / Export">
            <FontAwesomeIcon icon={faFileExport} />
          </button>

          {/* Theme toggle */}
          <button onClick={() => setIsDark(prev => !prev)}
            style={{ ...btnGhost, padding: '0.5rem 0.75rem' }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <FontAwesomeIcon icon={isDark ? faSun : faMoon} style={{ color: isDark ? '#fbbf24' : '#6366f1' }} />
          </button>

          {/* Add button */}
          <button onClick={() => { setEditingBirthday(null); setShowAddModal(true); }}
            style={{ ...btnPrimary, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Add</span>
          </button>
        </div>
      </div>


      {/* ═══════ DASHBOARD STAT CARDS ═══════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {/* Today's birthdays */}
        <div style={{
          ...glassCard,
          background: todayBirthdays.length > 0 ? t.todayHighlight : t.glassBg,
          border: todayBirthdays.length > 0 ? `1px solid ${t.todayBorder}` : `1px solid ${t.glassBorder}`,
          position: 'relative', overflow: 'hidden',
        }}>
          {todayBirthdays.length > 0 && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: 'linear-gradient(90deg, #ec4899, #a855f7, #ec4899)',
              animation: 'bdayShimmer 2s ease-in-out infinite',
            }} />
          )}
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: todayBirthdays.length > 0 ? '#ec4899' : t.textPrimary }}>
            {todayBirthdays.length}
          </div>
          <div style={{ fontSize: '0.82rem', color: t.textSecondary, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Today
          </div>
          {todayBirthdays.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: t.accentText }}>
              {todayBirthdays.map(b => b.name).join(', ')}
            </div>
          )}
        </div>

        {/* Upcoming 7 days */}
        <div style={glassCard}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: t.textPrimary }}>{upcomingWeek.length}</div>
          <div style={{ fontSize: '0.82rem', color: t.textSecondary, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            This Week
          </div>
          {upcomingWeek.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: t.textMuted }}>
              Next: {upcomingWeek[0].name} in {upcomingWeek[0].daysUntil}d
            </div>
          )}
        </div>

        {/* Total count */}
        <div style={glassCard}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎂</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: t.textPrimary }}>{birthdays.length}</div>
          <div style={{ fontSize: '0.82rem', color: t.textSecondary, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total
          </div>
        </div>

        {/* Categories count */}
        <div style={glassCard}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏷️</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: t.textPrimary }}>{categories.length}</div>
          <div style={{ fontSize: '0.82rem', color: t.textSecondary, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Categories
          </div>
        </div>
      </div>


      {/* ═══════ TODAY'S BIRTHDAY HIGHLIGHT ═══════ */}
      {todayBirthdays.length > 0 && (
        <div style={{
          ...glassCard,
          background: t.todayHighlight,
          border: `1px solid ${t.todayBorder}`,
          marginBottom: '2rem',
          padding: '1.5rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: 'linear-gradient(90deg, #ec4899, #a855f7, #6366f1, #ec4899)',
            backgroundSize: '200% 100%',
            animation: 'bdayShimmer 3s linear infinite',
          }} />
          <h3 style={{ margin: '0 0 1rem', color: t.textHeading, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🎉 Today's Birthdays!
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {todayBirthdays.map(b => {
              const age = getAge(b.year);
              return (
                <div key={b.id} style={{
                  ...makeGlassCard(t),
                  padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  borderLeft: `3px solid ${getCategoryColor(b.category)}`,
                  animation: 'bdayBounce 0.6s ease',
                  flex: '1 1 250px',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', flexShrink: 0,
                  }}>
                    🎂
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: t.textPrimary, fontSize: '1.05rem' }}>{b.name}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {age && (
                        <span style={{
                          background: t.accentSoft, color: t.accentText,
                          padding: '0.1rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600',
                        }}>
                          Turning {age}
                        </span>
                      )}
                      <span style={{
                        background: `${getCategoryColor(b.category)}20`,
                        color: getCategoryColor(b.category),
                        padding: '0.1rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500',
                      }}>
                        {b.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* ═══════ UPCOMING TIMELINE ═══════ */}
      {upcomingMonth.length > 0 && (
        <div style={{ ...glassCard, marginBottom: '2rem', padding: '1.5rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '1rem', cursor: 'pointer',
          }}
            onClick={() => setShowUpcomingExpanded(!showUpcomingExpanded)}>
            <h3 style={{ margin: 0, color: t.textHeading, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📆 Upcoming Birthdays
              <span style={{
                background: t.accentSoft, color: t.accentText,
                padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.78rem',
              }}>{upcomingMonth.length}</span>
            </h3>
            <FontAwesomeIcon icon={showUpcomingExpanded ? faChevronUp : faChevronDown}
              style={{ color: t.textMuted, fontSize: '0.85rem' }} />
          </div>

          {/* Always show first 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {(showUpcomingExpanded ? upcomingMonth : upcomingMonth.slice(0, 3)).map(b => {
              const age = b.year ? (new Date().getFullYear() - b.year + (getDaysUntil(b.birthday) <= 0 ? 0 : 1)) : null;
              return (
                <div key={b.id} style={{
                  ...makeGlassCard(t),
                  padding: '0.75rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  borderLeft: `3px solid ${getCategoryColor(b.category)}`,
                }}>
                  {/* Days countdown */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: b.daysUntil <= 3 ? 'linear-gradient(135deg, #ec4899, #f43f5e)' : t.accentSofter,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', flexShrink: 0,
                  }}>
                    <span style={{
                      fontSize: '1rem', fontWeight: '800',
                      color: b.daysUntil <= 3 ? '#fff' : t.accentText,
                      lineHeight: 1,
                    }}>{b.daysUntil}</span>
                    <span style={{
                      fontSize: '0.55rem', fontWeight: '600',
                      color: b.daysUntil <= 3 ? 'rgba(255,255,255,0.8)' : t.textMuted,
                      textTransform: 'uppercase',
                    }}>days</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', color: t.textPrimary, fontSize: '0.92rem' }}>{b.name}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.78rem', color: t.textSecondary }}>
                      <span>{formatBirthdayDisplay(b.birthday, b.year)}</span>
                      {age && <span style={{ color: t.textMuted }}>• turning {age}</span>}
                      <span style={{ color: getCategoryColor(b.category) }}>• {b.category}</span>
                    </div>
                  </div>

                  {/* Zodiac */}
                  <span style={{
                    fontSize: '0.75rem', color: t.textMuted,
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                  }}>
                    {getZodiacSign(b.birthday).split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {!showUpcomingExpanded && upcomingMonth.length > 3 && (
            <button onClick={() => setShowUpcomingExpanded(true)}
              style={{ ...btnGhost, width: '100%', marginTop: '0.75rem', fontSize: '0.82rem', padding: '0.5rem' }}>
              Show {upcomingMonth.length - 3} more
            </button>
          )}
        </div>
      )}


      {/* ═══════ SEARCH + FILTER BAR ═══════ */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <FontAwesomeIcon icon={faSearch} style={{
            position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
            color: t.textMuted, fontSize: '0.85rem',
          }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, category..."
            style={{ ...inputStyle, paddingLeft: '2.5rem' }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{
              position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', padding: '0.25rem',
            }}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.75rem' }} />
            </button>
          )}
        </div>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ ...inputStyle, width: 'auto', cursor: 'pointer', minWidth: '140px' }}>
          <option value="upcoming" style={{ background: t.selectOptionBg }}>⏰ Upcoming</option>
          <option value="name" style={{ background: t.selectOptionBg }}>🔤 Name</option>
          <option value="category" style={{ background: t.selectOptionBg }}>🏷️ Category</option>
        </select>
      </div>


      {/* ═══════ CATEGORY PILLS ═══════ */}
      <div style={{
        display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem',
        overflowX: 'auto', paddingBottom: '4px',
      }}>
        <button onClick={() => setSelectedCategory('All')}
          style={{
            ...btnGhost,
            padding: '0.4rem 0.85rem',
            fontSize: '0.82rem',
            background: selectedCategory === 'All' ? t.accentSoft : t.btnGhostBg,
            color: selectedCategory === 'All' ? t.accentText : t.textMuted,
            borderColor: selectedCategory === 'All' ? t.accent : t.btnGhostBorder,
          }}>
          All ({birthdays.length})
        </button>
        {categories.map(cat => {
          const count = birthdays.filter(b => b.category === cat).length;
          if (count === 0 && !DEFAULT_CATEGORIES.includes(cat)) return null;
          return (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              style={{
                ...btnGhost,
                padding: '0.4rem 0.85rem',
                fontSize: '0.82rem',
                background: selectedCategory === cat ? `${getCategoryColor(cat)}20` : t.btnGhostBg,
                color: selectedCategory === cat ? getCategoryColor(cat) : t.textMuted,
                borderColor: selectedCategory === cat ? getCategoryColor(cat) : t.btnGhostBorder,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: getCategoryColor(cat),
              }} />
              {cat} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>


      {/* ═══════ BIRTHDAY LIST ═══════ */}
      {filtered.length === 0 ? (
        <div style={{
          ...glassCard, textAlign: 'center', padding: '4rem 2rem',
          border: `2px dashed ${t.glassBorder}`,
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.6 }}>🎂</div>
          <p style={{ color: t.textSecondary, fontSize: '1.1rem', fontWeight: '500', margin: '0 0 0.5rem' }}>
            {birthdays.length === 0 ? 'No birthdays yet' : 'No matches found'}
          </p>
          <p style={{ color: t.textMuted, fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
            {birthdays.length === 0
              ? 'Add your first birthday or import from a JSON file!'
              : 'Try adjusting your search or filter.'}
          </p>
          {birthdays.length === 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setEditingBirthday(null); setShowAddModal(true); }}
                style={btnPrimary}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.4rem' }} />
                Add Birthday
              </button>
              <button onClick={() => setShowImportExport(true)}
                style={{ ...btnPrimary, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <FontAwesomeIcon icon={faFileImport} style={{ marginRight: '0.4rem' }} />
                Import JSON
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '0.85rem',
        }}>
          {filtered.map(b => {
            const daysUntil = getDaysUntil(b.birthday);
            const age = getAge(b.year);
            const nextAge = b.year ? age + (daysUntil > 0 ? 1 : 0) : null;
            const isToday = daysUntil === 0;
            const zodiac = getZodiacSign(b.birthday);
            const catColor = getCategoryColor(b.category);

            return (
              <div key={b.id} style={{
                ...glassCard,
                padding: '1rem 1.25rem',
                borderLeft: `3px solid ${catColor}`,
                background: isToday ? t.todayHighlight : t.glassBg,
                border: isToday ? `1px solid ${t.todayBorder}` : `1px solid ${t.glassBorder}`,
                borderLeft: `3px solid ${catColor}`,
                position: 'relative',
                cursor: 'default',
              }}
                className="bday-card-hover">
                {/* Today indicator */}
                {isToday && (
                  <div style={{
                    position: 'absolute', top: '0.75rem', right: '0.75rem',
                    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                    color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '6px',
                    fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
                    animation: 'bdayPulse 2s ease-in-out infinite',
                  }}>
                    🎉 Today!
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${catColor}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', flexShrink: 0,
                    border: `1px solid ${catColor}30`,
                  }}>
                    {isToday ? '🎂' : '🎁'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name */}
                    <div style={{
                      fontWeight: '700', color: t.textPrimary, fontSize: '1rem',
                      marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {b.name}
                    </div>

                    {/* Date */}
                    <div style={{ fontSize: '0.85rem', color: t.textSecondary, marginBottom: '0.4rem' }}>
                      {formatBirthdayDisplay(b.birthday, b.year)}
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {/* Days until */}
                      <span style={{
                        background: daysUntil <= 7 ? 'rgba(236,72,153,0.15)' : t.accentSofter,
                        color: daysUntil <= 7 ? '#ec4899' : t.textMuted,
                        padding: '0.1rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600',
                      }}>
                        {isToday ? 'Today!' : daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days`}
                      </span>

                      {/* Category */}
                      <span style={{
                        background: `${catColor}15`,
                        color: catColor,
                        padding: '0.1rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '500',
                      }}>
                        {b.category}
                      </span>

                      {/* Age */}
                      {nextAge && (
                        <span style={{
                          background: 'rgba(99,102,241,0.1)', color: '#818cf8',
                          padding: '0.1rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '500',
                        }}>
                          {isToday ? `Age ${age}` : `→ ${nextAge}`}
                        </span>
                      )}

                      {/* Zodiac */}
                      <span style={{
                        background: t.glassBg, color: t.textMuted,
                        padding: '0.1rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem',
                      }}>
                        {zodiac.split(' ')[0]}
                      </span>
                    </div>

                    {/* Notes */}
                    {b.notes && (
                      <div style={{
                        marginTop: '0.4rem', fontSize: '0.8rem', color: t.textMuted,
                        fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        💭 {b.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <button onClick={() => { setEditingBirthday(b); setShowAddModal(true); }}
                      style={{
                        background: 'none', border: 'none', color: t.textMuted,
                        cursor: 'pointer', padding: '0.3rem', borderRadius: '6px',
                        transition: 'color 0.2s',
                      }}
                      title="Edit">
                      <FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.82rem' }} />
                    </button>
                    <button onClick={() => setConfirmDelete(b)}
                      style={{
                        background: 'none', border: 'none', color: 'rgba(239,68,68,0.5)',
                        cursor: 'pointer', padding: '0.3rem', borderRadius: '6px',
                        transition: 'color 0.2s',
                      }}
                      title="Delete">
                      <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.82rem' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════ MONTH BY MONTH OVERVIEW ═══════ */}
      {birthdays.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div style={{ ...glassCard, marginTop: '2rem', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', color: t.textHeading, fontSize: '1.1rem' }}>
            📊 Monthly Overview
          </h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem',
          }}>
            {MONTH_NAMES.map((m, i) => {
              const count = birthdays.filter(b => {
                const bm = parseInt(b.birthday.split('-')[0]);
                return bm === i + 1;
              }).length;
              const maxCount = Math.max(...MONTH_NAMES.map((_, mi) =>
                birthdays.filter(b => parseInt(b.birthday.split('-')[0]) === mi + 1).length
              ), 1);
              const intensity = count / maxCount;

              return (
                <div key={m} style={{
                  textAlign: 'center', padding: '0.6rem 0.4rem',
                  borderRadius: '10px',
                  background: count > 0
                    ? `rgba(236,72,153,${0.05 + intensity * 0.2})`
                    : t.glassBg,
                  border: `1px solid ${count > 0 ? `rgba(236,72,153,${0.1 + intensity * 0.2})` : t.glassBorder}`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: '0.72rem', color: t.textMuted, fontWeight: '500', marginBottom: '0.25rem' }}>{m}</div>
                  <div style={{
                    fontSize: '1.1rem', fontWeight: '700',
                    color: count > 0 ? '#ec4899' : t.textMuted,
                  }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* ═══════ MODALS ═══════ */}
      {showAddModal && (
        <BirthdayFormModal
          birthday={editingBirthday}
          categories={categories}
          onSave={handleSaveBirthday}
          onClose={() => { setShowAddModal(false); setEditingBirthday(null); }}
          theme={t}
        />
      )}

      {showImportExport && (
        <ImportExportModal
          onClose={() => setShowImportExport(false)}
          onImportDone={loadData}
          theme={t}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Delete ${confirmDelete.name}'s birthday?`}
          onConfirm={() => handleDeleteBirthday(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
          theme={t}
        />
      )}
    </div>
  );
};

export default BirthdaySys;
