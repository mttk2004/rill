
import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { ARTISTS } from '../../../data';
import { Artist } from '../../../types';
import {
  Plus, Search, Globe
} from 'lucide-react';
import Button from '../../../components/Button';
import AlertDialog from '../../../components/AlertDialog';
import { useToast } from '../../../context/ToastContext';
import ArtistCard from '../../../components/admin/artists/ArtistCard';

const ArtistList = () => {
  const { showToast } = useToast();

  const [artists, setArtists] = useState<Artist[]>(ARTISTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Extract unique countries for filter
  const uniqueCountries = useMemo(() => {
    const countries = new Set(artists.map(a => a.country).filter(Boolean));
    return Array.from(countries).sort();
  }, [artists]);

  const filteredArtists = useMemo(() => {
    let items = [...artists];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(a =>
        a.name.toLowerCase().includes(lowerQuery) ||
        (a.slug && a.slug.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter Country
    if (filterCountry !== 'all') {
      items = items.filter(a => a.country === filterCountry);
    }

    return items;
  }, [artists, searchQuery, filterCountry]);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      setArtists(prev => prev.filter(a => a.id !== deleteId));
      showToast('Đã xóa nghệ sĩ thành công', 'success');
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Quản lý Nghệ sĩ</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách các nghệ sĩ, ban nhạc trong hệ thống</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => navigate('/admin/artists/create')}>
          <Plus size={18} /> Thêm nghệ sĩ
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Tìm tên nghệ sĩ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Globe size={18} className="text-gray-500" />
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
          >
            <option value="all">Tất cả quốc gia</option>
            {uniqueCountries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List Grid - Updated to 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onEdit={() => navigate(`/admin/artists/${artist.id}`)}
            onDelete={setDeleteId}
          />
        ))}
      </div>

      {filteredArtists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy nghệ sĩ nào.</p>
        </div>
      )}

      <AlertDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Xóa nghệ sĩ?"
        description="Bạn có chắc chắn muốn xóa nghệ sĩ này không? Lưu ý: Các sản phẩm liên kết với nghệ sĩ này có thể bị ảnh hưởng."
        confirmText="Xóa vĩnh viễn"
      />
    </div>
  );
};

export default ArtistList;
