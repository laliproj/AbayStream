import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Globe, Heart, BarChart3, Settings, User, Monitor, Play, ShieldCheck, Activity } from 'lucide-react';

const AbaySteam = () => {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [quality, setQuality] = useState("1080p");
  const [activeTab, setActiveTab] = useState('downloader');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // AUTO-PREVIEW LOGIC: Fires when link is pasted
  useEffect(() => {
    const fetchThumb = async () => {
      if (url.length > 15 && (url.includes("youtube.com") || url.includes("youtu.be"))) {
        try {
          const res = await axios.get(`http://localhost:8000/inspect?url=${url}`);
          if (!res.data.error) setMetadata(res.data);
        } catch (err) { console.log("Uplink delayed..."); }
      } else {
        setMetadata(null);
      }
    };
    fetchThumb();
  }, [url]);

  const handleDownload = async () => {
    if (!url) return setStatus("TARGET MISSING: PASTE URL");
    setLoading(true);
    setStatus("INITIATING EXTRACTION SEQUENCE...");
    
    try {
      const res = await axios.get(`http://localhost:8000/download?url=${url}&quality=${quality}`);
      if (res.data.status === "success") {
        setStatus("SUCCESS: FILE SAVED TO PC DOWNLOADS");
      } else {
        setStatus(`FAILED: ${res.data.error}`);
      }
    } catch (err) {
      setStatus("LINK SEVERED: CHECK BACKEND NODE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050505] text-white font-sans selection:bg-cyan-500/30">
      
      {/* SIDEBAR: Kept from previous professional layout */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">ABAY<span className="text-cyan-500 text-sm">Steam</span></h1>
        </div>
        
        <nav className="flex flex-col gap-1">
          <NavItem icon={<Download size={18}/>} label="Downloader" active={activeTab === 'downloader'} onClick={() => setActiveTab('downloader')} />
          <NavItem icon={<Globe size={18}/>} label="Ethio-Discovery" active={activeTab === 'discovery'} onClick={() => setActiveTab('discovery')} />
          <NavItem icon={<Heart size={18}/>} label="Vault" active={activeTab === 'vault'} />
          <NavItem icon={<BarChart3 size={18}/>} label="Analytics" active={activeTab === 'admin'} />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">System Load</span>
              <Activity size={12} className="text-cyan-500 animate-pulse"/>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-1/2"></div>
            </div>
          </div>
          <NavItem icon={<Settings size={18}/>} label="Node Config" />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Media Hub</h2>
            <p className="text-white/20 text-[10px] uppercase tracking-[0.4em]">High-Speed Content Extraction Platform</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-full border border-white/5">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/30">L</div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase">LEAL_USER_01</p>
              <p className="text-[9px] text-cyan-500">SYSTEM_ADMIN</p>
            </div>
          </div>
        </header>

        <section className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* DOWNLOADER MODULE */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl shadow-2xl">
              <label className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-6 block">Target Identification</label>
              <input 
                className="w-full bg-transparent border-b-2 border-white/10 p-4 outline-none focus:border-cyan-500 transition-all text-xl mb-12 placeholder:text-white/5" 
                placeholder="INPUT NEURAL LINK (URL)..." 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/10 p-5 rounded-3xl outline-none focus:border-cyan-400 cursor-pointer appearance-none text-sm font-bold"
                >
                  <option value="1080p">ULTRA HD (1080P)</option>
                  <option value="720p">HIGH DEF (720P)</option>
                  <option value="480p">STANDARD (480P)</option>
                  <option value="mp3">AUDIO (HQ MP3)</option>
                </select>

                <button 
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex-[1.5] bg-cyan-500 hover:bg-cyan-400 text-black font-black py-5 rounded-3xl transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] disabled:opacity-30 group"
                >
                  {loading ? "EXTRACTING DATA..." : "EXECUTE RETRIEVAL"}
                </button>
              </div>

              {status && (
                <div className="mt-8 flex items-center gap-3 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl animate-in slide-in-from-top-2">
                  <ShieldCheck size={16} className="text-cyan-400"/>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{status}</span>
                </div>
              )}
            </div>

            {/* PREVIEW MODULE: Show thumbnail and metadata */}
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-6 backdrop-blur-md border-t border-l border-white/20">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-6 block text-center">Visual Uplink</label>
              {metadata ? (
                <div className="animate-in fade-in zoom-in duration-700">
                  <div className="relative rounded-3xl overflow-hidden mb-6 group border border-white/10">
                    <img src={metadata.thumbnail} alt="preview" className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay"></div>
                  </div>
                  <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2 text-white/90">{metadata.title}</h3>
                  <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-6">{metadata.uploader}</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-[9px] text-white/20 uppercase">Duration</p>
                      <p className="text-xs font-bold">{metadata.duration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-white/20 uppercase">Views</p>
                      <p className="text-xs font-bold">{metadata.views}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[250px] opacity-10">
                  <Monitor size={64} className="mb-4 stroke-[1px]"/>
                  <p className="text-[10px] uppercase tracking-[0.5em]">Scanning...</p>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.4)] font-black' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
  >
    {icon} <span className="text-xs uppercase tracking-widest">{label}</span>
  </button>
);

export default AbaySteam;