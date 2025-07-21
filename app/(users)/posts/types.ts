import { Tables } from '@/database.types';

export type Post = Tables<'posts'>;
export type PostLike = Tables<'post_likes'>;

export interface UserPost {
  post_id: string;
  author_id: string;
  post_type: 'user_photo';
  title: string;
  content?: string;
  images: string[];
  is_published: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    profile_id: string;
    location_name: string;
    avatar?: string;
    role: string;
  };
}

export interface AdminPost {
  post_id: string;
  author_id: string;
  post_type: 'admin_product';
  title: string;
  content?: string;
  images: string[];
  product_name?: string;
  price?: number;
  size?: string;
  color?: string;
  available_stores?: string[];
  is_published: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    profile_id: string;
    location_name: string;
    avatar?: string;
    role: string;
  };
  stores?: Array<{
    store_id: string;
    branch: string;
    address: string;
  }>;
}

export type PostWithAuthor = UserPost | AdminPost;

export interface CreateUserPostData {
  title: string;
  content?: string;
  images: string[];
}

export interface CreateAdminPostData {
  title: string;
  content?: string;
  images: string[];
  product_name: string;
  price: number;
  size: string;
  color: string;
  available_stores: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  images?: string[];
  product_name?: string;
  price?: number;
  size?: string;
  color?: string;
  available_stores?: string[];
  is_published?: boolean;
}
