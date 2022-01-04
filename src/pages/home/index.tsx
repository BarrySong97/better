import { Button, Empty, Input, Modal } from "@douyinfe/semi-ui";
import React, { FC, useCallback, useState } from "react";
import CubicHabbit from "./components/cubic-habbit";
import { IconCopyAdd } from "@douyinfe/semi-icons";
import { Dialog } from "react-vant";
import "./index.css";
import { useBoolean } from "ahooks";
import { useNavigate } from "react-router-dom";
import {
  IllustrationIdle,
  IllustrationIdleDark,
} from "@douyinfe/semi-illustrations";
import { useAppContext } from "../../layout/context";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../API/db";
import moment from "moment";

export interface HomeProps {}
const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();
  console.log();
  const listData = useLiveQuery(() => db.habbitList.toArray());
  const { habitatController } = useAppContext();
  const [habbitName, setHabbitName] = useState<string>("");
  const [state, { toggle, setTrue, setFalse }] = useBoolean(false);

  const renderList = () =>
    listData?.map((v) => (
      <CubicHabbit
        key={v.id}
        id={v.id}
        onCheck={(id, date) => {
          onCheck(id, date);
        }}
        weekData={v.recorders}
        onClick={() => {
          navigate(`/detail/${v.name}`);
        }}
        frequency="2 / week"
        title={v.name}
      />
    ));

  const onAdd = async () => {
    const newItem = await habitatController.generateHabbit({
      name: habbitName,
      count: 0,
    });
    await db.habbitList.add(newItem);
    setFalse();
  };

  const onCheck = async (id: string, date: Date) => {
    // const res = await habitatController.toggleCheck(id);
    // if (res && listData) {
    //   const item = listData.find((v) => v.id === id);
    //   if (item) {
    //     item.recorders.find((v) => moment(date).day() === moment(v.date).day());
    //   }
    //   setListData([...listData]);
    // }
  };

  return (
    <>
      <div className="flex flex-col">
        {listData?.length ? (
          renderList()
        ) : (
          // <></>
          <Empty
            image={<IllustrationIdle />}
            darkModeImage={<IllustrationIdleDark />}
            description={"Nothing Here"}
            style={{ marginBottom: 16, marginTop: 200 }}
          />
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

          <Dialog
            visible={state}
            title="标题"
            showCancelButton
            onCancel={() => setFalse()}
            onConfirm={onAdd}
          >
            <div style={{ textAlign: "center", margin: "16px" }}>
              <Input
                onChange={(v) => setHabbitName(v)}
                placeholder={"NEW HABBIT"}
              ></Input>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Home;
