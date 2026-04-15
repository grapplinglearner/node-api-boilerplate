import { ProductModel, WarehouseModel, InventoryTransferModel } from '../schemas/schemas';
import DbConnection from '../connection/DbConnection';
import { config } from '../../config/config';

interface SeedData {
  warehouses: Array<{
    name: string;
    location: string;
    capacity: number;
    currentUsage: number;
  }>;
  products: Array<{
    name: string;
    sku: string;
    description: string;
    price: number;
    quantity: number;
    warehouseLocation: string;
  }>;
  transfers: Array<{
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    status: string;
  }>;
}

// Generate realistic dummy data
const generateSeedData = (): SeedData => {
  const warehouses = [
    { name: 'Main Distribution Center', location: 'New York, NY', capacity: 10000, currentUsage: 0 },
    { name: 'West Coast Hub', location: 'Los Angeles, CA', capacity: 8000, currentUsage: 0 },
    { name: 'Midwest Warehouse', location: 'Chicago, IL', capacity: 6000, currentUsage: 0 },
    { name: 'Southern Facility', location: 'Atlanta, GA', capacity: 5000, currentUsage: 0 },
    { name: 'Pacific Northwest', location: 'Seattle, WA', capacity: 4000, currentUsage: 0 },
    { name: 'Texas Distribution', location: 'Dallas, TX', capacity: 7000, currentUsage: 0 },
    { name: 'Florida East Coast', location: 'Miami, FL', capacity: 3500, currentUsage: 0 },
    { name: 'Mountain West', location: 'Denver, CO', capacity: 3000, currentUsage: 0 },
    { name: 'Northeast Regional', location: 'Boston, MA', capacity: 4500, currentUsage: 0 },
    { name: 'Central Valley', location: 'Sacramento, CA', capacity: 5500, currentUsage: 0 },
    { name: 'Great Lakes', location: 'Detroit, MI', capacity: 4800, currentUsage: 0 },
    { name: 'Gulf Coast', location: 'Houston, TX', capacity: 6200, currentUsage: 0 },
    { name: 'Rocky Mountain', location: 'Salt Lake City, UT', capacity: 2800, currentUsage: 0 },
    { name: 'Appalachian', location: 'Pittsburgh, PA', capacity: 3200, currentUsage: 0 },
    { name: 'Desert Southwest', location: 'Phoenix, AZ', capacity: 4100, currentUsage: 0 },
    { name: 'Northern Plains', location: 'Minneapolis, MN', capacity: 3600, currentUsage: 0 },
    { name: 'Cascade Range', location: 'Portland, OR', capacity: 2900, currentUsage: 0 },
    { name: 'Mississippi Valley', location: 'St. Louis, MO', capacity: 4300, currentUsage: 0 },
    { name: 'Coastal Carolinas', location: 'Charlotte, NC', capacity: 3800, currentUsage: 0 },
    { name: 'Inland Empire', location: 'Riverside, CA', capacity: 4700, currentUsage: 0 },
    { name: 'Ohio Valley', location: 'Cincinnati, OH', capacity: 3400, currentUsage: 0 },
    { name: 'Sierra Nevada', location: 'Reno, NV', capacity: 2600, currentUsage: 0 },
    { name: 'Tennessee Ridge', location: 'Nashville, TN', capacity: 3900, currentUsage: 0 },
    { name: 'Front Range', location: 'Colorado Springs, CO', capacity: 3100, currentUsage: 0 },
    { name: 'Blue Ridge', location: 'Asheville, NC', capacity: 2700, currentUsage: 0 },
  ];

  const productCategories = {
    electronics: [
      { name: 'Wireless Bluetooth Headphones', basePrice: 89.99 },
      { name: '4K Smart TV 55"', basePrice: 599.99 },
      { name: 'Gaming Laptop', basePrice: 1299.99 },
      { name: 'Smartphone 128GB', basePrice: 699.99 },
      { name: 'Wireless Router', basePrice: 149.99 },
      { name: 'Digital Camera', basePrice: 449.99 },
      { name: 'Tablet 10.5"', basePrice: 349.99 },
      { name: 'Smart Watch', basePrice: 299.99 },
      { name: 'External SSD 1TB', basePrice: 129.99 },
      { name: 'Bluetooth Speaker', basePrice: 79.99 },
    ],
    furniture: [
      { name: 'Ergonomic Office Chair', basePrice: 249.99 },
      { name: 'Standing Desk', basePrice: 399.99 },
      { name: 'Bookshelf 5-Tier', basePrice: 149.99 },
      { name: 'Dining Table Set', basePrice: 899.99 },
      { name: 'Recliner Chair', basePrice: 499.99 },
      { name: 'Wardrobe Closet', basePrice: 349.99 },
      { name: 'Coffee Table', basePrice: 199.99 },
      { name: 'Bed Frame Queen', basePrice: 299.99 },
      { name: 'Filing Cabinet', basePrice: 179.99 },
      { name: 'Bar Stools (Set of 4)', basePrice: 249.99 },
    ],
    appliances: [
      { name: 'Refrigerator 18 cu ft', basePrice: 899.99 },
      { name: 'Washing Machine', basePrice: 599.99 },
      { name: 'Dishwasher', basePrice: 449.99 },
      { name: 'Microwave Oven', basePrice: 149.99 },
      { name: 'Air Conditioner 12000 BTU', basePrice: 349.99 },
      { name: 'Vacuum Cleaner', basePrice: 199.99 },
      { name: 'Coffee Maker', basePrice: 79.99 },
      { name: 'Toaster Oven', basePrice: 59.99 },
      { name: 'Blender', basePrice: 89.99 },
      { name: 'Electric Kettle', basePrice: 39.99 },
    ],
    clothing: [
      { name: 'Winter Jacket', basePrice: 129.99 },
      { name: 'Running Shoes', basePrice: 89.99 },
      { name: 'Casual Shirt', basePrice: 29.99 },
      { name: 'Jeans', basePrice: 49.99 },
      { name: 'Sweater', basePrice: 39.99 },
      { name: 'Dress Shoes', basePrice: 79.99 },
      { name: 'T-Shirt Pack (5)', basePrice: 49.99 },
      { name: 'Hoodie', basePrice: 34.99 },
      { name: 'Shorts', basePrice: 24.99 },
      { name: 'Socks Pack (10)', basePrice: 19.99 },
    ],
  };

  const products: Array<{
    name: string;
    sku: string;
    description: string;
    price: number;
    quantity: number;
    warehouseLocation: string;
  }> = [];

  // Generate 30 products across categories
  let skuCounter = 1000;
  Object.entries(productCategories).forEach(([category, items]) => {
    items.forEach((item, index) => {
      const variations = ['Basic', 'Premium', 'Deluxe', 'Standard'];
      variations.forEach((variation, varIndex) => {
        const productName = variation === 'Standard' ? item.name : `${variation} ${item.name}`;
        const sku = `PRD-${category.toUpperCase().slice(0, 3)}-${skuCounter.toString().padStart(4, '0')}`;
        const price = item.basePrice + (varIndex * 50) + Math.floor(Math.random() * 20);
        const quantity = Math.floor(Math.random() * 100) + 10;
        const warehouseIndex = Math.floor(Math.random() * warehouses.length);

        products.push({
          name: productName,
          sku,
          description: `High-quality ${productName.toLowerCase()} perfect for everyday use. Features premium materials and excellent craftsmanship.`,
          price: Math.round(price * 100) / 100,
          quantity,
          warehouseLocation: warehouses[warehouseIndex].location,
        });

        skuCounter++;
      });
    });
  });

  // Generate inventory transfers
  const transfers: Array<{
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    status: string;
  }> = [];

  const transferStatuses = ['PENDING', 'IN_TRANSIT', 'COMPLETED', 'FAILED'];

  for (let i = 0; i < 25; i++) {
    const productIndex = Math.floor(Math.random() * products.length);
    let fromWarehouseIndex, toWarehouseIndex;

    do {
      fromWarehouseIndex = Math.floor(Math.random() * warehouses.length);
      toWarehouseIndex = Math.floor(Math.random() * warehouses.length);
    } while (fromWarehouseIndex === toWarehouseIndex);

    const quantity = Math.floor(Math.random() * 20) + 1;
    const status = transferStatuses[Math.floor(Math.random() * transferStatuses.length)];

    transfers.push({
      productId: `placeholder-${productIndex}`, // Will be replaced with actual ObjectId
      fromWarehouseId: `placeholder-${fromWarehouseIndex}`, // Will be replaced with actual ObjectId
      toWarehouseId: `placeholder-${toWarehouseIndex}`, // Will be replaced with actual ObjectId
      quantity,
      status,
    });
  }

  return { warehouses, products, transfers };
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await DbConnection.connect(config.MONGODB_URI);
    console.log('✅ Connected to database');

    // Clear existing data
    await ProductModel.deleteMany({});
    await WarehouseModel.deleteMany({});
    await InventoryTransferModel.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Generate seed data
    const seedData = generateSeedData();
    console.log('📊 Generated seed data');

    // Insert warehouses
    const insertedWarehouses = await WarehouseModel.insertMany(seedData.warehouses);
    console.log(`🏭 Inserted ${insertedWarehouses.length} warehouses`);

    // Insert products
    const insertedProducts = await ProductModel.insertMany(seedData.products);
    console.log(`📦 Inserted ${insertedProducts.length} products`);

    // Insert transfers with correct ObjectIds
    const transfersWithIds = seedData.transfers.map((transfer, index) => ({
      ...transfer,
      productId: insertedProducts[Math.floor(Math.random() * insertedProducts.length)]._id,
      fromWarehouseId: insertedWarehouses[Math.floor(Math.random() * insertedWarehouses.length)]._id,
      toWarehouseId: insertedWarehouses[Math.floor(Math.random() * insertedWarehouses.length)]._id,
    }));

    const insertedTransfers = await InventoryTransferModel.insertMany(transfersWithIds);
    console.log(`🚚 Inserted ${insertedTransfers.length} inventory transfers`);

    // Update warehouse current usage based on products
    for (const warehouse of insertedWarehouses) {
      const productsInWarehouse = insertedProducts.filter(p => p.warehouseLocation === warehouse.location);
      const totalUsage = productsInWarehouse.reduce((sum, product) => sum + product.quantity, 0);
      await WarehouseModel.findByIdAndUpdate(warehouse._id, { currentUsage: totalUsage });
    }
    console.log('📈 Updated warehouse usage statistics');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`   📊 Summary:`);
    console.log(`      • ${insertedWarehouses.length} warehouses`);
    console.log(`      • ${insertedProducts.length} products`);
    console.log(`      • ${insertedTransfers.length} inventory transfers`);
    console.log(`      • Total records: ${insertedWarehouses.length + insertedProducts.length + insertedTransfers.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await DbConnection.disconnect();
    process.exit(0);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase, generateSeedData };