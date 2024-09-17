import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    address?: Address;
    cart?: Cart;
    orders?: Order[];
    notifications?: Notification[];
  }

  interface Session extends DefaultSession {
    user: User;
  }

  interface JWT {
    id: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    address?: Address;
    cart?: Cart;
    orders?: Order[];
    notifications?: Notification[];
  }

  interface Address {
    id: number;
    title: string;
    provinceId: string;
    cityId: string;
    provinceName: string;
    cityName: string;
    postalCode: string;
    type: string;
  }

  interface Cart {
    id: number;
    userId: number;
    cartItems: CartItem[];
  }

  interface CartItem {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
    product: Product; // Include product details
  }

  interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    origin: string;
    weight: number;
  }

  interface Order {
    id: number;
    userId: number;
    totalAmount: number;
    deliveryFee: number;
    status: OrderStatus;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product; // Include product details
  }

  interface Notification {
    id: number;
    userId?: number; // Nullable if it's an admin notification
    orderId?: number;
    message: string;
    recipient: Roles;
    status: NotifStatus;
    createdAt: Date;
    updatedAt: Date;
  }

  enum Roles {
    Consumer = "Consumer",
    Admin = "Admin"
  }

  enum OrderStatus {
    Pending = "Pending",
    Paid = "Paid",
    Shipped = "Shipped"
  }

  enum NotifStatus {
    Unread = "Unread",
    Read = "Read"
  }
}
