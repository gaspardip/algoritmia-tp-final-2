import { DicesIcon, PauseIcon, PlayIcon, StopCircleIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLatest, useToggle } from "react-use";
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
import useSet from "./hooks/useSet";
import "./index.css";
import { PatternsCombobox } from "./PatternsCombobox";
import type { CellCoordinates } from "./types";
import {
  calculateNextGeneration,
  generateRandomGrid,
  serialize,
} from "./utils";

export const App = () => {
  const { toast } = useToast();

  const [gridSize, setGridSize] = useState(30);
  const [liveCells, { set, toggle, reset }] = useSet(new Set<CellCoordinates>());
  const liveCellsRef = useLatest(liveCells);
  const [running, toggleIsRunning] = useToggle(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(32);
  const [pattern, setPattern] = useState("");

  const isEmpty = liveCells.size === 0;

  const resetGame = useCallback((clearPattern = true) => {
    toggleIsRunning(false);
    setGeneration(0);
    reset();

    if (clearPattern) {
      setPattern("");
    }
  }, [toggleIsRunning, reset]);

  const handleSizeChange = useCallback(
    (size: string) => setGridSize(Number(size)),
    []
  );

  const handleStop = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleRandomize = useCallback(() => {
    resetGame();
    set(generateRandomGrid(gridSize));
  }, [resetGame, set, gridSize]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: tracking a ref
  const handlePatternInsert = useCallback(
    (pattern: number[][]) => {
      resetGame(false);

      set(() => {
        const patternHeight = pattern.length;
        const patternWidth = pattern[0].length;

        if (patternHeight > gridSize || patternWidth > gridSize) {
          toast({
            title: "Error",
            description: "El patrón no cabe en la grilla actual",
            variant: "destructive",
          });
          return liveCellsRef.current;
        }

        const newLiveCells = new Set<CellCoordinates>();
        const startX = Math.floor((gridSize - patternHeight) / 2);
        const startY = Math.floor((gridSize - patternWidth) / 2);

        for (let x = 0; x < patternHeight; x++) {
          for (let y = 0; y < patternWidth; y++) {
            if (pattern[x][y] === 1) {
              const coord = serialize(startX + x, startY + y);
              newLiveCells.add(coord);
            }
          }
        }
        return newLiveCells;
      });
    },
    [resetGame, set, gridSize, toast]
  );

  const handleCellClick = useCallback((x: number, y: number) => {
    toggle(serialize(x, y));
  }, [toggle]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: game must be reset when changing grid size
  useEffect(() => {
    resetGame();
  }, [gridSize, resetGame]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: tracking a ref
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let accumulatedTime = 0;

    const update = (time: number) => {
      if (!running) {
        return;
      }

      const deltaTime = time - lastTime;
      lastTime = time;
      accumulatedTime += deltaTime;

      const intervalMs = 1000 / speed;

      let steps = 0;

      const maxStepsPerFrame = 50;

      let currentLiveCells = liveCellsRef.current;

      while (accumulatedTime >= intervalMs && steps < maxStepsPerFrame) {
        currentLiveCells = calculateNextGeneration(currentLiveCells, gridSize);
        steps++;
        accumulatedTime -= intervalMs;
      }

      if (steps > 0) {
        set(currentLiveCells);
        setGeneration((gen) => gen + steps);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    if (running) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(update);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [running, speed, gridSize, set]);

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
            <Label className="w-1/2 text-lg font-semibold" htmlFor="grid-size">
              Tamaño de la grilla:
            </Label>
            <Select
              value={gridSize.toString()}
              onValueChange={handleSizeChange}
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
            <Button
              className="flex-1"
              onClick={toggleIsRunning}
              size="icon"
              disabled={!running && isEmpty}
            >
              {running ? <PauseIcon /> : <PlayIcon />}
            </Button>
            <Button
              className="flex-1"
              variant="destructive"
              onClick={handleStop}
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
          <PatternsCombobox
            disabled={running}
            value={pattern}
            onValueChange={setPattern}
            onPatternClick={handlePatternInsert}
          />
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
            {Array.from({ length: gridSize }, (_, x) =>
              Array.from({ length: gridSize }, (_, y) => {
                const isAlive = liveCells.has(serialize(x, y));

                return (
                  <Cell
                    key={`${x}-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      y
                      }`}
                    x={x}
                    y={y}
                    isAlive={isAlive}
                    onClick={handleCellClick}
                  />
                );
              })
            ).flat()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
