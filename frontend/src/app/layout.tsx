import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider  } from "../context/CartContext";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="app-shell">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
