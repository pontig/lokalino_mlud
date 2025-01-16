<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo '[
  {
    "id": "1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "price": 9.99,
    "description":
      "A story of decadence and excess, Gatsby explores the darker aspects of the American Dream."
  },
  {
    "id": "2",
    "title": "1984",
    "author": "George Orwell",
    "price": 12.99,
    "description":
      "A dystopian social science fiction novel and cautionary tale about totalitarianism."
  },
  {
    "id": "3",
    "title": "Pride and Prejudice",
    "author": "Jane Austen",
    "price": 7.99,
    "description":
      "A romantic novel of manners. The story follows the main character Elizabeth Bennet."
  },
  {
    "id": "4",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "price": 11.99,
    "description":
      "A story that explores human behavior and the collective conscience of The Deep South."
  },
  {
    "id": "5",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "price": 14.99,
    "description":
      "A fantasy novel about the adventures of hobbit Bilbo Baggins."
  },
  {
    "id": "6",
    "title": "Dune",
    "author": "Frank Herbert",
    "price": 13.99,
    "description":
      "A science fiction novel about the desert planet Arrakis and its native spice melange."
  },
  {
    "id": "7",
    "title": "Moby-Dick",
    "author": "Herman Melville",
    "price": 10.99,
    "description":
      "A thrilling tale of obsession and revenge between Captain Ahab and the white whale."
  },
  {
    "id": "8",
    "title": "Brave New World",
    "author": "Aldous Huxley",
    "price": 9.49,
    "description":
      "A dystopian novel that explores a technologically advanced society with deep moral implications."
  },
  {
    "id": "9",
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "price": 8.99,
    "description":
      "A story about teenage angst and rebellion, told through the eyes of Holden Caulfield."
  },
  {
    "id": "10",
    "title": "Jane Eyre",
    "author": "Charlotte Brontë",
    "price": 11.49,
    "description":
      "A Gothic novel about the life and struggles of the orphaned protagonist, Jane Eyre."
  },
  {
    "id": "11",
    "title": "The Alchemist",
    "author": "Paulo Coelho",
    "price": 9.99,
    "description":
      "An inspiring story about a shepherd\'s journey to pursue his personal legend."
  },
  {
    "id": "12",
    "title": "War and Peace",
    "author": "Leo Tolstoy",
    "price": 19.99,
    "description":
      "An epic novel that intertwines the lives of multiple families during the Napoleonic Wars."
  }
]';