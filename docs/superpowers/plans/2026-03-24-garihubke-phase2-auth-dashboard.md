# GariHub Phase 2: User Authentication & Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add user authentication (email/password + Google) and personal dashboard with profile management and favorites sync.

**Architecture:** NextAuth.js v5 with Prisma ORM, PostgreSQL database (Supabase), Zod for validation, bcrypt for password hashing.

**Tech Stack:** Next.js 14, NextAuth.js v5, Prisma, PostgreSQL (Supabase), Zod, bcryptjs, Tailwind CSS

---

## File Structure

```
garihubke/
├── prisma/
│   └── schema.prisma          # Database schema
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts  # NextAuth handler
│   │   ├── register/
│   │   │   └── route.ts      # Registration endpoint
│   │   └── favorites/
│   │       ├── route.ts      # Get/Add favorites
│   │       └── sync/
│   │           └── route.ts  # Sync favorites
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── register/
│   │   └── page.tsx          # Register page
│   └── dashboard/
│       ├── layout.tsx        # Dashboard layout with sidebar
│       └── page.tsx          # Dashboard main page
├── components/
│   ├── auth/
│   │   ├── AuthForm.tsx     # Login/Register form
│   │   └── PasswordInput.tsx # Password with toggle
│   ├── dashboard/
│   │   ├── Sidebar.tsx       # Dashboard navigation
│   │   ├── ProfileForm.tsx   # Profile editing
│   │   └── FavoritesGrid.tsx # User's favorites
│   └── ui/
│       └── Modal.tsx          # Reusable modal
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── db.ts                # Prisma client
│   └── validation.ts         # Zod schemas
├── .env                      # Environment variables
└── package.json              # Updated dependencies
```

---

## Task 1: Project Setup & Dependencies

**Files:**
- Modify: `package.json`
- Create: `.env`
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Update package.json with new dependencies**

```json
{
  "dependencies": {
    "existing...",
    "next-auth": "^5.0.0-beta.25",
    "@auth/prisma-adapter": "^2.4.1",
    "@prisma/client": "^5.17.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "existing...",
    "prisma": "^5.17.0",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

Run: `npm install`

- [ ] **Step 2: Create .env file**

```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_SECRET="generate-using-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

**Note:** User needs to provide Supabase connection string.

- [ ] **Step 3: Create prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  favorites     Favorite[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  vehicleId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, vehicleId])
}
```

- [ ] **Step 4: Generate Prisma client**

Run: `npx prisma generate`

- [ ] **Step 5: Push schema to database**

Run: `npx prisma db push`

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .env prisma/schema.prisma
git commit -m "feat: set up Prisma with PostgreSQL schema"
```

---

## Task 2: Prisma Client & Auth Configuration

**Files:**
- Create: `lib/db.ts`
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create lib/db.ts**

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

- [ ] **Step 2: Create lib/auth.ts**

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { loginSchema, registerSchema } from "./validation";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await db.user.findUnique({ where: { email } });
          
          if (!user || !user.password) return null;
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
```

- [ ] **Step 3: Create app/api/auth/[...nextauth]/route.ts**

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 4: Commit**

```bash
git add lib/db.ts lib/auth.ts app/api/auth
git commit -m "feat: add NextAuth configuration with Prisma"
```

---

## Task 3: Validation Schemas

**Files:**
- Create: `lib/validation.ts`

- [ ] **Step 1: Create lib/validation.ts**

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});
```

- [ ] **Step 2: Commit**

```bash
git add lib/validation.ts
git commit -m "feat: add Zod validation schemas"
```

---

## Task 4: Registration API

**Files:**
- Create: `app/api/register/route.ts`

- [ ] **Step 1: Create app/api/register/route.ts**

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = registerSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, password } = validatedFields.data;
    
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/register/route.ts
git commit -m "feat: add registration API endpoint"
```

---

## Task 5: Change Password API

**Files:**
- Create: `app/api/change-password/route.ts`

- [ ] **Step 1: Create app/api/change-password/route.ts**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { changePasswordSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const validatedFields = changePasswordSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { currentPassword, newPassword } = validatedFields.data;
    
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }
    
    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!passwordsMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/change-password/route.ts
git commit -m "feat: add change password API endpoint"
```

---

## Task 6: Favorites API

**Files:**
- Create: `app/api/favorites/route.ts`
- Create: `app/api/favorites/sync/route.ts`

