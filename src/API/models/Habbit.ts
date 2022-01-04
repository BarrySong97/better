export interface Habbit {
  id: string;
  name: string;
  count: number;
  createDate: Date;
  recorders: HabbitRecorder[];
}

export interface AddHabbit {
  id?: string;
  name: string;
  createDate: Date;
  count: number;
  recorders?: HabbitRecorder[];
}

export interface HabbitRecorder {
  date: Date;
  isActive: boolean;
}
