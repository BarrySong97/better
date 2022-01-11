import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { TabPane, Tabs, Tooltip } from "@douyinfe/semi-ui";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./index.css";
import Chart from "react-apexcharts";
import Section from "@douyinfe/semi-ui/lib/es/form/section";
import { useBoolean, useMount } from "ahooks";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useAppContext } from "../../layout/context";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../API/db";
import HabbitModal from "../home/components/habbit-modal";
const themeColor = [
  "#2563eb",
  "#2196f3",
  "#03a9f4",
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
];
export interface BasicStatistics {
  times: number;
  missed: number;
  total: number;
}
export interface HabbitDetailProps {}

const HabbitDetail: FC<HabbitDetailProps> = () => {
  let params = useParams();
  const { habitatController } = useAppContext();

  const [basicStatistics, setBasicStatistics] = useState<BasicStatistics>();
  const [heatMapValues, setHeatMapValues] = useState<any>();
  const [color, setColor] = useState("#26a0fc");

  const item = useLiveQuery(() => {
    return db.habbitList
      .where("name")
      .equals(params.name ?? "")
      .first();
  }, [params.name]);

  const [lineMonthData, setLineMonthData] = useState<Number[]>();
  const [lineWeekData, setLineWeekData] = useState<Number[]>();
  const [tabKey, setTabKey] = useState<string>("1");
  const commonCardStyle = {
    color: "black",
    // background: "#292929",
    boxShadow: "var(--semi-shadow-elevated)",
  };
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
        colors: [item?.color ?? ""],
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
    [tabKey, item]
  );

  const lineMonthSeries = useMemo(
    () => [
      {
        name: "Count",
        data: lineMonthData ?? [],
      },
    ],
    [lineMonthData]
  );
  const lineWeekSeries = useMemo(
    () => [
      {
        name: "Count",
        data: lineWeekData ?? [],
      },
    ],
    [lineWeekData]
  );

  const renderCalendarColor = useCallback(
    (value: { count: number }) => {
      if (value && item) {
        const idx = themeColor.findIndex((v) => v === item.color);
        return value.count === 1 ? `color-theme-${idx + 1}` : "color-github-1";
      } else {
        return "color-github-1";
      }
    },
    [color, item]
  );

  useMount(async () => {
    const { heatData, statistic, lineMonth, lineWeek, item } =
      await habitatController.getHabbitRecorders(params.name ?? "");
    setColor(item.color);
    setBasicStatistics(statistic);
    setHeatMapValues(heatData);

    setLineMonthData(lineMonth);
    setLineWeekData(lineWeek);
  });

  const renderTabColor = (key: string) => {
    if (tabKey === key && item) {
      return { color: "white", backgroundColor: item.color, fontWeight: 600 };
    } else {
      return { color: "#77797b", backgroundColor: "", fontWeight: 400 };
    }
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
        <div className="flex ">
          <div
            style={renderTabColor("1")}
            onClick={() => setTabKey("1")}
            className="better-tab-item"
          >
            月
          </div>
          <div
            style={renderTabColor("2")}
            onClick={() => setTabKey("2")}
            className="better-tab-item"
          >
            周
          </div>
        </div>

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
            classForValue={renderCalendarColor}
          />
        )}
      </Section>
    </div>
  );
};

export default HabbitDetail;
