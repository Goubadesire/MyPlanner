import Head from 'next/head'
import Layout from '../../components/layout'
import Style from './task.module.css'
import { useState, useEffect } from 'react'

export default function Tasks() {
  const [openForm, setOpenForm] = useState(false)
  const [tasks, setTasks] = useState([])

  const [type, setType] = useState('code')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState('haut')
  const [date, setDate] = useState('')

  // 🔹 Charger les tâches au montage
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks')
    const data = await res.json()
    setTasks(data)
  }

  // 🔹 Ajouter une tâche
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, description, statut, date }),
    })
    if (!res.ok) throw new Error("Erreur lors de l'ajout")

    fetchTasks()
    setOpenForm(false)
    setType('code')
    setDescription('')
    setStatut('haut')
    setDate('')
  }

  // 🔹 Supprimer une tâche
  const handleDelete = async (id) => {
    const res = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) throw new Error("Erreur lors de la suppression")
    fetchTasks()
  }

  // 🔹 Toggle "completed"
  const toggleComplete = async (id, current) => {
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !current }),
    })
    if (!res.ok) throw new Error("Erreur lors de la mise à jour")
    fetchTasks()
  }

  // 🔹 Totaux
  const totalTaches = tasks.length
  const totalAccomplis = tasks.filter((t) => t.completed).length
  const totalEnCours = totalTaches - totalAccomplis

  return (
    <>
      <Head>
        <title>Tasks</title>
      </Head>
      <Layout>
        <h1 className="text-2xl font-bold pb-4">Taches</h1>

        {/* Cards Totaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-green-100 shadow-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-green-700">Tache accomplis</h2>
            <p className="text-2xl font-bold text-green-900">{totalAccomplis}</p>
          </div>

          <div className="card bg-red-100 shadow-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-700">Total en cours</h2>
            <p className="text-2xl font-bold text-red-900">{totalEnCours}</p>
          </div>

          <div className="card bg-blue-100 shadow-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-blue-700">Total des taches</h2>
            <p className="text-2xl font-bold text-blue-900">{totalTaches}</p>
          </div>
        </div>

        {/* Bouton ajout */}
        <header className="flex justify-between items-center mb-6">
          <button
            className="btnPrimary btn-wide"
            onClick={() => setOpenForm(true)}
          >
            Ajouter une nouvelle tache
          </button>
        </header>

        {/* Formulaire */}
        <div
          className={`${'p-4 w-full'} ${Style.formcontainer} ${
            openForm ? Style.containerTcheOpen : ''
          }`}
        >
          <form
            className="flex flex-col gap-4 p-6 bg-base-100 rounded-lg shadow-md w-full max-w-2xl mx-auto bg-white"
            onSubmit={handleFormSubmit}
          >
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Type de tache</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="code">Code</option>
                <option value="etude">Etude</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                placeholder="Entrez une petite description"
                className="input input-bordered w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Statut de la tache</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
              >
                <option value="haut">Haute</option>
                <option value="moyen">Moyenne</option>
                <option value="bas">Basse</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex w-full justify-center gap-3 mt-4">
              <button type="submit" className="btnSUcces w-55">
                Ajouter
              </button>
              <button
                type="button"
                className="btnAnuler w-55"
                onClick={() => setOpenForm(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        {/* Liste des tâches */}
        <div className="p-6 w-full max-w-6xl mx-auto  rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Mes tâches</h2>

          <div className="overflow-x-auto w-full">
  <table className="table w-full">
    <thead>
      <tr>
        <th>✔</th>
        <th>Type</th>
        <th>Description</th>
        <th>Statut</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {tasks.map((t) => (
        <tr
          key={t.id}
          className={t.completed ? "bg-gray-200 line-through text-gray-500" : "bg-white"}
        >
          <td>
            <input
              type="checkbox"
              checked={t.completed || false}
              onChange={() => toggleComplete(t.id, t.completed)}
              className="checkbox checkbox-primary"
            />
          </td>
          <td className="font-semibold text-lg">{t.type}</td>
          <td className="text-lg">{t.description}</td>
          <td className="text-md text-gray-700">{t.statut}</td>
          <td className="text-md text-gray-500">{t.date}</td>
          <td>
            <button
              onClick={() => handleDelete(t.id)}
              className="btnAnuler btn-sm"
            >
              Supprimer
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>
      </Layout>
    </>
  )
}
