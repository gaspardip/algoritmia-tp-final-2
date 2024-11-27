import { DicesIcon, PauseIcon, PlayIcon, StopCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToggle } from "react-use";
import { Cell } from "./Cell";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { useToast } from "./hooks/use-toast";
import "./index.css";
import { PatternsCombobox } from "./PatternsCombobox";
import { countNeighbors, generateEmptyGrid, generateRandomGrid, isGridEmpty } from "./utils";

export const App = () => {
  const { toast } = useToast();
  const [gridSize, setGridSize] = useState(30);
  const [grid, setGrid] = useState(() =>
    generateEmptyGrid(gridSize)
  );
  const [running, toggleIsRunning] = useToggle(false);
  const [generation, setGeneration] = useState(0);

  const [speed, setSpeed] = useState(32);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isEmpty = isGridEmpty(grid);

  const resetGame = () => {
    toggleIsRunning(false);
    setGeneration(0);
    const grid = generateEmptyGrid(gridSize);
    setGrid(grid);
  };

  const handleCellClick = (x: number, y: number) => {
    setGrid((grid) => {
      const newGrid = [...grid];
      newGrid[x][y] = !newGrid[x][y];
      return newGrid;
    });
  };

  const handlePatternInsert = (pattern: number[][]) => {
    setGrid((grid) => {
      const newGrid = generateEmptyGrid(grid.length);
      const patternHeight = pattern.length;
      const patternWidth = pattern[0].length;
      const startX = Math.floor((gridSize - patternHeight) / 2);
      const startY = Math.floor((gridSize - patternWidth) / 2);

      try {
        for (let x = 0; x < patternHeight; x++) {
          for (let y = 0; y < patternWidth; y++) {
            if (pattern[x][y] === 1) {
              newGrid[startX + x][startY + y] = true;
            }
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "El patrón no cabe en la grilla actual",
          variant: "destructive",
        });
      }

      return newGrid;
    });
  };

  const handleRandomize = () => {
    setGrid((grid) => {
      const newGrid = generateRandomGrid(grid.length);
      return newGrid;
    });
  }

  useEffect(resetGame, [gridSize]);

  useEffect(() => {
    if (running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const intervalMs = 1000 / speed;

      intervalRef.current = setInterval(() => {
        setGrid((g) => {
          return g.map((row, x) =>
            row.map((cell, y) => {
              const neighbors = countNeighbors(g, x, y);

              if (!cell && neighbors === 3) {
                // Nacimiento
                return true;
              }

              if (cell && (neighbors < 2 || neighbors > 3)) {
                // Muerte
                return false;
              }

              // Supervivencia
              return cell;
            })
          );
        });
        setGeneration((gen) => gen + 1);
      }, intervalMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, speed]);

  return (
    <div className="flex p-4 h-full gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-2">
            Juego de la vida
          </CardTitle>
          <CardDescription>de John Horton Conway</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div className="flex items-center">
            <Label className="mr-2 w-2/3" htmlFor="grid-size">
              Tamaño de la grilla:
            </Label>
            <Select
              value={gridSize.toString()}
              onValueChange={(size) => setGridSize(Number(size))}
            >
              <SelectTrigger id="grid-size" className="flex-1">
                <SelectValue placeholder="Tamaño de la grilla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30x30</SelectItem>
                <SelectItem value="55">55x55</SelectItem>
                <SelectItem value="100">100x100</SelectItem>
                <SelectItem value="200">200x200</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-center">
            <Button className="flex-1" onClick={toggleIsRunning} size="icon" disabled={!running && isEmpty}>
              {running ? <PauseIcon /> : <PlayIcon />}
            </Button>
            <Button
              className="flex-1"
              variant="destructive"
              onClick={resetGame}
              disabled={running || generation === 0}
              size="icon"
            >
              <StopCircleIcon />
            </Button>
            <Button
              className="flex-1 bg-emerald-500"
              onClick={handleRandomize}
              disabled={running}
              size="icon"
            >
              <DicesIcon />
            </Button>

          </div>
          <PatternsCombobox disabled={running} onPatternClick={handlePatternInsert} />
          <div className="flex items-center">
            <Label className="text-lg font-semibold mr-2" htmlFor="velocity">
              Velocidad: {speed} gen/s
            </Label>
            <Slider
              id="velocity"
              defaultValue={[speed]}
              min={1}
              max={64}
              step={1}
              onValueChange={(value) => setSpeed(value[0])}
              className="w-1/2 ml-auto"
            />
          </div>
          <p className="text-lg font-semibold">Generación: {generation}</p>
        </CardContent>
      </Card>
      <Card className="flex-1 flex">
        <CardContent className="p-4 flex flex-1 h-full w-full items-center justify-center">
          <div
            className="h-full w-full grid border border-gray-500 gap-px bg-gray-500 aspect-square"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              maxWidth: "min(100vw, 100vh)",
              maxHeight: "min(100vw, 100vh)",
            }}
          >
            {grid.map((rows, x) =>
              rows.map((cell, y) => (
                <Cell
                  key={`${x}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    y
                    }`}
                  x={x}
                  y={y}
                  alive={cell}
                  onClick={handleCellClick}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
