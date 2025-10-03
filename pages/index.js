import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // ou autre moyen d'auth
    if (token) {
      router.replace("/dashboard"); // connecté → dashboard
    } else {
      router.replace("/login"); // non connecté → login
    }
  }, [router]);

  return null;
}
