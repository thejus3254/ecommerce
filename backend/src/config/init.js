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

    const createFavoritesTable = `
      CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, product_id)
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
    await db.query(createFavoritesTable);
    console.log('Favorites table created or exists.');

    // Seed data if products table is empty
    const productCountResult = await db.query('SELECT COUNT(*) FROM products');
    if (parseInt(productCountResult.rows[0].count) === 0) {
      console.log("Seeding initial products...");
      const seedProductsQuery = `
            INSERT INTO products (name, description, price, image_url, category, stock) VALUES
            ('Sketching Pencils Set', 'Professional 12-piece graphite drawing pencils', 15.99, 'https://images.unsplash.com/photo-1596701198425-c603b5ced372?auto=format&fit=crop&q=80&w=600', 'Pencils', 100),
            ('Watercolor Paint Set', '24 vibrant half-pans with brush', 25.50, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600', 'Paints', 50),
            ('Heavyweight Sketchbook', 'A4 size, 110gsm paper, 100 pages', 12.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', 'Paper', 200),
            ('Acrylic Brush Set', '10 piece synthetic bristle shapes', 18.25, 'https://images.unsplash.com/photo-1518331393666-6b2cbbc695a0?auto=format&fit=crop&q=80&w=600', 'Brushes', 150),
            ('Calligraphy Pen', 'Premium fountain pen with 3 nibs', 30.00, 'https://images.unsplash.com/photo-1585336261022-680e295a4843?auto=format&fit=crop&q=80&w=600', 'Pens', 75),
            ('Oil Pastels', '48 color professional oil pastel set', 22.99, 'https://images.unsplash.com/photo-1623800366810-73f8fb25870b?auto=format&fit=crop&q=80&w=600', 'Pastels', 80),
            ('Wooden Studio Easel', 'Adjustable H-frame floor easel for large canvases', 89.99, 'https://images.unsplash.com/photo-1518984950450-7164ea222de8?auto=format&fit=crop&q=80&w=600', 'Equipment', 15),
            ('Canvas Panels Pack', 'Set of 5 11x14 inch primed cotton canvas boards', 24.50, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600', 'Canvas', 120),
            ('Alcohol Markers Set', '36 dual-tip professional illustration blenders', 45.00, 'https://images.unsplash.com/photo-1521120098171-050dbfaa04c4?auto=format&fit=crop&q=80&w=600', 'Markers', 60),
            ('Self-Healing Cutting Mat', 'A3 size double-sided metric/imperial grid', 19.95, 'https://images.unsplash.com/photo-1621255536551-768a35eeccd1?auto=format&fit=crop&q=80&w=600', 'Equipment', 90),
            ('Workable Fixative Spray', '11oz spray to prevent smudging on charcoal and pastels', 14.25, 'https://images.unsplash.com/photo-1572947118128-091702eac3f2?auto=format&fit=crop&q=80&w=600', 'Mediums', 85),
            ('Porcelain Mixing Palette', '12-well heavy ceramic palette for watercolors', 21.00, 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=600', 'Accessories', 40)
        `;
      await db.query(seedProductsQuery);
      console.log("Database seeded successfully.");
    }

  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = initDB;
