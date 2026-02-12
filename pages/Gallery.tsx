
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Camera, Maximize2 } from 'lucide-react';
import { GalleryImage } from '../types';

interface GalleryProps {
  images: GalleryImage[];
  isDarkMode: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ images = [], isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn pb-24 max-w-2xl mx-auto px-2">
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center px-5 py-2 rounded-xl transition font-black text-xs uppercase tracking-widest ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-indigo-400' : 'bg-white text-gray-600 hover:text-indigo-600 shadow-sm border border-gray-100'}`}
        >
          <ArrowLeft size={16} className="mr-2" /> ফিরে যান
        </button>
      </div>

      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl mb-6 transform -rotate-3">
          <Camera size={40} />
        </div>
        <h2 className={`text-4xl font-black mb-3 tracking-tighter ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>চিত্রপট</h2>
        <div className="w-24 h-2 bg-indigo-600 rounded-full mx-auto mb-4"></div>
        <p className={`font-bold uppercase tracking-[0.2em] text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>স্মৃতিময় মুহূর্তগুলোর এক অনন্য সংকলন</p>
      </div>

      {images && Array.isArray(images) && images.length > 0 ? (
        <div className="flex flex-col space-y-8">
          {images.map((image) => (
            <div 
              key={image?.id || Math.random()} 
              className={`group rounded-[2.5rem] overflow-hidden shadow-lg border transition-all duration-500 hover:shadow-2xl flex flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
            >
              <div className="aspect-video relative overflow-hidden bg-gray-200 dark:bg-slate-900">
                <img 
                  src={image?.url || ''} 
                  alt={image?.title || 'Gallery Image'} 
                  className="w-full h-full object-cover transition duration-1000 group-hover:scale-105" 
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Image+Not+Found';
                  }}
                />
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <h3 className={`text-2xl font-black mb-2 transition-colors duration-300 group-hover:text-indigo-600 ${isDarkMode ? 'text-slate-100' : 'text-indigo-950'}`}>
                      {image?.title || 'শিরোনামহীন'}
                    </h3>
                    <div className="w-12 h-1 bg-indigo-600/30 rounded-full"></div>
                  </div>
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-900 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    <ImageIcon size={20} />
                  </div>
                </div>
                <p className={`text-sm font-medium leading-relaxed tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {image?.description || ''}
                </p>
                
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">
                    <Maximize2 size={16} />
                    <span>ফুল ভিউ দেখুন</span>
                  </button>
                  <div className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase">
                    ID: {image?.id ? String(image.id).slice(-4) : 'NEW'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-32 rounded-[4rem] border-4 border-dashed font-black ${isDarkMode ? 'border-slate-800 text-slate-700' : 'border-gray-100 text-gray-300'}`}>
          <ImageIcon size={100} className="mx-auto mb-6 opacity-10" />
          <p className="text-2xl uppercase tracking-widest opacity-50">বর্তমানে কোনো ছবি নেই</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
