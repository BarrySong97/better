import React, { createContext, FC, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Dialog, NavBar, Toast } from "react-vant";
import { Typography } from "@douyinfe/semi-ui";
import { db } from "../API/db";
import { Provider } from "./context";
import { IconDeleteStroked } from "@douyinfe/semi-icons";
export interface LayoutProps {}
const { Title } = Typography;

const Layout: FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [transitionStage, setTransistionStage] = useState("fadeIn");
  const [currentPathName, setCurrentPathName] = useState("/");
  let params = useParams();
  const navigate = useNavigate();

  const ROUTE_TITLE = { "/": "Home", "/detail": "Habbit Detail" };
  const title = params.name ? params.name : ROUTE_TITLE[pathname];

  useEffect(() => {
    if (pathname !== currentPathName) {
      setCurrentPathName(pathname);
      setTransistionStage("fadeOut");
    }
  }, [pathname]);

  const onDelelte = async () => {
    console.log(params.name);

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
        ),
      };
    } else {
      return {
        leftText: <Title heading={3}>{title}</Title>,
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
        </Provider>
      </div>
    </div>
  );
};

export default Layout;
