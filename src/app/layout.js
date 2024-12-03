
import "./globals.css";
import { fira_sans } from "../components/fonts";
import SessionWrapper from "../components/ui/SessionWrapper";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

export const metadata = {
  title: {
    template: "%s | aether",
    default: "Aether"
  },
  description: "Remote Desktop Sharing App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fira_sans.className} antialiased bg-gradient-to-b from-gray-100 to-white w-full min-h-screen p-0 m-0 box-border`}>
        <SessionWrapper>
          <Navbar />
          <main className="w-full min-h-screen">
            {children}
          </main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}