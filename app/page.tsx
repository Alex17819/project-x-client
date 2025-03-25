import {
  NumberNeighbor,
  MatchColors,
  MatchQuantity,
  GuessTheAnimal,
  MemoryCards,
} from "@/components/blocks";
import { ImageGeneration } from "@/components/image-generation";
import { AuthForm } from "@/components/auth-form";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-20">
      <MatchColors />
      <NumberNeighbor />
      <MatchQuantity />
      <GuessTheAnimal />
      <MemoryCards />
      <ImageGeneration />
      <AuthForm />
    </div>
  );
}
