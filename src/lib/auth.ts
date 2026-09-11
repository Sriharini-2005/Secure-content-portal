import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await connectToDatabase();

      const adminList = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase());
      
      const targetRole = adminList.includes(user.email.toLowerCase()) ? 'ADMIN' : 'VIEWER';

      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          email: user.email,
          name: user.name,
          role: targetRole,
        });
      } else if (existingUser.role !== targetRole && targetRole === 'ADMIN') {
        existingUser.role = 'ADMIN';
        await existingUser.save();
      }

      return true;
    },
    async jwt({ token }) {
      if (token?.email) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          (token as any).role = dbUser.role;
          (token as any).id = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
  pages: { signIn: '/' },
};