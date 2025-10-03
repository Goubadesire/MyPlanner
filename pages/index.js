// pages/index.jsx
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard"); // redirection immédiate (remplace l'historique)
  }, [router]);

  return null; // ou un loader si tu veux
}
