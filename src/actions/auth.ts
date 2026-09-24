"use server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, comparePassword, setSessionCookie, clearSessionCookie, getSession } from "@/lib/auth";

export interface RegisterInput {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  title?: string;
  phone?: string;
  avatar?: string;
  intent?: string;
  goals?: string[];
  stage?: string;
  strengths?: string;
  challenges?: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  country?: string;
  state?: string;
  city?: string;
  linkedin?: string;
  twitter?: string;
  termsAccepted?: boolean;
}

export interface LoginInput {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Register a new user and save full profile to MongoDB
 */
export async function registerUserAction(data: RegisterInput): Promise<ActionResponse> {
  try {
    const { email, password, firstName, lastName } = data;

    // Basic Validation
    if (!email || !email.trim()) {
      return { success: false, error: "Email address is required." };
    }
    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
      return { success: false, error: "First and last name are required." };
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in MongoDB
    const newUser = await User.create({
      ...data,
      email: normalizedEmail,
      password: hashedPassword,
      termsAccepted: data.termsAccepted || true,
      role: "user",
    });

    // Create session cookie
    await setSessionCookie({
      userId: newUser._id.toString(),
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      role: newUser.role,
    });

    return {
      success: true,
      message: "Account created successfully!",
      data: {
        userId: newUser._id.toString(),
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
      },
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during registration. Please try again.",
    };
  }
}

/**
 * Login user by checking credentials against MongoDB
 */
export async function loginUserAction(data: LoginInput): Promise<ActionResponse> {
  try {
    const { email, password } = data;

    if (!email || !email.trim()) {
      return { success: false, error: "Email or username is required." };
    }
    if (!password) {
      return { success: false, error: "Password is required." };
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectToDatabase();

    // Query user by email (include password field)
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user || !user.password) {
      return { success: false, error: "Invalid email or password." };
    }

    // Compare password with hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return { success: false, error: "Invalid email or password." };
    }

    // Set session cookie
    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    });

    return {
      success: true,
      message: "Logged in successfully!",
      data: {
        userId: user._id.toString(),
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during login. Please try again.",
    };
  }
}

/**
 * Logout current user
 */
export async function logoutUserAction(): Promise<ActionResponse> {
  try {
    await clearSessionCookie();
    return { success: true, message: "Logged out successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to log out." };
  }
}

/**
 * Get current session user details
 */
export async function getCurrentUserAction(): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    await connectToDatabase();
    // +avatar is needed here since the field is select:false by default
    const user = await User.findById(session.userId).select("+avatar");
    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      data: {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        phone: user.phone,
        avatarUrl: user.avatar,
        intent: user.intent,
        goals: user.goals,
        stage: user.stage,
        strengths: user.strengths,
        challenges: user.challenges,
        companyName: user.companyName,
        industry: user.industry,
        companySize: user.companySize,
        website: user.website,
        country: user.country,
        state: user.state,
        city: user.city,
        linkedin: user.linkedin,
        twitter: user.twitter,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch user session." };
  }
}

/**
 * Update user profile — text fields only (name, title, company, etc.)
 * Avatar is handled separately via updateAvatarAction to keep payloads small.
 */
export async function updateProfileAction(updatedData: Partial<RegisterInput>): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    // Build the $set object — only include fields that were actually sent
    const $set: Record<string, any> = {};
    const textFields = [
      "firstName", "lastName", "title", "phone",
      "companyName", "industry", "website",
      "country", "state", "city",
      "linkedin", "twitter", "stage", "strengths", "challenges",
    ] as const;

    for (const field of textFields) {
      if (updatedData[field] !== undefined) {
        $set[field] = updatedData[field];
      }
    }

    // Only include avatar when it's a new upload (data URI) or explicit clear
    if (updatedData.avatar !== undefined) {
      const isNewUpload = (updatedData.avatar as string).startsWith("data:");
      const isClear = updatedData.avatar === "";
      if (isNewUpload || isClear) {
        $set.avatar = updatedData.avatar;
      }
    }

    if (Object.keys($set).length === 0) {
      return { success: true, message: "Nothing to update." };
    }

    await connectToDatabase();

    // Single atomic write — no separate findById + save round-trip
    const user = await User.findByIdAndUpdate(
      session.userId,
      { $set },
      { new: true, runValidators: false, select: "+avatar" }
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      message: "Profile updated successfully!",
      data: {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        avatarUrl: user.avatar,
      },
    };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message || "Failed to update profile." };
  }
}
