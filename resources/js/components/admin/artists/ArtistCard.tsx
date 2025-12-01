
import React from 'react';
import { Edit2, Trash2, Globe, User, RotateCcw } from 'lucide-react';
import { Artist } from '../../../types';

interface ArtistCardProps {
  artist: Artist;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onEdit, onDelete, onRestore }) => {
  const isDeleted = !!artist.deleted_at;
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full group">
      <div className="p-5 flex items-start gap-4">
        <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
          {artist.image ? (
            <img src={artist.image} alt={artist.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              <User size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 truncate" title={artist.name}>
            {artist.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
            <Globe size={14} />
            <span className="truncate">{artist.country || 'N/A'}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-mono truncate">{artist.slug}</p>
        </div>
        
        {/* Status Dot */}
        <span 
          className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${
            isDeleted ? 'bg-red-500' : 'bg-green-500'
          }`} 
          title={isDeleted ? 'Đã xóa' : 'Đang hoạt động'}
        ></span>
      </div>
      
      <div className="px-5 pb-4 flex-1">
        <p className="text-sm text-gray-600 line-clamp-2 h-10 leading-relaxed">
          {artist.description || 'Chưa có mô tả.'}
        </p>
      </div>

      <div className="mt-auto border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-lg flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-gray-400">
          {isDeleted && <span className="text-red-500 font-medium mr-2">Đã xóa</span>}
          ID: {artist.id.slice(-4)}
        </span>
        <div className="flex gap-2">
            {!isDeleted ? (
              <>
                <button 
                    onClick={() => onEdit(artist.id)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-200 shadow-sm"
                    title="Chỉnh sửa"
                >
                    <Edit2 size={16} />
                </button>
                <button 
                    onClick={() => onDelete(artist.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-200 shadow-sm"
                    title="Xóa"
                >
                    <Trash2 size={16} />
                </button>
              </>
            ) : (
              <button 
                  onClick={() => onRestore(artist.id)}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-200 shadow-sm"
                  title="Khôi phục"
              >
                  <RotateCcw size={16} />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
