import React, { useState } from 'react';
import { Search, UserPlus, X, Users, Check } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { cn } from '@/lib/utils';

interface FriendsPickerProps {
  selectedParticipants: { name: string; amount: number }[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

export function FriendsPicker({ selectedParticipants, onAdd, onRemove }: FriendsPickerProps) {
  const { friends, searchFriends } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');
  const [newFriendName, setNewFriendName] = useState('');

  const filteredFriends = searchFriends(searchQuery);

  const handleAddNew = () => {
    if (newFriendName.trim()) {
      onAdd(newFriendName.trim());
      setNewFriendName('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Participants Chips */}
      {selectedParticipants.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {selectedParticipants.map(p => (
            <div 
              key={p.name} 
              className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1 rounded-full text-xs font-semibold shadow-xs"
            >
              <span>{p.name}</span>
              <button 
                type="button" 
                onClick={() => onRemove(p.name)}
                className="hover:bg-indigo-200 text-indigo-700 rounded-full p-0.5 transition-colors cursor-pointer"
                title={`Remove ${p.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Person Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type friend's name (e.g. Rahul, Priya)..."
          value={newFriendName}
          onChange={(e) => setNewFriendName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNew())}
          className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900 font-medium text-sm placeholder:text-slate-400 shadow-2xs"
        />
        <button
          type="button"
          onClick={handleAddNew}
          disabled={!newFriendName.trim()}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-98 transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Search / Existing Saved Friends */}
      {friends.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search existing friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 border border-slate-200 bg-slate-50/50 rounded-xl p-2">
            {filteredFriends.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-3">No saved friends found.</p>
            ) : (
              filteredFriends.map(friend => {
                const isSelected = selectedParticipants.some(p => p.name === friend.name);
                return (
                  <div key={friend.id} className="flex items-center justify-between p-2 bg-white border border-slate-100 hover:border-slate-200 rounded-lg transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-indigo-100 text-indigo-700 font-bold rounded-full flex items-center justify-center text-xs">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800 text-xs">{friend.name}</span>
                    </div>
                    {isSelected ? (
                      <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Added
                      </span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => onAdd(friend.name)} 
                        className="text-indigo-600 font-bold text-xs px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
