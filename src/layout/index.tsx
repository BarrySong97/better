import React, { createContext, FC, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Dialog, Icon, NavBar } from "react-vant";
import { Form, Space, Typography } from "@douyinfe/semi-ui";
import { db } from "../API/db";
import { Provider } from "./context";
import { IconDeleteStroked, IconEditStroked } from "@douyinfe/semi-icons";
import { BaseFormApi } from ".pnpm/@douyinfe+semi-foundation@2.2.0/node_modules/@douyinfe/semi-foundation/lib/es/form/interface";
import { useBoolean } from "ahooks";
import { CirclePicker } from "react-color";
import HabbitRankModal from "../pages/home/components/habbit-rank-modal";
import HabbitModal from "../pages/home/components/habbit-modal";
import { useLiveQuery } from "dexie-react-hooks";

export interface LayoutProps {}
const { Title } = Typography;

const Layout: FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [formApi, setFormApi] = useState<BaseFormApi<any>>();
  let params = useParams();
  const navigate = useNavigate();
  const item = useLiveQuery(() => {
    return db.habbitList
      .where("name")
      .equals(params.name ?? "")
      .first();
  }, [params.name]);
  const [state, { setTrue, setFalse }] = useBoolean(false);
  const ROUTE_TITLE = { "/": "Home", "/detail": "Habbit Detail" };
  const title = params.name ? params.name : ROUTE_TITLE[pathname];
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
        title: <Title heading={4}>{title}</Title>,
      };
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
          <HabbitModal
            type="edit"
            item={item}
            visible={state}
            onOk={() => {
              setFalse();
              // setRefresh(!refresh);
            }}
            onCancel={setFalse}
          />
        </Provider>
      </div>
    </div>
  );
};

export default Layout;
