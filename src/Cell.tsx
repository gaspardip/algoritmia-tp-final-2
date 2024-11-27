import clsx from 'clsx';
import { memo } from 'react';

interface CellProps {
  x: number;
  y: number;
  alive: boolean;
  onClick: (x: number, y: number) => void;
}

export const Cell = memo(
  ({ x, y, alive, onClick }: CellProps) => {
    return (
      <button
        type="button"
        onClick={() => onClick(x, y)}
        className={clsx("w-full h-full", {
          "bg-black": !alive,
          "bg-white": alive
        })}
      />
    );
  },
  (prevProps, nextProps) => prevProps.alive === nextProps.alive
);

