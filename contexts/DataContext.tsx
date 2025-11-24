
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveToDB, loadFromDB, DB_STORES } from '../services/db';

// --- Types (Moved/Shared) ---
export interface CoffeeItem {
  id: number;
  name: string;
  region: string;
  process: string;
  notes: string;
  colorFrom: string;
  colorTo: string;
  roast: 'Light' | 'Medium' | 'Dark' | 'Omni';
}

export interface CafeShelfData {
  id: number;
  title: string;
  items: CoffeeItem[];
}

export interface AlbumItem {
  id: number;
  title: string;
  artist: string;
  coverUrl: string;
  trackUrl: string;
  year: string;
  description?: string;
  isFavorite?: boolean; // New field for "Quanh hay nghe"
}

export interface AudioShelfData {
  id: number;
  title: string;
  items: AlbumItem[];
}

// --- Initial Data ---
const INITIAL_CAFE_SHELVES: CafeShelfData[] = [
  {
    id: 1,
    title: "Premium Arabica Collection",
    items: [
      {
        id: 101,
        name: "Panama Geisha",
        region: "Boquete",
        process: "Washed",
        notes: "Jasmine, Bergamot, Honey",
        colorFrom: "#f472b6",
        colorTo: "#be185d",
        roast: "Light",
      },
      {
        id: 102,
        name: "Ethiopia Yirgacheffe",
        region: "Gedeo",
        process: "Natural",
        notes: "Blueberry, Lemon",
        colorFrom: "#facc15",
        colorTo: "#ea580c",
        roast: "Light",
      }
    ]
  },
  {
    id: 2,
    title: "Experimental & Blends",
    items: [
      {
        id: 201,
        name: "Cau Dat Arabica",
        region: "Vietnam",
        process: "Honey",
        notes: "Caramel, Chocolate",
        colorFrom: "#60a5fa",
        colorTo: "#1e3a8a",
        roast: "Medium",
      }
    ]
  }
];

const INITIAL_AUDIO_SHELVES: AudioShelfData[] = [
  {
    id: 1,
    title: "Favorites Playlist",
    items: [
      {
        id: 101,
        title: "Random Access Memories",
        artist: "Daft Punk",
        coverUrl: "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
        trackUrl: "https://open.spotify.com/album/4m2880jivSbbyEGqf539qK",
        year: "2013",
        description: "A homage to the late 1970s and early 1980s US disco and boogie era.",
        isFavorite: true
      },
      {
        id: 102,
        title: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        coverUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        trackUrl: "",
        year: "1973",
        description: "A concept album that explores themes such as conflict, greed, time, death, and mental illness."
      }
    ]
  },
  {
    id: 2,
    title: "Late Night Lo-Fi",
    items: [
      {
        id: 201,
        title: "Nostalgia",
        artist: "Various Artists",
        coverUrl: "https://f4.bcbits.com/img/a1637693293_65",
        trackUrl: "",
        year: "2024",
        description: "Beats to relax and study to."
      }
    ]
  }
];

// --- Context Definition ---
interface DataContextType {
  cafeShelves: CafeShelfData[];
  setCafeShelves: React.Dispatch<React.SetStateAction<CafeShelfData[]>>;
  audioShelves: AudioShelfData[];
  setAudioShelves: React.Dispatch<React.SetStateAction<AudioShelfData[]>>;
  exportData: () => void;
  importData: (file: File) => Promise<boolean>;
  resetData: () => void;
  moveAlbum: (sourceShelfId: number, sourceIndex: number, targetShelfId: number, targetIndex: number | null) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cafeShelves, setCafeShelves] = useState<CafeShelfData[]>(INITIAL_CAFE_SHELVES);
  const [audioShelves, setAudioShelves] = useState<AudioShelfData[]>(INITIAL_AUDIO_SHELVES);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Load from IndexedDB
  useEffect(() => {
    const initData = async () => {
      try {
        const savedCafe = await loadFromDB(DB_STORES.CAFE);
        const savedAudio = await loadFromDB(DB_STORES.AUDIO);

        if (savedCafe && savedCafe.length > 0) {
          setCafeShelves(savedCafe);
        }
        if (savedAudio && savedAudio.length > 0) {
          setAudioShelves(savedAudio);
        }
      } catch (e) {
        console.error("Failed to load data from DB, using defaults", e);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // Sync Cafe to DB on change
  useEffect(() => {
    if (!isLoading) {
      saveToDB(DB_STORES.CAFE, cafeShelves).catch(e => console.error("Failed to save cafe data", e));
    }
  }, [cafeShelves, isLoading]);

  // Sync Audio to DB on change
  useEffect(() => {
    if (!isLoading) {
      saveToDB(DB_STORES.AUDIO, audioShelves).catch(e => console.error("Failed to save audio data", e));
    }
  }, [audioShelves, isLoading]);

  // --- Actions ---

  const exportData = () => {
    const data = {
      cafe: cafeShelves,
      audio: audioShelves,
      version: 1,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mind_palace_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          
          // Update State
          if (json.cafe) setCafeShelves(json.cafe);
          if (json.audio) setAudioShelves(json.audio);
          
          // Force Save to DB immediately to ensure consistency
          if (json.cafe) await saveToDB(DB_STORES.CAFE, json.cafe);
          if (json.audio) await saveToDB(DB_STORES.AUDIO, json.audio);
          
          resolve(true);
        } catch (error) {
          console.error("Invalid backup file", error);
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  };

  const resetData = async () => {
    if (window.confirm("Are you sure? This will wipe all current data and restore defaults.")) {
      setCafeShelves(INITIAL_CAFE_SHELVES);
      setAudioShelves(INITIAL_AUDIO_SHELVES);
      
      // Clear DB via saving defaults
      await saveToDB(DB_STORES.CAFE, INITIAL_CAFE_SHELVES);
      await saveToDB(DB_STORES.AUDIO, INITIAL_AUDIO_SHELVES);
    }
  };

  const moveAlbum = (sourceShelfId: number, sourceIndex: number, targetShelfId: number, targetIndex: number | null) => {
    setAudioShelves(prev => {
      // Deep clone to avoid direct mutation
      const newShelves = JSON.parse(JSON.stringify(prev)) as AudioShelfData[];
      
      const sourceShelf = newShelves.find(s => s.id === sourceShelfId);
      const targetShelf = newShelves.find(s => s.id === targetShelfId);

      if (!sourceShelf || !targetShelf) return prev;

      // Remove from source
      const [movedItem] = sourceShelf.items.splice(sourceIndex, 1);

      // Add to target
      if (targetIndex === null) {
        // Append to end
        targetShelf.items.push(movedItem);
      } else {
        // Insert at specific index
        targetShelf.items.splice(targetIndex, 0, movedItem);
      }

      return newShelves;
    });
  };

  return (
    <DataContext.Provider value={{
      cafeShelves,
      setCafeShelves,
      audioShelves,
      setAudioShelves,
      exportData,
      importData,
      resetData,
      moveAlbum,
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
