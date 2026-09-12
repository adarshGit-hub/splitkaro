'use client';

import React, { useState } from 'react';
import { useFriends } from '@/hooks/useFriends';
import { Users, UserPlus, Search, Edit2, Trash2, Phone, X, Check } from 'lucide-react';
import { Friend } from '@/types';

export default function FriendsPage() {
  const { friends, loading, addFriend, updateFriend, deleteFriend } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendPhone, setNewFriendPhone] = useState('');

  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (f.phone && f.phone.includes(searchQuery))
  );

  const handleAdd = async () => {
    if (!newFriendName.trim()) return;
    await addFriend(newFriendName.trim(), newFriendPhone.trim() || undefined);
    setIsAddModalOpen(false);
    setNewFriendName('');
    setNewFriendPhone('');
  };

  const handleUpdate = async () => {
    if (!editingFriend || !editingFriend.name.trim()) return;
    await updateFriend(editingFriend.id, { 
      name: editingFriend.name.trim(), 
      phone: editingFriend.phone?.trim() || null 
    } as any);
    setEditingFriend(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      await deleteFriend(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Friends
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search friends by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {filteredFriends.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No friends found</h3>
          <p className="text-gray-500 mt-1">Start adding friends to easily split bills with them.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {filteredFriends.map(friend => (
            <div key={friend.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              {editingFriend?.id === friend.id ? (
                <div className="flex-1 flex items-center gap-3 mr-4">
                  <input
                    type="text"
                    value={editingFriend.name}
                    onChange={e => setEditingFriend({...editingFriend, name: e.target.value})}
                    className="flex-1 px-3 py-1 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={editingFriend.phone || ''}
                    onChange={e => setEditingFriend({...editingFriend, phone: e.target.value})}
                    className="w-32 px-3 py-1 border rounded"
                  />
                  <button onClick={handleUpdate} className="text-green-600 p-1"><Check className="w-5 h-5" /></button>
                  <button onClick={() => setEditingFriend(null)} className="text-gray-400 p-1"><X className="w-5 h-5" /></button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{friend.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {friend.phone && (
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {friend.phone}</span>
                        )}
                        <span>Split {friend.times_used || 0} times</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingFriend(friend)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(friend.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal (Simple overlay for now) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add Friend</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newFriendName}
                  onChange={e => setNewFriendName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input
                  type="text"
                  value={newFriendPhone}
                  onChange={e => setNewFriendPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newFriendName.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Add Friend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
