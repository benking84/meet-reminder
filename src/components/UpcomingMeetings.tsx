"use client";

import type { Meeting } from '@/types';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { CalendarOff } from 'lucide-react';

// Mock data for demonstration
const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Daily Standup',
    startTime: new Date(new Date().getTime() + 2 * 60 * 1000), // 2 minutes from now for testing
    endTime: new Date(new Date().getTime() + 17 * 60 * 1000), // 17 minutes from now
    meetLink: 'https://meet.google.com/xyz-abc-pqr',
    description: 'Quick sync on daily tasks and blockers.'
  },
  {
    id: '2',
    title: 'Project Phoenix - Client Demo',
    startTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    endTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), // 3 hours from now
    meetLink: 'https://meet.google.com/def-uvw-stu',
    description: 'Presenting the latest iteration to the client. Key stakeholders will be present.'
  },
  {
    id: '3',
    title: 'Team Brainstorming Session',
    startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // Tomorrow, 30 mins later
    endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // Tomorrow, 1.5 hours later
    meetLink: 'https://meet.google.com/ghi-jkl-mno',
    description: 'Idea generation for the Q3 marketing campaign.'
  },
];

interface UpcomingMeetingsProps {
  reminderMinutes: number; // Received from ReminderSettings
}

export default function UpcomingMeetings({ reminderMinutes }: UpcomingMeetingsProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notifiedMeetings, setNotifiedMeetings] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch meetings from Google Calendar API
    // For now, use mock data and sort by start time
    const sortedMeetings = [...mockMeetings].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setMeetings(sortedMeetings);
  }, []);

  useEffect(() => {
    const checkMeetings = () => {
      const now = new Date().getTime();
      meetings.forEach(meeting => {
        const meetingStartTime = meeting.startTime.getTime();
        const reminderTime = meetingStartTime - reminderMinutes * 60 * 1000;

        // Check if it's time for a reminder and notification hasn't been sent
        if (now >= reminderTime && now < meetingStartTime && !notifiedMeetings.has(meeting.id)) {
          toast({
            title: `Reminder: ${meeting.title}`,
            description: `Meeting starts in ${reminderMinutes} minute(s) at ${meeting.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
            action: <ToastAction altText="Join Now" onClick={() => window.open(meeting.meetLink, '_blank')}>Join Now</ToastAction>,
            duration: 10000, // 10 seconds
          });
          setNotifiedMeetings(prev => new Set(prev).add(meeting.id));
        }
        
        // Simulate "Automated Opener" via toast when meeting starts
        // A real automated open (window.open) without user gesture is often blocked by browsers
        // and usually requires browser extension capabilities.
        if (now >= meetingStartTime && now <= meeting.endTime.getTime() && !notifiedMeetings.has(`started-${meeting.id}`)) {
           toast({
            title: `Meeting Starting: ${meeting.title}`,
            description: "This meeting is starting now. Click to join.",
            action: <ToastAction altText="Join" onClick={() => window.open(meeting.meetLink, '_blank')}>Join</ToastAction>,
            duration: 15000, // 15 seconds
          });
          setNotifiedMeetings(prev => new Set(prev).add(`started-${meeting.id}`));
        }
      });
    };

    const intervalId = setInterval(checkMeetings, 30 * 1000); // Check every 30 seconds
    checkMeetings(); // Initial check

    return () => clearInterval(intervalId);
  }, [meetings, reminderMinutes, notifiedMeetings, toast]);

  const upcoming = meetings.filter(m => m.startTime.getTime() >= new Date().getTime() - (5 * 60 * 1000)); // Show meetings that haven't ended more than 5 mins ago

  return (
    <section aria-labelledby="upcoming-meetings-title" className="w-full">
      <h2 id="upcoming-meetings-title" className="text-2xl font-semibold mb-6 text-foreground">
        Upcoming Meetings
      </h2>
      {upcoming.length > 0 ? (
        <div className="space-y-4">
          {upcoming.map(meeting => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
          <CalendarOff className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-muted-foreground">No upcoming meetings.</p>
          <p className="text-sm text-muted-foreground mt-1">Enjoy your free time or check your calendar!</p>
        </div>
      )}
    </section>
  );
}
