interface postMedia {
  url: string;
  mediaType: string;
}

interface Post {
  Description: string;
  PostUrl: string;
  Location: string;
  TagIds: Array<Number>;
}

interface Feed {
  user: {
    id: string;
    fullname: string;
    username: string;
    profilePicture: string;
  };
  id: number;
  description: string;
  media: postMedia[];
  location: string;
  createdAt: string; // ISO timestamp from backend
  isLiked: boolean;
  commentCount: number;
  likeCount: number;
  views: number | null; // null if not owner (as per API behavior)
}
