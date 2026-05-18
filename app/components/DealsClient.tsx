"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "./NavBar";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Deal = {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  image: string;
};

const rewardDeals: Deal[] = [
  {
    id: "1",
    title: "Free Small Chips",
    description: "Redeem your points for crispy small chips.",
    points_cost: 3500,
    image: "/smallFriesBg.webp",
  },
  {
    id: "2",
    title: "Free Coke",
    description: "Enjoy a refreshing Coke reward.",
    points_cost: 4000,
    image: "/coke.webp",
  },
  {
    id: "3",
    title: "Free Crunch Box",
    description: "Redeem your points for a Crunch Box reward.",
    points_cost: 5500,
    image: "/Levelupyourwrapgame.webp",
  },
  {
    id: "4",
    title: "Give Me Zungu",
    description: "Redeem your points for Give Me Zungu.",
    points_cost: 7000,
    image: "/GiveMeZungusingle.webp",
  },
  {
    id: "5",
    title: "XL Kasi Styled Wrap",
    description: "Redeem your points for an XL Kasi Styled Wrap.",
    points_cost: 10500,
    image: "/KasiStyledWrapXL.webp",
  },
];

export default function DealsClient() {
  const router = useRouter();
  const { cart, addToCart } = useCart();

  const [customerEmail, setCustomerEmail] = useState("");
  const [points, setPoints] = useState(0);
  const [selectedReward, setSelectedReward] = useState<Deal | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(true);

  useEffect(() => {
    async function loadCustomer() {
      try {
        setIsLoadingCustomer(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("User fetch error:", userError.message);
          return;
        }

        if (!user?.email) {
          setCustomerEmail("");
          setPoints(0);
          return;
        }

        setCustomerEmail(user.email);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("points")
          .eq("email", user.email)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError.message);
          setPoints(0);
          return;
        }

        setPoints(Number(profile?.points || 0));
      } catch (error) {
        console.error("Customer loading failed:", error);
      } finally {
        setIsLoadingCustomer(false);
      }
    }

    loadCustomer();
  }, []);

  const getAlreadyInCart = (dealId: string) => {
    return cart.some((item) => item.isReward === true && item.id === dealId);
  };

  const selectReward = (deal: Deal) => {
    setSelectedReward(deal);

    setTimeout(() => {
      document
        .getElementById("reward-checkout")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleRedeemReward = () => {
    if (!selectedReward) {
      alert("Please select a reward first.");
      return;
    }

    if (!customerEmail) {
      alert("Please login first before redeeming a reward.");
      router.push("/login");
      return;
    }

    if (points < selectedReward.points_cost) {
      const pointsNeeded = selectedReward.points_cost - points;
      alert(`You need ${pointsNeeded} more points to redeem this reward.`);
      return;
    }

    const alreadyInCart = getAlreadyInCart(selectedReward.id);

    if (alreadyInCart) {
      alert("This reward is already in your cart.");
      return;
    }

    addToCart({
      id: selectedReward.id,
      itemName: selectedReward.title,
      optionLabel: "Reward Item",
      basePrice: "R0",
      price: 0,
      quantity: 1,
      image: selectedReward.image,
      customerEmail,
      isReward: true,
      pointsCost: selectedReward.points_cost,
    });

    alert(`${selectedReward.title} added to cart. Go to Menu to checkout.`);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <NavBar onCartClick={() => router.push("/menu")} />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8 rounded-3xl bg-zinc-50 p-5 sm:p-7">
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            <span>GenZ </span>
            <span className="text-lime-500">Rewards</span>
          </h1>

          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Choose a reward and redeem it using your GenZ Kitchen points.
          </p>

          <div className="mt-5 inline-flex rounded-full bg-lime-100 px-5 py-3">
            <p className="text-sm font-bold text-lime-700 sm:text-base">
              Your Points: {isLoadingCustomer ? "Loading..." : points}
            </p>
          </div>
        </div>

        {!isLoadingCustomer && !customerEmail && (
          <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700 sm:text-base">
              Please login first to redeem rewards.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-4 w-full rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-lime-500 hover:text-black sm:w-auto"
            >
              Go to Login
            </button>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {rewardDeals.map((deal) => {
            const isSelected = selectedReward?.id === deal.id;
            const alreadyInCart = getAlreadyInCart(deal.id);
            const canAfford = points >= deal.points_cost;
            const pointsNeeded = Math.max(deal.points_cost - points, 0);

            return (
              <button
                type="button"
                key={deal.id}
                onClick={() => selectReward(deal)}
                className={`rounded-3xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 ${
                  isSelected
                    ? "border-lime-400 ring-2 ring-lime-300"
                    : "border-zinc-200"
                }`}
              >
                <div className="relative h-40 w-full sm:h-44">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 250px"
                    className="rounded-2xl object-contain"
                  />
                </div>

                <h2 className="mt-4 text-lg font-extrabold">{deal.title}</h2>

                <p className="mt-2 min-h-[40px] text-xs text-zinc-500">
                  {deal.description}
                </p>

                <div className="mt-4 rounded-full bg-lime-100 px-2 py-1 text-center">
                  <p className="text-xs font-bold text-lime-700">
                    {deal.points_cost} Points Needed
                  </p>
                </div>

                <div
                  className={`mt-5 w-full rounded-full px-2 py-2 text-center text-sm font-bold ${
                    alreadyInCart
                      ? "bg-zinc-300 text-black"
                      : canAfford
                      ? "bg-lime-400 text-black"
                      : "bg-zinc-200 text-zinc-500"
                  }`}
                >
                  {alreadyInCart
                    ? "In Cart"
                    : canAfford
                    ? "Redeem Reward"
                    : `Need ${pointsNeeded} Points`}
                </div>
              </button>
            );
          })}
        </div>

        {selectedReward && (
          <div
            id="reward-checkout"
            className="mt-10 rounded-3xl border border-lime-300 bg-zinc-50 p-5 sm:p-6"
          >
            {(() => {
              const canAfford = points >= selectedReward.points_cost;
              const pointsNeeded = Math.max(
                selectedReward.points_cost - points,
                0
              );
              const alreadyInCart = getAlreadyInCart(selectedReward.id);

              return (
                <>
                  <h2 className="text-2xl font-bold text-black">
                    Selected Reward
                  </h2>

                  <p className="mt-3 text-lg font-bold text-black">
                    {selectedReward.title}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-bold uppercase text-zinc-400">
                        Required Points
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-lime-700">
                        {selectedReward.points_cost}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-bold uppercase text-zinc-400">
                        Your Points
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-black">
                        {points}
                      </p>
                    </div>
                  </div>

                  {customerEmail && (
                    <p className="mt-4 text-sm text-zinc-600">
                      Customer email:{" "}
                      <span className="font-bold text-black">
                        {customerEmail}
                      </span>
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleRedeemReward}
                      disabled={
                        isLoadingCustomer ||
                        !customerEmail ||
                        !canAfford ||
                        alreadyInCart
                      }
                      className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:bg-lime-500 hover:text-black disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-white"
                    >
                      {isLoadingCustomer
                        ? "Loading..."
                        : !customerEmail
                        ? "Login to Redeem"
                        : alreadyInCart
                        ? "Already in Cart"
                        : canAfford
                        ? "Redeem Reward"
                        : `Need ${pointsNeeded} More Points`}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/menu")}
                      className="w-full rounded-xl bg-lime-400 px-4 py-3 font-semibold text-black transition hover:bg-lime-300"
                    >
                      Go to Menu / Checkout
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-lime-200 bg-black p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-lime-400">
            How Rewards Work
          </h2>

          <div className="mt-4 space-y-3 text-sm text-white">
            <p>Choose the reward item you want to redeem.</p>
            <p>Add your reward to cart if you have enough points.</p>
            <p>Your customer email is saved with the reward order.</p>
            <p>Go to the menu and add normal paid items too.</p>
            <p>Checkout everything together from the menu cart.</p>
            <p>Admin subtracts your points after the order is completed.</p>
          </div>
        </div>
      </section>
    </main>
  );
}