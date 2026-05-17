const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MenuItem, Order } = require("./models/Restaurant");
const { Book, BookIssue } = require("./models/Library");
const { LaundryItem, LaundryOrder } = require("./models/Laundry");
const { Rental } = require("./models/Rental");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/campuskart", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected for seeding"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Sample data
const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce and mozzarella",
    price: 299,
    category: "dinner",
    image: "/images/Margherita_Pizza.jpeg",
    availability: true,
  },
  {
    name: "Cheeseburger",
    description: "Juicy beef patty with melted cheese and fresh vegetables",
    price: 249,
    category: "lunch",
    image: "/images/Cheeseburger.jpeg",
    availability: true,
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons and parmesan",
    price: 199,
    category: "lunch",
    image: "/images/Caesar_Salad.jpeg",
    availability: true,
  },
  {
    name: "Chocolate Cake",
    description: "Rich and moist chocolate cake with chocolate frosting",
    price: 149,
    category: "snacks",
    image: "/images/Chocolate_Cake.jpeg",
    availability: true,
  },
  {
    name: "Coffee",
    description: "Freshly brewed premium coffee",
    price: 99,
    category: "beverages",
    image: "/images/Coffee.jpeg",
    availability: true,
  },
  {
    name: "Omelette",
    description: "Fluffy omelette with cheese and vegetables",
    price: 179,
    category: "breakfast",
    image: "/images/Omelette.jpeg",
    availability: true,
  },
  {
    name: "Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 89,
    category: "beverages",
    image: "/images/Orange_Juice.jpeg",
    availability: true,
  },
  {
    name: "Pancakes",
    description: "Fluffy pancakes served with maple syrup and butter",
    price: 159,
    category: "breakfast",
    image: "/images/Pancakes.jpeg",
    availability: true,
  },
  {
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta with creamy sauce, bacon, and parmesan",
    price: 279,
    category: "dinner",
    image: "/images/Spaghetti_Carbonara.jpeg",
    availability: true,
  },
];

const books = require("./seed/libraryCatalog");

const laundryItems = [
  {
    name: "T-Shirt",
    price: 20,
    category: "Clothing",
  },
  {
    name: "Jeans",
    price: 40,
    category: "Clothing",
  },
];

const rentalItems = [
  {
    title: "Projector",
    description: "HD Projector with HDMI input",
    price: 500,
    image: "https://example.com/projector.jpg",
    category: "Electronics",
    availability: true,
  },
  {
    title: "Tent",
    description: "4-person camping tent",
    price: 300,
    image: "https://example.com/tent.jpg",
    category: "Camping",
    availability: true,
  },
];

// Seed the database
async function seed() {
  try {
    // Clear existing data
    await Rental.deleteMany({});
    await LaundryItem.deleteMany({});
    await MenuItem.deleteMany({});
    await Book.deleteMany({});

    // Insert new data
    await Rental.insertMany(rentalItems);
    await LaundryItem.insertMany(laundryItems);
    await MenuItem.insertMany(menuItems);
    await Book.insertMany(books);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
