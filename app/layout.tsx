import './globals.css';

export const metadata = {
  title: '스마트 복약 관리',
  description: '독거노인을 위한 스마트 복약 관리 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}