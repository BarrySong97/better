import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import moment from "moment";
import { useParams } from "react-router";
// import "./Page.css";
import Home from "./home";

const Page: React.FC = () => {
  //   const { name } = useParams<{ name: string }>();

  return <Home />;
};

export default Page;
