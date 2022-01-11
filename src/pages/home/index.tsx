import { Button, Form } from "@douyinfe/semi-ui";
import React, { FC, useEffect, useState } from "react";
import CubicHabbit from "./components/cubic-habbit";
import { IconCopyAdd } from "@douyinfe/semi-icons";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import "./index.css";
import { useBoolean } from "ahooks";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../API/db";

import moment from "moment";
import { getCurrentWeekDate } from "../../utils/date";
import HabbitModal from "./components/habbit-modal";
import { Habbit } from "../../API/models/Habbit";

export interface HomeProps {}
const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();

  const queryData = useLiveQuery(() =>
    db.habbitList.toCollection().sortBy("rank")
  );
  const [listData, setListData] = useState<Habbit[]>();
  const days = getCurrentWeekDate();
  const [isEmpty, { setTrue: setEmptyTrue, setFalse: setEmptyFalse }] =
    useBoolean(false);
  const [state, { setTrue, setFalse }] = useBoolean(false);
  const renderItem = (v: Habbit) => {
    const idx = v.recorders.findIndex(
      (v) => moment(v.date).dayOfYear() === days[0].dayOfYear()
    );

    const weekData = v.recorders.slice(idx, idx + 7);

    return (
      <CubicHabbit
        key={v.id}
        id={v.id}
        color={v.color}
        weekData={weekData}
        onClick={() => {
          navigate(`/detail/${v.name}`);
        }}
        frequency="2 / week"
        title={v.name}
      />
    );
  };

  useEffect(() => {
    setListData(queryData);
  }, [queryData]);

  useEffect(() => {
    if (listData?.length) {
      setEmptyFalse();
    } else {
      setEmptyTrue();
    }
  }, [listData]);

  const reorder = async (
    list: Habbit[],
    startIndex: number,
    endIndex: number
  ) => {
    console.log(startIndex, endIndex);

    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setListData([...result]);
    await db.habbitList.toCollection().modify((f) => {
      const idx = result.findIndex((v) => v.id === f.id);
      f.rank = idx;
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    reorder(listData ?? [], result.source.index, result.destination.index);
  };

  return (
    <>
      <div
        style={{ height: "calc(100vh - 100px)" }}
        className="flex flex-col overflow-auto"
      >
        {listData?.length ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {listData?.map((item, index) => (
                    <Draggable
                      key={item.id + ""}
                      draggableId={item.id + ""}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          {renderItem(item)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <></>
        )}

        <div className="pb-4 flex justify-center">
          <Button
            onClick={() => setTrue()}
            icon={<IconCopyAdd />}
            theme="borderless"
            type="primary"
          >
            New Habbit
          </Button>
        </div>

        <HabbitModal
          type="add"
          visible={state}
          onOk={() => {
            setFalse();
            // setRefresh(!refresh);
          }}
          onCancel={setFalse}
        />
      </div>
    </>
  );
};

export default Home;
