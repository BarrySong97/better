import React, { FC, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Descriptions,
  Radio,
  RadioGroup,
  TabPane,
  Tabs,
  Typography,
} from "@douyinfe/semi-ui";
import { IconArrowUp } from "@douyinfe/semi-icons";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./index.css";
import Chart from "react-apexcharts";
import Section from "@douyinfe/semi-ui/lib/es/form/section";
import { useMount } from "ahooks";
import { db } from "../../API/db";
import { useParams } from "react-router-dom";
import moment from "moment";
const { Title, Text } = Typography;

export interface BasicStatistics {
  times: number;
  missed: number;
  total: number;
}
export interface HabbitDetailProps {}
const HabbitDetail: FC<HabbitDetailProps> = () => {
  let params = useParams();
  const [basicStatistics, setBasicStatistics] = useState<BasicStatistics>();
  const [heatMapValues, setHeatMapValues] = useState<any>();
  const commonCardStyle = {
    color: "black",
    // background: "#292929",
    boxShadow: "var(--semi-shadow-elevated)",
  };
  const today = new Date();
  const commentClass = "flex flex-col justify-center items-center";

  const lineOption = {
    series: [
      {
        name: "Count",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
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
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  };

  useMount(async () => {
    const item = await db.habbitList.where({ name: params.name }).toArray();
    const statistic = {
      times: item[0].count,
      missed: item[0].recorders.length - item[0].count,
      total: item[0].recorders.length,
    };
    const days = await getHeatData();
    const res = days.map((v, index) => {
      return {
        date: moment(v.date).format("YYYY-MM-DD"),
        count: v.isActive ? 3 : 1,
      };
    });

    setBasicStatistics(statistic);
    setHeatMapValues(res);
  });

  const getHeatData = async () => {
    const item = await db.habbitList.where({ name: params.name }).toArray();
    const end = item[0].recorders.findIndex(
      (item) => moment(item.date).dayOfYear() === moment(today).dayOfYear()
    );

    return item[0].recorders.slice(end - 150 > 0 ? end - 150 : 0, end + 1);
  };

  const getLineMonthData = async () => {};
  const getLineWeekData = async () => {};

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
        <Tabs type="button">
          <TabPane tab="月" itemKey="1"></TabPane>
          <TabPane tab="周" itemKey="2"></TabPane>
        </Tabs>
        <Chart
          options={lineOption.options}
          series={lineOption.series}
          type="line"
          // width="500"
        />
      </Section>
      <Section style={{ marginTop: 0 }} className="px-2" text={"The Heat"}>
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
              console.log(value);

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
