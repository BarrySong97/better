import React, { createContext, FC, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { NavBar, Toast } from "react-vant";
import { Typography } from "@douyinfe/semi-ui";
// import "./index.css";
import { motion } from "framer-motion";
import main from "../API/App";
import { AppContext, Provider } from "./context";
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

  const getToolbarProps = () => {
    if (params.name) {
      return {
        title: <Title heading={3}>{title}</Title>,
        leftArrow: true,
        onClickLeft: () => {
          navigate("/");
        },
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
