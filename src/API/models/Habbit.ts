export interface Habbit {
  id: string;
  name: string;
  count: number;
  color: string;
  createDate: Date;
  rank: number;
  recorders: HabbitRecorder[];
}

export interface AddHabbit {
  id?: string;
  name: string;
  createDate: Date;
  count: number;
  color: string;
  recorders?: HabbitRecorder[];
}

export interface HabbitRecorder {
  date: Date;
  isActive: boolean;
}
