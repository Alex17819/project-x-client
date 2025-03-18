import {
  NumberNeighbor,
  MatchColors,
  MatchQuantity,
  GuessTheAnimal,
} from "@/components/blocks";

export default function Home() {
  return (
    <div>
      <MatchColors />
      <NumberNeighbor />
      <MatchQuantity />
      <GuessTheAnimal />
    </div>
  );
}
