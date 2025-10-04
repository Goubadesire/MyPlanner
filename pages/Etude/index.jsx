import Layout from "../../components/layout";
import Head from "next/head";
import Style from "./etude.module.css";
import { useState, useEffect } from "react";

export default function Etude() {
  const [matieres, setMatieres] = useState([]);
  const [nomMatiere, setNomMatiere] = useState("");
  const [coeffMatiere, setCoeffMatiere] = useState(1);
  const [noteMatiere, setNoteMatiere] = useState("");
  const [matiereSelectionnee, setMatiereSelectionnee] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [noteFormOpen, setNoteFormOpen] = useState(false);
  const [modifMatiereId, setModifMatiereId] = useState(null);
  const [modifNoteId, setModifNoteId] = useState(null);

  // Récupérer toutes les matières avec leurs notes
  const fetchMatieres = async () => {
    try {
      const res = await fetch("/api/matieres");
      const data = await res.json();
      // Pour chaque matière, récupérer ses notes
      const matieresAvecNotes = await Promise.all(
        data.map(async (m) => {
          const resNotes = await fetch(`/api/notes?id=${m.id}`);
          const notesData = await resNotes.json();
          return { ...m, notes: notesData.notes || [] };
        })
      );
      setMatieres(matieresAvecNotes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, []);

  // Ajouter ou modifier une matière
  const handleAddMatiere = async () => {
    if (!nomMatiere || !coeffMatiere) return alert("Remplir tous les champs");
    try {
      if (modifMatiereId) {
        // Modifier
        await fetch(`/api/matieres`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: modifMatiereId, nom: nomMatiere, coefficient: coeffMatiere }),
        });
      } else {
        // Ajouter
        await fetch(`/api/matieres`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: nomMatiere, coefficient: coeffMatiere }),
        });
      }
      setNomMatiere("");
      setCoeffMatiere(1);
      setOpenForm(false);
      setModifMatiereId(null);
      fetchMatieres();
    } catch (err) {
      console.error(err);
    }
  };

  // Supprimer une matière
 const handleDeleteMatiere = async (id) => {
  if (!confirm("Supprimer cette matière ?")) return;
  try {
    await fetch(`/api/matieres?id=${id}`, { method: 'DELETE' });
    fetchMatieres();
  } catch (err) {
    console.error(err);
  }
};


  // Ajouter ou modifier une note
  const handleAddNote = async () => {
    if (!matiereSelectionnee || !noteMatiere) return alert("Remplir tous les champs");
    try {
      if (modifNoteId) {
        await fetch(`/api/notes?id=${matiereSelectionnee}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: modifNoteId, note: Number(noteMatiere) }),
        });
      } else {
        await fetch(`/api/notes?id=${matiereSelectionnee}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note: Number(noteMatiere) }),
        });
      }
      setNoteMatiere("");
      setNoteFormOpen(false);
      setModifNoteId(null);
      fetchMatieres();
    } catch (err) {
      console.error(err);
    }
  };

  // Supprimer une note
  const handleDeleteNote = async (noteId) => {
    if (!confirm("Supprimer cette note ?")) return;
    try {
      await fetch(`/api/notes?id=${noteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId }),
      });
      fetchMatieres();
    } catch (err) {
      console.error(err);
    }
  };

  // Calcul moyenne d'une matière
  const calculerMoyenneMatiere = (mat) => {
    if (!mat.notes || mat.notes.length === 0) return 0;
    const somme = mat.notes.reduce((acc, n) => acc + Number(n.note), 0);
    return (somme / mat.notes.length).toFixed(2);
  };

  // Calcul moyenne générale
  const moyenneGenerale = () => {
    if (matieres.length === 0) return 0;
    let totalNotes = 0;
    let totalCoeff = 0;
    matieres.forEach(mat => {
      const coeff = mat.coefficient || 1;
      const moyenne = calculerMoyenneMatiere(mat);
      totalNotes += moyenne * coeff;
      totalCoeff += coeff;
    });
    return (totalNotes / totalCoeff).toFixed(2);
  };

  return (
    <>
      <Head>
        <title>Etude</title>
      </Head>
      <Layout>
        <div className="p-6 w-full max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Études</h1>
          <div className="mb-4 p-4 bg-base-200 rounded-lg shadow text-center font-semibold">
            Moyenne générale : {moyenneGenerale()}
          </div>

          {/* Ajouter matière */}
          <button className=" btn btnPrimary" onClick={() => setOpenForm(true)}>Ajouter une matière</button>

          {/* Formulaire Matière */}
          <div className={`${'p-4 w-full'} ${Style.formcontainer} ${openForm ? Style.containerTcheOpen : ''}`}>
            <form className="flex flex-col gap-4 p-6 bg-base-100 rounded-lg shadow-md w-full max-w-2xl mx-auto bg-white" onSubmit={e => { e.preventDefault(); handleAddMatiere(); }}>
              <div className="form-control w-full">
                <label>Nom de la matièere</label>
                <input type="text" value={nomMatiere} onChange={e => setNomMatiere(e.target.value)} />
              </div>
              <div className="form-control w-full">
                <label>Coefficient</label>
                <input type="number" value={coeffMatiere} onChange={e => setCoeffMatiere(Number(e.target.value))} />
              </div>
              <div className="flex w-full justify-center gap-3 mt-4">
                <button className="btn btn-md sm:btn-sm btnSUcces w-55" type="submit">Ajouter</button>
                <button className="btnAnuler w-55" onClick={() => { setOpenForm(false); setModifMatiereId(null); }}>Annuler</button>
              </div>
            </form>
          </div>

          {/* Liste des matières */}
          <ul className="flex flex-col gap-4 mt-4">
  {matieres.map((m) => (
    <li key={m.id} className="flex flex-col p-4 bg-base-100 rounded-lg shadow">
      {/* En-tête Matière */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <span className="font-semibold">{m.nom} (Coeff: {m.coefficient})</span>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="btn btnPrimary w-full sm:w-auto btn-md sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => { setMatiereSelectionnee(m.id); setNoteFormOpen(true); }}
          >
            Ajouter note
          </button>
          <button
            className="btn btnMofifier w-full sm:w-auto btn-md sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => { setNomMatiere(m.nom); setCoeffMatiere(m.coefficient); setModifMatiereId(m.id); setOpenForm(true); }}
          >
            Modifier
          </button>
          <button
            className="btn btnAnuler w-full sm:w-auto btn-md sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => handleDeleteMatiere(m.id)}
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Notes */}
      {m.notes && m.notes.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2">
          {m.notes.map((n) => (
            <li key={n.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-base-200 p-2 rounded shadow">
              <span className="text-gray-700 mb-2 sm:mb-0">Note : {n.note}</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className="btn btnMofifier w-full sm:w-auto btn-md sm:btn-sm md:btn-md lg:btn-lg"
                  onClick={() => { setNoteMatiere(n.note); setModifNoteId(n.id); setMatiereSelectionnee(m.id); setNoteFormOpen(true); }}
                >
                  Modifier
                </button>
                <button
                  className="btn btnAnuler w-full sm:w-auto btn-md sm:btn-sm md:btn-md lg:btn-lg"
                   onClick={() => handleDeleteNote(n.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Moyenne matière */}
      <div className="mt-2 font-semibold">
        Moyenne matière : {calculerMoyenneMatiere(m)}
      </div>
    </li>
  ))}
</ul>


          {/* Formulaire Note */}
          {noteFormOpen && (
            <div className={`${'p-4 w-full'} ${Style.formcontainer} ${Style.containerTcheOpen}`}>
              <form className="flex flex-col gap-4 p-6 bg-base-100 rounded-lg shadow-md w-full max-w-2xl mx-auto bg-white" onSubmit={e => { e.preventDefault(); handleAddNote(); }}>
                <div className="form-control w-full">
                  <label>Note</label>
                  <input type="number" value={noteMatiere} onChange={e => setNoteMatiere(e.target.value)} />
                </div>
                <div className="flex w-full justify-center gap-3 mt-4">
                  <button className="btnPrimary w-55" type="submit">Ajouter</button>
                  <button className="btnAnuler w-55" onClick={() => { setNoteFormOpen(false); setModifNoteId(null); }}>Annuler</button>
                </div>
              </form>
            </div>
          )}

        </div>
      </Layout>
    </>
  );
}
