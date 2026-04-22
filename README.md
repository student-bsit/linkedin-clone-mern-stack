# 🔗 LinkedIn Clone (MERN Stack + Socket.IO)

A full-stack LinkedIn-inspired social media platform built using the MERN stack. It includes real-time features, user connections, posts, likes, and comments similar to LinkedIn.

---

## 🚀 Features

### 👤 User Features
- User authentication (Signup / Login)
- Create and edit profile
- Upload profile picture
- Create posts (text + images)
- Like and comment on posts
- Send connection requests
- Accept / reject connections
- View other user profiles

### ⚡ Real-Time Features
- Real-time connection updates using Socket.IO
- Instant post interactions (likes/comments updates)
- Live notifications (if implemented)

---

## 🧑‍💻 Tech Stack

**Frontend:**
- React.js
- Redux / Context API
- Tailwind CSS / CSS

**Backend:**
- Node.js
- Express.js
- Socket.IO

**Database:**
- MongoDB

**Authentication:**
- JWT (JSON Web Token)

**File Uploads:**
- Cloudinary / Multer

---

## 📂 Project Structure

git clone https://github.com/student-bsit/linkedin-clone-mern-stack.git
cd linkedin-clone

2️⃣ Setup Backend
```bash
cd backend
npm install

Create .env file in /backend:

PORT=8000
MONGODB_URL=mongodb+srv://ahteshamrauf9_db_user:shami123@cluster0.lapyvzg.mongodb.net/Linkedin
NODE_ENVIRONMENT=development
JWT_SECRET=1uuueyyyyy34
CLOUDINARY_CLOUD_NAME=do0x7qgxt
CLOUDINARY_API_KEY=361532463871536
CLOUDINARY_API_SECRET=oc_pbKKa2Gze7epLQlGQhC9VK0A

Run backend:
npm run dev

3️⃣ Setup Frontend

cd frontend
npm install
npm start

🔥 Key Features Explained
🔗 Connection System
Users can send connection requests
Accept / reject system
Mutual connections stored in database
💬 Post System
Create posts with text/images
Like and comment functionality
Real-time updates via Socket.IO
⚡ Real-Time Updates
Instant UI updates without refresh
Socket-based event handling


Home Feed
Profile Page
Connections Page
Post Interaction
🎯 Future Improvements
Messaging system (chat feature)
Job posting feature
Notification system
Resume upload
Advanced search filters
Dark mode


Contact
Name: Muhammad Ahtesham
Email: ahteshamrauf9@email.com

/frontend   -> React frontend (UI)
/backend    -> Node.js + Express + API + Socket.IO
