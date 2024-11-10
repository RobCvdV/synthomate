import { createContext, FC, ReactNode, useContext, useState } from "react";
import { AppNodeTypes } from "@/store/types";
import { AnyObject } from "@/types/AnyObject";

type DndContextType = {
  type?: AppNodeTypes;
  data?: AnyObject;
};

export const DndContext = createContext([{}, () => {}] as [
  DndContextType,
  (props: DndContextType) => void,
]);

type Props = {
  children: ReactNode;
};

export const DndProvider: FC<Props> = ({ children }) => {
  const [props, setProps] = useState<DndContextType>({});

  return (
    <DndContext.Provider value={[props, setProps]}>
      {children}
    </DndContext.Provider>
  );
};

export const useDnd = () => {
  return useContext(DndContext);
};
