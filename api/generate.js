// /api/generate.js
// Vercel Serverless Function. El token vive SOLO aquí (variable de entorno),
// nunca llega al navegador del usuario.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { modelId, prompt, parameters } = req.body || {};

  if (!modelId || !prompt) {
    return res.status(400).json({ error: 'modelId y prompt son requeridos' });
  }

  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'HF_TOKEN no está configurado en las variables de entorno de Vercel' });
  }

  try {
    const hfRes = await fetch('https://api-inference.huggingface.co/models/' + modelId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: parameters || {},
        options: { wait_for_model: true }
      })
    });

    if (!hfRes.ok) {
      const text = await hfRes.text();
      return res.status(hfRes.status).json({ error: text.slice(0, 500) });
    }

    const contentType = hfRes.headers.get('content-type') || '';

    // Si HF responde JSON en vez de imagen, es un error/estado de carga del modelo
    if (contentType.indexOf('application/json') !== -1) {
      const data = await hfRes.json();
      return res.status(502).json({ error: 'El modelo no devolvió una imagen', detail: data });
    }

    const arrayBuffer = await hfRes.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
