# B Airways - Your Journey Starts Here

This is a Next.js project for B Airways, an airline booking and management system.

## Project Overview

B Airways is a comprehensive web application that allows users to search for flights, book tickets, manage passenger details, and more. The project is built using Next.js, React, and integrates with a MySQL database for data management.

## Features

- Flight search functionality
- Passenger information management
- User authentication (Sign up and Sign in)
- Responsive design for various devices
- Integration with MySQL database

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET_KEY=your_jwt_secret_key
   SMTP_SERVER_USERNAME=your_smtp_username
   SMTP_SERVER_PASSWORD=your_smtp_password 
   SMTP_SERVER_HOST=your_smtp_host
   SITE_MAIL_RECEIVER=your_site_email
   GEMINI_API_KEY=your_gemini_api_key

   ```

4. **Run the development server and Python server:**
   ```bash
   # Start Next.js development server
   npm run dev

   # In a separate terminal, start the Python server
   python "app/utils/Services/python_backend/chatbot.py"
   ```

5. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.**

## Project Structure

- `app/`: Contains the main application code
  - `api/`: API routes for authentication and other functionalities
  - `components/`: Reusable React components
  - `context/`: React Context for global state management
  - `lib/`: Utility functions and database connection
  - `layout.tsx`: Root layout component
  - `page.js`: Main page component
- `public/`: Static assets

## Technologies Used

### Frontend
- Next.js 14 (App Router)
- React 18
- TailwindCSS

### Backend
- Python (FastAPI)
- MySQL
- JSON Web Tokens (JWT)

### AI/ML
- Google Gemini API

### Development Tools
- TypeScript

## Contributing

Contributions to improve B Airways are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any queries regarding this project, please contact the development team.

---

Happy coding and smooth flights with B Airways!