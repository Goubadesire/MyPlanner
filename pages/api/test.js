export default function handler(req, res) {
  res.status(200).json({
    dbUrl: process.env.DATABASE_URL ? "Variable trouvée" : "Variable introuvable",
    value: process.env.DATABASE_URL || null
  });
}
