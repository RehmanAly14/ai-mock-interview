# AI Mock Interview Platform

An intelligent, interactive platform that conducts mock interviews using Google's Generative AI (Gemini). It helps job seekers practice for interviews by generating role-specific questions, evaluating their answers, and providing actionable feedback.

---

# 🚀 Features

## AI-Powered Mock Interviews

* Generates tailored interview questions based on the selected role and difficulty using Google Gemini.
* Provides realistic interview simulations for different job domains.

## Real-Time Evaluation

* Analyzes user answers instantly.
* Provides:

  * Overall score
  * Strengths
  * Areas for improvement
  * Suggested ideal answer

## Comprehensive Dashboard

* Displays previous interview sessions.
* Tracks performance and improvement over time.
* Includes interactive analytics and Skills Radar charts.

## Export & Share

* Generate and download:

  * PDF interview reports
  * Completion certificates
* Share interview results publicly using:

  * Unique shareable links
  * QR codes

## Authentication & Security

* Secure authentication using NextAuth.
* Password hashing with bcryptjs.
* Protected user sessions.

---

# 🛠️ Tech Stack & Libraries

## Frontend

### Framework

* Next.js 16 (App Router)

### UI Library

* React 19

### Styling

* Tailwind CSS v4

### Icons

* Lucide React

### Charts & Analytics

* Recharts

### Forms & Validation

* React Hook Form
* Zod

### Animations

* @lottiefiles/dotlottie-react

### PDF Generation

* jspdf
* html2canvas-pro

### QR Code Generation

* qrcode.react

---

## Backend & Database

### API Layer

* Next.js Server Actions
* API Routes

### Database

* PostgreSQL

### ORM

* Prisma
* @prisma/client
* @prisma/adapter-pg

### Authentication

* NextAuth.js v4
* Credentials Provider
* bcryptjs

### AI Integration

* Google Gemini AI
* @google/genai
* @google/generative-ai

---

# 🏗️ Project Architecture & Workflow

## 1. Database Schema (Prisma)

### User

Stores:

* User credentials
* Authentication details
* Profile information

### InterviewSession

Tracks:

* Interview role
* Difficulty level
* Session status
* Public sharing slug

### Question

Stores AI-generated interview questions linked to a session.

### Answer

Stores user-submitted responses.

### Feedback

Contains AI evaluation including:

* Score
* Strengths
* Areas for improvement
* Improved answer suggestion

---

# 🔄 Application Flow

## Step 1: Onboarding

Users visit the homepage and can:

* Register
* Login

Routes:

* `app/page.tsx`
* `app/register`
* `app/login`

---

## Step 2: Dashboard

After authentication, users access the dashboard where they can:

* View analytics
* Track progress
* See previous interviews
* Start new interview sessions

Route:

* `app/dashboard`

---

## Step 3: Interview Setup

Users select:

* Target role
* Difficulty level

Route:

* `app/interview`

---

## Step 4: Question Generation

Backend logic sends prompts to Gemini AI to generate interview questions.

Core File:

* `lib/generate-questions.ts`

---

## Step 5: Answer Evaluation

1. User submits answer.
2. Backend sends:

   * Question
   * User answer
     to Gemini AI.
3. Gemini returns structured feedback.
4. Feedback is stored in the database.

Core File:

* `lib/evaluate-answer.ts`

---

## Step 6: Review & Export

Users can:

* Review detailed feedback
* View Skills Radar charts
* Export reports as PDF
* Generate certificates

---

## Step 7: Public Sharing

Users can enable public visibility for interview sessions.

Features:

* Unique shareable URL
* QR code sharing

Field:

* `shareSlug`

---

# ⚙️ Getting Started

## Prerequisites

* Node.js v18+
* PostgreSQL Database
* Google Gemini API Key

---

# 📦 Installation Guide

## 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-mock-interview
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_mock_db"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-google-gemini-api-key"
```

---

## 4. Initialize Database

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

---

## 5. Start Development Server

```bash
npm run dev
```

---

## 6. Open Application

Visit:

```bash
http://localhost:3000
```

---

# 📁 Directory Structure

```bash
/app
/components
/lib
/prisma
/public
/types
```

## Folder Details

### `/app`

Contains:

* App Router pages
* Dashboard
* Authentication pages
* Interview pages
* API routes

### `/components`

Reusable UI components:

* Navbar
* Footer
* Charts
* Buttons
* PDF export components

### `/lib`

Core business logic:

* Gemini API wrappers
* Authentication config
* Database utilities
* Evaluation logic

Files:

* `gemini.ts`
* `evaluate-answer.ts`
* `generate-questions.ts`

### `/prisma`

Database schema and migrations.

### `/public`

Static assets:

* Images
* Icons
* Logos

### `/types`

Custom TypeScript type definitions.

---

# 🌟 Key Highlights

* AI-driven interview preparation platform
* Real-time answer analysis
* Performance tracking dashboard
* PDF report generation
* Completion certificates
* Public sharing support
* Secure authentication system
* Modern scalable architecture using Next.js + Prisma + PostgreSQL

---

# 🔮 Future Improvements

* Voice-based interview support
* Webcam-based mock interviews
* Multi-language interview support
* Company-specific interview preparation
* AI-powered resume analysis
* Real-time coding interview environment
* Leaderboards and community challenges

---

# 📌 Conclusion

The AI Mock Interview Platform is designed to help students and professionals improve their interview skills through AI-powered simulations, instant feedback, analytics, and personalized improvement suggestions. The project demonstrates modern full-stack development using Next.js, Prisma, PostgreSQL, and Google Gemini AI while focusing on scalability, user experience, and real-world interview preparation.
