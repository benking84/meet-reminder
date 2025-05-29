"use client";

import type { Meeting } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Video, Users, Info } from 'lucide-react';
import { format } from 'date-fns';

interface MeetingCardProps {
  meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const handleJoinMeeting = () => {
    window.open(meeting.meetLink, '_blank', 'noopener,noreferrer');
  };

  const meetingTime = `${format(meeting.startTime, 'p')} - ${format(meeting.endTime, 'p')}`;
  const meetingDate = format(meeting.startTime, 'MMMM d, yyyy');

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <Video className="mr-2 h-6 w-6 text-primary" />
          {meeting.title}
        </CardTitle>
        <CardDescription className="flex items-center text-muted-foreground pt-1">
          <Clock className="mr-2 h-4 w-4" />
          {meetingDate} &bull; {meetingTime}
        </CardDescription>
      </CardHeader>
      {meeting.description && (
        <CardContent>
          <div className="flex items-start text-sm text-foreground">
            <Info className="mr-2 h-4 w-4 mt-1 shrink-0 text-accent-foreground" />
            <p className="break-words">{meeting.description}</p>
          </div>
        </CardContent>
      )}
      <CardFooter className="flex justify-end">
        <Button onClick={handleJoinMeeting} aria-label={`Join meeting: ${meeting.title}`}>
          <Video className="mr-2 h-5 w-5" />
          Join Meeting
        </Button>
      </CardFooter>
    </Card>
  );
}
