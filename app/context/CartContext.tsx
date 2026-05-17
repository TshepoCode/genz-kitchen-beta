"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  id: string;
  itemName: string;
  optionLabel: string;
  basePrice: string;
  price?: number;
  quantity?: number;
  image?: string;

  chips?: string;
  drink?: string;

  customerEmail?: string;
  isReward?: boolean;
  pointsCost?: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("genz-cart");

    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("genz-cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: CartItem) {
    setCart((prev) => {
      if (item.isReward) {
        const rewardExists = prev.some(
          (cartItem) => cartItem.id === item.id && cartItem.isReward
        );

        if (rewardExists) return prev;

        return [
          ...prev,
          {
            ...item,
            quantity: 1,
            price: 0,
            basePrice: "R0",
          },
        ];
      }

      const existingIndex = prev.findIndex(
        (cartItem) =>
          !cartItem.isReward &&
          cartItem.itemName === item.itemName &&
          cartItem.optionLabel === item.optionLabel &&
          cartItem.chips === item.chips &&
          cartItem.drink === item.drink
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prev];

        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: (updatedCart[existingIndex].quantity || 1) + 1,
        };

        return updatedCart;
      }

      return [
        ...prev,
        {
          ...item,
          quantity: item.quantity || 1,
        },
      ];
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((sum, item) => {
    if (item.isReward) return sum;

    const itemPrice =
      typeof item.price === "number"
        ? item.price
        : Number(item.basePrice.replace("R", "").replace(",", "")) || 0;

    return sum + itemPrice * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}