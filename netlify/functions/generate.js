exports.handler = async (event, context) => {
  // Solo aceptamos peticiones POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const { prompt, model, parameters } = JSON.parse(event.body || "{}");

    // Lee la variable que acabas de guardar en Netlify
    const HF_TOKEN = process.env.HF_API_TOKEN;

    if (!HF_TOKEN) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "No se encontró el token de Hugging Face en Netlify." }) 
      };
    }

    const selectedModel = model || "black-forest-labs/FLUX.1-schnell";

    // Llamada segura servidor -> Hugging Face
    const response = await fetch(`https://api-inference.huggingface.co/models/${selectedModel}`, {
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: parameters || {}
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: errorText };
    }

    const contentType = response.headers.get("content-type");

    // Si devuelve una imagen (por ejemplo de FLUX.1)
    if (contentType && contentType.includes("image")) {
      const buffer = await response.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      
      return {
        statusCode: 200,
        headers: { "Content-Type": contentType },
        body: base64Image,
        isBase64Encoded: true
      };
    }

    // Si devuelve texto/JSON
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
