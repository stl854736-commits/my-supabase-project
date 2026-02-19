import "./globals.css";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Modern Bookmark Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
