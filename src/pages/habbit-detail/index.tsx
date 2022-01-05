import React, { FC, useMemo, useState } from "react";
import { TabPane, Tabs, Typography } from "@douyinfe/semi-ui";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./index.css";
import Chart from "react-apexcharts";
import Section from "@douyinfe/semi-ui/lib/es/form/section";
import { useMount } from "ahooks";
import { db } from "../../API/db";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Habbit } from "../../API/models/Habbit";

export interface BasicStatistics {
  times: number;
  missed: number;
  total: number;
}
export interface HabbitDetailProps {}
console.log(moment(new Date()).isoWeeksInYear());

const HabbitDetail: FC<HabbitDetailProps> = () => {
  let params = useParams();
  const [basicStatistics, setBasicStatistics] = useState<BasicStatistics>();
  const [heatMapValues, setHeatMapValues] = useState<any>();

  const [lineMonthData, setLineMonthData] = useState<Number[]>();
  const [lineWeekData, setLineWeekData] = useState<Number[]>();
  const [tabKey, setTabKey] = useState<string>("1");
  const commonCardStyle = {
    color: "black",
    // background: "#292929",
    boxShadow: "var(--semi-shadow-elevated)",
  };
  const today = new Date();
  const commentClass = "flex flex-col justify-center items-center";

  const lineOption = useMemo(
    () => ({
      options: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        tooltip: {
          x: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },

        grid: {
          show: false,
        },
        yaxis: {
          lines: {
            show: false, //or just here to disable only y axis
          },
          labels: {
            formatter: function (value: number) {
              return value;
            },
          },
        },

        xaxis: {
          lines: {
            show: false, //or just here to disable only y axis
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
          axisBorder: {
            show: false,
          },
          categories:
            tabKey === "1"
              ? [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ]
              : [
                  moment().isoWeek(),
                  moment().subtract(1, "week").isoWeek(),
                  moment().subtract(2, "week").isoWeek(),
                  moment().subtract(3, "week").isoWeek(),
                ],
        },
      },
    }),
    [tabKey]
  );

  const lineMonthSeries = useMemo(
    () => [
      {
        name: "Count",
        data: lineMonthData,
      },
    ],
    [lineMonthData]
  );
  const lineWeekSeries = useMemo(
    () => [
      {
        name: "Count",
        data: lineWeekData,
      },
    ],
    [lineWeekData]
  );

  const getStatisticsData = (item: Habbit) => {
    const createDate = item.createDate;
    const start = item.recorders.findIndex((v) =>
      moment(v.date).isSame(createDate, "day")
    );
    const end = item.recorders.findIndex((v) =>
      moment(v.date).isSame(today, "day")
    );

    const total = item.recorders.slice(start, end + 1).length;
    const statistic = {
      times: item.count,
      missed: total - item.count < 0 ? 0 : total - item.count,
      total: total,
    };

    return statistic;
  };

  useMount(async () => {
    /**
     * get staitistic data
     */
    const item = await db.habbitList.where({ name: params.name }).toArray();
    const days = await getHeatData();
    const statistic = await getStatisticsData(item[0]);
    const lineMonth = await getLineMonthData(item[0]);
    const lineWeek = await getLineWeekData(item[0]);

    
    const res = days.map((v, index) => {
      return {
        date: moment(v.date).format("YYYY-MM-DD"),
        count: v.isActive ? 3 : 1,
      };
    });

    setBasicStatistics(statistic);
    setHeatMapValues(res);

    setLineMonthData(lineMonth);
    setLineWeekData(lineWeek);
  });

  const getHeatData = async () => {
    const item = await db.habbitList.where({ name: params.name }).toArray();
    const end = item[0].recorders.findIndex(
      (item) => moment(item.date).dayOfYear() === moment(today).dayOfYear()
    );

    return item[0].recorders.slice(end - 150 > 0 ? end - 150 : 0, end + 1);
  };

  /**
   * get 12 months data
   * @param item
   * @returns
   */
  const getLineMonthData = async (item: Habbit) => {
    const res = [];
    for (let i = 0; i < 12; i++) {
      const temp = [];
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
  };

  /**
   * get recently 4 weeks data
   * @param item
   * @returns
   */
  const getLineWeekData = async (item: Habbit) => {
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
  };

  return (
    <div className=" pt-4 px-4 ">
      <Section style={{ marginTop: 0 }} text={"Basic Statistics"}>
        <div
          className="flex justify-evenly py-2 rounded-md mb-4"
          style={commonCardStyle}
        >
          <div className={commentClass}>
            <div>{basicStatistics?.times}</div>
            <div>Times</div>
          </div>
          <div className={commentClass}>
            <div>{basicStatistics?.missed}</div>
            <div>missed</div>
          </div>
          <div className={commentClass}>
            <div>{basicStatistics?.total}</div>
            <div>Total</div>
          </div>
        </div>
      </Section>

      <Section text={"Trend"}>
        <Tabs onChange={(key: string) => setTabKey(key)} type="button">
          <TabPane tab="月" itemKey={"1"}></TabPane>
          <TabPane tab="周" itemKey="2"></TabPane>
        </Tabs>
        <Chart
          options={lineOption.options}
          series={tabKey === "1" ? lineMonthSeries : lineWeekSeries}
          type="line"
          // width="500"
        />
      </Section>
      <Section style={{ marginTop: 0 }} className="px-2" text={"History"}>
        {heatMapValues && (
          <CalendarHeatmap
            startDate={moment()
              .startOf("year")
              .subtract(150, "days")
              .format("YYYY-MM-DD")}
            endDate={moment().format("YYYY-MM-DD")}
            // showWeekdayLabels={false}

            showWeekdayLabels
            values={heatMapValues}
            tooltipDataAttrs={(value: any) => {
              return {
                "data-tip": value.date,
              };
            }}
            classForValue={(value) => {
              if (!value) {
                return "color-github-1";
              }
              return `color-github-${value.count}`;
            }}
          />
        )}
      </Section>
    </div>
  );
};

export default HabbitDetail;
