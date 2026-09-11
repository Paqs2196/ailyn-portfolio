import type { Metadata } from 'next';
import './globals.css';

// TEMPORARY PLACEHOLDER — real Synonym/Amulya files are missing from public/fonts/.
// Swap this block back to the two localFont() calls (see git history / earlier
// docs) once Synonym-Semibold.woff2 and Amulya-Regular.woff2 are in place.
const placeholderFontVars = {
  '--font-synonym': '"Arial Black", "Helvetica Neue", Arial, sans-serif',
  '--font-amulya': '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as React.CSSProperties;

export const metadata: Metadata = {
  title: 'Create with Ailyn | Design, Video & Digital Marketing',
  description: 'Meet Ailyn: digital marketer, graphic designer, video editor, and content creator. Explore her creative work and connect for your next project.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" style={placeholderFontVars}><body>{children}</body></html>;
}
