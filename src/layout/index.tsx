import React, { createContext, FC, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Dialog, NavBar } from "react-vant";
import { Form, Space, Typography } from "@douyinfe/semi-ui";
import { db } from "../API/db";
import { Provider } from "./context";
import { IconDeleteStroked, IconEditStroked } from "@douyinfe/semi-icons";
import { BaseFormApi } from ".pnpm/@douyinfe+semi-foundation@2.2.0/node_modules/@douyinfe/semi-foundation/lib/es/form/interface";
import { useBoolean } from "ahooks";
import { CirclePicker } from "react-color";

export interface LayoutProps {}
const { Title } = Typography;

const Layout: FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [formApi, setFormApi] = useState<BaseFormApi<any>>();
  let params = useParams();
  const navigate = useNavigate();
  const [state, { toggle, setTrue, setFalse }] = useBoolean(false);
  const ROUTE_TITLE = { "/": "Home", "/detail": "Habbit Detail" };
  const title = params.name ? params.name : ROUTE_TITLE[pathname];
  const [habbitName, setHabbitName] = useState<string>("");
  const [addcolor, setAddcolor] = useState<string>("#2563eb");
  const onDelelte = async () => {
    return await db.habbitList
      .where("name")
      .equals(params.name ?? "")
      .delete();
  };

  const getToolbarProps = () => {
    if (params.name) {
      return {
        title: <Title heading={3}>{title}</Title>,
        leftArrow: true,
        onClickLeft: () => {
          navigate("/");
        },
        rightText: (
          <>
            <Space>
              <IconEditStroked onClick={setTrue} />
              <IconDeleteStroked
                onClick={() => {
                  Dialog.confirm({
                    title: "Delte Habbit",
                    closeable: true,
                    closeOnClickOverlay: true,
                    onConfirm: async () => {
                      const count = await onDelelte();
                      if (count) {
                        navigate("/");
                      }
                    },
                  });
                }}
              />
            </Space>
          </>
        ),
      };
    } else {
      return {
        leftText: <Title heading={3}>{title}</Title>,
      };
    }
  };

  const onEdit = async () => {
    try {
      await formApi?.validate();
      const count = await db.habbitList
        .where({
          name: params.name,
        })
        .modify((f) => {
          f.name = habbitName;
          f.color = addcolor;
        });
      if (count) {
        navigate(`/detail/${habbitName}`);

        setFalse();
      }
    } catch (e) {
      console.log(e);

      formApi?.setError("name", "name are unique or can not empty");
    }
  };
  const toolbarProps = getToolbarProps();
  return (
    <div>
      <NavBar fixed className="mt-8" {...toolbarProps} />

      <div
        // initial="hidden"
        className={`pt-24 px-4 `}
        // transition={{ duration: 4 }}
      >
        <Provider>
          <Outlet />
        </Provider>
      </div>
      {state && (
        <Dialog
          visible={state}
          title="Add Habbit"
          showCancelButton
          onCancel={() => setFalse()}
          onConfirm={onEdit}
        >
          <div style={{ textAlign: "center", margin: "16px" }}>
            <Form getFormApi={(formApi) => setFormApi(formApi)}>
              <Form.Input
                field="name"
                noLabel
                initValue={params.name}
                rules={[{ required: true, message: "name can not be empty" }]}
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
  );
};

export default Layout;
