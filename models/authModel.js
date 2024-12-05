import {
  addressSchema,
  emailSchema,
  nameSchema,
  phoneSchema,
  resetPasswordSchema,
  tokenSchema,
  verificationSchema,
} from "./globalSchema";

const authSchema = new Schema(
  {
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    address: { type: addressSchema },
    tokens: [tokenSchema],
    role: { type: String, default: "user" },
    verification: { type: verificationSchema },
    resetPassword: { type: resetPasswordSchema },
    isVerified: { type: Boolean, default: false },
    f2a: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const auth = model("Auth", authSchema);
export default auth;
