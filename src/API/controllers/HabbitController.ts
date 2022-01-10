import { AddHabbit, Habbit, HabbitRecorder } from "../models/Habbit";
import localforage from "localforage";
import moment from "moment";
import { db } from "../db";
type PartialOptional<T, K extends keyof T> = {
  [P in K]?: T[P];
};
export class HabbitController {
  constructor() {}

  async addHabbit(habbit: AddHabbit) {
    const yearDays =
      moment(`${moment().year()}-2`, "YYYY-MM").daysInMonth() === 28
        ? 365
        : 366;
    const recorders = new Array(yearDays).fill(0).map((v, index) => ({
      date: moment()
        .dayOfYear(index + 1)
        .toDate(),

      isActive: false,
    }));
    habbit.recorders = recorders;
    await db.habbitList.add(habbit as Habbit);
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

  async toggleCheck(title: string, index: number) {
    await db.habbitList
      .where({
        name: title,
      })
      .modify((f) => {
        const item = f.recorders[moment().weekday(index).dayOfYear() - 1];
        console.log(item);

        item.isActive = !item.isActive;

        if (item.isActive) {
          f.count++;
        } else {
          f.count--;
        }
      });
  }

  async getHeatData(item: Habbit) {
    const end = item.recorders.findIndex(
      (item) => moment(item.date).dayOfYear() === moment(new Date()).dayOfYear()
    );

    return item.recorders
      .slice(end - 150 > 0 ? end - 150 : 0, end + 1)
      .map((v, index) => {
        return {
          date: moment(v.date).format("YYYY-MM-DD"),
          count: v.isActive ? 1 : 0,
        };
      });
  }
  async getLineMonthData(item: Habbit) {
    const res = [];
    for (let i = 0; i < 12; i++) {
      const end = item.recorders.findIndex(
        (item) => moment(item.date).month() === i
      );
      res.push(
        item.recorders
          .slice(end, moment(item.recorders[end].date).daysInMonth())
          .filter((v) => v.isActive).length
      );
    }

    return res;
  }
  async getLineWeekData(item: Habbit) {
    const res = [];
    const currentWeekStartDate = moment().startOf("week");
    const end = item.recorders.findIndex((item) =>
      moment(item.date).startOf("week").isSame(currentWeekStartDate)
    );

    const currentWeekCount = item.recorders
      .slice(end, 7)
      .filter((v) => v.isActive).length;
    res.push(currentWeekCount);
    for (let i = 1; i < 4; i++) {
      const start = currentWeekStartDate.subtract(7, "day");
      const temp = item.recorders.findIndex((item) =>
        moment(item.date).isSame(start)
      );

      const currentWeekCount = item.recorders
        .slice(temp, 7)
        .filter((v) => v.isActive).length;

      res.push(currentWeekCount);
    }

    return res;
  }
  async getStatisticsData(item: Habbit) {
    const createDate = item.createDate;
    const start = item.recorders.findIndex((v) =>
      moment(v.date).isSame(createDate, "day")
    );
    const end = item.recorders.findIndex((v) =>
      moment(v.date).isSame(new Date(), "day")
    );

    const total = item.recorders.slice(start, end + 1).length;
    const statistic = {
      times: item.count,
      missed: total - item.count < 0 ? 0 : total - item.count,
      total: total,
    };

    return statistic;
  }

  async getHabbitRecorders(name: string) {
    const item = await db.habbitList.where({ name: name }).toArray();
    const heatData = await this.getHeatData(item[0]);
    const statistic = await this.getStatisticsData(item[0]);
    const lineMonth = await this.getLineMonthData(item[0]);
    const lineWeek = await this.getLineWeekData(item[0]);

    return { heatData, statistic, lineMonth, lineWeek, item: item[0] };
  }
}
