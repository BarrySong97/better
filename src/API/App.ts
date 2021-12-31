import Dexie from "dexie";
import { HabbitController } from "./controllers/HabbitController";

function main() {
  const habitatController = new HabbitController();
  return { habitatController };
}

export default main;
