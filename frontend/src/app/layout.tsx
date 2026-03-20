import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider  } from "../context/CartContext";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}