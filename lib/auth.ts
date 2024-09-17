import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email and include all related models
        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
          include: {
            address: true,        // Include address details
            cart: true,           // Include cart details
            orders: true,         // Include orders details
            notifications: true,  // Include notifications
          },
        });

        if (!existingUser) {
          return null;
        }

        // Check if the password matches
        const passwordMatch = await compare(credentials.password, existingUser.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          fullName: existingUser.fullName,
          email: existingUser.email,
          phoneNumber: existingUser.phoneNumber,
          role: existingUser.role,
          address: existingUser.address,
          cart: existingUser.cart,
          orders: existingUser.orders,
          notifications: existingUser.notifications,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          address: user.address,
          cart: user.cart,
          orders: user.orders,
          notifications: user.notifications,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          fullName: token.fullName,
          email: token.email,
          phoneNumber: token.phoneNumber,
          role: token.role,
          address: token.address,
          cart: token.cart,
          orders: token.orders,
          notifications: token.notifications,
        },
      };
    },
  },
};
