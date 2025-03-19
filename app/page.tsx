import {
  NumberNeighbor,
  MatchColors,
  MatchQuantity,
  GuessTheAnimal,
  MemoryCards,
} from "@/components/blocks";
import { ImageGeneration } from "@/components/image-generation";

export default function Home() {
  return (
    <div>
      <MatchColors />
      <NumberNeighbor />
      <MatchQuantity />
      <GuessTheAnimal />
      <MemoryCards />
      <ImageGeneration />
    </div>
  );
}
