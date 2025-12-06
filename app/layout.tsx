import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stacks Whitelist Dapp',
  description: 'Manage whitelist access on Stacks Bitcoin L2',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className="font-sans antialiased bg-slate-950 text-slate-100">
      <main>{children}</main>
    </body>
  </html>
);

export default RootLayout;
