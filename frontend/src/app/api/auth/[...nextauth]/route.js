// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'crypto';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:7878';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_is_i_love_you_secretly';

// Helper to sign an Aether-compatible HS256 JWT
function signAetherJWT(userId, username, secret = JWT_SECRET) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: String(userId),
    username: username,
    iat: now,
    exp: now + 7200, // 2 hours
  })).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${SERVER_URL}/api/authenticate-user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data.ok && data.access_token) {
            return {
              id: "1",
              email: credentials.email,
              name: credentials.email.split('@')[0],
              accessToken: data.access_token,
            };
          }
          return null;
        } catch (error) {
          console.error("Credentials authorize error:", error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      issuer: 'https://github.com/login/oauth',
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || token.id;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user && user.accessToken) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      } else if (account && (account.provider === 'github' || account.provider === 'google')) {
        const username = profile?.login || user?.name || "oauth_user";
        // Create an Aether backend JWT for OAuth user
        const aetherToken = signAetherJWT(1, username);
        token.accessToken = aetherToken;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'secret_is_i_love_you_secretly',
});

export { handler as GET, handler as POST };