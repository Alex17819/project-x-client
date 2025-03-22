import {
  NumberNeighbor,
  MatchColors,
  MatchQuantity,
  GuessTheAnimal,
  MemoryCards,
} from "@/components/blocks";
import { ImageGeneration } from "@/components/image-generation";
import { AuthForm } from "@/components/auth-form";
import { Bounce, ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div>
      {/*<MatchColors />*/}
      {/*<NumberNeighbor />*/}
      {/*<MatchQuantity />*/}
      {/*<GuessTheAnimal />*/}
      {/*<MemoryCards />*/}
      <ImageGeneration />
      {/*<AuthForm />*/}
    </div>
  );
}
