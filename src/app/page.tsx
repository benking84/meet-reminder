"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UpcomingMeetings from '@/components/UpcomingMeetings';
import ReminderSettings from '@/components/ReminderSettings';
import { useState, useEffect } from 'react';

export default function Home() {
  // Default reminder time: 5 minutes.
  // Use localStorage to persist this setting.
  const [reminderTime, setReminderTime] = useState<number>(5);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedReminderTime = localStorage.getItem('aviatoReminderTime');
    if (storedReminderTime) {
      setReminderTime(parseInt(storedReminderTime, 10));
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem('aviatoReminderTime', String(reminderTime));
    }
  }, [reminderTime, isClient]);


  if (!isClient) {
    // Render a loading state or null to avoid hydration mismatch with localStorage
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded w-1/4"></div>
            <div className="h-40 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded w-1/4 mt-8"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
          <UpcomingMeetings reminderMinutes={reminderTime} />
          <ReminderSettings reminderTime={reminderTime} setReminderTime={setReminderTime} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
