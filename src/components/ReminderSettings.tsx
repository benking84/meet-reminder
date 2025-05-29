"use client";

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface ReminderSettingsProps {
  reminderTime: number;
  setReminderTime: Dispatch<SetStateAction<number>>;
}

const reminderOptions = [
  { value: 1, label: '1 minute before' },
  { value: 5, label: '5 minutes before' },
  { value: 10, label: '10 minutes before' },
  { value: 15, label: '15 minutes before' },
];

export default function ReminderSettings({ reminderTime, setReminderTime }: ReminderSettingsProps) {
  const handleReminderChange = (value: string) => {
    setReminderTime(parseInt(value, 10));
    // In a real app, save this preference (e.g., localStorage or backend)
  };

  return (
    <Card className="w-full shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <BellRing className="mr-2 h-6 w-6 text-primary" />
          Reminder Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label htmlFor="reminder-time-group" className="text-base font-medium text-foreground">
            Notify me:
          </Label>
          <RadioGroup
            id="reminder-time-group"
            value={String(reminderTime)}
            onValueChange={handleReminderChange}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {reminderOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground">
                <RadioGroupItem value={String(option.value)} id={`reminder-${option.value}`} />
                <Label htmlFor={`reminder-${option.value}`} className="font-normal cursor-pointer w-full">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        {/* <div className="mt-6 flex justify-end">
          <Button>Save Preferences</Button> 
          // Save button is optional as selection can be instant
        </div> */}
      </CardContent>
    </Card>
  );
}
