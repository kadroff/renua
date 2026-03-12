
import PageHeader from "@/components/PageHeader";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import PageFooter from "@/components/PageFooter";
import ContactUsFooter from "@/components/ContactUsFooter";
import Script from "next/script";

export const metadata = {
  title: {
    default: "Renua - Creative Agency",
    template: "%s | Renua",
  },
  description: "Renua - shaping brands and digital experiences through motion, design, and storytelling.",
  keywords: ["creative agency", "motion design", "branding", "digital storytelling"],
  authors: [{ name: "Renua Team", url: "https://renua.com" }],
  creator: "Renua Creative Agency",
  publisher: "Renua",
  openGraph: {
    title: "Renua - Creative Agency",
    description: "Shaping brands and digital experiences through motion and design.",
    url: "https://renua.com",
    siteName: "Renua",
    images: [
      {
        url: "/Renua_Preview.png",
        width: 1200,
        height: 630,
        alt: "Renua - Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Renua - Creative Agency",
    description: "Shaping brands and digital experiences through motion and design.",
    images: ["/Renua_Preview.png"],
    creator: "@renua",
  },
  alternates: {
    canonical: "https://renua.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "favicon/favicon.ico",
    shortcut: "favicon/favicon-16x16.png",
    apple: "favicon/apple-touch-icon.png",
  },
  themeColor: "#0D0D0D",
  other: {
    "p:domain_verify": "314f74d0dbf28b0b51e17b63977cdc71",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <PageHeader />
          {children}
          <PageFooter />
        </div>
      </body>
      <GoogleAnalytics gaId="G-54E24VX7E5" />
      {/* <Script
        id="emailjs-init"
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
        strategy="lazyOnload"
      />
      <Script
        id="emailjs-init-inline"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `(function(){ emailjs.init('XVlqzmwyk5p21XGJI'); })();`
        }}
      /> */}
    </html>
  );
}
