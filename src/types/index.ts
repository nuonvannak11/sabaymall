export type DefLayoutProps = {
  children?: React.ReactNode;
  params: Promise<Record<string, string> & { locale: string }>;
};
