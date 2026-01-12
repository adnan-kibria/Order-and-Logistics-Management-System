import { UserProfile } from "./user-profile.interface";

export interface User {
  userId: string;
  email: string;
  role: string;
  profile: UserProfile | null;
}