import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { userController } from "./actions/controller/user_controller";
import { decrypt } from "@/utils/index";
import count from "universal-counter";

const CredentialsSchema = z.object({
  phone: z.string().min(1, "Phone is required"),
  password: z.string().min(1, "Password is required"),
});

class InvalidCredentialsError extends Error {
  code = "invalid_credentials";
  constructor(message = "Invalid phone or password") {
    super(message);
    this.name = "CredentialsSignin";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsedCredentials = CredentialsSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new InvalidCredentialsError();
        }

        const { phone, password } = parsedCredentials.data;
        const user = await userController.getUserByPhone(phone);
        const isEncrypted = count(decrypt(password));
        if (
          !user ||
          user.password !== (isEncrypted > 0 ? decrypt(password) : password)
        ) {
          throw new InvalidCredentialsError();
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email ?? undefined,
          image: user.img ?? undefined,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = String(user.id);
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token, trigger, newSession }) {
      session.user = {
        id: String(token.id ?? token.sub ?? ""),
        name: typeof token.name === "string" ? token.name : undefined,
        email: typeof token.email === "string" ? token.email : "",
        image: typeof token.image === "string" ? token.image : undefined,
        emailVerified: null,
      };

      if (trigger === "update" && newSession?.user) {
        session.user = {
          ...session.user,
          ...newSession.user,
        };
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
});
