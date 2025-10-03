// pages/login.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirige vers le dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur serveur');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>

        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Pseudo</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Entrez votre pseudo"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold">Mot de passe</label>
          <input
            type="password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <button
          type="submit"
          className="btnOpenSidebar w-full"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
