export type DefLayoutProps = {
  children?: React.ReactNode;
  params: Promise<Record<string, string> & { locale: string }>;
};

export interface ItemCardProps {
  id: number;
  name: string;
  status: string;
  category: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
}

export interface ProductProps {
  id: number;
  name: string;
  createdAt: string;
  category: string;
  status: string;
  img: string;
  price: number;
  description: string;
}
