# Smart Food Distribution System 🍱

A full-stack web application that connects **Donors, NGOs, Volunteers, and Admins** to manage food donations and distribution efficiently.

The platform helps reduce food waste by making it easier to donate, request, collect, and distribute surplus food.

## Features

### Donor

* Register and manage profile
* Add food donations
* Manage donations
* Track donation status

### NGO

* Manage organization profile
* View available food donations
* Request food
* Track food requests
* View received donations

### Volunteer

* View assigned delivery tasks
* Manage pickup and delivery
* Update delivery status
* Track assigned distributions

### Admin

* Manage users
* Manage donors, NGOs, and volunteers
* Manage food donations
* Monitor food distribution
* Manage the overall platform

## Tech Stack

* **Next.js**
* **TypeScript**
* **React**
* **Tailwind CSS**
* **Prisma ORM**
* **PostgreSQL**
* **Vercel**
* **Git & GitHub**

## How It Works

```text
Donor
  │
  │ Donate Food
  ▼
Smart Food Distribution System
  │
  │ Request Food
  ▼
NGO
  │
  │ Assign Delivery
  ▼
Volunteer
  │
  │ Deliver Food
  ▼
People in Need

Admin
  │
  └── Manage & Monitor System
```

## Project Structure

```text
smart-food-distribution/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── src/
│   ├── app/
│   ├── components/
│   └── ...
│
├── .env
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

* Node.js
* npm
* PostgreSQL

### Clone the Repository

```bash
git clone https://github.com/SahilMiya12/smart-food-distribution.git
```

### Navigate to the Project

```bash
cd smart-food-distribution
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your_postgresql_database_url"
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migration

```bash
npx prisma migrate dev
```

### Start the Development Server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Live Demo

https://smart-food-distribution.vercel.app/

## GitHub Repository

https://github.com/SahilMiya12/smart-food-distribution

## Future Improvements

* AI-powered food matching
* Location-based donor and NGO matching
* Food expiry notifications
* Real-time delivery tracking
* Analytics and reporting
* Food demand prediction
* Mobile application
* Real-time notifications

## Author

**Sahil Miya**

GitHub: https://github.com/SahilMiya12

---

⭐ If you find this project useful, consider giving it a star.
