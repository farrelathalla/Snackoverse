'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: number;
  productId: number;
  product: {
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    weight: number;
  };
  quantity: number;
};

type Address = {
  title: string;
  provinceId: string;
  cityId: string;
  provinceName: string;
  cityName: string;
  postalCode: string;
  type: string;
};

declare global {
    interface Window {
        snap: any;
    }
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [courier, setCourier] = useState<string>('jne');
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [deliveryServices, setDeliveryServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [noDelivery, setNoDelivery] = useState<boolean>(false);
  const [snapLoaded, setSnapLoaded] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Load Snap.js on component mount
    const loadSnapScript = () => {
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
      script.async = true;
      script.onload = () => setSnapLoaded(true);
      document.body.appendChild(script);
    };

    loadSnapScript();

    const fetchCart = async () => {
      try {
        const cartResponse = await fetch('/api/cart');
        const cartData = await cartResponse.json();
        setCartItems(cartData.cartItems || []);
        setAddress(cartData.address || null);
        fetchDeliveryServices('jne'); // Default courier
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    if (address && cartItems.length > 0) {
      fetchDeliveryServices('jne');
    }
  }, [address, cartItems]);

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        await deleteCartItem(cartItemId);
      } else {
        await fetch(`/api/cart/items/${cartItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: newQuantity }),
        });
        await refreshCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const deleteCartItem = async (cartItemId: number) => {
    try {
      await fetch(`/api/cart/items/${cartItemId}`, { method: 'DELETE' });
      await refreshCart();
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const refreshCart = async () => {
    const cartResponse = await fetch('/api/cart');
    const cartData = await cartResponse.json();
    setCartItems(cartData.cartItems || []);
    calculateTotalPrice();
  };

  const fetchDeliveryServices = async (courier: string) => {
    if (!address) return;

    const totalWeight = cartItems.reduce((sum, item) => sum + item.product.weight * item.quantity, 0);

    try {
      const response = await fetch('/api/rajaongkir/cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: '23',
          destination: address.cityId,
          weight: totalWeight,
          courier,
        }),
      });

      const data = await response.json();
      if (data.rajaongkir.results.length > 0 && data.rajaongkir.results[0].costs.length > 0) {
        setDeliveryServices(data.rajaongkir.results[0].costs);
        setNoDelivery(false);
      } else {
        setDeliveryServices([]);
        setNoDelivery(true);
      }
    } catch (error) {
      console.error('Error fetching delivery services:', error);
      setNoDelivery(true);
    }
  };

  const calculateTotalPrice = () => {
    const productTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setTotalPrice(productTotal + deliveryFee);
  };

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = deliveryServices.find(service => service.service === event.target.value);
    if (selected) {
      setSelectedService(event.target.value);
      setDeliveryFee(selected.cost[0].value);
      calculateTotalPrice();
    }
  };

  const handleCourierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCourier(event.target.value);
    fetchDeliveryServices(event.target.value);
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          deliveryFee,
          totalPrice,
        }),
      });

      const data = await response.json();
      console.log("Data", data)
      if (data.token && snapLoaded) {
        window.snap.pay(data.token, {
          onSuccess: async () => {
            await checkTransactionStatus(data.order_id);
            alert('Payment Successful');
            router.push('/order-confirmation');
          },
          onError: () => alert('Payment Failed'),
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const checkTransactionStatus = async (order_id: string) => {
    try {
      const response = await fetch(`/api/status/${order_id}`);
      const statusData = await response.json();
      console.log('Transaction Status:', statusData);
      // Update order status in your database based on the status returned
    } catch (error) {
      console.error('Error checking transaction status:', error);
    }
  };

  return (
    <div>
      <h1>Your Cart</h1>

      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
            <img src={item.product.image} alt={item.product.name} width="100" />
            <h3>{item.product.name}</h3>
            <p>{item.product.description}</p>
            <p>Price: ${item.product.price}</p>
            <p>Stock: {item.product.stock}</p>

            <div>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                {item.quantity === 1 ? 'Delete' : '-'}
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity === item.product.stock}>
                +
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}

      {address && (
        <div>
          <h2>Shipping Address</h2>
          <p>{address.title}</p>
          <p>{address.type} {address.cityName}, {address.provinceName}</p>
          <button onClick={() => router.push('/profile')}>Edit Address</button>
        </div>
      )}

      <div>
        <h2>Courier</h2>
        <select value={courier} onChange={handleCourierChange}>
          <option value="jne">JNE</option>
          <option value="pos">POS</option>
          <option value="tiki">TIKI</option>
        </select>
      </div>

      {noDelivery ? (
        <p>No delivery available for this courier</p>
      ) : (
        deliveryServices.length > 0 && (
          <div>
            <h2>Delivery Service</h2>
            <select value={selectedService} onChange={handleServiceChange}>
              <option value="">Select Delivery Service</option>
              {deliveryServices.map((service) => (
                <option key={service.service} value={service.service}>
                  {service.service} - {service.description}
                </option>
              ))}
            </select>
          </div>
        )
      )}

      <div>
        <h2>Total Price</h2>
        <p>Products: ${cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)}</p>
        <p>Delivery Fee: ${deliveryFee}</p>
        <p>Total: ${cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + deliveryFee}</p>
      </div>

      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CartPage;
