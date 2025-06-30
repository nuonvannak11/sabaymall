import "next-auth";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export type DefLayoutProps = {
  children?: React.ReactNode;
  params: Promise<Record<string, string> & { locale: string }>;
};

export type DefPageProps = {
  params: Promise<Record<string, string> & { locale: string }>;
  searchParams: Promise<Record<string, string>>;
};

export interface UserProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  img: string;
  address: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductProps {
  id: number;
  name: string;
  createdAt: string;
  category: string;
  status: string;
  img: string;
  price: number;
  total: number;
  description: string;
}

export interface ItemCardProps {
  id: number;
  name: string;
  total: number;
  status: string;
  category: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
}

export interface SliderProps {
  id: number;
  name: string;
  category: string;
  img: string;
  createdAt: string;
}

export interface LayoutProps {
  sliders: SliderProps[];
  products: ProductProps[];
}

export interface LoginProps {
  open: boolean;
  onClose: () => void;
}

export type WithId = { id: number };
