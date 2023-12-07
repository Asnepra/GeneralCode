import NextAuth, { AuthOptions } from "next-auth";
import Providers from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // Add your own logic here to validate the user ID and password
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        } else {
          //call the api using the credentials for validation, the api return true and false
          // Call the API using the credentials for validation

          console.log("nextauth file ", credentials);
          const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();

          console.log(
            "user id",
            credentials.email,
            "password",
            credentials.password
          );
          if (res.ok && user) {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
