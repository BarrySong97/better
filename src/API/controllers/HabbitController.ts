import { AddHabbit, Habbit, HabbitRecorder } from "../models/Habbit";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
type PartialOptional<T, K extends keyof T> = {
  [P in K]?: T[P];
};
export class HabbitController {
  constructor() {}

  async generateHabbit(habbit: AddHabbit): Promise<Habbit> {
    const habbitId = uuidv4();
    // habbit.id = habbitId;
    console.log(123);
    const habbits: Habbit[] | null = await localforage.getItem("habbits");
    const yearDays =
      moment(`${moment().year()}-2`, "YYYY-MM").daysInMonth() === 28
        ? 365
        : 366;
    const recorders = new Array(yearDays).fill(0).map((v, index) => ({
      date: moment()
        .dayOfYear(index + 1)
        .toDate(),
      isActive: false,
      habbitId: habbitId,
    }));
    habbit.recorders = recorders;
    const res = await localforage.setItem(habbitId, habbit);
    return res as Habbit;
  }

  async listHabbit(): Promise<Habbit[]> {
    const getWeekDay = () => {
      return moment.weekdaysShort();
    };
    const weekDayString = getWeekDay();
    // weekDayString.map((day, index) => {
    //   const isActive = weekData[index].isActive;
    //   const render = moment().weekday(index).date();
    // });

    const res: Habbit[] | null = await localforage.getItem("habbits");

    // if (res) {
    //   for (const h of res) {
    //     const recorders = await this.getHabbitRecorders(h.id);
    //   }
    //   return res;
    // }
    return res ?? [];
  }
  async toggleCheck(id: string, date: string): Promise<boolean> {
    // const res: Habbit[] | null = await localforage.getItem(
    //   "habbits"
    // );
    // const item = res?.find((v) => v.id === id);
    // if (item?.recorders) {
    //   item.isActive = !item.isActive;
    //   return true;
    // } else {
    //   return false;
    // }
  }

  // async listHabbit(): Promise<Habbit> {}
}
