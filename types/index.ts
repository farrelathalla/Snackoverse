export type User = {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    address: {
      title: string;
      provinceName: string;
      cityName: string;
      type: string;
      postalCode: string;
    };
  };
  
  export type OrderItem = {
    id: number;
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  };
  
  export type Order = {
    id: number;
    totalAmount: number;
    deliveryFee: number;
    status: 'Pending' | 'Paid' | 'Shipped';
    orderItems: OrderItem[];
    user: User;
  };
  
  export type Notification = {
    id: number;
    message: string;
    status: 'Unread' | 'Read';
    orderId: number;
    order: Order;
  };
  