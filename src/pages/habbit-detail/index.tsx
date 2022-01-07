import React, { FC, useMemo, useState } from "react";
import { TabPane, Tabs, Tooltip } from "@douyinfe/semi-ui";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./index.css";
import Chart from "react-apexcharts";
import Section from "@douyinfe/semi-ui/lib/es/form/section";
import { useMount } from "ahooks";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useAppContext } from "../../layout/context";

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

  useMount(async () => {
    const { heatData, statistic, lineMonth, lineWeek } =
      await habitatController.getHabbitRecorders(params.name ?? "");
    console.log(heatData);

    setBasicStatistics(statistic);
    setHeatMapValues(heatData);

    setLineMonthData(lineMonth);
    setLineWeekData(lineWeek);
  });

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
