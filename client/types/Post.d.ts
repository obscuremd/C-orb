interface Post {
  Description: string;
  PostUrl: string;
  Location: string;
  TagIds: Array<Number>;
}

interface Feed {
  user: {
    username: string;
    profilePicture: string;
  };
  id: number;
  description: string;
  postUrl: string;
  location: string;
  createdAt: string; // ISO timestamp from backend
  commentCount: number;
  likeCount: number;
  views: number | null; // null if not owner (as per API behavior)
}
