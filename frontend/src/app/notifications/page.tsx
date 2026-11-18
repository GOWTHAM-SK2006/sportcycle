'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Check, Package, CreditCard, Shield, Users, ArrowRight } from 'lucide-react';
import { notificationApi } from '@/lib/api';
import { NotificationItem, NotificationType } from '@/types';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadNotifications();
  }, [user]);

  const loadNotifications = () => {
    setLoading(true);
    notificationApi.getAll()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-4 h-4 text-olive" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'CLUB':
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-lime-700" />;
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-dark">Please sign in to view notifications</h2>
        <Link href="/auth/login" className="mt-4 inline-block px-6 py-3 rounded-2xl bg-lime font-bold text-xs text-dark">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-white min-h-screen pb-20">
      <div className="bg-ivory/60 border-b border-surface-border py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-dark">Notifications</h1>
            <p className="text-xs text-dark-muted mt-0.5">Stay updated with orders, club invitations, and listing approvals</p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-xl bg-surface-white border border-surface-border text-xs font-bold text-olive hover:bg-ivory flex items-center gap-1.5 shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-ivory/50 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center bg-ivory/30 rounded-3xl border border-surface-border p-8">
            <Bell className="w-10 h-10 text-olive mx-auto mb-2 opacity-50" />
            <h3 className="font-bold text-dark">No notifications right now</h3>
            <p className="text-xs text-dark-muted mt-1">We will notify you about order progress and club activities here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  n.isRead ? 'bg-surface-white border-surface-border' : 'bg-ivory/60 border-lime-300 shadow-sm'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-surface-white border border-surface-border flex items-center justify-center flex-shrink-0 shadow-sm">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm text-dark truncate">{n.title}</h3>
                    <span className="text-[10px] text-dark-muted whitespace-nowrap">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-dark-muted leading-relaxed">{n.message}</p>

                  <div className="mt-3 flex items-center gap-3">
                    {n.linkUrl && (
                      <Link
                        href={n.linkUrl}
                        className="text-xs font-bold text-olive hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="text-xs font-semibold text-dark-muted hover:text-dark flex items-center gap-1 ml-auto"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

