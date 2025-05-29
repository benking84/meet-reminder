export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  meetLink: string;
  description?: string;
}
