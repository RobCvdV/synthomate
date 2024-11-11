import { FC, ReactNode } from "react";
import { AppNodeTypes } from "@/store/types";
import { AnyObject } from "@/types/AnyObject";
import { create } from "zustand";

// create a store using zustand to handle all the drag n drop state

type DndContextType = {
  type?: AppNodeTypes;
  data?: AnyObject;
};

export const DndContext = create()([{}, () => {}] as [
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
