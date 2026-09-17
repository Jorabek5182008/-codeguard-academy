import './../styles/globals.css';

export const metadata = {
  title: 'CodeGuard — Python va sun\'iy intellekt darslari',
  description: "Zamonaviy Python va AI kurslari. Bepul sun'iy intellekt darsi bilan boshlang.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
