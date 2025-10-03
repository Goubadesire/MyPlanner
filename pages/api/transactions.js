// pages/api/transactions.js
import { createClient } from '@supabase/supabase-js';

// ⚠️ Assure-toi que ces variables sont définies dans .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Les variables NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies"
  );
}

// Création du client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Récupère toutes les transactions
      const { data, error } = await supabase
        .from('Transaction') // ⚠️ Vérifie que ton table s'appelle 'Transaction'
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { type, montant, date } = req.body;

      if (!type || !montant || !date) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
      }

      const { data, error } = await supabase
        .from('Transaction') // ⚠️ Même nom de table
        .insert([{ type, montant, date }]);

      if (error) throw error;

      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID requis pour la suppression" });
  }

  const { error } = await supabase
    .from('Transaction')
    .delete()
    .eq('id', Number(id));

  if (error) throw error;

  return res.status(200).json({ message: "Transaction supprimée" });
}


    return res.status(405).json({ message: 'Méthode non autorisée' });
  } catch (err) {
    console.error("Erreur API transactions:", err.message);
    return res.status(500).json({ message: err.message });
  }
}
