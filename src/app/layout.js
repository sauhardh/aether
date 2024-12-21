
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
      <body className={`${fira_sans.className} antialiased  w-full p-0 m-0  min-h-[100%] relative`}>
        <SessionWrapper>
          <Navbar />
          <main className="flex-1 w-full bg-gradient-to-b  from-gray-100 to-white">
            {children}
          </main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}