import { useState } from "react";
import "./App.css";
import Home from "./pages/home";
import "react-vant/lib/index.css";
import { Route, Routes } from "react-router-dom";
import HabbitDetail from "./pages/habbit-detail";
import Layout from "./layout";
import moment from "moment";

console.log(moment().dayOfYear(1));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="detail/:name" element={<HabbitDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
