// api/cors.js — простой и надёжный CORS-прокси для Vercel
export default async function handler(req, res) {
    // Разрешаем CORS для всех источников
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Обрабатываем предварительный OPTIONS-запрос (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Получаем целевой URL из параметра 'url'
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing ?url= parameter' });
    }
    
    try {
        const response = await fetch(targetUrl);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch target URL' });
    }
}