- [ ] **Step 1: Create app/api/favorites/route.ts**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const favorites = await db.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Get favorites error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { vehicleId } = body;
    
    if (!vehicleId) {
      return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 });
    }
    
    const existing = await db.favorite.findUnique({
      where: {
        userId_vehicleId: {
          userId: session.user.id,
          vehicleId,
        },
      },
    });
    
    if (existing) {
      return NextResponse.json({ message: "Already favorited" });
    }
    
    await db.favorite.create({
      data: {
        userId: session.user.id,
        vehicleId,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add favorite error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create app/api/favorites/sync/route.ts**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { vehicleIds } = body;
    
    if (!Array.isArray(vehicleIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    
    const existingFavorites = await db.favorite.findMany({
      where: { userId: session.user.id },
      select: { vehicleId: true },
    });
    
    const existingIds = new Set(existingFavorites.map((f) => f.vehicleId));
    
    const newFavorites = vehicleIds
      .filter((id) => !existingIds.has(id))
      .map((vehicleId) => ({
        userId: session.user.id,
        vehicleId,
      }));
    
    if (newFavorites.length > 0) {
      await db.favorite.createMany({
        data: newFavorites,
      });
    }
    
    return NextResponse.json({ success: true, count: newFavorites.length });
  } catch (error) {
    console.error("Sync favorites error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/favorites
git commit -m "feat: add favorites API endpoints"
```

---

## Task 7: Auth Components

**Files:**
- Create: `components/auth/PasswordInput.tsx`
- Create: `components/auth/AuthForm.tsx`

- [ ] **Step 1: Create components/auth/PasswordInput.tsx**

```typescript
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function PasswordInput({ label, error, className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "w-full px-3 py-2 border rounded-lg pr-10",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create components/auth/AuthForm.tsx**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { PasswordInput } from "./PasswordInput";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (mode === "register" && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "Registration failed");
          setLoading(false);
          return;
        }
        
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        
        if (result?.error) {
          setError("Registration succeeded but login failed");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        
        if (result?.error) {
          setError("Invalid email or password");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      setError("Something went wrong");
    }
    
    setLoading(false);
  };
  
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          GariHub
        </Link>
        <h1 className="text-xl font-semibold mt-2">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Enter your password"
          required
        />
        
        {mode === "register" && (
          <PasswordInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm your password"
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords don't match" : undefined}
            required
          />
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>
      
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
      </div>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <Link href="/register" className="text-primary-600 hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/auth
git commit -m "feat: add auth components"
```

---

## Task 8: Login & Register Pages

**Files:**
- Create: `app/login/page.tsx`
- Create: `app/register/page.tsx`

- [ ] **Step 1: Create app/login/page.tsx**

```typescript
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
```

- [ ] **Step 2: Create app/register/page.tsx**

```typescript
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <AuthForm mode="register" />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/login app/register
git commit -m "feat: add login and register pages"
```

---

## Task 9: Dashboard Components

**Files:**
- Create: `components/dashboard/Sidebar.tsx`
- Create: `components/dashboard/ProfileForm.tsx`
- Create: `components/dashboard/FavoritesGrid.tsx`

- [ ] **Step 1: Create components/dashboard/Sidebar.tsx**

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Profile", icon: "user" },
  { href: "/dashboard/favorites", label: "Favorites", icon: "heart" },
  { href: "/dashboard/listings", label: "My Listings", icon: "car" },
];

function Icon({ name }: { name: string }) {
  switch (name) {
    case "user":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case "heart":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "car":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    default:
      return null;
  }
}

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-primary-50 text-primary-600"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
      
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full mt-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create components/dashboard/ProfileForm.tsx**

```typescript
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function ProfileForm() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [name, setName] = useState(session?.user?.name || "");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      
      if (res.ok) {
        setSuccess(true);
        await update({ name });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("Something went wrong");
    }
    
    setLoading(false);
  };
  
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmNewPassword: passwordData.confirmNewPassword,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (err) {
      setError("Something went wrong");
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
          Settings updated successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={session?.user?.email || ""}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-lg mt-1 bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Change Password
          </button>
        </div>
      </form>
      
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <PasswordInput
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
              <PasswordInput
                label="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <PasswordInput
                label="Confirm New Password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Update Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create components/dashboard/FavoritesGrid.tsx**

```typescript
"use client";

import { useState, useEffect } from "react";
import { vehicles } from "@/data/vehicles";
import { Vehicle } from "@/types";
import VehicleCard from "@/components/VehicleCard";

export function FavoritesGrid() {
  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      
      const favoriteVehicles = data
        .map((f: { vehicleId: string }) => vehicles.find((v) => v.id === f.vehicleId))
        .filter(Boolean) as Vehicle[];
      
      setFavorites(favoriteVehicles);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (vehicleId: string) => {
    try {
      await fetch(`/api/favorites?vehicleId=${vehicleId}`, { method: "DELETE" });
      setFavorites(favorites.filter((v) => v.id !== vehicleId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const localFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      await fetch("/api/favorites/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleIds: localFavorites }),
      });
      
      localStorage.removeItem("favorites");
      await fetchFavorites();
    } catch (err) {
      console.error("Failed to sync favorites:", err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Saved Favorites</h2>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "Sync from Browser"}
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No favorites yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Save vehicles you like to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((vehicle) => (
            <div key={vehicle.id} className="relative">
              <VehicleCard vehicle={vehicle} />
              <button
                onClick={() => handleRemove(vehicle.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/dashboard
git commit -m "feat: add dashboard components"
```

---

## Task 10: Dashboard Pages

**Files:**
- Create: `app/dashboard/layout.tsx`
- Create: `app/dashboard/page.tsx`
- Create: `app/dashboard/favorites/page.tsx`
- Create: `app/dashboard/listings/page.tsx`

- [ ] **Step 1: Create app/dashboard/layout.tsx**

```typescript
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create app/dashboard/page.tsx**

```typescript
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default function DashboardPage() {
  return <ProfileForm />;
}
```

- [ ] **Step 3: Create app/dashboard/favorites/page.tsx**

```typescript
import { FavoritesGrid } from "@/components/dashboard/FavoritesGrid";

export default function FavoritesPage() {
  return <FavoritesGrid />;
}
```

- [ ] **Step 4: Create app/dashboard/listings/page.tsx**

```typescript
export default function ListingsPage() {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <h2 className="text-2xl font-bold text-gray-400 mb-4">Coming Soon</h2>
      <p className="text-gray-500">
        Seller listings will be available in a future update.
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/dashboard
git commit -m "feat: add dashboard pages"
```

---

## Task 11: Update Profile API

**Files:**
- Create: `app/api/update-profile/route.ts`

- [ ] **Step 1: Create app/api/update-profile/route.ts**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { name } = body;
    
    await db.user.update({
      where: { id: session.user.id },
      data: { name },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/update-profile
git commit -m "feat: add update profile API"
```

---

## Task 12: TypeScript Types for Session

**Files:**
- Create: `types/next-auth.d.ts`

- [ ] **Step 1: Create types/next-auth.d.ts**

```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add types/next-auth.d.ts
git commit -m "feat: add NextAuth TypeScript types"
```

---

## Task 13: Update Navbar with Auth State

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Update Navbar.tsx**

Replace the static nav with auth-aware nav using SessionProvider and useSession:

```typescript
// Add SessionProvider wrapper to layout first, then update Navbar
```

Add to `app/layout.tsx`:
```typescript
import { SessionProvider } from "next-auth/react";
// Wrap body with SessionProvider
```

Update `components/Navbar.tsx`:
```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/sell', label: 'Sell' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    // ... existing navbar code, update to show Login/Dashboard
    // Add conditional: session ? (
    //   <Link href="/dashboard" className="...">Dashboard</Link>
    //   <button onClick={() => signOut()}>Sign Out</button>
    // ) : (
    //   <Link href="/login">Login</Link>
    // )
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Navbar.tsx app/layout.tsx
git commit -m "feat: add session provider and auth-aware navbar"
```

---

## Task 14: Update VehicleCard with DB Favorites

**Files:**
- Modify: `components/VehicleCard.tsx`

- [ ] **Step 1: Update VehicleCard.tsx**

Add database sync when adding/removing favorites if user is logged in:

```typescript
const toggleFavorite = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  let newFavorites;
  
  if (favorites.includes(vehicle.id)) {
    newFavorites = favorites.filter((id: string) => id !== vehicle.id);
    // Also remove from DB if logged in
    try {
      await fetch(`/api/favorites?vehicleId=${vehicle.id}`, { method: 'DELETE' });
    } catch (err) { /* ignore */ }
  } else {
    newFavorites = [...favorites, vehicle.id];
    // Also add to DB if logged in
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: vehicle.id }),
      });
    } catch (err) { /* ignore */ }
  }
  
  localStorage.setItem('favorites', JSON.stringify(newFavorites));
  setIsFavorite(!isFavorite);
};
```

- [ ] **Step 2: Commit**

```bash
git add components/VehicleCard.tsx
git commit -m "feat: sync favorites to database when logged in"
```

---

## Task 15: Build & Test

- [ ] **Step 1: Run build**

Run: `npm run build`

Expected: Build completes without errors

- [ ] **Step 2: Verify all pages load**

- Login: http://localhost:3000/login
- Register: http://localhost:3000/register
- Dashboard: http://localhost:3000/dashboard (should redirect to login if not authenticated)
- Favorites: http://localhost:3000/dashboard/favorites

- [ ] **Step 3: Test functionality**

- Register new account
- Login with email/password
- Login with Google (if credentials configured)
- Update profile name
- Change password
- Add/remove favorites
- Sync favorites

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: complete Phase 2 - auth and dashboard"
```

---

## Summary

Phase 2 implementation includes:

- ✅ NextAuth.js v5 with credentials + Google OAuth
- ✅ Prisma with PostgreSQL (Supabase)
- ✅ User registration and login
- ✅ Profile management (name, password change)
- ✅ Favorites with database persistence
- ✅ Sync from localStorage favorites
- ✅ Protected dashboard routes
- ✅ Responsive dashboard with sidebar
- ✅ Auth-aware navbar

**Next Steps (Phase 3):**
- Advanced search with filters
- Saved search notifications
- Price drop alerts
