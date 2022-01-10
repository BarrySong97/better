import React, { FC } from "react";
import { Button, Card, Typography } from "@douyinfe/semi-ui";
import moment from "moment";
import "./index.css";
import { HabbitRecorder } from "../../../../API/models/Habbit";
import { useAppContext } from "../../../../layout/context";
const { Title, Text } = Typography;

export interface CubicHabbitProps {
  title: string;
  id: string;
  frequency: string;
  color: string;
  onClick: () => void;
  weekData: HabbitRecorder[];
}
const CubicHabbit: FC<CubicHabbitProps> = ({
  title,
  onClick,
  weekData,
  color,
}) => {
  const { habitatController } = useAppContext();
  const getWeekDay = () => {
    return moment.weekdaysShort();
  };

  const renderWeek = () => {
    const weekDayString = getWeekDay();

    return weekDayString.map((day, index) => {
      const isActive = weekData[index].isActive;
      const render = moment(weekData[index].date).format("DD");
      const activeCss = isActive
        ? "text-white h-10 w-10 rounded-full flex items-center justify-center text-center"
        : "h-10 w-10 rounded-full flex items-center justify-center  text-center";
      const activeColor = isActive ? color : "#f5f5f5";
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
            onClick={async (e) => {
              e.stopPropagation();
              try {
                if (
                  moment().weekday(index).isSameOrBefore(moment(new Date()))
                ) {
                  await habitatController.toggleCheck(title, index);
                }
              } catch (error) {}
            }}
            style={{ backgroundColor: activeColor }}
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
