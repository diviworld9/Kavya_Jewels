# Kavya Jewels - E-Commerce Platform

Welcome to the Kavya Jewels E-Commerce platform. This is a premium frontend web application built to showcase and manage luxury jewelry.

## Tech Stack
- **HTML5**: Semantic structure.
- **Vanilla CSS3**: Styling, animations, layout (no external frameworks like Bootstrap or Tailwind, ensuring complete custom control).
- **Vanilla JavaScript**: State management, DOM manipulation, shopping cart logic, and admin panel logic.

## Features
- **Premium UI/UX**: Dark mode theme, glassmorphism, smooth animations.
- **Dynamic Shopping Cart**: Slide-out cart with real-time total calculations.
- **Admin Dashboard**: A hidden dashboard allowing the store owner to add products and change stock status.
- **Local Storage Database**: Data is saved directly to your browser's local storage. This allows data to persist across page reloads without a backend server.

## How to Use the Admin Panel
1. Click the **User Icon** in the top right header to open the Login modal.
2. Enter the password: `ADMIN_999` (Email can be anything).
3. The Admin Dashboard will open.
4. **Manage Products**: View the table of products, click "Toggle Status" to mark items as Out of Stock/In Stock.
5. **Add Products**: Click "Add New Product", fill out the form, upload an image from your computer, and save. The image is converted to Base64 and saved locally.

---

## TODO: Future Cloud Database Integration
Currently, the application relies on the browser's `localStorage` to simulate a database. This is great for a prototype, but for a real-world application, the following tasks must be completed:

- [ ] **Setup Cloud Database**: Integrate a cloud database (like Firebase Firestore, Supabase, or MongoDB) to store product details, pricing, and status centrally.
- [ ] **Cloud Storage for Images**: Move away from storing Base64 image strings in local storage (which is slow and limited in size). Integrate AWS S3, Cloudinary, or Firebase Storage to host uploaded product images.
- [ ] **Secure Authentication**: Replace the hardcoded `ADMIN_999` password with secure, token-based authentication (e.g., JWT, NextAuth, or Firebase Auth) for the admin dashboard.
- [ ] **REST/GraphQL API**: Build an API layer to handle requests between the frontend and the cloud database securely.
- [ ] **Deployment**: Deploy the static frontend to a service like Vercel, Netlify, or GitHub Pages.
