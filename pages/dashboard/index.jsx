import Head from "next/head";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [budget, setBudget] = useState(0);
  const [matieres, setMatieres] = useState([]);
  const [taches, setTaches] = useState([]);
  const [moyenneGenerale, setMoyenneGenerale] = useState(0);

  // Récupération des données
  useEffect(() => {
    // Budget
    fetch("/api/transactions")
  .then(res => res.json())
  .then(data => {
    let revenu = 0, depense = 0;
    data.forEach(t => {
      if (t.type === 'revenu') revenu += Number(t.montant);
      else if (t.type === 'depense') depense += Number(t.montant);
    });
    setBudget(revenu - depense);
  })
  .catch(err => console.error(err));


    // Matières et notes
    fetch("/api/matieres")
      .then(res => res.json())
      .then(async data => {
        const matieresAvecNotes = await Promise.all(
          data.map(async mat => {
            const resNotes = await fetch(`/api/notes?id=${mat.id}`);
            const notesData = await resNotes.json();
            return { ...mat, notes: notesData.notes || [] };
          })
        );
        setMatieres(matieresAvecNotes);

        // Calcul de la moyenne générale
        let totalNotes = 0;
        let totalCoeff = 0;
        matieresAvecNotes.forEach(mat => {
          const sommeNotes = mat.notes.reduce((acc, n) => acc + Number(n.note), 0);
          const moyenneMat = mat.notes.length ? sommeNotes / mat.notes.length : 0;
          totalNotes += moyenneMat * (mat.coefficient || 1);
          totalCoeff += mat.coefficient || 1;
        });
        setMoyenneGenerale(totalCoeff ? (totalNotes / totalCoeff).toFixed(2) : 0);
      })
      .catch(err => console.error(err));

    // Tâches
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => setTaches(data))
      .catch(err => console.error(err));
  }, []);

  // Données graphiques
  const tacheData = {
    labels: ["En cours", "Accomplies"],
    datasets: [
      {
        label: "Tâches",
        data: [
          taches.filter(t => !t.completed).length,
          taches.filter(t => t.completed).length,
        ],
        backgroundColor: ["#f87171", "#34d399"],
        borderWidth: 1,
      },
    ],
  };

  const budgetData = {
    labels: ["Budget actuel", "Budget restant"],
    datasets: [
      {
        label: "Budget",
        data: [budget, 1000 - budget], // Exemple, adapter selon ton app
        backgroundColor: ["#60a5fa", "#93c5fd"],
        borderWidth: 1,
      },
    ],
  };

  const moyenneData = {
    labels: matieres.map(m => m.nom),
    datasets: [
      {
        label: "Moyenne par matière",
        data: matieres.map(m => {
          const somme = m.notes.reduce((acc, n) => acc + Number(n.note), 0);
          return m.notes.length ? (somme / m.notes.length).toFixed(2) : 0;
        }),
        backgroundColor: "#fbbf24",
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>
        <div className="p-6 space-y-6">
          {/* Cartes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 bg-blue-100 shadow text-center rounded-lg">
              <h2 className="text-lg font-semibold text-blue-700">Budget actuel</h2>
              <p className="text-2xl font-bold text-blue-900">{budget} F</p>
            </div>
            <div className="card p-6 bg-yellow-100 shadow text-center rounded-lg">
              <h2 className="text-lg font-semibold text-yellow-700">Moyenne générale</h2>
              <p className="text-2xl font-bold text-yellow-900">{moyenneGenerale}</p>
            </div>
            <div className="card p-6 bg-green-100 shadow text-center rounded-lg">
              <h2 className="text-lg font-semibold text-green-700">Tâches</h2>
              <p className="text-2xl font-bold text-green-900">{taches.length}</p>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="chart-container h-64">
              <Doughnut data={budgetData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <div className="chart-container h-64">
              <Bar data={moyenneData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <div className="chart-container h-64">
              <Doughnut data={tacheData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
