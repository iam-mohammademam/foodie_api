import {
  emailSchema,
  nameSchema,
  resetPasswordSchema,
  tokenSchema,
} from "./globalSchema";

const authSchema = new Schema(
  {
    name: nameSchema,
    email: emailSchema,
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    tokens: [tokenSchema],
    role: { type: String, default: "user" },
    resetPassword: { type: resetPasswordSchema },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const auth = model("Auth", authSchema);
export default auth;
