import { Button, Form } from "@douyinfe/semi-ui";
import React, { FC, useEffect, useState } from "react";
import CubicHabbit from "./components/cubic-habbit";
import { IconCopyAdd } from "@douyinfe/semi-icons";
import { Dialog } from "react-vant";
import "./index.css";
import { useBoolean } from "ahooks";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../layout/context";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../API/db";
import { CirclePicker } from "react-color";
import moment from "moment";
import { BaseFormApi } from ".pnpm/@douyinfe+semi-foundation@2.2.0/node_modules/@douyinfe/semi-foundation/lib/es/form/interface";
import { getCurrentWeekDate } from "../../utils/date";

export interface HomeProps {}
const Home: FC<HomeProps> = () => {
  const navigate = useNavigate();

  const listData = useLiveQuery(() => db.habbitList.toArray());
  const { habitatController } = useAppContext();
  const [habbitName, setHabbitName] = useState<string>("");
  const [addcolor, setAddcolor] = useState<string>("#2563eb");
  const [isEmpty, { setTrue: setEmptyTrue, setFalse: setEmptyFalse }] =
    useBoolean(false);
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
          color={v.color}
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

  useEffect(() => {
    if (listData?.length) {
      setEmptyFalse();
    } else {
      setEmptyTrue();
    }
  }, [listData]);

  const onAdd = async () => {
    try {
      await habitatController.addHabbit({
        name: habbitName,
        createDate: new Date(),
        count: 0,
        color: addcolor,
      });

      setFalse();
    } catch (e) {
      formApi?.setError("name", "name are unique or name are unique");
    }
  };

  return (
    <>
      <div
        style={{ height: "calc(100vh - 100px)" }}
        className="flex flex-col overflow-auto"
      >
        {renderList()}

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
                <CirclePicker
                  colors={[
                    "#2563eb",
                    "#2196f3",
                    "#03a9f4",
                    "#f44336",
                    "#e91e63",
                    "#9c27b0",
                    "#673ab7",
                  ]}
                  onChange={(v) => setAddcolor(v.hex)}
                  color={addcolor}
                  circleSpacing={16}
                />
              </div>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
