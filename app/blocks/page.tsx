import {
  GuessTheAnimal,
  MatchColors,
  MatchQuantity,
  MemoryCards,
  NumberNeighbor,
} from "@/components/blocks";

export default function BlocksPage() {
  return (
    <div className="flex flex-col items-center gap-y-10 pb-100 pt-5">
      <MatchColors />
      <NumberNeighbor />
      <MatchQuantity />
      <GuessTheAnimal />
      <MemoryCards />
    </div>
  );
}
