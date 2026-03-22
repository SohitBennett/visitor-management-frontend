import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "GateKeeper — Visitor Management System",
  description: "Modern visitor management system for enterprises. Manage visitor check-ins, approvals, and security with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          offset={16}
          gap={8}
          duration={4000}
          visibleToasts={4}
          expand={false}
          richColors={false}
          closeButton={false}
          style={{ "--width": "380px" }}
        />
      </body>
    </html>
  );
}
