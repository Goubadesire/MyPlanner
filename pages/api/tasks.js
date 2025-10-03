// pages/api/tasks.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("⚠️ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    // 📌 GET → récupérer toutes les tâches
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("Task")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    // 📌 POST → créer une nouvelle tâche
    if (req.method === "POST") {
      const { type, description, statut, date } = req.body;

      if (!type || !description || !statut || !date) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      const { data, error } = await supabase
        .from("Task")
        .insert([{ type, description, statut, date, completed: false }])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    // 📌 DELETE → supprimer une tâche
    if (req.method === "DELETE") {
      const { id } = req.body;

      const { error } = await supabase
        .from("Task")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return res.status(200).json({ message: "Tâche supprimée" });
    }

    // 📌 PUT → mettre à jour une tâche (par ex. statut completed)
    if (req.method === "PUT") {
      const { id, completed } = req.body;

      const { data, error } = await supabase
        .from("Task")
        .update({ completed })
        .eq("id", id)
        .select();

      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    return res.status(405).json({ message: "Méthode non autorisée" });
  } catch (err) {
    console.error("Erreur API Tasks:", err.message);
    return res.status(500).json({ message: err.message });
  }
}
