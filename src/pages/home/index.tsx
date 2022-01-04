import {
  Button,
  Form,
  Empty,
  useFormApi,
  Input,
  Modal,
} from "@douyinfe/semi-ui";
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
import { BaseFormApi } from ".pnpm/@douyinfe+semi-foundation@2.2.0/node_modules/@douyinfe/semi-foundation/lib/es/form/interface";
import { getCurrentWeekDate } from "../../utils/date";

export interface HomeProps {}
const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();

  const listData = useLiveQuery(() => db.habbitList.toArray());
  const { habitatController } = useAppContext();
  const [habbitName, setHabbitName] = useState<string>("");
  const [state, { toggle, setTrue, setFalse }] = useBoolean(false);
  const [formApi, setFormApi] = useState<BaseFormApi<any>>();
  const renderList = () => {
    const days = getCurrentWeekDate();

    return listData?.map((v) => {
      const idx = v.recorders.findIndex(
        (v) => moment(v.date).dayOfYear() === days[0].dayOfYear()
      );

      const weekData = v.recorders.slice(idx, idx + 7);

      return (
        <CubicHabbit
          key={v.id}
          id={v.id}
          onCheck={(id, date) => {
            onCheck(id, date);
          }}
          weekData={weekData}
          onClick={() => {
            navigate(`/detail/${v.name}`);
          }}
          frequency="2 / week"
          title={v.name}
        />
      );
    });
  };

  const onAdd = async () => {
    console.log(123);
    try {
      const values = await formApi?.validate();

      const newItem = await habitatController.generateHabbit({
        name: habbitName,
        createDate: new Date(),
        count: 0,
      });
      await db.habbitList.add(newItem);
      setFalse();
    } catch (e) {
      formApi?.setError("name", "name are unique");
    }
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

          {state && (
            <Dialog
              visible={state}
              title="Add Habbit"
              showCancelButton
              onCancel={() => setFalse()}
              onConfirm={onAdd}
            >
              <div style={{ textAlign: "center", margin: "16px" }}>
                <Form getFormApi={(formApi) => setFormApi(formApi)}>
                  <Form.Input
                    field="name"
                    noLabel
                    rules={[
                      { required: true, message: "name can not be empty" },
                    ]}
                    onChange={(v) => setHabbitName(v)}
                    placeholder={"NEW HABBIT"}
                  ></Form.Input>
                </Form>
              </div>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
