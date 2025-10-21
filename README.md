# 🎨 Deepak's 3-in-1 Portfolio

> **A revolutionary personal portfolio that adapts to three professional identities: Software Developer, Data Scientist, and UX/UI Designer**

---

## 🌟 **Features**

### **Interactive Role Selection**
- Dynamic landing page with 3 identity portals
- Role-adaptive UI themes and animations
- Personalized content based on selected role

### **Surreal Design Experience**
- Brutalist typography with soft gradients
- Floating modules and non-linear navigation
- Ambient animations using Framer Motion & GSAP
- Custom cursor and particle effects

### **Full-Stack Architecture**
- **Frontend:** React 19, Apollo Client, Framer Motion, GSAP
- **Backend:** Node.js, Express, Apollo GraphQL
- **Database:** MongoDB with Mongoose
- **Security:** Helmet.js, Rate Limiting, JWT Authentication

### **Content Management**
- Projects showcase (filtered by role)
- Testimonials system
- Blog platform
- Contact form with email notifications
- Newsletter subscription
- Admin panel (JWT protected)

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16+)
- MongoDB Account
- npm or yarn





## 📁 **Project Structure**

```
Portfolio/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Project.js
│   │   ├── Testimonial.js
│   │   ├── Contact.js
│   │   ├── Blog.js
│   │   └── Newsletter.js
│   ├── graphql/
│   │   ├── schema.js
│   │   └── resolvers.js
│   ├── middleware/
│   │   └── rateLimiter.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── apollo/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── LoadingScreen.js
│   │   ├── context/
│   │   │   └── PortfolioContext.js
│   │   ├── graphql/
│   │   │   └── queries.js
│   │   ├── pages/
│   │   │   ├── Landing.js
│   │   │   ├── Home.js
│   │   │   ├── Projects.js
│   │   │   ├── About.js
│   │   │   ├── Contact.js
│   │   │   ├── Blog.js
│   │   │   ├── BlogPost.js
│   │   │   └── Admin.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── package.json
│   └── .env
│
└── README.md
```

---






## 🔒 **Security Features**

- ✅ Helmet.js for HTTP headers security
- ✅ Rate limiting on API endpoints
- ✅ JWT authentication for admin routes
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Environment variables for secrets

---

## 🎨 **Design Philosophy**

This portfolio breaks traditional UI/UX norms:
- **Non-linear navigation** - Discover sections organically
- **Role-adaptive themes** - Each identity has unique visual language
- **Surreal animations** - Framer Motion & GSAP for immersive experiences
- **Emotional feedback** - UI reacts to user behavior

---

## 📊 **Tech Stack**

### **Frontend**
- React 19
- Apollo Client (GraphQL)
- Framer Motion (Animations)
- GSAP (Advanced animations)
- React Router v6
- React Toastify (Notifications)
- React Loading Skeleton

### **Backend**
- Node.js
- Express.js
- Apollo Server v4
- GraphQL
- Mongoose (MongoDB ODM)
- JWT (Authentication)
- Helmet.js (Security)
- Express Rate Limit

### **Database**
- MongoDB Atlas

---





## 👤 **Author**

**Kuruguntla Deepak Reddy**


---

## 🙏 **Acknowledgments**

- Design inspiration from brutalist web movement
- Animation techniques from Awwwards winners
- GraphQL best practices from Apollo documentation

---

**Made with ❤️ and lots of ☕**
