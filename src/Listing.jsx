import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faTrash, faEdit, faTimes, faImage,
  faFolder, faBox, faExclamationCircle, faSortUp, faSortDown, faSort,
  faFilter, faColumns
} from '@fortawesome/free-solid-svg-icons';

const CategoryItemManager = () => {
  // Load data from localStorage on initial render
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  });
  
  const [categoryColumns, setCategoryColumns] = useState(() => {
    const saved = localStorage.getItem('categoryColumns');
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (error) {
      console.error('Error loading category columns:', error);
      return {};
    }
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('items');
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      console.error('Error loading items:', error);
      return {};
    }
  });

  const [editingItem, setEditingItem] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemFormData, setItemFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({});
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('text');

  // Save to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }, [categories]);

  React.useEffect(() => {
    try {
      localStorage.setItem('categoryColumns', JSON.stringify(categoryColumns));
    } catch (error) {
      console.error('Error saving category columns:', error);
    }
  }, [categoryColumns]);

  React.useEffect(() => {
    try {
      localStorage.setItem('items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving items:', error);
    }
  }, [items]);

  // Add new category
  const addCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      const category = newCategoryName.trim();
      setCategories([...categories, category]);
      setItems({ ...items, [category]: [] });
      setCategoryColumns({ 
        ...categoryColumns, 
        [category]: [
          { name: 'name', type: 'text', required: true },
          { name: 'url', type: 'url', required: true }
        ] 
      });
      setNewCategoryName('');
      setSelectedCategory(category);
    }
  };

  // Delete category
  const deleteCategory = (categoryToDelete) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    const newItems = { ...items };
    delete newItems[categoryToDelete];
    setItems(newItems);
    const newColumns = { ...categoryColumns };
    delete newColumns[categoryToDelete];
    setCategoryColumns(newColumns);
    if (selectedCategory === categoryToDelete) {
      setSelectedCategory('');
    }
  };

  // Add column to category
  const addColumnToCategory = () => {
    if (!selectedCategory || !newColumnName.trim()) return;
    
    const columnName = newColumnName.trim().toLowerCase().replace(/\s+/g, '_');
    const columns = categoryColumns[selectedCategory] || [];
    
    if (columns.some(col => col.name === columnName)) {
      alert('Column already exists!');
      return;
    }

    setCategoryColumns({
      ...categoryColumns,
      [selectedCategory]: [
        ...columns,
        { name: columnName, type: newColumnType, required: false }
      ]
    });
    
    setNewColumnName('');
    setNewColumnType('text');
  };

  // Remove column from category
  const removeColumnFromCategory = (columnName) => {
    if (columnName === 'name' || columnName === 'url') {
      alert('Cannot remove required columns (name, url)');
      return;
    }

    setCategoryColumns({
      ...categoryColumns,
      [selectedCategory]: categoryColumns[selectedCategory].filter(col => col.name !== columnName)
    });
  };

  // Get unique values for discrete columns
  const getUniqueValues = (columnName) => {
    if (!selectedCategory) return [];
    const categoryItems = items[selectedCategory] || [];
    const values = categoryItems
      .map(item => item[columnName])
      .filter(val => val !== undefined && val !== null && val !== '');
    return [...new Set(values)].sort();
  };

  // Column options management
  const [columnOptions, setColumnOptions] = useState(() => {
    const saved = localStorage.getItem('columnOptions');
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (error) {
      console.error('Error loading column options:', error);
      return {};
    }
  });

  const [newOption, setNewOption] = useState('');
  const [editingColumn, setEditingColumn] = useState(null);

  React.useEffect(() => {
    try {
      localStorage.setItem('columnOptions', JSON.stringify(columnOptions));
    } catch (error) {
      console.error('Error saving column options:', error);
    }
  }, [columnOptions]);

  const addOptionToColumn = (category, columnName) => {
    if (!newOption.trim()) return;
    
    const key = `${category}-${columnName}`;
    const options = columnOptions[key] || [];
    
    if (options.includes(newOption.trim())) {
      alert('Option already exists!');
      return;
    }

    setColumnOptions({
      ...columnOptions,
      [key]: [...options, newOption.trim()]
    });
    
    setNewOption('');
  };

  const removeOptionFromColumn = (category, columnName, option) => {
    const key = `${category}-${columnName}`;
    setColumnOptions({
      ...columnOptions,
      [key]: (columnOptions[key] || []).filter(opt => opt !== option)
    });
  };

  const getColumnOptions = (category, columnName) => {
    const key = `${category}-${columnName}`;
    return columnOptions[key] || [];
  };

  // Add or update item
  const addOrUpdateItem = () => {
    if (!selectedCategory || !itemFormData.name?.trim()) return;

    const columns = categoryColumns[selectedCategory] || [];
    const newItem = {
      id: editingItem ? editingItem.id : Date.now(),
      ...itemFormData
    };

    if (editingItem) {
      setItems({
        ...items,
        [selectedCategory]: items[selectedCategory].map(item =>
          item.id === editingItem.id ? newItem : item
        )
      });
    } else {
      setItems({
        ...items,
        [selectedCategory]: [...(items[selectedCategory] || []), newItem]
      });
    }

    resetItemForm();
  };

  // Delete item
  const deleteItem = (itemId) => {
    setItems({
      ...items,
      [selectedCategory]: items[selectedCategory].filter(item => item.id !== itemId)
    });
  };

  // Start editing item
  const startEditItem = (item) => {
    setEditingItem(item);
    setItemFormData({ ...item });
    setShowItemForm(true);
  };

  // Reset item form
  const resetItemForm = () => {
    setItemFormData({});
    setEditingItem(null);
    setShowItemForm(false);
  };

  // Truncate text with ellipsis
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply filters
  const applyFilters = (itemsList) => {
    return itemsList.filter(item => {
      return Object.entries(filters).every(([columnName, filterValue]) => {
        if (!filterValue || (typeof filterValue === 'object' && !filterValue.min && !filterValue.max && !filterValue.value)) {
          return true;
        }

        const itemValue = item[columnName];
        const column = (categoryColumns[selectedCategory] || []).find(col => col.name === columnName);
        
        if (column?.type === 'number') {
          const numValue = parseFloat(itemValue);
          if (isNaN(numValue)) return false;
          
          // Range filter
          if (filterValue.min !== undefined && filterValue.min !== '' && numValue < parseFloat(filterValue.min)) return false;
          if (filterValue.max !== undefined && filterValue.max !== '' && numValue > parseFloat(filterValue.max)) return false;
        } else if (column?.type === 'boolean') {
          // Boolean filter
          if (filterValue.value && itemValue !== filterValue.value) return false;
        } else if (column?.type === 'select') {
          // Select filter
          if (filterValue && itemValue !== filterValue) return false;
        } else {
          // Text filter
          return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
        }
        
        return true;
      });
    });
  };

  // Get sorted and filtered items
  const getSortedFilteredItems = () => {
    if (!selectedCategory) return [];
    
    let categoryItems = [...(items[selectedCategory] || [])];
    
    // Apply filters
    categoryItems = applyFilters(categoryItems);
    
    // Filter by search query
    if (searchQuery.trim()) {
      categoryItems = categoryItems.filter(item => {
        return Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }
    
    // Sort
    categoryItems.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      const column = (categoryColumns[selectedCategory] || []).find(col => col.name === sortField);
      if (column?.type === 'number') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (sortDirection === 'asc') {
        return String(aValue).localeCompare(String(bValue));
      } else {
        return String(bValue).localeCompare(String(aValue));
      }
    });
    
    return categoryItems;
  };

  const filteredItems = getSortedFilteredItems();

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return faSort;
    return sortDirection === 'asc' ? faSortUp : faSortDown;
  };

  const columns = selectedCategory ? (categoryColumns[selectedCategory] || []) : [];

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1800px',
      margin: '0 auto',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '0.5rem'
        }}>
          Dynamic Category & Item Manager
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Create categories with custom columns and manage items dynamically
        </p>
      </div>

      {/* Category Creation */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{
          color: '#1e293b',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📁 Create Category
        </h3>
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Enter category name..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={addCategory}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Category
          </button>
        </div>

        {/* Category List */}
        {categories.length > 0 && (
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {categories.map(category => (
              <div
                key={category}
                style={{
                  background: selectedCategory === category ? '#3b82f6' : '#f1f5f9',
                  color: selectedCategory === category ? 'white' : '#475569',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => {
                  setSelectedCategory(category);
                  setFilters({});
                  setSearchQuery('');
                }}
              >
                <span style={{ fontWeight: '500' }}>{category}</span>
                <span style={{
                  background: selectedCategory === category ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem'
                }}>
                  {(items[category] || []).length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(category);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} size="sm" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Column Manager */}
      {selectedCategory && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              color: '#1e293b',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FontAwesomeIcon icon={faColumns} />
              Manage Columns for {selectedCategory}
            </h3>
            <button
              onClick={() => setShowColumnManager(!showColumnManager)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                color: '#475569'
              }}
            >
              {showColumnManager ? 'Hide' : 'Show'} Column Manager
            </button>
          </div>

          {showColumnManager && (
            <>
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Column name..."
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
                <select
                  value={newColumnType}
                  onChange={(e) => setNewColumnType(e.target.value)}
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    minWidth: '150px'
                  }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="url">URL</option>
                  <option value="select">Select/Dropdown</option>
                  <option value="boolean">Boolean</option>
                </select>
                <button
                  onClick={addColumnToCategory}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add Column
                </button>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {columns.map(col => (
                  <div
                    key={col.name}
                    style={{
                      background: col.required ? '#dbeafe' : '#f1f5f9',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{col.name}</span>
                    <span style={{
                      background: 'rgba(0,0,0,0.1)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '10px',
                      fontSize: '0.75rem'
                    }}>
                      {col.type}
                    </span>
                    {col.type === 'select' && (
                      <button
                        onClick={() => setEditingColumn(editingColumn === col.name ? null : col.name)}
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: 'none',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                      >
                        Options
                      </button>
                    )}
                    {!col.required && (
                      <button
                        onClick={() => removeColumnFromCategory(col.name)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} size="sm" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Dropdown Options Manager */}
              {editingColumn && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  border: '2px solid #bae6fd'
                }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#0369a1' }}>
                    Manage options for "{editingColumn}"
                  </h4>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addOptionToColumn(selectedCategory, editingColumn)}
                      placeholder="Add new option..."
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button
                      onClick={() => addOptionToColumn(selectedCategory, editingColumn)}
                      style={{
                        background: '#0ea5e9',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.85rem'
                      }}
                    >
                      Add
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {getColumnOptions(selectedCategory, editingColumn).map(option => (
                      <div
                        key={option}
                        style={{
                          background: 'white',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem'
                        }}
                      >
                        <span>{option}</span>
                        <button
                          onClick={() => removeOptionFromColumn(selectedCategory, editingColumn, option)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} size="xs" />
                        </button>
                      </div>
                    ))}
                    {getColumnOptions(selectedCategory, editingColumn).length === 0 && (
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                        No options yet. Add options above.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Item Management */}
      {selectedCategory && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: showItemForm ? '400px 1fr' : '1fr',
          gap: '2rem'
        }}>
          {/* Left Panel - Item Input */}
          {showItemForm && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{
                color: '#1e293b',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {editingItem ? '✏️ Edit Item' : '➕ Add Item'}
              </h3>

              {columns.map(col => (
                <div key={col.name} style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#475569'
                  }}>
                    {col.name} {col.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>
                  
                  {col.type === 'select' ? (
                    <select
                      value={itemFormData[col.name] || ''}
                      onChange={(e) => setItemFormData({ ...itemFormData, [col.name]: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Select {col.name}...</option>
                      {getColumnOptions(selectedCategory, col.name).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : col.type === 'boolean' ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={col.name}
                          value="Yes"
                          checked={itemFormData[col.name] === 'Yes'}
                          onChange={(e) => setItemFormData({ ...itemFormData, [col.name]: e.target.value })}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Yes</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={col.name}
                          value="No"
                          checked={itemFormData[col.name] === 'No'}
                          onChange={(e) => setItemFormData({ ...itemFormData, [col.name]: e.target.value })}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  ) : col.type === 'number' ? (
                    <input
                      type="number"
                      value={itemFormData[col.name] || ''}
                      onChange={(e) => setItemFormData({ ...itemFormData, [col.name]: e.target.value })}
                      placeholder={`Enter ${col.name}...`}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  ) : (
                    <input
                      type={col.type === 'url' ? 'url' : 'text'}
                      value={itemFormData[col.name] || ''}
                      onChange={(e) => setItemFormData({ ...itemFormData, [col.name]: e.target.value })}
                      placeholder={col.type === 'url' ? 'https://...' : `Enter ${col.name}...`}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={resetItemForm}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#64748b'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addOrUpdateItem}
                  disabled={!itemFormData.name?.trim()}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: 'none',
                    background: itemFormData.name?.trim() ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e2e8f0',
                    color: itemFormData.name?.trim() ? 'white' : '#94a3b8',
                    borderRadius: '8px',
                    cursor: itemFormData.name?.trim() ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FontAwesomeIcon icon={editingItem ? faEdit : faPlus} />
                  {editingItem ? 'Update' : 'Insert'}
                </button>
              </div>
            </div>
          )}

          {/* Right Panel - Items Table */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <h3 style={{
                  color: '#1e293b',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📦 Items in {selectedCategory}
                  <span style={{
                    background: '#e0e7ff',
                    color: '#4f46e5',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {filteredItems.length} / {(items[selectedCategory] || []).length}
                  </span>
                </h3>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {/* Search Bar */}
                  <div style={{ position: 'relative', width: '250px' }}>
                    <FontAwesomeIcon 
                      icon={faSearch}
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8'
                      }}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items..."
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <button
                    onClick={() => setShowItemForm(true)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600',
                  color: '#475569'
                }}>
                  <FontAwesomeIcon icon={faFilter} />
                  Filters:
                </div>
                
                {columns.filter(col => col.name !== 'url').map(col => {
                  return (
                    <div key={col.name} style={{ minWidth: '150px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '0.25rem',
                        fontWeight: '500'
                      }}>
                        {col.name}
                      </label>
                      
                      {col.type === 'number' ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters[col.name]?.min || ''}
                            onChange={(e) => setFilters({
                              ...filters,
                              [col.name]: { ...filters[col.name], min: e.target.value }
                            })}
                            style={{
                              width: '70px',
                              padding: '0.5rem',
                              border: '2px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '0.85rem'
                            }}
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters[col.name]?.max || ''}
                            onChange={(e) => setFilters({
                              ...filters,
                              [col.name]: { ...filters[col.name], max: e.target.value }
                            })}
                            style={{
                              width: '70px',
                              padding: '0.5rem',
                              border: '2px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>
                      ) : col.type === 'boolean' ? (
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                              type="radio"
                              name={`filter-${col.name}`}
                              value=""
                              checked={!filters[col.name]?.value}
                              onChange={() => setFilters({
                                ...filters,
                                [col.name]: { value: '' }
                              })}
                              style={{ cursor: 'pointer' }}
                            />
                            <span>All</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                              type="radio"
                              name={`filter-${col.name}`}
                              value="Yes"
                              checked={filters[col.name]?.value === 'Yes'}
                              onChange={(e) => setFilters({
                                ...filters,
                                [col.name]: { value: e.target.value }
                              })}
                              style={{ cursor: 'pointer' }}
                            />
                            <span>Yes</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                              type="radio"
                              name={`filter-${col.name}`}
                              value="No"
                              checked={filters[col.name]?.value === 'No'}
                              onChange={(e) => setFilters({
                                ...filters,
                                [col.name]: { value: e.target.value }
                              })}
                              style={{ cursor: 'pointer' }}
                            />
                            <span>No</span>
                          </label>
                        </div>
                      ) : col.type === 'select' ? (
                        <select
                          value={filters[col.name] || ''}
                          onChange={(e) => setFilters({
                            ...filters,
                            [col.name]: e.target.value
                          })}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <option value="">All</option>
                          {getColumnOptions(selectedCategory, col.name).map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder={`Filter ${col.name}...`}
                          value={filters[col.name] || ''}
                          onChange={(e) => setFilters({
                            ...filters,
                            [col.name]: e.target.value
                          })}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '0.85rem'
                          }}
                        />
                      )}
                    </div>
                  );
                })}

                {Object.keys(filters).some(key => {
                  const val = filters[key];
                  if (typeof val === 'object') {
                    return val.min || val.max || val.value;
                  }
                  return val;
                }) && (
                  <button
                    onClick={() => setFilters({})}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      alignSelf: 'flex-end'
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {(items[selectedCategory] || []).length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>No items yet</h4>
                  <p style={{ margin: 0 }}>Add your first item to this category</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>No results found</h4>
                  <p style={{ margin: 0 }}>Try adjusting your filters or search</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '800px'
                  }}>
                    <thead>
                      <tr style={{
                        background: '#f8fafc',
                        borderBottom: '2px solid #e2e8f0'
                      }}>
                        {columns.map(col => (
                          <th 
                            key={col.name}
                            onClick={() => handleSort(col.name)}
                            style={{
                              padding: '0.75rem',
                              textAlign: 'left',
                              fontWeight: '600',
                              color: '#475569',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              userSelect: 'none',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {col.name}
                              <FontAwesomeIcon icon={getSortIcon(col.name)} style={{ fontSize: '0.8rem' }} />
                            </div>
                          </th>
                        ))}
                        <th style={{
                          padding: '0.75rem',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#475569',
                          fontSize: '0.9rem',
                          width: '150px'
                        }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map(item => (
                        <tr 
                          key={item.id}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          {columns.map(col => (
                            <td 
                              key={col.name}
                              style={{
                                padding: '0.75rem',
                                color: col.name === 'name' ? '#1e293b' : '#64748b',
                                fontWeight: col.name === 'name' ? '500' : '400',
                                fontSize: '0.9rem'
                              }}
                            >
                              {col.type === 'url' && item[col.name] ? (
                                <a 
                                  href={item[col.name]} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    color: '#3b82f6',
                                    textDecoration: 'none'
                                  }}
                                >
                                  {truncateText(item[col.name], 30)}
                                </a>
                              ) : (
                                truncateText(String(item[col.name] || ''), 50)
                              )}
                            </td>
                          ))}
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{
                              display: 'flex',
                              gap: '0.5rem',
                              justifyContent: 'center'
                            }}>
                              <button
                                onClick={() => startEditItem(item)}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  border: 'none',
                                  background: '#3b82f6',
                                  color: 'white',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontWeight: '500',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.85rem'
                                }}
                                title="Edit item"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                                Edit
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  border: 'none',
                                  background: '#ef4444',
                                  color: 'white',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontWeight: '500',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.85rem'
                                }}
                                title="Delete item"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedCategory && categories.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center',
          color: '#94a3b8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>Select a category</h3>
          <p style={{ margin: 0 }}>Choose a category from above to manage its items</p>
        </div>
      )}

      {categories.length === 0 && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center',
          color: '#94a3b8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>Get started</h3>
          <p style={{ margin: 0 }}>Create your first category to begin organizing items</p>
        </div>
      )}
    </div>
  );
};

export default CategoryItemManager;