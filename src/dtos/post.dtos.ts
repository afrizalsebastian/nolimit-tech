export interface AuthorPost {
  name: string;
  email: string;
  id: number;
}

export interface PostResponse {
  id: number;
  content: string;
  author?: AuthorPost;
  updatedAt: Date;
}

export interface CreatePostRequest {
  userId: number;
  content: string;
}

export interface UpdatePostRequest {
  id: number;
  userId: number;
  content: string;
}
