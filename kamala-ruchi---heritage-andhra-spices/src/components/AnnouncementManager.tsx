import React, { useState, useEffect } from 'react';
import { Announcement, PopupNote } from '../types';
import { fetchAnnouncements, adminSaveAnnouncement, fetchPopups, adminSavePopup } from '../lib/dbService';

export const AnnouncementManager: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [popups, setPopups] = useState<PopupNote[]>([]);
  const [loading, setLoading] = useState(true);

  // States for forms
  const [marqueeText, setMarqueeText] = useState('');
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);
  
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupButton, setPopupButton] = useState('');
  const [isPopupActive, setIsPopupActive] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [anns, pops] = await Promise.all([fetchAnnouncements(), fetchPopups()]);
    setAnnouncements(anns);
    setPopups(pops);
    
    if (anns.length > 0) {
      setMarqueeText(anns[0].message);
      setIsMarqueeActive(anns[0].isActive);
    }
    if (pops.length > 0) {
      setPopupTitle(pops[0].title);
      setPopupMessage(pops[0].message);
      setPopupButton(pops[0].buttonText || '');
      setIsPopupActive(pops[0].isActive);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveMarquee = async (e: React.FormEvent) => {
    e.preventDefault();
    const ann: Announcement = {
      id: announcements.length > 0 ? announcements[0].id : 'main-announcement',
      message: marqueeText,
      isActive: isMarqueeActive,
      updatedAt: new Date().toISOString()
    };
    await adminSaveAnnouncement(ann);
    window.dispatchEvent(new Event('kamala-data-updated'));
    alert('Marquee updated!');
    loadData();
  };

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const pop: PopupNote = {
      id: popups.length > 0 ? popups[0].id : 'main-popup',
      title: popupTitle,
      message: popupMessage,
      buttonText: popupButton,
      isActive: isPopupActive,
      updatedAt: new Date().toISOString()
    };
    await adminSavePopup(pop);
    window.dispatchEvent(new Event('kamala-data-updated'));
    alert('Popup updated!');
    loadData();
  };

  if (loading) {
    return <div className="text-center p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Marquee Settings */}
      <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
        <div className="mb-6 border-b border-[#ebd3aa]/40 pb-4">
          <h3 className="font-headline-sm text-xl text-[#241a04] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#af1820]">linear_scale</span>
            Scrolling Marquee (Top Bar)
          </h3>
          <p className="text-xs text-[#5a431f]">Displays moving text at the very top of the storefront.</p>
        </div>

        <form onSubmit={handleSaveMarquee} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5a431f] mb-1">Announcement Text</label>
            <input type="text" value={marqueeText} onChange={e => setMarqueeText(e.target.value)} placeholder="e.g. 50% OFF Diwali Special!" className="w-full p-2 border border-[#d6be95] rounded-lg text-sm" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isMarqueeActive} onChange={e => setIsMarqueeActive(e.target.checked)} className="w-5 h-5 accent-[#af1820]" />
              <span className="text-sm font-bold text-[#241a04]">Enable Marquee</span>
            </label>
            <button type="submit" className="px-5 py-2 bg-[#af1820] hover:bg-[#d23435] active:bg-[#8e1319] active:scale-95 text-white rounded-lg font-bold text-xs transition-all cursor-pointer">Save Marquee</button>
          </div>
        </form>
      </div>

      {/* Popup Settings */}
      <div className="bg-[#fffbf6] border border-[#ebd3aa] rounded-2xl p-6 shadow-xs">
        <div className="mb-6 border-b border-[#ebd3aa]/40 pb-4">
          <h3 className="font-headline-sm text-xl text-[#241a04] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#af1820]">branding_watermark</span>
            Welcome Popup Modal
          </h3>
          <p className="text-xs text-[#5a431f]">Shows a central popup modal when users visit the site.</p>
        </div>

        <form onSubmit={handleSavePopup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5a431f] mb-1">Popup Title</label>
            <input type="text" value={popupTitle} onChange={e => setPopupTitle(e.target.value)} placeholder="e.g. Important Announcement" className="w-full p-2 border border-[#d6be95] rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5a431f] mb-1">Popup Message</label>
            <textarea value={popupMessage} onChange={e => setPopupMessage(e.target.value)} placeholder="Message content..." rows={3} className="w-full p-2 border border-[#d6be95] rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#5a431f] mb-1">Button Text</label>
            <input type="text" value={popupButton} onChange={e => setPopupButton(e.target.value)} placeholder="e.g. Shop Now" className="w-full p-2 border border-[#d6be95] rounded-lg text-sm" />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPopupActive} onChange={e => setIsPopupActive(e.target.checked)} className="w-5 h-5 accent-[#af1820]" />
              <span className="text-sm font-bold text-[#241a04]">Enable Popup</span>
            </label>
            <button type="submit" className="px-5 py-2 bg-[#af1820] hover:bg-[#d23435] active:bg-[#8e1319] active:scale-95 text-white rounded-lg font-bold text-xs transition-all cursor-pointer">Save Popup</button>
          </div>
        </form>
      </div>
    </div>
  );
};
