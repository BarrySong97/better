import React, { createContext, FC, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Dialog, Icon, NavBar } from "react-vant";
import { Form, Space, Typography } from "@douyinfe/semi-ui";
import { db } from "../API/db";
import { Provider } from "./context";

export interface LayoutProps {}
const { Title } = Typography;

const Layout: FC<LayoutProps> = () => {
  return (
    <div>
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
