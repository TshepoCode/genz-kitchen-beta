"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import { useCart } from "@/app/context/CartContext";
import { createClient } from "@supabase/supabase-js";
import {
  Beef,
  Sandwich,
  UtensilsCrossed,
  Drumstick,
  PackageOpen,
  CupSoda,
  ArrowLeft,
  Trash2,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ChoiceItem {
  name: string;
  image: string | StaticImageData;
  price?: string;
}

interface MealStep {
  title: string;
  type: "single";
  choices: ChoiceItem[];
}

interface MenuOption {
  label: string;
  price: string;
  image: string | StaticImageData;
  customizations?: MealStep[];
}

interface MenuItem {
  name: string;
  image: string | StaticImageData;
  options: MenuOption[];
}

const categories = [
  { name: "Burgers", icon: Beef },
  { name: "Hotdogs", icon: Sandwich },
  { name: "Wraps", icon: UtensilsCrossed },
  { name: "StickyWings", icon: Drumstick },
  { name: "Sides", icon: PackageOpen },
  { name: "Drinks", icon: CupSoda },
] as const;

type CategoryName = (typeof categories)[number]["name"];
type BuilderStep = "option" | "chips" | "drink" | "review";

const menuItems: Record<CategoryName, MenuItem[]> = {
  Burgers: [
    {
      name: "Give Me Zungu",
      image: "/GiveMeZungusingle.png",
      options: [
        {
          label: "Burger Only",
          price: "R59",
          image: "/GiveMeZungusingle.png",
        },
        {
          label: "Meal Deal",
          price: "R89",
          image: "/GiveMeZunguWebsite.png",
          customizations: [
            {
              title: "Choose your chips",
              type: "single",
              choices: [{ name: "Plain Chips", image: "/smallFriesBg.png" }],
            },
            {
              title: "Choose your drink",
              type: "single",
              choices: [
                { name: "Coke", image: "/coke.png" },
                { name: "Sprite", image: "/Sprite.png" },
                { name: "Fanta Orange", image: "/Fanta.png" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Matla Thata Burger",
      image: "/Matla Thata.png",
      options: [
        {
          label: "Burger Only",
          price: "R79",
          image: "/Matla Thata.png",
        },
        {
          label: "Meal Option",
          price: "R95",
          image: "/MatlaThataMeal2.png",
          customizations: [
            {
              title: "Choose your chips",
              type: "single",
              choices: [{ name: "Plain Chips", image: "/smallFriesBg.png" }],
            },
            {
              title: "Choose your drink",
              type: "single",
              choices: [
                { name: "Coke", image: "/coke.png" },
                { name: "Sprite", image: "/Sprite.png" },
                { name: "Fanta Orange", image: "/Fanta.png" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Single Mingle Burger",
      image: "/singleMingleWeb.png",
      options: [
        {
          label: "Burger Only",
          price: "R35",
          image: "/singleMingleWeb.png",
        },
        {
          label: "Meal",
          price: "R75",
          image: "/singleMingleMeal.png",
          customizations: [
            {
              title: "Choose your chips",
              type: "single",
              choices: [{ name: "Plain Chips", image: "/smallFriesBg.png" }],
            },
            {
              title: "Choose your drink",
              type: "single",
              choices: [
                { name: "Coke", image: "/coke.png" },
                { name: "Sprite", image: "/Sprite.png" },
                { name: "Fanta Orange", image: "/Fanta.png" },
              ],
            },
          ],
        },
      ],
    },
  ],
  Hotdogs: [
    {
      name: "Bacon Bite Hotdog",
      image: "/baconbitehotdog.png",
      options: [
        {
          label: "Standard",
          price: "R55",
          image: "/baconbitehotdog.png",
        },
      ],
    },
  ],
  Wraps: [
    {
      name: "Crunch Box Wrap",
      image: "/CrunchBoss1.png",
      options: [
        {
          label: "Standard",
          price: "R59",
          image: "/CrunchBoss1.png",
        },
        {
          label: "Meal Option",
          price: "R69",
          image: "/Levelupyourwrapgame.png",
        },
      ],
    },
    {
      name: "Kasi Styled Wrap Small",
      image: "/KasiStyledWrapSmall.png",
      options: [
        {
          label: "Standard",
          price: "R35",
          image: "/KasiStyledWrapSmall.png",
        },
      ],
    },
    {
      name: "Kasi Styled Wrap Medium",
      image: "/KasiStyleWrapMedium.png",
      options: [
        {
          label: "Standard",
          price: "R55",
          image: "/KasiStyleWrapMedium.png",
        },
      ],
    },
    {
      name: "Kasi Styled Wraps Large",
      image: "/KasiStyledWrapLarge2.png",
      options: [
        {
          label: "Standard",
          price: "R75",
          image: "/KasiStyledWrapLarge2.png",
        },
      ],
    },
    {
      name: "Kasi Styled Wrap Extra Large",
      image: "/KasiStyledWrapXL.png",
      options: [
        {
          label: "Standard",
          price: "R95",
          image: "/KasiStyledWrapXL.png",
        },
      ],
    },
  ],
  StickyWings: [
    {
      name: "Mama's Sticky Wings",
      image: "/Mamastickywingsnow!.png",
      options: [
        {
          label: "Standard",
          price: "R59",
          image: "/Mamastickywingsnow!.png",
        },
      ],
    },
    {
      name: "Mama's Sticky Wings",
      image: "/MamaWings10.png",
      options: [
        {
          label: "standard",
          price: "R110",
          image: "/MamaWings10.png",
        }
      ]
    }
  ],
  Sides: [
    {
      name: "Flamin Hot Street-style Tacos",
      image: "/FlaminHotStreet-styleTacos.png",
      options: [
        {
          label: "Standard",
          price: "R75",
          image: "/FlaminHotStreet-styleTacos.png",
        },
      ],
    },
    {
      name: "Small Fries",
      image: "/smallFriesBg.png",
      options: [
        {
          label: "Standard",
          price: "R10",
          image: "/smallFriesBg.png",
        },
      ],
    },
    {
      name: "Cheesy Jalapeno Fries",
      image: "/CheesyjalapenoFries.png",
      options: [
        {
          label: "Standard",
          price: "R45",
          image: "/CheesyjalapenoFries.png",
        },
      ],
    },
    {
      name: "Lunch Box Toast",
      image: "/Lunchboxtoastwithmeltedcheese.png",
      options: [
        {
          label: "Standard",
          price: "R35",
          image: "/Lunchboxtoastwithmeltedcheese.png",
        },
      ],
    },
    {
      name: "Bundle of Joys",
      image: "/bundleofjoymealdeal.png",
      options: [
        {
          label: "Standard",
          price: "R90",
          image: "/bundleofjoymealdeal.png",
        },
      ],
    },
  ],
  Drinks: [
    {
      name: "Sprite",
      image: "/Sprite.png",
      options: [
        {
          label: "Standard",
          price: "R19",
          image: "/Sprite.png",
        },
      ],
    },
    {
      name: "Coke",
      image: "/coke.png",
      options: [
        {
          label: "Standard",
          price: "R19",
          image: "/coke.png",
        },
      ],
    },
    {
      name: "Fanta Orange",
      image: "/Fanta.png",
      options: [
        {
          label: "Standard",
          price: "R19",
          image: "/Fanta.png",
        },
      ],
    },
  ],
};

export default function MenuClient() {
  const [customerEmail, setCustomerEmail] = useState("");
  const [active, setActive] = useState<CategoryName>("Burgers");
  const [selectedCard, setSelectedCard] = useState<MenuItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);
  const [selectedChips, setSelectedChips] = useState<ChoiceItem | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<ChoiceItem | null>(null);
  const [builderStep, setBuilderStep] = useState<BuilderStep>("option");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isFinalCheckoutOpen, setIsFinalCheckoutOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [orderType, setOrderType] = useState<"delivery" | "collection" | "">(
    ""
  );

  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    async function loadCustomer() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setCustomerEmail(user.email);
      }
    }

    loadCustomer();
  }, []);

  function getPriceNumber(price: string) {
    return Number(price.replace("R", "").replace(",", "").trim()) || 0;
  }

  const cartTotal = cart.reduce((total, item) => {
    if (item.isReward) return total;

    const quantity = item.quantity || 1;
    const price =
      typeof item.price === "number"
        ? item.price
        : getPriceNumber(item.basePrice);

    return total + price * quantity;
  }, 0);

  const rewardPointsTotal = cart.reduce((total, item) => {
    if (!item.isReward) return total;
    return total + (item.pointsCost || 0);
  }, 0);

  const activeItems = menuItems[active];

  function getLowestPrice(options: MenuOption[]) {
    const values = options.map((option) => getPriceNumber(option.price));
    return `R${Math.min(...values)}`;
  }

  function resetBuilder() {
    setSelectedCard(null);
    setSelectedOption(null);
    setSelectedChips(null);
    setSelectedDrink(null);
    setBuilderStep("option");
  }

  function handleCategoryChange(category: CategoryName) {
    setActive(category);
    resetBuilder();
  }

  function handleSelectCard(item: MenuItem) {
    setSelectedCard(item);
    setSelectedOption(null);
    setSelectedChips(null);
    setSelectedDrink(null);
    setBuilderStep("option");
  }

  function handleSelectOption(option: MenuOption) {
    setSelectedOption(option);
    setSelectedChips(null);
    setSelectedDrink(null);

    if (option.customizations?.length) {
      setBuilderStep("chips");
    } else {
      setBuilderStep("review");
    }
  }

  function handleSelectChips(chip: ChoiceItem) {
    setSelectedChips(chip);
    setBuilderStep("drink");
  }

  function handleSelectDrink(drink: ChoiceItem) {
    setSelectedDrink(drink);
    setBuilderStep("review");
  }

  function handleAddToCart() {
    if (!selectedCard || !selectedOption) return;

    const needsMealChoices = Boolean(selectedOption.customizations?.length);

    if (needsMealChoices && (!selectedChips || !selectedDrink)) {
      alert("Please select chips and drink first.");
      return;
    }

    addToCart({
      id: crypto.randomUUID(),
      itemName: selectedCard.name,
      optionLabel: selectedOption.label,
      basePrice: selectedOption.price,
      price: getPriceNumber(selectedOption.price),
      quantity: 1,
      image: typeof selectedOption.image === "string" ? selectedOption.image : "",
      chips: selectedChips?.name,
      drink: selectedDrink?.name,
      customerEmail,
      isReward: false,
      pointsCost: 0,
    });

    resetBuilder();
    setIsCartOpen(true);
  }

  const selectedHeading = useMemo(() => {
    if (!selectedCard) return "";
    return `${selectedCard.name} Options`;
  }, [selectedCard]);

  const chipsStep = selectedOption?.customizations?.[0];
  const drinkStep = selectedOption?.customizations?.[1];

  function handlePlaceOrder() {
    if (!orderType) return;

    if (rewardPointsTotal > 0 && !customerEmail) {
      alert("Please login first before redeeming rewards.");
      return;
    }

    const deliveryFee = orderType === "delivery" ? 30 : 0;
    const finalTotal = cartTotal + donationAmount + deliveryFee;

    const orderMessage = cart
      .map((item, index) => {
        const quantity = item.quantity || 1;

        if (item.isReward) {
          return `${index + 1}. REWARD ITEM: ${item.itemName}
Customer Email: ${item.customerEmail || customerEmail || "Not logged in"}
Points To Subtract: ${item.pointsCost || 0}
Price: R0`;
        }

        return `${index + 1}. ${item.itemName} - ${item.optionLabel}
Quantity: ${quantity}
${item.chips ? `Chips: ${item.chips}` : ""}
${item.drink ? `Drink: ${item.drink}` : ""}
Price: ${item.basePrice}`;
      })
      .join("\n\n");

    const message = `Hi GenZ Kitchen, I would like to place an order:

Customer Email: ${customerEmail || "Not logged in"}

${orderMessage}

Order Type: ${orderType}
Donation: R${donationAmount}
Delivery: R${deliveryFee}
Reward Points To Subtract After Approval: ${rewardPointsTotal}

Total To Pay: R${finalTotal}`;

    const whatsappUrl = `https://wa.me/27676325434?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");

    clearCart();
    setOrderType("");
    setDonationAmount(0);
    setIsFinalCheckoutOpen(false);
    setIsDonationOpen(false);
    setIsCartOpen(false);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <NavBar onCartClick={() => setIsCartOpen(true)} />

      <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-8 px-4 pb-28 md:mt-10 md:flex-row md:px-6 md:pb-10">
        <aside className="fixed bottom-0 left-0 z-50 w-full border-t border-zinc-200 bg-white md:static md:w-60 md:border-t-0 md:border-r md:border-zinc-200 md:pr-6">
          <h2 className="mb-6 hidden text-xl font-bold text-black md:block">
            MENU
          </h2>

          <div className="flex gap-3 overflow-x-auto px-4 py-3 md:flex-col md:gap-3 md:overflow-visible md:px-0 md:py-0">
            {categories.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => handleCategoryChange(item.name)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2 text-sm transition md:text-base ${
                    isActive
                      ? "border-lime-400 bg-lime-400 font-semibold text-black"
                      : "border-zinc-200 bg-black text-white hover:text-lime-400"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-lime-500 md:text-3xl md:font-bold">
                {selectedCard ? selectedHeading : active}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {selectedCard
                  ? "Build your order step by step."
                  : "Select an item to view its options."}
              </p>
            </div>

            {selectedCard && (
              <button
                onClick={resetBuilder}
                className="rounded-full bg-black p-2 text-white md:flex md:items-center md:gap-2 md:px-4 md:py-2"
              >
                <ArrowLeft size={20} />
                <span className="hidden md:block">Back</span>
              </button>
            )}
          </div>

          {!selectedCard ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {activeItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCard(item)}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-lime-400"
                >
                  <div className="relative overflow-hidden h-[280px] w-full md:h-[280px] sm:h-[180px] sm:w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-2 p-4">
                    <p className="text-lg font-semibold text-black">
                      {item.name}
                    </p>
                    <p className="text-base font-bold text-white bg-lime-600 inline-block rounded-full px-3 py-1 w-max">
                      From {getLowestPrice(item.options)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {builderStep === "option" && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {selectedCard.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(option)}
                      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-lime-400"
                    >
                      <div className="relative overflow-hidden h-[280px] w-full md:h-[280px] sm:h-[180px] sm:w-full">
                        <Image
                          src={option.image}
                          alt={option.label}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-3 p-3 md:p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold text-black md:text-lg">
                            {option.label}
                          </h3>
                          <p className="text-sm font-bold text-lime-600 md:text-lg">
                            {option.price}
                          </p>
                        </div>

                        <div className="rounded-xl bg-lime-400 px-4 py-2 text-center text-sm font-semibold text-black md:py-3">
                          Choose Option
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {builderStep === "chips" && chipsStep && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-lime-500 md:text-2xl">
                    {chipsStep.title}
                  </h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {chipsStep.choices.map((chip) => (
                      <button
                        key={chip.name}
                        onClick={() => handleSelectChips(chip)}
                        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-lime-400"
                      >
                        <div className="relative h-[180px] w-full md:h-[180px] overflow-hidden">
                          <Image
                            src={chip.image}
                            alt={chip.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="space-y-3 p-3 md:p-5">
                          <h3 className="text-sm font-semibold text-black md:text-lg">
                            {chip.name}
                          </h3>

                          <div className="rounded-xl bg-lime-400 px-4 py-2 text-center text-sm font-semibold text-black md:py-3">
                            Select Chips
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {builderStep === "drink" && drinkStep && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-lime-500 md:text-2xl">
                    {drinkStep.title}
                  </h2>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {drinkStep.choices.map((drink) => (
                      <button
                        key={drink.name}
                        onClick={() => handleSelectDrink(drink)}
                        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-lime-400"
                      >
                        <div className="relative overflow-hidden h-[280px] w-full md:h-[280px] sm:h-[180px] sm:w-full">
                          <Image
                            src={drink.image}
                            alt={drink.name}
                            fill
                            className="object-contain p-4"
                          />
                        </div>

                        <div className="space-y-3 p-3 md:p-5">
                          <h3 className="text-sm font-semibold text-black md:text-lg">
                            {drink.name}
                          </h3>

                          <div className="rounded-xl bg-lime-400 px-4 py-2 text-center text-sm font-semibold text-black md:py-3">
                            Select Drink
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {builderStep === "review" && selectedOption && selectedCard && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:p-6">
                  <h2 className="text-lg font-semibold text-lime-500 md:text-2xl">
                    Ready to add to cart
                  </h2>

                  <div className="mt-5 space-y-3 rounded-2xl bg-zinc-50 p-4">
                    <p className="flex justify-between text-sm">
                      <span className="text-zinc-600">Item</span>
                      <span className="font-semibold">{selectedCard.name}</span>
                    </p>

                    <p className="flex justify-between text-sm">
                      <span className="text-zinc-600">Option</span>
                      <span className="font-semibold">
                        {selectedOption.label}
                      </span>
                    </p>

                    {selectedChips && (
                      <p className="flex justify-between text-sm">
                        <span className="text-zinc-600">Chips</span>
                        <span className="font-semibold">
                          {selectedChips.name}
                        </span>
                      </p>
                    )}

                    {selectedDrink && (
                      <p className="flex justify-between text-sm">
                        <span className="text-zinc-600">Drink</span>
                        <span className="font-semibold">
                          {selectedDrink.name}
                        </span>
                      </p>
                    )}

                    <p className="flex justify-between border-t pt-3 text-sm">
                      <span className="text-zinc-600">Price</span>
                      <span className="text-base font-bold text-lime-500">
                        {selectedOption.price}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="mt-5 w-full rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:opacity-90"
                  >
                    Add to Cart • {selectedOption.price}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-[90%] max-w-md overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-black">Your Cart</h2>

              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-full bg-black px-3 py-1 text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-zinc-500">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-zinc-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-black">
                          {item.itemName}
                        </p>

                        <p className="text-sm text-zinc-500">
                          {item.optionLabel}
                        </p>

                        {item.chips && (
                          <p className="text-sm text-zinc-500">
                            Chips: {item.chips}
                          </p>
                        )}

                        {item.drink && (
                          <p className="text-sm text-zinc-500">
                            Drink: {item.drink}
                          </p>
                        )}

                        {(item.quantity || 1) > 1 && (
                          <p className="text-sm text-zinc-500">
                            Qty: {item.quantity}
                          </p>
                        )}

                        {item.isReward ? (
                          <p className="mt-2 font-bold text-lime-800">
                            Reward • {item.pointsCost} points
                          </p>
                        ) : (
                          <p className="mt-2 font-bold text-lime-800">
                            {item.basePrice}
                          </p>
                        )}

                        {item.customerEmail && (
                          <p className="mt-1 text-xs text-zinc-400">
                            Email: {item.customerEmail}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-full bg-red-700 p-2 text-white transition hover:opacity-90"
                        aria-label="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="sticky bottom-0 mt-6 border-t border-zinc-200 bg-white pt-4">
                <div className="mb-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-black">
                      Paid Items Total
                    </span>
                    <span className="text-xl font-bold text-black">
                      R{cartTotal}
                    </span>
                  </div>

                  {rewardPointsTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-black">
                        Reward Points
                      </span>
                      <span className="text-sm font-bold text-lime-700">
                        {rewardPointsTotal} pts
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsDonationOpen(true)}
                  className="w-full rounded-xl bg-lime-400 px-4 py-3 font-bold text-black transition hover:bg-lime-300"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isDonationOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-md space-y-4 rounded-2xl bg-white p-6">
            <h2 className="text-center text-xl font-bold text-black">
              Support GenZ Kitchen ❤️
            </h2>

            <p className="text-center text-sm text-zinc-500">
              Would you like to add a small donation?
            </p>

            <button
              onClick={() => {
                setDonationAmount(5);
                setIsDonationOpen(false);
                setIsFinalCheckoutOpen(true);
              }}
              className="w-full rounded-xl bg-lime-400 py-3 font-bold"
            >
              Donate R5
            </button>

            <button
              onClick={() => {
                setDonationAmount(12);
                setIsDonationOpen(false);
                setIsFinalCheckoutOpen(true);
              }}
              className="w-full rounded-xl bg-lime-400 py-3 font-bold"
            >
              Donate R12
            </button>

            <button
              onClick={() => {
                setDonationAmount(0);
                setIsDonationOpen(false);
                setIsFinalCheckoutOpen(true);
              }}
              className="w-full rounded-xl bg-black py-3 text-white"
            >
              No Donation
            </button>
          </div>
        </div>
      )}

      {isFinalCheckoutOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-md space-y-4 rounded-2xl bg-white p-6">
            <h2 className="text-center text-xl font-bold text-black">
              Final Checkout
            </h2>

            <button
              onClick={() => setOrderType("collection")}
              className={`w-full rounded-xl py-3 font-bold ${
                orderType === "collection" ? "bg-lime-400" : "bg-zinc-200"
              }`}
            >
              Collection
            </button>

            <button
              onClick={() => setOrderType("delivery")}
              className={`w-full rounded-xl py-3 font-bold ${
                orderType === "delivery" ? "bg-lime-400" : "bg-zinc-200"
              }`}
            >
              Delivery (+R30)
            </button>

            <p className="text-sm text-zinc-500">
              Delivery is currently available in Kagiso only. If you choose
              delivery, please send your address on WhatsApp.
            </p>

            <div className="space-y-1 border-t pt-3 text-sm">
              <p>Paid Items: R{cartTotal}</p>
              <p>Donation: R{donationAmount}</p>
              <p>Delivery: R{orderType === "delivery" ? 30 : 0}</p>

              {rewardPointsTotal > 0 && (
                <p>Reward Points To Subtract: {rewardPointsTotal}</p>
              )}

              <p className="text-lg font-bold">
                Total To Pay: R
                {cartTotal +
                  donationAmount +
                  (orderType === "delivery" ? 30 : 0)}
              </p>
            </div>

            <button
              disabled={!orderType}
              onClick={handlePlaceOrder}
              className="w-full rounded-xl bg-black py-3 font-bold text-white disabled:opacity-50"
            >
              Place Order
            </button>

            <button
              onClick={() => {
                setIsFinalCheckoutOpen(false);
                setIsCartOpen(true);
              }}
              className="text-sm font-semibold text-black"
            >
              ← Return to Cart
            </button>
          </div>
        </div>
      )}
    </main>
  );
}