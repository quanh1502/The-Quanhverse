import React, { useState, useRef, useEffect } from 'react';
import { Music, Plus, X, Save, Trash2, Edit3, Headphones, Mic2, Upload, Link as LinkIcon, Play, Calendar, AlignLeft, Wand2, Loader2, GripVertical, Star } from 'lucide-react';
import RavenclawTaurusMascot from '../../components/RavenclawTaurusMascot';
import { useData, AlbumItem, AudioShelfData } from '../../contexts/DataContext';
import { analyzeYoutubeMetadata } from '../../services/geminiService';

// --- Utilities ---
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getYouTubeThumbnail = (id: string) => {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};

// --- Components ---

const JewelCase3D: React.FC<{ 
  item: AlbumItem; 
  onClick: () => void; 
  onEdit: () => void;
}> = ({ 
  item, 
  onClick, 
  onEdit 
}) => {
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const handleStart = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onEdit(); // Trigger Edit Mode
    }, 600); // 600ms hold to edit
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent ghost clicks on touch devices
    // e.preventDefault(); 
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isLongPress.current) {
      onClick(); // Trigger Detail View
    }
  };

  const handleCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 group relative z-10 hover:z-20">
        <div 
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleCancel}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          className="relative w-32 h-32 cursor-pointer perspective-[800px] transition-all duration-500"
        >
          {/* Hover Lift Effect */}
          <div className="w-full h-full preserve-3d transition-transform duration-500 group-hover:-translate-y-4 group-hover:rotate-x-12 group-hover:rotate-y-12">
            
            {/* THE DISC (Inside) - Slides out on hover */}
            <div className="absolute top-1 left-1 w-28 h-28 rounded-full bg-gradient-to-tr from-slate-300 via-white to-slate-400 flex items-center justify-center transition-transform duration-700 group-hover:translate-x-16 group-hover:rotate-[360deg]"
                style={{ 
                    background: `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.8) 20%, transparent 30%, transparent 100%), radial-gradient(circle, #d1d5db 30%, #9ca3af 100%)`,
                    boxShadow: '0 0 5px rgba(0,0,0,0.5)'
                }}>
              {/* Rainbow reflection */}
              <div className="absolute inset-0 rounded-full opacity-40 bg-gradient-to-tr from-transparent via-pink-500/20 to-cyan-500/20 mix-blend-color-dodge"></div>
              {/* Center Hole */}
              <div className="w-8 h-8 bg-slate-900 rounded-full border-2 border-white/20"></div>
            </div>

            {/* CASE BACK */}
            <div className="absolute inset-0 bg-slate-900 rounded border border-slate-700 shadow-xl" style={{ transform: 'translateZ(-2px)' }}>
                {/* Spine (Left) */}
                <div className="absolute top-0 bottom-0 -left-2 w-2 bg-slate-800 origin-right transform rotateY(-90deg) flex items-center justify-center overflow-hidden border-l border-slate-600">
                    <span className="text-[6px] text-white whitespace-nowrap rotate-90 tracking-widest uppercase font-mono opacity-70">
                       {item.isFavorite && "★ "}{item.artist} - {item.title}
                    </span>
                </div>
                {/* Spine (Right) */}
                <div className="absolute top-0 bottom-0 -right-2 w-2 bg-slate-800 origin-left transform rotateY(90deg) border-r border-slate-600"></div>
            </div>

            {/* CASE FRONT (Cover) - Opens slightly */}
            <div className="absolute inset-0 bg-slate-900 rounded overflow-hidden border-l border-slate-600 shadow-lg transform origin-left transition-transform duration-500 group-hover:rotate-y-[-20deg]">
                {/* Glass Gloss */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent z-20 pointer-events-none"></div>
                {/* Crack/Texture */}
                <div className="absolute top-2 right-2 w-full h-full bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_50%,transparent_52%)] pointer-events-none"></div>
                
                {/* Favorite Star Badge */}
                {item.isFavorite && (
                   <div className="absolute top-0 left-0 z-30 bg-yellow-500/80 p-1 rounded-br-lg backdrop-blur-sm shadow-sm">
                      <Star size={10} fill="white" className="text-white" />
                   </div>
                )}

                {/* Cover Art */}
                {item.coverUrl ? (
                    <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover opacity-90" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-blue-900 flex flex-col items-center justify-center p-2 text-center">
                      <Music size={32} className="text-cyan-400/50 mb-2" />
                      <span className="text-[8px] text-cyan-200 font-bold uppercase">{item.title}</span>
                    </div>
                )}
                
                {/* Side Hinge Visual */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/20 z-30"></div>
            </div>
            
            {/* Long Press Hint Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 active:opacity-100 transition-opacity duration-300 z-40 rounded pointer-events-none">
               <Edit3 className="text-white animate-pulse" size={24} />
            </div>
          </div>
        </div>

        {/* 3D Label Under Disc */}
        <div className="text-center transform transition-transform duration-300 group-hover:translate-y-2 preserve-3d w-40 pointer-events-none">
            <h3 className="text-[10px] font-bold text-cyan-100 leading-tight bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded border border-cyan-500/20 shadow-[0_2px_10px_rgba(0,0,0,0.5)] inline-block max-w-full truncate">
                {item.title}
            </h3>
            <p className="text-[9px] text-cyan-400/60 font-mono uppercase tracking-widest mt-1">
                {item.artist}
            </p>
        </div>
    </div>
  );
};

