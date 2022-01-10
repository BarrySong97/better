import Dexie, { Table } from "dexie";
import { Habbit } from "./models/Habbit";

export class AppDB extends Dexie {
  habbitList!: Table<Habbit, number>;
  constructor() {
    super("habbit");
    this.version(1).stores({
      habbitList: "++id, &name, count,habbitRecorder, color, createDate",
    });
  }
}

export const db = new AppDB();
