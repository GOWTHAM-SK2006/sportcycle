'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  MapPin,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/lib/api';
import { Address } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');

  // Edit profile state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Add address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/profile');
      return;
    }
    setFullName(user.fullName || '');
    setPhone(user.phone || '');
    setAvatarUrl(user.avatarUrl || '');

    userApi.getAddresses().then(setAddresses).catch(console.error);
  }, [user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await userApi.updateProfile({ fullName, phone, avatarUrl });
      updateUser(updated);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setPasswordMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAddr = await userApi.addAddress({
        recipientName: addrName,
        phone: addrPhone,
        street: addrStreet,
        landmark: addrLandmark,
        city: addrCity,
        state: addrState,
        postalCode: addrPin,
        country: 'India',
        isDefault: addresses.length === 0,
        addressType: 'HOME',
      });
      setAddresses([...addresses, newAddr]);
      setShowAddressModal(false);
      // Reset
      setAddrName('');
      setAddrPhone('');
      setAddrStreet('');
      setAddrLandmark('');
      setAddrCity('');
      setAddrState('');
      setAddrPin('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await userApi.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await userApi.setDefaultAddress(id);
      const refreshed = await userApi.getAddresses();
      setAddresses(refreshed);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-lime/40 border border-lime flex items-center justify-center font-black text-xl text-dark">
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-black text-dark">{user.fullName}</h1>
              <p className="text-xs text-dark-muted">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-border pb-3 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile' ? 'bg-olive text-surface-white' : 'text-dark-muted hover:text-dark'
            }`}
          >
            Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'addresses' ? 'bg-olive text-surface-white' : 'text-dark-muted hover:text-dark'
            }`}
          >
            Saved Addresses ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'security' ? 'bg-olive text-surface-white' : 'text-dark-muted hover:text-dark'
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* TAB 1: PROFILE INFO */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-sm space-y-5">
            <h2 className="text-lg font-black text-dark">Account Details</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-dark block mb-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-gray-100 text-dark-muted cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-dark block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-dark block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>

              <div className="pt-2">
                <span className="text-xs font-bold text-dark-muted block mb-1">Assigned Roles:</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.roles.map((r) => (
                    <span key={r} className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-lime/30 text-dark border border-lime">
                      {r.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>

              {profileMsg && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  {profileMsg}
                </p>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-lime hover:bg-lime-500 font-black text-xs text-dark shadow-sm"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-dark">Address Book</h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 rounded-xl bg-lime font-bold text-xs text-dark hover:bg-lime-500 flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-2xl bg-surface-white border border-surface-border shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-dark">{addr.recipientName}</span>
                      {addr.isDefault ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime text-dark">
                          DEFAULT
                        </span>
                      ) : (
                        <button
                          onClick={() => addr.id && handleSetDefault(addr.id)}
                          className="text-[11px] font-bold text-olive hover:underline"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-dark-muted">{addr.street}</p>
                    {addr.landmark && <p className="text-xs text-dark-muted">{addr.landmark}</p>}
                    <p className="text-xs text-dark font-medium mt-1">{addr.city}, {addr.state} - {addr.postalCode}</p>
                    <p className="text-xs text-dark-muted mt-1">Phone: {addr.phone}</p>
                  </div>

                  <div className="pt-2 border-t border-surface-border flex justify-end">
                    <button
                      onClick={() => addr.id && handleDeleteAddress(addr.id)}
                      className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === 'security' && (
          <div className="max-w-md bg-surface-white rounded-3xl p-6 sm:p-8 border border-surface-border shadow-sm space-y-5">
            <h2 className="text-lg font-black text-dark">Update Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-dark block mb-1">New Password (Min 6 characters) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>

              {passwordMsg && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  {passwordMsg}
                </p>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-olive text-surface-white font-bold text-xs shadow-sm hover:bg-olive/90"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>

      {/* NEW ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-surface-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-surface-border shadow-2xl space-y-4">
            <h3 className="text-base font-black text-dark">Add New Address</h3>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-dark block mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-dark block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-dark block mb-1">PIN Code *</label>
                <input
                  type="text"
                  required
                  value={addrPin}
                  onChange={(e) => setAddrPin(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-surface-border bg-ivory/20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 rounded-xl border border-surface-border font-bold text-xs text-dark hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-lime hover:bg-lime-500 font-bold text-xs text-dark shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

