import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    Credentials({
      name: "Custom Login",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          placeholder: "ejemplo@jemplo.com",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        /* Validte with DB */

        return await dbUsers.checkEmailPassword(
          credentials!.email,
          credentials!.password
        );
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  /* Custom Pages */

  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },

  session: {
    maxAge: 2592000, //30d
    strategy: "jwt",
    updateAge: 86400, // Every day
  },

  callbacks: {
    async jwt({ token, account, user }) {
      /* console.log({ token, account, user }); */
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          /* Create user or verified if exist in my DB */
          case "oauth":
            token.user = await dbUsers.oAuthToDBUser(
              user?.email || "",
              user?.name || ""
            );
            break;

          case "credentials":
            token.user = user;
            break;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      /* console.log({ token, session, user }); */
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
});
