
import "./globals.css";
import { fira_sans } from "../components/fonts";
import SessionWrapper from "../components/ui/SessionWrapper";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import PageWrapper from '../components/ui/PageWrapper.js'

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
      <body className={`${fira_sans.className} antialiased`}>
        <SessionWrapper>
          <Navbar />
          <main className="min-h-screen bg-[size:20px_20px]">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}