const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not set on Netlify' })
    };
  }

  let history, systemPrompt;
  try {
    const parsed = JSON.parse(event.body);
    history = parsed.history;
    systemPrompt = parsed.systemPrompt;
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' })
    };
  }

  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const requestBody = JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { maxOutputTokens: 1000 }
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);

          if (res.statusCode !== 200) {
            return resolve({
              statusCode: 200,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                error: `Gemini returned ${res.statusCode}`,
                geminiError: parsed?.error?.message || JSON.stringify(parsed)
              })
            });
          }

          const reply = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || null;
          resolve({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reply })
          });
        } catch (e) {
          resolve({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to parse Gemini response', raw: data.slice(0, 300) })
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'HTTPS request failed', detail: e.message })
      });
    });

    req.write(requestBody);
    req.end();
  });
};