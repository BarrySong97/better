import { Button, Empty, Input, Modal } from "@douyinfe/semi-ui";
import React, { FC, useCallback, useState } from "react";
import CubicHabbit from "./components/cubic-habbit";
import { IconCopyAdd } from "@douyinfe/semi-icons";
import HabbitDetail from "../habbit-detail";
import { Dialog } from "react-vant";
import { useMount } from "ahooks";
import { motion } from "framer-motion";
import "./index.css";
import { useNavigate } from "react-router-dom";
import {
  IllustrationIdle,
  IllustrationIdleDark,
} from "@douyinfe/semi-illustrations";
import { useAppContext } from "../../layout/context";
import { Habbit } from "../../API/models/Habbit";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../API/db";

export interface HomeProps {}
const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();

  const listData = useLiveQuery(() => db.habbitList.toArray());
  const { habitatController } = useAppContext();
  const [habbitName, setHabbitName] = useState<string>("");

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
          navigate("/detail/English");
        }}
        frequency="2 / week"
        title={v.name}
      />
    ));

  const onAdd = useCallback(async () => {
    const newItem = await habitatController.generateHabbit({
      name: habbitName,
      count: 0,
    });
    db.habbitList.add(newItem);
  }, [habbitName]);

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
          <Empty
            image={<IllustrationIdle />}
            darkModeImage={<IllustrationIdleDark />}
            description={"Nothing Here"}
            style={{ marginBottom: 16, marginTop: 200 }}
          />
        )}

        <div className="pb-4 flex justify-center">
          <Button
            onClick={() => {
              Dialog.show({
                title: "NEW HABBIT",
                closeable: true,
                closeOnClickOverlay: true,
                onConfirm: () => {
                  onAdd();
                },
                // theme: "round-button",
                children: (
                  <div style={{ textAlign: "center", margin: "16px" }}>
                    <Input
                      onChange={(v) => setHabbitName(v)}
                      placeholder={"NEW HABBIT"}
                    ></Input>
                  </div>
                ),
              });
            }}
            icon={<IconCopyAdd />}
            theme="borderless"
            type="primary"
          >
            New Habbit
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
