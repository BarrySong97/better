import { Button, Form, Typography } from "@douyinfe/semi-ui";
import React, { FC, useEffect, useState } from "react";
import CubicHabbit from "./components/cubic-habbit";
import { IconAscend, IconCopyAdd } from "@douyinfe/semi-icons";
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
import ListModal from "./components/list-modal";
import { NavBar } from "react-vant";
const { Title } = Typography;
export interface HomeProps {}
const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();

  const listData = useLiveQuery(() =>
    db.habbitList.toCollection().sortBy("rank")
  );

  const days = getCurrentWeekDate();

  const [
    addModalVisible,
    { setTrue: setAddModalVisibleTrue, setFalse: setAddModalVisibleFalse },
  ] = useBoolean(false);
  const [
    rankModalVisible,
    { setTrue: setRankModalVisibleTrue, setFalse: setRankModalVisibleFalse },
  ] = useBoolean(false);

  const renderItem = (v: Habbit) => {
    const idx = v.recorders.findIndex(
      (v) => moment(v.date).dayOfYear() === days[0].dayOfYear()
    );

    const weekData = v.recorders.slice(idx, idx + 7);

    return (
      <CubicHabbit
        key={v.id}
        id={v.id}
        item={v}
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

  return (
    <>
      <NavBar
        fixed
        className="mt-8"
        rightText={<IconAscend onClick={setRankModalVisibleTrue} />}
        title={<Title heading={4}>Home</Title>}
      />
      <div
        style={{ height: "calc(100vh - 100px)" }}
        className="flex flex-col overflow-auto"
      >
        {listData?.length ? (
          listData?.map((item, index) => renderItem(item))
        ) : (
          <></>
        )}

        <div className="pb-4 flex justify-center">
          <Button
            onClick={setAddModalVisibleTrue}
            icon={<IconCopyAdd />}
            theme="borderless"
            type="primary"
          >
            New Habbit
          </Button>
        </div>

        <HabbitModal
          type="add"
          visible={addModalVisible}
          onOk={setAddModalVisibleFalse}
          onCancel={setAddModalVisibleFalse}
        />
      </div>
      <ListModal
        items={listData ?? []}
        visible={rankModalVisible}
        onOk={setRankModalVisibleFalse}
        onCancel={setRankModalVisibleFalse}
      />
    </>
  );
};

export default Home;
