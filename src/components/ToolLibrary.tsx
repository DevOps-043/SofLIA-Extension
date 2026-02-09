/**
 * Tool Library Component
 * Main view for browsing and managing tools
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Tool,
  UserTool,
  ToolCategory,
  TOOL_CATEGORIES,
  getPublicTools,
  getUserTools,
  getUserFavoritePublicTools,
  addToolToFavorites,
  removeToolFromFavorites,
  deleteUserTool,
  toggleUserToolFavorite,
} from '../services/tools';

// Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

type TabType = 'public' | 'mine' | 'favorites';

interface ToolLibraryProps {
  onSelectTool: (tool: Tool | UserTool) => void;
  onClose: () => void;
  onCreateTool?: () => void;
  onEditTool?: (tool: UserTool) => void;
}

export function ToolLibrary({ onSelectTool, onClose, onCreateTool, onEditTool }: ToolLibraryProps) {
  const [activeTab, setActiveTab] = useState<TabType>('public');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  
  const [publicTools, setPublicTools] = useState<Tool[]>([]);
  const [userTools, setUserTools] = useState<UserTool[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        const [pubTools, usrTools, favTools] = await Promise.all([
          getPublicTools(),
          getUserTools(),
          getUserFavoritePublicTools(),
        ]);
        
        setPublicTools(pubTools);
        setUserTools(usrTools);
        setFavoriteTools(favTools);
        setFavoriteIds(new Set(favTools.map(t => t.id)));
      } catch (err) {
        console.error('Error loading tools:', err);
        setError('Error al cargar las herramientas');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let tools: (Tool | UserTool)[] = [];
    
    switch (activeTab) {
      case 'public':
        tools = publicTools;
        break;
      case 'mine':
        tools = userTools;
        break;
      case 'favorites':
        tools = favoriteTools;
        break;
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(t => 
        t.name.toLowerCase().includes(query) ||
        (t.description?.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      tools = tools.filter(t => t.category === selectedCategory);
    }
    
    return tools;
  }, [activeTab, publicTools, userTools, favoriteTools, searchQuery, selectedCategory]);

  // Handle favorite toggle
  const handleToggleFavorite = async (toolId: string, isPublic: boolean) => {
    try {
      if (isPublic) {
        if (favoriteIds.has(toolId)) {
          await removeToolFromFavorites(toolId);
          setFavoriteIds(prev => {
            const next = new Set(prev);
            next.delete(toolId);
            return next;
          });
          setFavoriteTools(prev => prev.filter(t => t.id !== toolId));
        } else {
          await addToolToFavorites(toolId);
          setFavoriteIds(prev => new Set(prev).add(toolId));
          const tool = publicTools.find(t => t.id === toolId);
          if (tool) setFavoriteTools(prev => [...prev, tool]);
        }
      } else {
        const newValue = await toggleUserToolFavorite(toolId);
        setUserTools(prev => prev.map(t => 
          t.id === toolId ? { ...t, is_favorite: newValue } : t
        ));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Handle delete
  const handleDelete = async (toolId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta herramienta?')) return;
    
    try {
      await deleteUserTool(toolId);
      setUserTools(prev => prev.filter(t => t.id !== toolId));
    } catch (err) {
      console.error('Error deleting tool:', err);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>🛠️ Biblioteca de Herramientas</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {(['public', 'mine', 'favorites'] as TabType[]).map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'public' && '🌐 Públicas'}
              {tab === 'mine' && '👤 Mis Herramientas'}
              {tab === 'favorites' && '⭐ Favoritas'}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div style={styles.filters}>
          <div style={styles.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar herramientas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as ToolCategory | 'all')}
            style={styles.categorySelect}
          >
            <option value="all">Todas las categorías</option>
            {TOOL_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>

          {activeTab === 'mine' && onCreateTool && (
            <button style={styles.createBtn} onClick={onCreateTool}>
              <PlusIcon /> Nueva
            </button>
          )}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loading}>Cargando herramientas...</div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : filteredTools.length === 0 ? (
            <div style={styles.empty}>
              {activeTab === 'mine' 
                ? 'No tienes herramientas. ¡Crea una!'
                : 'No se encontraron herramientas'}
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredTools.map(tool => {
                const isPublicTool = 'status' in tool;
                const isFav = isPublicTool 
                  ? favoriteIds.has(tool.id)
                  : (tool as UserTool).is_favorite;
                
                return (
                  <div key={tool.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <span style={styles.cardIcon}>{tool.icon}</span>
                      <div style={styles.cardInfo}>
                        <h3 style={styles.cardName}>{tool.name}</h3>
                        {tool.category && (
                          <span style={styles.categoryBadge}>
                            {TOOL_CATEGORIES.find(c => c.value === tool.category)?.label}
                          </span>
                        )}
                      </div>
                      <button
                        style={styles.favBtn}
                        onClick={() => handleToggleFavorite(tool.id, isPublicTool)}
                      >
                        <StarIcon filled={isFav} />
                      </button>
                    </div>
                    
                    <p style={styles.cardDesc}>
                      {tool.description?.substring(0, 80)}
                      {(tool.description?.length || 0) > 80 && '...'}
                    </p>
                    
                    <div style={styles.cardActions}>
                      <button
                        style={styles.useBtn}
                        onClick={() => onSelectTool(tool)}
                      >
                        Usar
                      </button>
                      
                      {!isPublicTool && (
                        <>
                          {onEditTool && (
                            <button
                              style={styles.iconBtn}
                              onClick={() => onEditTool(tool as UserTool)}
                            >
                              <EditIcon />
                            </button>
                          )}
                          <button
                            style={{ ...styles.iconBtn, color: '#ff6b6b' }}
                            onClick={() => handleDelete(tool.id)}
                          >
                            <TrashIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#1a1f2e',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#888',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '12px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  tab: {
    background: 'transparent',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'rgba(0, 212, 179, 0.15)',
    color: '#00d4b3',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#888',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '14px',
  },
  categorySelect: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#00d4b3',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    color: '#0a2540',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '16px 24px 24px',
  },
  loading: {
    textAlign: 'center',
    color: '#888',
    padding: '40px',
  },
  error: {
    textAlign: 'center',
    color: '#ff6b6b',
    padding: '40px',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.2s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  cardIcon: {
    fontSize: '28px',
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  categoryBadge: {
    display: 'inline-block',
    fontSize: '11px',
    color: '#00d4b3',
    background: 'rgba(0, 212, 179, 0.1)',
    padding: '2px 8px',
    borderRadius: '4px',
    marginTop: '4px',
  },
  favBtn: {
    background: 'none',
    border: 'none',
    color: '#ffc107',
    cursor: 'pointer',
    padding: '4px',
  },
  cardDesc: {
    margin: 0,
    fontSize: '13px',
    color: '#888',
    lineHeight: 1.4,
    flex: 1,
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  useBtn: {
    flex: 1,
    background: 'rgba(0, 212, 179, 0.15)',
    border: '1px solid rgba(0, 212, 179, 0.3)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#00d4b3',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    color: '#888',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default ToolLibrary;
