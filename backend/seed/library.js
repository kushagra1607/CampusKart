const mongoose = require("mongoose");
const { Book } = require("../models/Library");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/campuskart", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const seedLibrary = async () => {
  await connectDB();

  const books = [
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "9780262033848",
      category: "academic",
      description:
        "A comprehensive introduction to algorithms and data structures.",
      location: "Shelf A1",
      totalCopies: 5,
      availableCopies: 5,
    },
    {
      title: "National Geographic",
      author: "National Geographic Society",
      isbn: "9781426217781",
      category: "periodical",
      description:
        "A stunning collection of photography and stories from around the world.",
      location: "Shelf B2",
      totalCopies: 3,
      availableCopies: 3,
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      isbn: "9780062316097",
      category: "non-fiction",
      description:
        "A thought-provoking journey through the history of humankind.",
      location: "Shelf C3",
      totalCopies: 4,
      availableCopies: 4,
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      category: "fiction",
      description: "A classic novel of the Jazz Age and the American dream.",
      location: "Shelf D4",
      totalCopies: 6,
      availableCopies: 6,
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "9780553380163",
      category: "academic",
      description:
        "An exploration of the universe by one of the greatest minds of our time.",
      location: "Shelf E5",
      totalCopies: 2,
      availableCopies: 2,
    },
  ];

  try {
    console.log("Inserting books into the database...");
    await Book.insertMany(books);
    console.log("Books inserted successfully:", books);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding library:", error);
    process.exit(1);
  }
};

seedLibrary();
