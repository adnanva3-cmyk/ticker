import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Film, Music, Upload } from 'lucide-react';

export function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay policies
  const [isExpanded, setIsExpanded] = useState(false);
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video');
  const [source, setSource] = useState<string>('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSource(url);
      setMediaType(file.type.startsWith('audio') ? 'audio' : 'video');
      setIsPlaying(true);
      // Auto-play new file
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  };

  return (
    <div 
      className={`absolute bottom-8 right-8 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out shadow-2xl z-50 ${isExpanded ? 'w-[800px] h-[450px]' : 'w-[400px] h-[225px]'}`}
    >
      {/* Header / Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            title="Upload Media"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="video/*,audio/*" 
            onChange={handleFileChange}
          />
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Media Element */}
      <div className="w-full h-full bg-black relative group">
        {mediaType === 'audio' ? (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <Music className="w-24 h-24 text-zinc-600 animate-pulse" />
          </div>
        ) : (
          <video 
            ref={videoRef}
            src={source}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            onClick={togglePlay}
          />
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={togglePlay}
            className="p-3 rounded-full bg-white text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>

          <div className="flex-1">
            <div className="text-xs font-medium text-zinc-300 mb-1">
              {mediaType === 'video' ? 'Live Feed' : 'Audio Stream'}
            </div>
            <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full animate-pulse" />
            </div>
          </div>

          <button 
            onClick={toggleMute}
            className="p-2 text-white hover:text-emerald-400 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
