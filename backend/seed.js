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

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "fiction",
    description:
      "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    totalCopies: 5,
    availableCopies: 5,
    image: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
    isbn: "9780743273565",
    location: "Section A, Shelf 2",
    ebookUrl: "https://www.gutenberg.org/files/64317/64317-h/64317-h.htm",
    genre: "Classic"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "fiction",
    description:
      "The story of racial injustice and the loss of innocence in the American South.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
    isbn: "9780061120084",
    location: "Section A, Shelf 3",
    ebookUrl: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
    genre: "Classic"
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "fiction",
    description: "A dystopian novel set in a totalitarian society where independent thinking is a crime.",
    totalCopies: 4,
    availableCopies: 4,
    image: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    isbn: "9780451524935",
    location: "Section A, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/files/1984/1984-h/1984-h.htm",
    genre: "Dystopian"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "fiction",
    description: "A romantic novel that follows the emotional development of Elizabeth Bennet.",
    totalCopies: 4,
    availableCopies: 4,
    image: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
    isbn: "9780141439518",
    location: "Section A, Shelf 2",
    ebookUrl: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
    genre: "Romance"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "fiction",
    description: "The adventure of Bilbo Baggins as he journeys to the Lonely Mountain with a group of dwarves.",
    totalCopies: 5,
    availableCopies: 5,
    image: "https://covers.openlibrary.org/b/isbn/9780618260300-L.jpg",
    isbn: "9780618260300",
    location: "Section A, Shelf 2",
    ebookUrl: "https://www.gutenberg.org/ebooks/29728",
    genre: "Fantasy"
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "non-fiction",
    description: "A survey of the history of humankind from the evolution of Homo sapiens to the present day.",
    totalCopies: 4,
    availableCopies: 4,
    image: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    isbn: "9780062316097",
    location: "Section B, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/45175",
    genre: "Anthropology"
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "science",
    description: "A book on theoretical cosmology that attempts to explain a range of subjects in cosmology.",
    totalCopies: 4,
    availableCopies: 4,
    image: "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg",
    isbn: "9780553380163",
    location: "Section C, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/60727",
    genre: "Physics"
  },
  {
    title: "The Origin of Species",
    author: "Charles Darwin",
    category: "science",
    description: "The foundation of evolutionary biology, explaining Darwin's theory of evolution by natural selection.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780451529060-L.jpg",
    isbn: "9780451529060",
    location: "Section C, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/files/1228/1228-h/1228-h.htm",
    genre: "Biology"
  },
  {
    title: "Cosmos",
    author: "Carl Sagan",
    category: "science",
    description: "A popular science book that explores the universe and humanity's place within it.",
    totalCopies: 4,
    availableCopies: 4,
    image: "https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg",
    isbn: "9780345539434",
    location: "Section C, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/62244",
    genre: "Astronomy"
  },
  {
    title: "The Guns of August",
    author: "Barbara W. Tuchman",
    category: "history",
    description: "A detailed account of the first month of World War I, from the assassination of Archduke Franz Ferdinand to the beginning of trench warfare.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780345476098-L.jpg",
    isbn: "9780345476098",
    location: "Section D, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/62131",
    genre: "Military History"
  },
  {
    title: "The Rise and Fall of the Third Reich",
    author: "William L. Shirer",
    category: "history",
    description: "A comprehensive historical account of Nazi Germany.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780671728687-L.jpg",
    isbn: "9780671728687",
    location: "Section D, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/62241",
    genre: "World War II"
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    category: "biography",
    description: "The authorized biography of Apple founder Steve Jobs.",
    totalCopies: 4,
    availableCopies: 4,
    image: "https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg",
    isbn: "9781451648539",
    location: "Section E, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/62249",
    genre: "Business"
  },
  {
    title: "Einstein: His Life and Universe",
    author: "Walter Isaacson",
    category: "biography",
    description: "A biography of physicist Albert Einstein, exploring both his personal and scientific life.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780743264747-L.jpg",
    isbn: "9780743264747",
    location: "Section E, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/61842",
    genre: "Science Biography"
  },
  {
    title: "Code: The Hidden Language of Computer Hardware and Software",
    author: "Charles Petzold",
    category: "technology",
    description: "A book that explains the inner workings of computers using everyday examples.",
    totalCopies: 4,
    availableCopies: 4,
    image: "https://covers.openlibrary.org/b/isbn/9780735611313-L.jpg",
    isbn: "9780735611313",
    location: "Section F, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/61782",
    genre: "Computer Science"
  },
  {
    title: "The Innovators",
    author: "Walter Isaacson",
    category: "technology",
    description: "A history of the pioneers of computer science and digital innovation.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9781476708706-L.jpg",
    isbn: "9781476708706",
    location: "Section F, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/62247",
    genre: "Technology History"
  },
  {
    title: "The Story of Art",
    author: "E.H. Gombrich",
    category: "art",
    description: "One of the most famous and popular books on art ever written.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780714832470-L.jpg",
    isbn: "9780714832470",
    location: "Section G, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/59580",
    genre: "Art History"
  },
  {
    title: "Ways of Seeing",
    author: "John Berger",
    category: "art",
    description: "A study of how we look at art, based on the BBC television series.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780140135152-L.jpg",
    isbn: "9780140135152",
    location: "Section G, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/61865",
    genre: "Art Criticism"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "fiction",
    description: "The story of Holden Caulfield, a teenage boy who struggles with alienation and loss of innocence.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg",
    isbn: "9780316769488",
    location: "Section A, Shelf 1",
    ebookUrl: "https://www.gutenberg.org/ebooks/67426",
    genre: "Coming-of-age"
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "fiction",
    description: "A dystopian novel set in a futuristic World State of genetically modified citizens.",
    totalCopies: 3,
    availableCopies: 3,
    image: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg",
    isbn: "9780060850524",
    location: "Section A, Shelf 2",
    ebookUrl: "https://www.gutenberg.org/ebooks/63986",
    genre: "Dystopian"
  }
];

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
