const mongoose = require("mongoose");
const { MenuItem } = require("../models/Restaurant"); // Corrected the model import

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/campuskart", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const seedRestaurant = async () => {
  await connectDB(); // Ensure database connection before seeding

  const menuItems = [
    {
      name: "Margherita Pizza",
      description: "Classic pizza with fresh tomatoes, mozzarella, and basil.",
      price: 8.99,
      image: "/images/Margherita_Pizza.jpeg",
      category: "lunch",
      availability: true,
    },
    {
      name: "Cheeseburger",
      description: "Juicy beef patty with cheddar cheese, lettuce, and tomato.",
      price: 6.99,
      image: "/images/Cheeseburger.jpeg",
      category: "lunch",
      availability: true,
    },
    {
      name: "Caesar Salad",
      description:
        "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan.",
      price: 5.99,
      image: "/images/Caesar_Salad.jpeg",
      category: "snacks",
      availability: true,
    },
    {
      name: "Spaghetti Carbonara",
      description:
        "Classic Italian pasta with creamy sauce, pancetta, and parmesan.",
      price: 10.99,
      image: "/images/Spaghetti_Carbonara.jpeg",
      category: "dinner",
      availability: true,
    },
    {
      name: "Chocolate Cake",
      description:
        "Rich and moist chocolate cake with a creamy chocolate frosting.",
      price: 4.99,
      image: "/images/Chocolate_Cake.jpeg",
      category: "snacks",
      availability: true,
    },
    {
      name: "Pancakes",
      description: "Fluffy pancakes served with maple syrup and butter.",
      price: 4.99,
      image: "/images/Pancakes.jpeg",
      category: "breakfast",
      availability: true,
    },
    {
      name: "Omelette",
      description: "Three-egg omelette with cheese, tomatoes, and onions.",
      price: 3.99,
      image: "/images/Omelette.jpeg",
      category: "breakfast",
      availability: true,
    },
    {
      name: "Orange Juice",
      description: "Freshly squeezed orange juice.",
      price: 2.99,
      image: "/images/Orange_Juice.jpeg",
      category: "beverages",
      availability: true,
    },
    {
      name: "Coffee",
      description: "Hot brewed coffee with a rich aroma.",
      price: 1.99,
      image: "/images/Coffee.jpeg",
      category: "beverages",
      availability: true,
    },
  ];

  try {
    console.log("Inserting menu items into the database...");
    await MenuItem.insertMany(menuItems); // Corrected the model usage
    console.log("Menu items inserted successfully:", menuItems);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding restaurant menu:", error);
    process.exit(1);
  }
};

seedRestaurant();
