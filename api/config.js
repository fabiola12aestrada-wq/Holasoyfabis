// /api/config.js
// Expone valores PÚBLICOS (seguros de mostrar en el navegador) leídos de
// variables de entorno, para no hardcodearlos directo en el HTML/repo.
// La llave "anon" de Supabase está diseñada para ser pública; la seguridad
// real la da Row Level Security (RLS) en las tablas, no ocultar esta llave.

export default function handler(req, res) {
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || null,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || null
  });
}
