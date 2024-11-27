import clsx from 'clsx';
import { memo } from 'react';

interface CellProps {
  x: number;
  y: number;
  isAlive: boolean;
  onClick: (x: number, y: number) => void;
}

export const Cell = memo(
  ({ x, y, isAlive, onClick }: CellProps) => {
    return (
      <button
        type="button"
        onClick={() => onClick(x, y)}
        className={clsx("w-full h-full", {
          "bg-black": !isAlive,
          "bg-white": isAlive
        })}
      />
    );
  },
  (prevProps, nextProps) => prevProps.isAlive === nextProps.isAlive
);

