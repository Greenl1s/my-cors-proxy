// api/cors.js — простой и надёжный CORS-прокси для Vercel

export default async function handler(req, res) {
    // 1. Разрешаем CORS для всех источников
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // 2. Обрабатываем предварительный OPTIONS-запрос (preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. Получаем целевой URL из параметра 'url'
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing ?url= parameter' });
    }

    try {
        // 4. Делаем запрос к целевому API (Яндекс.Диск)
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'User-Agent': 'CORS-Proxy',
                'Accept': 'application/json',
            },
        });
        
        // 5. Получаем данные
        const data = await response.json();
        
        // 6. Возвращаем данные на сайт
        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch target URL' });
    }
}
