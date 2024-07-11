// types/session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
    user: Record<string, any>; // Adjust the type according to your user object
  }
}
