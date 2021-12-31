import React, { FC } from "react";
import { Button, Card, Typography } from "@douyinfe/semi-ui";
import moment from "moment";
import "./index.css";
import { HabbitRecorder } from "../../../../API/models/Habbit";
const { Title, Text } = Typography;

export interface CubicHabbitProps {
  title: string;
  id: string;
  frequency: string;
  onClick: () => void;
  onCheck: (id: string, date: Date) => void;
  weekData: HabbitRecorder[];
}
const CubicHabbit: FC<CubicHabbitProps> = ({
  title,
  onClick,
  frequency,
  weekData,
  id,
  onCheck,
}) => {
  const getWeekDay = () => {
    return moment.weekdaysShort();
  };

  const renderWeek = () => {
    const currentWeekDay = moment().weekday(0);
    const weekDayString = getWeekDay();
    return weekDayString.map((day, index) => {
      const isActive = weekData[index].isActive;
      const render = moment().weekday(index).date();
      const activeCss = isActive
        ? "text-white h-10 w-10 rounded-full flex items-center justify-center bg-blue-600 text-center"
        : "h-10 w-10 rounded-full flex items-center justify-center bg-indigo-50  text-center";
      return (
        <div
          key={`cubic-habbit-day-${index}`}
          className="flex flex-col justify-center"
        >
          <Text
            style={{ color: "#686868" }}
            type="tertiary"
            className="mb-1 text-center"
          >
            {day}
          </Text>
          <div
            key={`cubic-habbit-render-${index}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log(moment(new Date()));
              console.log(moment().weekday(index));

              if (moment().weekday(index).isSameOrBefore(moment(new Date()))) {
                onCheck(id, moment().weekday(index).toDate());
              }
            }}
            className={activeCss}
          >
            {render}
          </div>
        </div>
      );
    });
  };
  return (
    <div
      className="mb-4 text-white rounded-md"
      // style={{ backgroundColor: "#292929" }}
    >
      <Card>
        <div className="flex text-white justify-between items-baseline mb-4">
          <Title heading={6}>{title}</Title>
          <Button
            onClick={() => {
              onClick();
            }}
          >
            Detail
          </Button>
        </div>
        <div className="flex justify-between">{renderWeek()}</div>
      </Card>
    </div>
  );
};

export default CubicHabbit;
