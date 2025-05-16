"use client";

import { useState } from "react";

import {
  GuessTheAnimal,
  MatchColors,
  MatchQuantity,
  MemoryCards,
  NumberNeighbor,
} from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { ProjectsApi } from "@/api/projects";

type GameType =
  | "GuessTheAnimal"
  | "MatchColors"
  | "MatchQuantity"
  | "MemoryCards"
  | "NumberNeighbor";

export interface Game {
  type: GameType;
  data?: Record<string, any>;
}

const gameNames: GameType[] = [
  "GuessTheAnimal",
  "MatchColors",
  "MatchQuantity",
  "MemoryCards",
  "NumberNeighbor",
];

export default function CreateProjectPage() {
  const [games, setGames] = useState<Game[]>([]);

  const addGame = (type: GameType) => {
    setGames((prevState) => [...prevState, { type }]);
  };

  const handleDataChange = (index: number, newData: Record<string, any>) => {
    setGames((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        data: { ...updatedData[index].data, ...newData },
      };
      return updatedData;
    });
  };

  const saveProject = async () => {
    console.log(JSON.stringify(games));
    await ProjectsApi.saveProject(games);
  };

  return (
    <div>
      {!games.length ? <h2>Add the first game</h2> : null}
      <div className="flex justify-between">
        <div className="space-x-1">
          {gameNames.map((gameName) => (
            <Button key={gameName} onClick={() => addGame(gameName)}>
              {gameName}
            </Button>
          ))}
        </div>
        <Button onClick={saveProject}>Save</Button>
      </div>

      <div className="flex flex-col gap-y-4">
        {games.map(({ type }, index) => {
          switch (type) {
            case "GuessTheAnimal": {
              return (
                <GuessTheAnimal
                  key={`${type}-${index}`}
                  onDataChange={(data) => handleDataChange(index, data)}
                />
              );
            }
            case "MatchColors": {
              return <MatchColors key={`${type}-${index}`} />;
            }
            case "MatchQuantity": {
              return <MatchQuantity key={`${type}-${index}`} />;
            }
            case "MemoryCards": {
              return <MemoryCards key={`${type}-${index}`} />;
            }
            case "NumberNeighbor": {
              return <NumberNeighbor key={`${type}-${index}`} />;
            }
            default: {
              return null;
            }
          }
        })}
      </div>
    </div>
  );
}
