export interface Habbit {
  id: string;
  name: string;
  count: number;
  recorders: HabbitRecorder[];
}

export interface AddHabbit {
  id?: string;
  name: string;
  count: number;
  recorders?: HabbitRecorder[];
}

export interface HabbitRecorder {
  date: Date;
  habbitId: string;
  isActive: boolean;
}
