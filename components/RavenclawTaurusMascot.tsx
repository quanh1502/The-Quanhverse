import React, { useState, useEffect } from 'react';
import { Edit3, Check, X, Music, MessageCircle } from 'lucide-react';

interface MascotProps {
  greeting: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  variant?: 'default' | 'coffee' | 'music';
  size?: 'small' | 'medium';
  withHint?: boolean;
  forceOpen?: boolean;
  dialogClassName?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'top-left'; // Control bubble direction
}

const RavenclawTaurusMascot: React.FC<MascotProps> = ({ 
  greeting: initialGreeting, 
  className, 
  style, 
  onClick,
  variant = 'default',
  size = 'medium',
  withHint = false,
  forceOpen = false,
  dialogClassName,
  placement = 'top'
}) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentGreeting, setCurrentGreeting] = useState(initialGreeting);
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(initialGreeting);

  useEffect(() => {
    setCurrentGreeting(initialGreeting);
    setTempText(initialGreeting);
  }, [initialGreeting]);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
    if (onClick) onClick();
  };

  const handleSave = () => {
    setCurrentGreeting(tempText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempText(currentGreeting);
    setIsEditing(false);
  };

  // Styles based on size
  const modalDimensions = dialogClassName || (size === 'small' 
    ? 'w-[280px] md:w-[320px]' 
    : 'w-[300px]');
    
  const contentPadding = size === 'small' && !dialogClassName ? 'px-4 py-3 pt-6' : 'p-4 pt-6';
  const fontSize = size === 'small' ? 'text-xs leading-relaxed' : 'text-sm leading-relaxed';
  const titleSize = size === 'small' ? 'text-[10px]' : 'text-xs';
  const iconSize = size === 'small' ? 'w-10 h-10 -top-5 text-lg' : 'w-12 h-12 -top-6 text-2xl';

  // Calculate bubble position classes based on placement
  let bubblePositionClass = '';
  let arrowClass = '';
  
  // Adjust top offset if Music variant to avoid covering the halo
  const topOffset = variant === 'music' ? 'bottom-[130%]' : 'bottom-[115%]';

  switch (placement) {
    case 'bottom':
      bubblePositionClass = 'top-[115%] left-1/2 -translate-x-1/2 origin-top';
      arrowClass = '-top-2 left-1/2 -translate-x-1/2 border-t border-l rotate-45';
      break;
    case 'bottom-left':
      bubblePositionClass = 'top-[115%] right-0 origin-top-right';
      arrowClass = '-top-2 right-8 border-t border-l rotate-45';
      break;
    case 'left':
      bubblePositionClass = 'top-1/2 right-[115%] -translate-y-1/2 origin-right';
      arrowClass = 'top-1/2 -right-2 -translate-y-1/2 border-t border-r rotate-45';
      break;
    case 'right':
      bubblePositionClass = 'top-1/2 left-[115%] -translate-y-1/2 origin-left';
      arrowClass = 'top-1/2 -left-2 -translate-y-1/2 border-b border-l rotate-45';
      break;
    case 'top-left':
       bubblePositionClass = `${topOffset} right-0 origin-bottom-right`;
       arrowClass = '-bottom-2 right-8 border-b border-r rotate-45';
       break;
    case 'top':
    default:
      bubblePositionClass = `${topOffset} left-1/2 -translate-x-1/2 origin-bottom`;
      arrowClass = '-bottom-2 left-1/2 -translate-x-1/2 border-b border-r rotate-45';
      break;
  }

  return (
    <>
      {/* Container */}
      <div 
        onClick={handleClick}
        className={`relative z-50 cursor-pointer animate-float hover:scale-110 transition-transform duration-300 w-24 h-24 ${className || ''}`}
        style={{ animationDuration: '5s', ...style }}
        title="Click me!"
      >
        <div className="relative w-full h-full drop-shadow-2xl">
            {/* --- HINT BUBBLE --- */}
            {withHint && !isOpen && (
              <div className="absolute -top-2 -right-4 z-50 animate-bounce" style={{ animationDuration: '2s' }}>
                  <div className="bg-white text-cyan-700 rounded-t-xl rounded-br-xl rounded-bl-none p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.6)] border-2 border-cyan-100 flex items-center justify-center transform hover:scale-110 transition-transform">
                      <MessageCircle size={14} fill="currentColor" className="text-cyan-600" />
                  </div>
              </div>
            )}

            {/* --- HALO VARIANTS --- */}
            {variant === 'coffee' && (
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 animate-float" style={{ animationDuration: '3s' }}>
                  <div className="w-8 h-5 bg-[#3e2723] rounded-[50%] border-t border-white/10 shadow-[0_0_15px_rgba(255,165,0,0.4)] relative overflow-hidden transform rotate-12">
                     <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1a100c] -translate-y-1/2 rotate-3 shadow-[0_1px_1px_rgba(255,255,255,0.1)]"></div>
                  </div>
               </div>
            )}

            {variant === 'music' && (
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-40 animate-float" style={{ animationDuration: '4s' }}>
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-400 bg-black/50 shadow-[0_0_15px_#22d3ee] flex items-center justify-center backdrop-blur-sm relative overflow-hidden group-hover:scale-110 transition-transform">
                     <div className="absolute inset-0 bg-cyan-400/20 animate-pulse"></div>
                     <Music size={14} className="text-cyan-300 relative z-10" />
                  </div>
               </div>
            )}

            {/* --- BODY (Ravenclaw Robe) --- */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-12 bg-[#0e1a40] rounded-t-3xl rounded-b-xl overflow-hidden shadow-lg flex justify-center z-10">
                 {/* Robe Opening/Bronze Trim */}
                 <div className="w-2 h-full bg-[#946b2d]/80"></div>
                 {/* Inner Shirt */}
                 <div className="absolute top-0 w-6 h-6 bg-white rotate-45 -translate-y-4 shadow-sm"></div>
            </div>

            {/* --- ARM & WAND (Waving) - Behind Scarf, In front of body --- */}
            <div className="absolute top-12 right-0 origin-top-left animate-wave z-30 pointer-events-none">
                 {/* Arm */}
                 <div className="w-8 h-3 bg-[#0e1a40] rounded-full rotate-45 absolute top-0 left-0"></div>
                 {/* Hand */}
                 <div className="w-3 h-3 bg-[#5d4037] rounded-full absolute top-1 right-[-2px]"></div>
                 {/* Wand */}
                 <div className="w-10 h-0.5 bg-[#3e2723] absolute top-2 left-6 -rotate-12">
                    {/* Magic Sparkle */}
                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse ${variant === 'music' ? 'bg-cyan-300 shadow-cyan-400' : 'bg-blue-300 shadow-blue-400'}`}></div>
                 </div>
            </div>

            {/* --- SCARF (Red) --- */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#b91c1c] rounded-full z-20 shadow-md border-b-2 border-[#7f1d1d] flex items-center justify-center gap-2 overflow-hidden">
                <div className="w-2 h-full bg-[#7f1d1d]/20 -skew-x-12"></div>
                <div className="w-2 h-full bg-[#7f1d1d]/20 -skew-x-12"></div>
            </div>
            {/* Scarf Tail */}
            <div className="absolute top-14 right-5 w-4 h-8 bg-[#b91c1c] rounded-b-md rotate-6 z-10 border-r-2 border-[#7f1d1d]"></div>

            {/* --- HEAD (Taurus) --- */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-12 bg-[#5d4037] rounded-2xl shadow-md z-10 flex items-center justify-center">
                {/* Eyes */}
                <div className="flex gap-3 mb-1">
                    <div className="w-2 h-2 bg-black rounded-full animate-blink relative">
                        <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                    </div>
                    <div className="w-2 h-2 bg-black rounded-full animate-blink relative">
                        <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                    </div>
                </div>
                {/* Snout */}
                <div className="absolute bottom-0.5 w-9 h-5 bg-[#3e2723] rounded-xl flex justify-center items-center gap-2 opacity-80">
                     <div className="w-1 h-1 bg-black/60 rounded-full"></div>
                     <div className="w-1 h-1 bg-black/60 rounded-full"></div>
                     {/* Nose Ring */}
                     <div className="absolute -bottom-1 w-3 h-3 border-2 border-yellow-500 rounded-full clip-path-half"></div>
                </div>
            </div>

            {/* --- HORNS (Visible now) --- */}
            <div className="absolute top-0 left-0 w-4 h-7 border-l-[6px] border-t-[4px] border-[#e2e8f0] rounded-tl-full -rotate-[20deg] z-0"></div>
            <div className="absolute top-0 right-0 w-4 h-7 border-r-[6px] border-t-[4px] border-[#e2e8f0] rounded-tr-full rotate-[20deg] z-0"></div>

            {/* --- SPEECH BUBBLE DIALOG --- */}
            {isOpen && (
                <div 
                    className={`
                    absolute ${bubblePositionClass} z-[100] mb-2
                    cursor-auto animate-zoom-in
                    bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 
                    rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] 
                    text-center transform
                    ${modalDimensions} ${contentPadding}
                    `} 
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    {/* Arrow Pointer */}
                    <div className={`absolute w-4 h-4 bg-slate-900 border-cyan-500/50 transform ${arrowClass}`}></div>

                    {/* Icon Badge */}
                    <div className={`absolute left-1/2 -translate-x-1/2 bg-slate-800 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg ${iconSize}`}>
                        <span className="filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] flex items-center justify-center">
                            {variant === 'music' ? (
                                <Music size={20} className="text-cyan-400" />
                            ) : variant === 'coffee' ? '☕' : '✨'}
                        </span>
                    </div>
                    
                    {/* Header & Edit Toggle */}
                    <div className="mt-2 mb-1 space-y-1 relative">
                        <h3 className={`text-cyan-400 font-bold uppercase tracking-[0.2em] ${titleSize}`}>
                            {variant === 'music' ? 'DJ Taurus' : (variant === 'coffee' ? 'Barista Taurus' : 'Taurus the Wizard')}
                        </h3>
                        
                        {!isEditing && !forceOpen && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="absolute top-0 right-0 text-slate-600 hover:text-cyan-400 transition-colors"
                            >
                                <Edit3 size={12} />
                            </button>
                        )}
                    </div>
                    
                    {/* Content Area */}
                    {isEditing ? (
                        <div className="mb-2">
                            <textarea 
                                value={tempText}
                                onChange={(e) => setTempText(e.target.value)}
                                className="w-full h-16 bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none resize-none mb-2"
                            />
                            <div className="flex gap-2 justify-center">
                                <button onClick={handleCancel} className="p-1 rounded bg-red-900/20 text-red-400 hover:bg-red-900/40"><X size={14} /></button>
                                <button onClick={handleSave} className="p-1 rounded bg-green-900/20 text-green-400 hover:bg-green-900/40"><Check size={14} /></button>
                            </div>
                        </div>
                    ) : (
                        <div className="min-h-[2rem] flex items-center justify-center">
                            <p className={`text-slate-200 font-serif italic ${fontSize} px-2 whitespace-pre-wrap`}>
                                "{currentGreeting}"
                            </p>
                        </div>
                    )}
                    
                    {!forceOpen && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                            className="absolute -top-2 -right-2 p-1 bg-slate-800 text-slate-500 rounded-full hover:bg-red-900/50 hover:text-red-400 transition-colors border border-slate-700"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            )}
        </div>

        {/* --- STYLES --- */}
        <style>{`
            @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                5% { transform: rotate(20deg); }
                10% { transform: rotate(-10deg); }
                15% { transform: rotate(10deg); }
                20% { transform: rotate(0deg); }
            }
            .animate-wave {
                animation: wave 5s infinite ease-in-out;
            }
            @keyframes blink {
                0%, 96%, 100% { transform: scaleY(1); }
                98% { transform: scaleY(0.1); }
            }
            .animate-blink {
                animation: blink 4s infinite;
            }
        `}</style>
      </div>
    </>
  );
};

export default RavenclawTaurusMascot;