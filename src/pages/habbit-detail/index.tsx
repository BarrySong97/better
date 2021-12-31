import React, { FC } from "react";
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
const { Title, Text } = Typography;
export interface HabbitDetailProps {}
const HabbitDetail: FC<HabbitDetailProps> = () => {
  const commonCardStyle = {
    color: "black",
    // background: "#292929",
    boxShadow: "var(--semi-shadow-elevated)",
  };
  const today = new Date();
  const commentClass = "flex flex-col justify-center items-center";
  const data = [
    {
      key: "同比上周",
      value: (
        <span>
          11
          <IconArrowUp
            size="small"
            style={{ color: "red", marginLeft: "4px" }}
          />
        </span>
      ),
    },
    {
      key: "同比上月",
      value: (
        <span>
          3
          <IconArrowUp
            size="small"
            style={{ color: "red", marginLeft: "4px" }}
          />
        </span>
      ),
    },
  ];
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
  function getRange(count) {
    return Array.from({ length: count }, (_, i) => i);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }
  const randomValues = getRange(363).map((index) => {
    return {
      date: shiftDate(today, -index),
      count: getRandomInt(1, 3),
    };
  });

  return (
    <div className=" pt-4 px-4 ">
      <Section style={{ marginTop: 0 }} text={"Basic Statistics"}>
        <div
          className="flex justify-evenly py-2 rounded-md mb-4"
          style={commonCardStyle}
        >
          <div className={commentClass}>
            <div>125</div>
            <div>Times</div>
          </div>
          <div className={commentClass}>
            <div>125</div>
            <div>missed</div>
          </div>
          <div className={commentClass}>
            <div>125</div>
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
        <CalendarHeatmap
          startDate={shiftDate(today, -150)}
          endDate={today}
          showWeekdayLabels={false}
          showMonthLabels={false}
          values={randomValues}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            }
            return `color-github-${value.count}`;
          }}
          tooltipDataAttrs={(value) => {
            return {
              "data-tip": `${value.date
                .toISOString()
                .slice(0, 10)} has count: ${value.count}`,
            };
          }}
        />
      </Section>
    </div>
  );
};

export default HabbitDetail;
