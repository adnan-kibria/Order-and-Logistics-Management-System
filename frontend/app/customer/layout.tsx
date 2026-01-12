import { CartProvider } from "@/app/_context/CartContext";
import CustomerNavbar from "../_layout/customer/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <nav>
            <CustomerNavbar />
          </nav>
          <main>{children}</main>
          <footer>This is the footer</footer>
        </CartProvider>
      </body>
    </html>
  );
}
