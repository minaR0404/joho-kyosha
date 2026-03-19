import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      emailVerifiedAt?: string | null;
      isBanned?: boolean;
    };
  }

  interface User {
    role?: string;
    emailVerifiedAt?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    emailVerifiedAt?: string | null;
    isBanned?: boolean;
    lastChecked?: number;
  }
}
