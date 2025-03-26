# **InkSpire – A Secure and User-Friendly Blogging Platform**

InkSpire is an intuitive and secure blogging web application designed to empower users to create, edit, and share their thoughts effortlessly. With a focus on user experience and security, InkSpire ensures seamless content management while keeping user data protected with **Clerk-powered authentication** and **JWT-based authorization**.

---

## **Features**
✔️ **Secure Authentication** – Powered by **Clerk**, InkSpire offers a hassle-free and secure authentication system with login, signup, and session management. JWT (JSON Web Token) is used for secure authorization.
✔️ **Create & Manage Blogs** – Users can effortlessly **write, edit, delete, and manage** their blog posts with a simple and intuitive interface.
✔️ **Responsive UI** – A well-designed, mobile-friendly interface that provides a **smooth reading and writing experience** across all devices.
✔️ **Robust Tech Stack** – Built using **React, Node.js, Express, and MongoDB**, ensuring a scalable and high-performance platform.

---

## **Tech Stack**
- **Frontend**: React, Clerk Authentication, TailwindCSS
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB
- **Deployment**: Netlify (Frontend), Render (Backend)

---

## **Installation and Setup**

### **Prerequisites**
- Node.js installed
- MongoDB setup (local or cloud)
- Clerk API key (for authentication management)

### **Clone the Repository**
```sh
git clone https://github.com/yourusername/inkspire.git
cd inkspire
```

### **Backend Setup**
1. Navigate to the `backend` folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### **Frontend Setup**
1. Navigate to the `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and add the following:
   ```env
   REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
4. Start the frontend:
   ```sh
   npm start
   ```

---

## **Usage**
1. Register or log in to your account using Clerk authentication.
2. Create, edit, or delete blog posts effortlessly.
3. Browse and read blogs with a responsive UI.
4. Securely manage your content with JWT-based authentication.

---

## **Contributing**
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added a new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request

---

## **Contact**
For any queries or collaboration, feel free to reach out:
- **Email**: srikarjanjirala92@gmail.com
- **GitHub**: [janjirala-srikar](https://github.com/janjirala-srikar)
- **LinkedIn**: [srikar_janjirala](https://linkedin.com/in/srikar-janjirala)

Happy Blogging! 🚀

