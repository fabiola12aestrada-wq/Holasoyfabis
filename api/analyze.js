// /api/analyze.js
// Vercel Serverless Function. La llave de Gemini vive SOLO aquí
// (variable de entorno), nunca llega al navegador.
//
// Usa el tier GRATIS de la API de Google Gemini (sin tarjeta).
//
// Recibe { text, sceneCount } (el texto ya extraído del PDF en el cliente)
// y devuelve { scenes: [{ label, script, prompt }, ...] }.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, sceneCount } = req.body || {};

  if (!text || !sceneCount) {
    return res.status(400).json({ error: 'text y sceneCount son requeridos' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY no está configurado en las variables de entorno de Vercel' });
  }

  // Límite de seguridad de tamaño para no pasarnos de tokens
  var truncated = text.slice(0, 60000);

  var systemPrompt = 'Eres un asistente que convierte el texto de un documento en un storyboard visual. ' +
    'Respondes ÚNICAMENTE con JSON válido, sin texto adicional, sin backticks de markdown.';

  var userPrompt = 'Divide el siguiente texto en exactamente ' + sceneCount + ' escenas para un storyboard visual. ' +
    'Para cada escena da: "label" (breve, ej. "EXTERIOR / CIUDAD"), "script" (resumen narrativo de la escena, ' +
    'estilo guion, en mayúsculas, 1-3 frases), y "prompt" (un prompt en inglés, muy descriptivo y visual, ' +
    'para un modelo de generación de imágenes tipo FLUX/Stable Diffusion, describiendo la composición de esa escena).\n\n' +
    'Devuelve un JSON con esta forma exacta y nada más:\n' +
    '{"scenes":[{"label":"...","script":"...","prompt":"..."}]}\n\n' +
    'Texto del documento:\n' + truncated;

  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return res.status(geminiRes.status).json({ error: errText.slice(0, 500) });
    }

    const data = await geminiRes.json();
    var content = ((data.candidates || [])[0] || {}).content;
    var rawText = content && content.parts
      ? content.parts.map(function (p) { return p.text || ''; }).join('')
      : '';

    var parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      return res.status(502).json({ error: 'La IA no devolvió JSON válido', raw: rawText.slice(0, 300) });
    }

    return res.status(200).json({ scenes: parsed.scenes || [] });
  } catch (err) {
    var detail = err && err.cause ? (err.cause.message || String(err.cause)) : null;
    return res.status(500).json({ error: err.message, cause: detail });
  }
}
