# Carolinian Accommodation App

## Overview

The Carolinian Accommodation App is a comprehensive platform designed to help students and visitors find the best places around campus. Whether you're looking for food options, leisure activities, or essential services, this application provides an intuitive interface to discover, explore, and save your favorite locations.

![Carolinian Accommodation App Screenshot](USCtulToolhomepage.png)

## Features

### General Features
- **Modern, Responsive UI**: Beautifully designed interface that works on all devices
- **Favorites System**: Save your favorite places for quick access
- **Search Functionality**: Find places by name or tags
- **Detailed Information**: View comprehensive details about each location
- **Interactive Elements**: Engaging animations and intuitive controls

### Category-Specific Features
- **Food Places**: Browse restaurants, cafes, and eateries around campus
- **Leisure Places**: Discover recreational activities and relaxation spots
- **Service Places**: Find essential services and amenities

## Technologies Used

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **localStorage API**: For client-side storage of favorites

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Prisma**: ORM for database access
- **MySQL**: Relational database for data storage

## Installation and Setup

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MySQL database

### Step 1: Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/carolinian-accommodation-app.git
cd carolinian-accommodation-app
\`\`\`

### Step 2: Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory with the following variables:
\`\`\`
DATABASE_URL="mysql://username:password@localhost:3306/carolinian_app"
\`\`\`

### Step 4: Set Up the Database
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### Step 5: Seed the Database (Optional)
\`\`\`bash
npm run seed
# or
yarn seed
\`\`\`

### Step 6: Run the Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

The application will be available at `http://localhost:3000`.

## Project Structure

\`\`\`
carolinian-accommodation-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── food_items/       # Food items API endpoints
│   │   ├── leisure_items/    # Leisure items API endpoints
│   │   └── service_items/    # Service items API endpoints
│   ├── components/           # React components
│   ├── food_places/          # Food places pages
│   ├── leisure_places/       # Leisure places pages
│   ├── service_places/       # Service places pages
│   ├── globals.css           # Global styles
│   ├── layout.js             # Root layout
│   └── page.js               # Home page
├── prisma/                   # Prisma schema and migrations
├── public/                   # Static assets
├── scripts/                  # Utility scripts
├── .env                      # Environment variables
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # Project documentation
\`\`\`

## API Endpoints

### Food Items

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/food_items` | GET | Get all food items |
| `/api/food_items` | POST | Create a new food item |
| `/api/food_items/:id` | GET | Get a specific food item |
| `/api/food_items/:id` | DELETE | Delete a food item |
| `/api/food_items/tags` | GET | Get all tags for food items |
| `/api/food_items/tags` | POST | Create a new tag |
| `/api/food_items/tags/:id` | GET | Get food items with a specific tag |
| `/api/food_items/tags/:id` | DELETE | Delete a tag |
| `/api/food_items/addTag/:id` | POST | Add a tag to a food item |

### Leisure Items

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leisure_items` | GET | Get all leisure items |
| `/api/leisure_items` | POST | Create a new leisure item |
| `/api/leisure_items/:id` | GET | Get a specific leisure item |
| `/api/leisure_items/:id` | DELETE | Delete a leisure item |

### Service Items

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/service_items` | GET | Get all service items |
| `/api/service_items` | POST | Create a new service item |
| `/api/service_items/:id` | GET | Get a specific service item |
| `/api/service_items/:id` | DELETE | Delete a service item |

## Database Schema

### Food Items
- `id`: Integer (Primary Key)
- `name`: String
- `description`: String (Optional)
- `price`: Float (Optional)
- `image`: Bytes (Optional)
- `directionLink`: String (Optional)
- `openHours`: String (Optional)

### Leisure Items
- `id`: Integer (Primary Key)
- `name`: String
- `description`: String (Optional)
- `price`: Float (Optional)
- `image`: Bytes (Optional)
- `directionLink`: String (Optional)
- `openHours`: String (Optional)

### Service Items
- `id`: Integer (Primary Key)
- `name`: String
- `description`: String (Optional)
- `price`: Float (Optional)
- `image`: Bytes (Optional)
- `directionLink`: String (Optional)
- `openHours`: String (Optional)

### Tags
- `id`: Integer (Primary Key)
- `name`: String

### Relationships
- FoodItemTag: Many-to-many relationship between Food Items and Tags
- LeisureItemTag: Many-to-many relationship between Leisure Items and Tags
- ServiceItemTag: Many-to-many relationship between Service Items and Tags

## Usage Guide

### Home Page
The home page provides an overview of the application with quick access to all categories:
- Food Places
- Leisure Places
- Service Places

### Browsing Items
1. Click on any category to view all items in that category
2. Use the search bar to find specific items by name
3. Use the tag search to find items with specific tags
4. Toggle the "Show Favorites" button to view only your favorite items

### Item Details
Click on any item to view detailed information:
- Name and description
- Price (if applicable)
- Opening hours
- Direction link
- Associated tags

### Managing Favorites
- Click the heart icon on any item to add it to your favorites
- Click the heart icon again to remove it from your favorites
- Use the "Show Favorites" toggle to filter and view only your favorite items

## Contributing

We welcome contributions to the Carolinian Accommodation App! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- University of San Carlos for supporting this project
- All contributors who have helped build and improve this application (Rafiq Esler and Enzo Basuil)
- The open-source community for providing the tools and libraries used in this project
