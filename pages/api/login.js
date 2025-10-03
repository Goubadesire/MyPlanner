// pages/api/login.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
  }

  try {
    // Vérifier si l’utilisateur existe
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('pseudo', pseudo)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Comparer le mot de passe
    const bcrypt = require('bcryptjs');
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    return res.status(200).json({ message: 'Connexion réussie' });
  } catch (err) {
    console.error('Erreur API login:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
