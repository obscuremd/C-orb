interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  coverPicture?: string | null;
  bio?: string | null;
  location?: string | null;
  badgePoints: number;
  createdAt: string; // ISO date string
}
