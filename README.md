Carolinian Accommodation App
The Carolinian Accommodation App is a digital platform designed to assist Carolinians in navigating university life. It offers features that provide information about the university's ins and outs, helping users feel right at home.

Features
University Information: Access comprehensive details about university facilities, services, and events.

Accommodation Listings: Browse and manage accommodation options suitable for students.

User Profiles: Create and manage personal profiles to personalize the user experience.

Interactive Map: Navigate the campus with an integrated map highlighting key locations.

Notifications: Receive timely updates about university announcements and events.

Technologies Used
Next.js: Framework for server-rendered React applications.

Prisma: Next-generation ORM for Node.js and TypeScript.

Tailwind CSS: Utility-first CSS framework for rapid UI development.

PostgreSQL: Relational database for storing application data.

Getting Started
Prerequisites
Node.js (v14 or later)

npm or yarn

PostgreSQL database

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/conradshun/Carolinian-Accomodation-App.git
cd Carolinian-Accomodation-App
Install dependencies:

bash
Copy
Edit
npm install
# or
yarn install
Set up environment variables:
Create a .env file in the root directory and add your database connection string:

env
Copy
Edit
DATABASE_URL="your_postgresql_connection_string"
Run database migrations:

bash
Copy
Edit
npx prisma migrate dev --name init
Start the development server:

bash
Copy
Edit
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to view the application.

Project Structure
/src - Main application source code.

/prisma - Prisma schema and migrations.

/assets - Static assets such as images and icons.

/public - Publicly accessible files.

/styles - Global and component-specific styles.

Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

License
This project is licensed under the MIT License. See the LICENSE file for details.
