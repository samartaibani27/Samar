import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),
  email: z
    .string({ required_error: "Email address is required." })
    .trim()
    .min(1, "Email address is required.")
    .email("Please provide a valid email address."),
  whatsapp: z
    .string({ required_error: "WhatsApp or phone number is required." })
    .trim()
    .min(10, "Please enter a valid phone or WhatsApp number (at least 10 digits).")
    .max(25, "Phone number cannot exceed 25 characters.")
    .regex(/^[+]?[0-9\s\-()]{10,25}$/, "Please enter a valid telephone format."),
  inquiryType: z
    .string({ required_error: "Inquiry category is required." })
    .trim()
    .min(1, "Please select an inquiry category."),
  message: z
    .string({ required_error: "Message is required." })
    .trim()
    .min(10, "Message must be at least 10 characters long.")
    .max(3000, "Message cannot exceed 3000 characters."),
  hp: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
