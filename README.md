# Sternguard RBAC System

**Sternguard** is a Node.js-based Role-Based Access Control (RBAC) system.
It demonstrates a **scalable and secure approach** for managing users, roles, and permissions in web applications, using **Express**, **MongoDB**, and **JWT authentication**.

---

## 🔹 Features

* User authentication with **JWT tokens**
* Role-based and permission-based access control
* Modular folder structure for scalability
* MongoDB integration via **Mongoose**
* Example protected route (`/get`) accessible only by users with the proper permissions
* Easy to extend with additional roles and permissions

---

## 📂 Project Structure

```
sternguard-rbac/
├── server.js                 # Entry point
├── package.json
├── .env                      # Environment variables (not committed)
├── src/
│   ├── app.js                # Express app setup
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   └── userController.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── rbacMiddleware.js
│   └── models/
│       ├── user.js
│       ├── role.js
│       └── permission.js
├── scripts/
│   └── seed.js               # Seeds initial users, roles, and permissions
└── .gitignore
```

---

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/MehrozMustafa/sternguard-rbac.git
cd sternguard-rbac
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with:

```
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://127.0.0.1:27017/sternguard
```

4. Seed the database with example users, roles, and permissions:

```bash
node scripts/seed.js
```

5. Start the server:

```bash
node server.js
```

Server runs at `http://localhost:5000`.

---

## 🚀 API Endpoints

### 1. **Login**

**POST** `/api/login`

**Body:**

```json
{
  "email": "mehroz@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "<JWT_TOKEN>"
}
```

### 2. **Get Protected Route**

**GET** `/api/get`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

```
mehroz
```

Only users with the `read:any_user` permission (assigned via roles) can access this route.

---

## 🔒 Security Notes

* Passwords should be hashed in production using **bcrypt**.
* JWT tokens should use a strong secret (`JWT_SECRET`) stored securely.
* Permissions allow fine-grained control over route access, scalable to large applications.

---

## 💡 Contribution

Feel free to fork this repository and extend it:

* Add new roles and permissions
* Implement password hashing and registration
* Add more protected routes with permission checks

---

## 📄 License

MIT License
