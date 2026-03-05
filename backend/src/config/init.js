const db = require('./db');

const initDB = async () => {
    try {
        const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        category VARCHAR(100),
        stock INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        const createOrderItemsTable = `
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );
    `;

        await db.query(createUsersTable);
        console.log('Users table created or exists.');
        await db.query(createProductsTable);
        console.log('Products table created or exists.');
        await db.query(createOrdersTable);
        console.log('Orders table created or exists.');
        await db.query(createOrderItemsTable);
        console.log('Order Items table created or exists.');

        // Seed data if products table is empty
        const productCountResult = await db.query('SELECT COUNT(*) FROM products');
        if (parseInt(productCountResult.rows[0].count) === 0) {
            console.log("Seeding initial products...");
            const seedProductsQuery = `
            INSERT INTO products (name, description, price, image_url, category, stock) VALUES
            ('Sketching Pencils Set', 'Professional 12-piece graphite drawing pencils', 15.99, 'https://images.unsplash.com/photo-1596701198425-c603b5ced372?auto=format&fit=crop&q=80', 'Pencils', 100),
            ('Watercolor Paint Set', '24 vibrant half-pans with brush', 25.50, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80', 'Paints', 50),
            ('Heavyweight Sketchbook', 'A4 size, 110gsm paper, 100 pages', 12.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80', 'Paper', 200),
            ('Acrylic Brush Set', '10 piece synthetic bristle shapes', 18.25, 'https://images.unsplash.com/photo-1518331393666-6b2cbbc695a0?auto=format&fit=crop&q=80', 'Brushes', 150),
            ('Caliagraphy Pen', 'Premium fountain pen with 3 nibs', 30.00, 'https://images.unsplash.com/photo-1585336261022-680e295a4843?auto=format&fit=crop&q=80', 'Pens', 75),
            ('Oil Pastels', '48 color professional oil pastel set', 22.99, 'https://images.unsplash.com/photo-1623800366810-73f8fb25870b?auto=format&fit=crop&q=80', 'Pastels', 80)
        `;
            await db.query(seedProductsQuery);
            console.log("Database seeded successfully.");
        }

    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

module.exports = initDB;
