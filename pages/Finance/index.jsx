import Head from 'next/head'
import Layout from '../../components/layout'
import Style from '../../styles/finance.module.css'
import { useState, useEffect } from 'react'
import { IoTrashOutline } from "react-icons/io5";

export default function Finance() {
  const [openForm, setOpenForm] = useState(false)
  const [type, setType] = useState('depense')
  const [montant, setMontant] = useState('')
  const [date, setDate] = useState('')
  const [transactions, setTransactions] = useState([])

  // Totaux
  const [totalRevenu, setTotalRevenu] = useState(0)
  const [totalDepense, setTotalDepense] = useState(0)
  const [solde, setSolde] = useState(0)

  // Récupérer transactions
  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data)

      // Calcul des totaux
      let revenu = 0, depense = 0
      data.forEach(t => {
        if (t.type === 'revenu') revenu += Number(t.montant)
        else if (t.type === 'depense') depense += Number(t.montant)
      })
      setTotalRevenu(revenu)
      setTotalDepense(depense)
      setSolde(revenu - depense)
    } catch (err) {
      console.error("Erreur récupération:", err)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Soumission du formulaire
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!montant || !date) return alert("Veuillez remplir tous les champs")

    const newTransaction = { type, montant: Number(montant), date }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      })
      if (!res.ok) throw new Error('Erreur lors de l’ajout')
      setType('depense')
      setMontant('')
      setDate('')
      setOpenForm(false)
      fetchTransactions()
    } catch (err) {
      console.error("Erreur d'envoi:", err)
    }
  }

  // Suppression
  const handleDelete = async (id) => {
  try {
    const res = await fetch('/api/transactions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) throw new Error('Erreur lors de la suppression');
    fetchTransactions(); // Recharge la liste
  } catch (err) {
    console.error(err);
    alert('Impossible de supprimer la transaction');
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'type') setType(value)
    else if (name === 'montant') setMontant(value)
    else if (name === 'date') setDate(value)
  }

  return (
    <>
      <Head>
        <title>Finance</title>
      </Head>

      <Layout>
        <h1 className="my-4 font-bold text-2xl">Finance</h1>

        {/* Cards Totaux */}
        <div className="grid grid-cols-1 mt-3 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-green-100 shadow-lg p-6 text-center rounded-lg">
            <h2 className="text-lg font-semibold text-green-700">Total Revenus</h2>
            <p className="text-2xl font-bold text-green-900">{totalRevenu} FCFA</p>
          </div>

          <div className="card bg-red-100 shadow-lg p-6 text-center rounded-lg">
            <h2 className="text-lg font-semibold text-red-700">Total Dépenses</h2>
            <p className="text-2xl font-bold text-red-900">{totalDepense} FCFA</p>
          </div>

          <div className="card bg-blue-100 shadow-lg p-6 text-center rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700">Solde Actuel</h2>
            <p className="text-2xl font-bold text-blue-900">{solde} FCFA</p>
          </div>
        </div>

        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <button className="btnPrimary" onClick={() => setOpenForm(true)}>
            Ajouter une nouvelle transaction
          </button>
        </header>

        {/* Formulaire */}
        <div className={`${"p-4 w-full"} ${Style.formcontainer} ${openForm ? Style.containerTransactionOpen : ""}`}>
          <form className="flex flex-col gap-4 p-6 bg-base-100 rounded-lg shadow-md w-full max-w-2xl mx-auto"
            onSubmit={handleFormSubmit}>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Type de transaction</span></label>
              <select className="select select-bordered w-full" name="type" value={type} onChange={handleChange}>
                <option value="depense">Dépense</option>
                <option value="revenu">Revenu</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Montant</span></label>
              <input type="number" className="input input-bordered w-full" name="montant" value={montant} onChange={handleChange} placeholder="Entrez le montant" />
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Date</span></label>
              <input type="date" className="input input-bordered w-full" name="date" value={date} onChange={handleChange} />
            </div>

            <div className="flex w-full justify-center gap-3 mt-4">
              <button type="submit" className="btnSUcces w-55">Ajouter</button>
              <button type="button" className="btnAnuler w-55" onClick={() => setOpenForm(false)}>Annuler</button>
            </div>
          </form>
        </div>

        {/* Tableau transactions */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t, index) => (
                  <tr key={t.id || index} className={index % 2 === 0 ? "bg-base-200" : ""}>
                    <td>{t.type}</td>
                    <td>{t.montant}</td>
                    <td>{t.date}</td>
                    <td>
                      <IoTrashOutline style={{ cursor: "pointer" }} size={20} color="red" onClick={() => handleDelete(t.id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">Aucune transaction trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  )
}
