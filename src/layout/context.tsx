import { createContext, useContext } from "react";
import main from "../API/App";

const controllers = main();
const AppContext = createContext(controllers);

const useAppContext = () => useContext(AppContext);

const Provider: React.FC = ({ children }) => (
  <AppContext.Provider value={controllers}>{children}</AppContext.Provider>
);
export { useAppContext, AppContext, Provider };
