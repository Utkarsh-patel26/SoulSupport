const { z } = require("zod");

/**
 * Reusable validation schemas using Zod
 */

// Common patterns
const emailSchema = z.string().email("Invalid email address");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number");

const phoneSchema = z.string().regex(/^\+?[0-9]{10,}$/, "Invalid phone number");

// Auth schemas
const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  userType: z.enum(["user", "therapist"]),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const passwordResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
});

// User schemas
const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  phone: phoneSchema.optional(),
  avatar: z.string().url().optional(),
});

// Therapist schemas
const createTherapistProfileSchema = z.object({
  specializations: z.array(z.string()).min(1),
  qualifications: z.string().min(10),
  bio: z.string().min(20),
  hourlyRate: z.number().positive("Hourly rate must be positive"),
  availableHours: z.string(),
  licenseNumber: z.string(),
  licenseExpiry: z.string().datetime(),
});

// Forum schemas
const createPostSchema = z.object({
  content: z.string().min(10, "Post must be at least 10 characters"),
  category: z.enum([
    "general",
    "anxiety",
    "depression",
    "relationships",
    "stress",
    "success",
  ]),
  isAnonymous: z.boolean().optional().default(false),
});

const addCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  isAnonymous: z.boolean().optional().default(false),
});

// Session schemas
const createSessionSchema = z.object({
  therapistId: z.string().min(1),
  date: z.string().datetime("Invalid date format"),
  duration: z.number().int().positive(),
  notes: z.string().optional(),
});

/**
 * Validation middleware
 */
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body
      const validatedData = await schema.parseAsync(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

module.exports = {
  // Schemas
  registerSchema,
  loginSchema,
  passwordResetSchema,
  updateProfileSchema,
  createTherapistProfileSchema,
  createPostSchema,
  addCommentSchema,
  createSessionSchema,

  // Middleware
  validate,
};
