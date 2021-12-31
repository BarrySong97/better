import { HabbitController } from "./controllers/HabbitController";
import localforage from "localforage";
function main() {
  initDB();
  const habitatController = new HabbitController();
  return { habitatController };
}

async function initDB() {
  const habbits = await localforage.getItem("habbits");

  if (!habbits) {
    localforage.setItem("habbits", []);
  }
}

export default main;
