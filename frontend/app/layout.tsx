

import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

export const metadata = {
  title: "WeCall SMS",
  description: "SMS Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