const AddNewAlbum = ({ onClick }: { onClick: () => void }) => {
  return (
    <div onClick={onClick} className="mb-12 w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-cyan-500/20 rounded bg-cyan-900/5 hover:bg-cyan-900/20 hover:border-cyan-400/50 transition-all cursor-pointer group perspective-[800px]">
       <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-cyan-500/20">
          <Plus className="text-cyan-500/50 group-hover:text-cyan-400" />
       </div>
       <span className="mt-2 text-[9px] text-cyan-400/40 font-mono uppercase tracking-widest group-hover:text-cyan-300">Add CD</span>
    </div>
  );
};

// --- DETAIL VIEW MODAL ---
const DetailModal = ({ item, onClose }: { item: AlbumItem, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 perspective-[1200px]">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-visible animate-zoom-in flex flex-col md:flex-row">
                
                {/* --- FAVORITE MASCOT --- */}
                {item.isFavorite && (
                   <div className="absolute top-1/2 -right-8 md:-right-24 transform -translate-y-1/2 z-50 pointer-events-none">
                      <div className="scale-75 origin-center pointer-events-auto">
                         <RavenclawTaurusMascot 
                            variant="music"
                            greeting="Bài này Quanh hay nghe lắm nè"
                            size="small"
                            forceOpen={true}
                            dialogClassName="w-32 h-auto aspect-square flex items-center justify-center !p-2 !pt-6"
                            placement="top" // Ensure bubble is above head for detail view
                         />
                      </div>
                   </div>
                )}

                {/* Left: Cover Art */}
                <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-black rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
                    {item.coverUrl ? (
                        <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover opacity-90" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-slate-900 flex items-center justify-center">
                            <Music size={64} className="text-cyan-500/30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
                    
                    {/* Close Button Mobile */}
                    <button onClick={onClose} className="absolute top-4 right-4 md:hidden text-white bg-black/50 p-2 rounded-full backdrop-blur-sm">
                        <X size={20} />
                    </button>
                </div>

                {/* Right: Details */}
                <div className="flex-1 p-8 flex flex-col justify-center relative bg-slate-900 md:rounded-r-2xl">
                    {/* Close Button Desktop */}
                    <button onClick={onClose} className="absolute top-4 right-4 hidden md:block text-slate-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>

                    <div className="mb-6">
                        <div className="flex items-center gap-2">
                             <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{item.title}</h2>
                             {item.isFavorite && <Star size={24} fill="gold" className="text-yellow-500 mb-2" />}
                        </div>
                        <p className="text-xl text-cyan-400 font-serif italic">{item.artist}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400 font-mono mb-6 border-b border-slate-800 pb-6">
                        <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded"><Calendar size={14}/> {item.year}</span>
                        {item.trackUrl && (
                            <span className="flex items-center gap-1 text-green-400"><LinkIcon size={14}/> Connected</span>
                        )}
                    </div>

                    <div className="mb-8 flex-1 overflow-y-auto scrollbar-hide max-h-40">
                        <p className="text-slate-300 leading-relaxed text-sm">
                            {item.description || "No description available for this track."}
                        </p>
                    </div>

                    {item.trackUrl ? (
                        <a 
                            href={item.trackUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(8,145,178,0.4)] hover:shadow-[0_4px_25px_rgba(8,145,178,0.6)] hover:-translate-y-1"
                        >
                            <div className="p-1 bg-white rounded-full text-cyan-600">
                                <Play size={14} fill="currentColor" />
                            </div>
                            Listen Now
                        </a>
                    ) : (
                         <button disabled className="flex items-center justify-center gap-3 w-full py-4 bg-slate-800 text-slate-500 rounded-xl font-bold cursor-not-allowed">
                            No Source Link
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// --- EDIT MODAL ---
const EditModal = ({ 
  item, 
  onClose, 
  onSave, 
  onDelete 
}: { 
  item: AlbumItem, 
  onClose: () => void, 
  onSave: (item: AlbumItem) => void,
  onDelete: (id: number) => void
}) => {
  const [formData, setFormData] = useState<AlbumItem>({ ...item });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoFill = async () => {
    if (!formData.trackUrl) return;
    setIsAnalyzing(true);

    try {
      // 1. Extract and set thumbnail immediately if possible (Client side)
      const ytId = getYouTubeId(formData.trackUrl);
      if (ytId) {
        const thumbUrl = getYouTubeThumbnail(ytId);
        setFormData(prev => ({ ...prev, coverUrl: thumbUrl }));
      }

      // 2. Call Gemini for Metadata
      const metadata = await analyzeYoutubeMetadata(formData.trackUrl);
      
      if (metadata) {
        setFormData(prev => ({
          ...prev,
          title: metadata.title || prev.title,
          artist: metadata.artist || prev.artist,
          year: metadata.year || prev.year,
        }));
      }

    } catch (e) {
      console.error("Auto-fill failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
       <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
       <div className="relative bg-slate-900 border border-cyan-900 w-full max-w-lg rounded-xl shadow-[0_0_50px_rgba(8,145,178,0.2)] overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">
          
          <div className="p-5 bg-slate-950 border-b border-cyan-900/50 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-3">
                 <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                    <Edit3 size={18} /> Edit Metadata
                 </h3>
                 {/* Favorite Toggle */}
                 <button 
                    onClick={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                    className="p-1.5 rounded-full hover:bg-slate-800 transition-colors"
                    title="Toggle Favorite"
                 >
                    <Star 
                        size={20} 
                        className={formData.isFavorite ? "text-yellow-500" : "text-slate-600"} 
                        fill={formData.isFavorite ? "currentColor" : "none"}
                    />
                 </button>
             </div>
             <button onClick={onClose} className="text-slate-500 hover:text-cyan-400 transition-colors"><X size={20}/></button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto scrollbar-hide">
             <div className="grid grid-cols-3 gap-4">
                {/* Cover Image Upload Section */}
                <div className="col-span-1 relative group aspect-square bg-slate-800 rounded overflow-hidden border border-slate-700 cursor-pointer h-full"
                     onClick={() => fileInputRef.current?.click()}>
                   
                   {formData.coverUrl ? (
                      <img src={formData.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                         <Upload size={20} />
                         <span className="text-[8px] text-center">Click to Upload</span>
                      </div>
                   )}
                   
                   {/* Upload Overlay */}
                   <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={20} className="text-white mb-1" />
                      <span className="text-[8px] text-white font-mono uppercase">Change Cover</span>
                   </div>
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*"
                      className="hidden" 
                   />
                </div>

                {/* Inputs */}
                <div className="col-span-2 space-y-3">
                   <div>
                      <label className="text-[10px] text-cyan-600 uppercase font-mono font-bold">Track / Album Title</label>
                      <input 
                         type="text" 
                         value={formData.title} 
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         className="w-full bg-slate-800/50 border border-slate-700 rounded p-2 text-sm text-cyan-100 focus:border-cyan-500 focus:outline-none focus:bg-slate-800"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] text-cyan-600 uppercase font-mono font-bold">Artist</label>
                      <input 
                         type="text" 
                         value={formData.artist} 
                         onChange={(e) => setFormData({...formData, artist: e.target.value})}
                         className="w-full bg-slate-800/50 border border-slate-700 rounded p-2 text-sm text-cyan-100 focus:border-cyan-500 focus:outline-none focus:bg-slate-800"
                      />
                   </div>
                </div>
             </div>
             
             {/* Track Link with Auto-Fill */}
             <div>
                <label className="text-[10px] text-cyan-600 uppercase font-mono font-bold flex items-center justify-between mb-1">
                   <div className="flex items-center gap-1">
                      <LinkIcon size={10} /> Track Link (YouTube)
                   </div>
                   {formData.trackUrl && (
                      <span className="text-[9px] text-cyan-400/50 animate-pulse">Paste link to auto-fill details</span>
                   )}
                </label>
                <div className="relative">
                    <input 
                       type="text" 
                       value={formData.trackUrl || ''} 
                       onChange={(e) => setFormData({...formData, trackUrl: e.target.value})}
                       placeholder="https://youtube.com/watch?v=..."
                       className="w-full bg-slate-800/50 border border-slate-700 rounded p-2 text-xs text-blue-300 focus:border-cyan-500 focus:outline-none font-mono placeholder-slate-600 pr-10"
                    />
                    <button 
                      onClick={handleAutoFill}
                      disabled={!formData.trackUrl || isAnalyzing}
                      className="absolute right-1 top-1 p-1 bg-cyan-900/50 rounded hover:bg-cyan-500 hover:text-white text-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Auto-fill Metadata from YouTube"
                    >
                      {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    </button>
                </div>
             </div>

             <div>
                <label className="text-[10px] text-cyan-600 uppercase font-mono font-bold flex items-center gap-1 mb-1">
                    <AlignLeft size={10} /> Description / Liner Notes
                </label>
                <textarea 
                   value={formData.description || ''} 
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="Add notes about this album..."
                   className="w-full bg-slate-800/50 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-cyan-500 focus:outline-none font-sans h-20 resize-none"
                />
             </div>
             
             <div>
                <label className="text-[10px] text-cyan-600 uppercase font-mono font-bold">Year</label>
                 <input 
                   type="text" 
                   value={formData.year} 
                   onChange={(e) => setFormData({...formData, year: e.target.value})}
                   className="w-full bg-slate-800/50 border border-slate-700 rounded p-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none font-mono w-24"
                />
             </div>
          </div>

          <div className="p-4 bg-slate-950 border-t border-cyan-900/30 flex gap-3 shrink-0">
             <button 
               onClick={() => onDelete(formData.id)}
               className="p-2 rounded bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 transition-colors"
             >
               <Trash2 size={18} />
             </button>
             <button 
               onClick={() => onSave(formData)}
               className="flex-1 flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded font-bold transition-colors py-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
             >
               <Save size={16} />
               Update Disc
             </button>
          </div>
       </div>
    </div>
  );
};

const AudioRoom: React.FC = () => {
  const { audioShelves: shelves, setAudioShelves: setShelves, moveAlbum } = useData();
  
  // State for viewing a specific item (Detail Modal)
  const [viewingItem, setViewingItem] = useState<AlbumItem | null>(null);
  
  // State for editing (Edit Modal)
  const [editingItem, setEditingItem] = useState<{item: AlbumItem, shelfId: number} | null>(null);
  
  const [editingShelfId, setEditingShelfId] = useState<number | null>(null);
  const [tempShelfTitle, setTempShelfTitle] = useState("");

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState<{ shelfId: number; index: number } | null>(null);

  // --- Background Visualizer ---
  const [bars, setBars] = useState<number[]>(new Array(30).fill(20));
  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 60 + 10));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handleAddNewItem = (shelfId: number) => {
     const newItem: AlbumItem = {
        id: Date.now(),
        title: "New Track",
        artist: "Unknown Artist",
        coverUrl: "",
        trackUrl: "",
        year: new Date().getFullYear().toString(),
        description: "",
        isFavorite: false
     };
     setShelves(prev => prev.map(s => s.id === shelfId ? { ...s, items: [...s.items, newItem] } : s));
     setEditingItem({ item: newItem, shelfId });
  };

  const handleSaveItem = (updatedItem: AlbumItem) => {
     if (!editingItem) return;
     setShelves(prev => prev.map(s => s.id === editingItem.shelfId ? {
        ...s, items: s.items.map(i => i.id === updatedItem.id ? updatedItem : i)
     } : s));
     setEditingItem(null);
  };

  const handleDeleteItem = (id: number) => {
     if (!editingItem) return;
     setShelves(prev => prev.map(s => s.id === editingItem.shelfId ? {
        ...s, items: s.items.filter(i => i.id !== id)
     } : s));
     setEditingItem(null);
  };

  const handleAddShelf = () => {
    const newId = Date.now();
    setShelves([...shelves, { id: newId, title: "New Genre", items: [] }]);
    setEditingShelfId(newId);
    setTempShelfTitle("New Genre");
  };

  const handleSaveShelfTitle = (id: number) => {
    setShelves(prev => prev.map(s => s.id === id ? { ...s, title: tempShelfTitle } : s));
    setEditingShelfId(null);
  };

  const handleDeleteShelf = (id: number) => {
     if(window.confirm("Delete this shelf?")) {
        setShelves(prev => prev.filter(s => s.id !== id));
     }
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, shelfId: number, index: number) => {
    setDraggedItem({ shelfId, index });
    // Make transparent drag image
    e.dataTransfer.effectAllowed = "move";
    if (e.target instanceof HTMLElement) {
        e.target.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
      if (e.target instanceof HTMLElement) {
          e.target.style.opacity = "1";
      }
      setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); // Necessary to allow dropping
      e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnItem = (e: React.DragEvent, targetShelfId: number, targetIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      if (!draggedItem) return;

      if (draggedItem.shelfId === targetShelfId && draggedItem.index === targetIndex) return;

      moveAlbum(draggedItem.shelfId, draggedItem.index, targetShelfId, targetIndex);
  };

  const handleDropOnShelf = (e: React.DragEvent, targetShelfId: number) => {
      e.preventDefault();
      if (!draggedItem) return;
      
      // If dropping on the shelf (not a specific item), append to end
      if (draggedItem.shelfId === targetShelfId) return; 

      moveAlbum(draggedItem.shelfId, draggedItem.index, targetShelfId, null);
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center bg-slate-950 overflow-hidden">
      
      {/* Ambient Background Visualizer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-2 h-64 opacity-10 pointer-events-none -z-0 gap-1">
         {bars.map((h, i) => (
            <div key={i} className="w-full bg-cyan-500/20 blur-xl transition-all duration-300" style={{ height: `${h}%` }}></div>
         ))}
      </div>

      {/* Header */}
      <div className="relative z-10 mt-12 mb-8 text-center animate-appear-from-void">
         <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyan-950/30 border border-cyan-500/30 mb-2 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Headphones size={32} className="text-cyan-400" />
         </div>
         <h1 className="text-4xl font-bold text-cyan-100 tracking-[0.2em] uppercase font-mono">
            Quanh<span className="text-cyan-500">Zik</span>
         </h1>
         <p className="text-cyan-400/50 text-xs tracking-widest mt-2">Quanh's Sonic Dimension</p>
         <p className="text-slate-600 text-[10px] mt-1">Drag to reorder • Hold to edit • Click to view</p>
      </div>

      {/* Content */}
      <div className="w-full h-full overflow-y-auto overflow-x-hidden pb-32 px-4 scrollbar-hide perspective-container z-10">
         <div className="max-w-6xl mx-auto flex flex-col gap-24 pt-8 pb-24">
            
            {shelves.map((shelf) => (
               <div 
                 key={shelf.id} 
                 className="relative group/shelf"
                 onDragOver={handleDragOver}
                 onDrop={(e) => handleDropOnShelf(e, shelf.id)}
               >
                  
                  {/* Shelf Header */}
                  <div className="flex items-center gap-4 mb-6 border-b border-cyan-900/50 pb-2 w-full max-w-md">
                     <Mic2 size={16} className="text-cyan-700" />
                     {editingShelfId === shelf.id ? (
                        <div className="flex items-center gap-2 flex-1">
                            <input 
                                autoFocus
                                className="bg-slate-900 border border-cyan-500/50 text-cyan-100 px-2 py-1 rounded w-full text-sm font-mono uppercase"
                                value={tempShelfTitle}
                                onChange={(e) => setTempShelfTitle(e.target.value)}
                                onBlur={() => handleSaveShelfTitle(shelf.id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveShelfTitle(shelf.id)}
                            />
                        </div>
                     ) : (
                        <div className="flex items-center gap-4 flex-1 group-hover/shelf:translate-x-2 transition-transform">
                           <h2 className="text-lg text-cyan-100/80 font-mono uppercase tracking-wider">{shelf.title}</h2>
                           <div className="opacity-0 group-hover/shelf:opacity-100 transition-opacity flex gap-1">
                              <button onClick={() => { setEditingShelfId(shelf.id); setTempShelfTitle(shelf.title); }} className="p-1 text-slate-500 hover:text-cyan-400"><Edit3 size={14}/></button>
                              <button onClick={() => handleDeleteShelf(shelf.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 size={14}/></button>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* 3D Shelf Platform */}
                  <div className="absolute top-32 -left-[5%] -right-[5%] h-4 bg-cyan-900/20 border-t border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] transform -rotate-x-6 translate-z-[-20px]"></div>
                  
                  {/* Items Row */}
                  <div className="flex flex-wrap items-end gap-x-6 gap-y-16 pl-4 relative z-10 min-h-[160px]">
                     {shelf.items.map((item, index) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, shelf.id, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDropOnItem(e, shelf.id, index)}
                            className="cursor-move"
                        >
                            <JewelCase3D 
                               item={item} 
                               onClick={() => setViewingItem(item)}
                               onEdit={() => setEditingItem({ item, shelfId: shelf.id })} 
                            />
                        </div>
                     ))}
                     <AddNewAlbum onClick={() => handleAddNewItem(shelf.id)} />
                  </div>

               </div>
            ))}

            {/* Add New Shelf Button */}
            <div className="flex justify-center mt-12">
                <button 
                    onClick={handleAddShelf}
                    className="px-8 py-4 rounded-full border border-dashed border-cyan-900 text-cyan-700 hover:text-cyan-400 hover:border-cyan-500 hover:bg-cyan-900/10 transition-all uppercase font-mono text-xs tracking-widest flex items-center gap-2"
                >
                    <Plus size={16} /> Create New Section
                </button>
            </div>

         </div>
      </div>

      {/* Detail View Modal */}
      {viewingItem && (
          <DetailModal 
            item={viewingItem}
            onClose={() => setViewingItem(null)}
          />
      )}

      {/* Edit Modal */}
      {editingItem && (
         <EditModal 
            item={editingItem.item} 
            onClose={() => setEditingItem(null)}
            onSave={handleSaveItem}
            onDelete={handleDeleteItem}
         />
      )}

    </div>
  );
};

export default AudioRoom;