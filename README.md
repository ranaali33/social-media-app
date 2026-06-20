# 🌐 SocialPulse - Full-Stack Social Media Platform

SocialPulse is a lightweight, responsive full-stack social media dashboard application. It implements a complete relational MVC architecture to handle user networking, real-time post publication, interactive liking systems, and dynamic follower metrics.

## 🚀 Core Feature Sequence

- **👤 User Profiles:** Secure user registration and login pipeline linking accounts dynamically.
- **📝 Posts & Comments:** Clean dashboard interface enabling users to publish thoughts and query conversational flows.
- **🤝 Like/Follow System:** Interactive endpoints to toggle post interactions and manage follower/following relationships instantly without page refreshes.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Modern Flexbox/Grid layout), Vanilla JavaScript (Asynchronous Fetch API)
- **Backend:** Node.js, Express.js (RESTful API Router pattern)
- **Database:** MongoDB Atlas via Mongoose ODM (Object Document Mapping)

---

## 📂 Project Structure

```text
📁 SOCIAL-MEDIA-APP
├── 📁 models/              # Mongoose Data Schemas (User, Post, Comment, Follower)
├── 📁 public/              # Static Frontend Interface (HTML, CSS, App Engine)
├── 📁 routes/              # Express API Controller Enclaves
├── 📄 .env                 # Environment Configuration Variables (Ignored by Git)
├── 📄 .gitignore           # Version Control Target Exclusion Shield
├── 📄 server.js            # Express Engine App Entry Point
└── 📄 package.json         # Node Dependencies & Custom Initialization Scripts