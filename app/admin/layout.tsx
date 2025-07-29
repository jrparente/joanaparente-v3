export const metadata = {
  title: "Joana Parente's Portfolio Website - Admin",
  description:
    "Admin dashboard for managing Joana Parente's portfolio content.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
