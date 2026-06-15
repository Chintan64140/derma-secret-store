import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth, API } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, token } = useAuth();
  const [loadingCart, setLoadingCart] = useState(true);

  // Load or sync cart when auth state changes (login, logout, or initial load)
  useEffect(() => {
    const loadCart = async () => {
      setLoadingCart(true);
      if (user && token) {
        try {
          // Retrieve guest cart from localStorage
          const savedCart = localStorage.getItem('cart');
          let localCart = [];
          if (savedCart) {
            try {
              localCart = JSON.parse(savedCart);
            } catch (e) {
              console.error('Error parsing local cart:', e);
            }
          }

          if (localCart && localCart.length > 0) {
            // Sync guest cart with server
            const response = await API.post('/cart/sync', { cartItems: localCart });
            setCartItems(response.data);
            // Clear local storage cart so we don't keep syncing it
            localStorage.removeItem('cart');
          } else {
            // No local cart items, just load the server cart
            const response = await API.get('/cart');
            setCartItems(response.data);
          }
        } catch (err) {
          console.error('Failed to load/sync server cart:', err.message);
        } finally {
          setLoadingCart(false);
        }
      } else {
        // Guest user: load from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (err) {
            console.error('Error parsing cart from localStorage:', err.message);
          }
        } else {
          setCartItems([]);
        }
        setLoadingCart(false);
      }
    };

    loadCart();
  }, [user, token]);

  // Save cart to localStorage when changed (only for guest users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user && token) {
      try {
        const response = await API.post('/cart', { productId: product.id, quantity });
        setCartItems(response.data);
      } catch (err) {
        console.error('Error adding to server cart:', err.message);
      }
    } else {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: parseFloat(product.price),
            compare_price: product.compare_price ? parseFloat(product.compare_price) : parseFloat(product.price),
            image_url: product.image_url,
            discount_percent: product.discount_percent || 0,
            quantity
          }
        ];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user && token) {
      try {
        const response = await API.delete(`/cart/${productId}`);
        setCartItems(response.data);
      } catch (err) {
        console.error('Error removing from server cart:', err.message);
      }
    } else {
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    if (user && token) {
      try {
        const response = await API.put(`/cart/${productId}`, { quantity: parseInt(quantity) });
        setCartItems(response.data);
      } catch (err) {
        console.error('Error updating quantity on server:', err.message);
      }
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user && token) {
      try {
        await API.delete('/cart');
        setCartItems([]);
      } catch (err) {
        console.error('Error clearing server cart:', err.message);
      }
    } else {
      setCartItems([]);
    }
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCompareTotal = cartItems.reduce((acc, item) => acc + item.compare_price * item.quantity, 0);
  const cartDiscount = Math.max(0, cartCompareTotal - cartTotal);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      cartCompareTotal,
      cartDiscount,
      loadingCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
