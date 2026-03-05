const db = require('./src/config/db');
require('dotenv').config();

const q = `
SELECT o.*, 
        json_agg(json_build_object(
            'product_id', oi.product_id, 
            'name', p.name,
            'image_url', p.image_url,
            'quantity', oi.quantity, 
            'price', oi.price
        )) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 3
GROUP BY o.id
ORDER BY o.created_at DESC
`;

db.query(q)
    .then(res => console.log(JSON.stringify(res.rows, null, 2)))
    .catch(console.error)
    .finally(() => process.exit());
