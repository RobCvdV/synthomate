import { FC, MouseEvent, ReactNode, useCallback, useState } from "react";
import s from "./Collapsable.module.css";
import { mergeClasses } from "@/utils/mergeClasses";

export type Props = {
  initialCollapsed?: boolean;
  children: ReactNode;
  collapsedChildren?: ReactNode;
  className?: string;
};

export const Collapsable: FC<Props> = ({
  children,
  collapsedChildren,
  className,
  initialCollapsed = true,
}) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const toggle = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setCollapsed((c) => !c);
    },
    [setCollapsed],
  );
  return (
    <div className={mergeClasses(s.Main, className)} onClick={toggle}>
      <div className={collapsed ? s.closed : s.open}>{children}</div>
      <div className={collapsed ? s.lineClosed : s.lineOpen} />
      <div className={collapsed ? s.altClosed : s.altOpen}>
        {collapsedChildren}
      </div>
    </div>
  );
};
