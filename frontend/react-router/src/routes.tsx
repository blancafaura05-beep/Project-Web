import Layout from "./components/Layout";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrdersHistory from "./pages/OrdersHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <ProductCatalog /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "orders", element: <OrdersHistory /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
];

