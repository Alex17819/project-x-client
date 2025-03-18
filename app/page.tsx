import Image from "next/image";
import styles from "./page.module.css";
import {MatchColors} from "@/components/blocks/match-colors";

export default function Home() {
  return (
    <div className={styles.page}>
      <MatchColors />
    </div>
  );
}
