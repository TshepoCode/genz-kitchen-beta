import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    slug: "cheesy-jalapeno-fries",
    title: "Cheesy Jalapeño Fries Just Dropped 🔥",
    image: "/CheesyJalapenoFries.webp",
    category: "New Drops",
    date: "27/05/2026",
    author: "Tshepo M.",
    content: [
      "Our new cheesy jalapeño fries are officially here. Crispy golden fries loaded with rich cheese sauce and spicy jalapeños for the perfect GenZ Kitchen flavor experience.",
      "GenZ Kitchen continues bringing bold flavor and exciting food experiences to Kagiso with premium fast-food concepts and creative menu drops.",
      "Stay tuned for more updates, influencer challenges, community stories and new meal launches. With only a month and a half in, we have so much more in store for GenZ Kitchen.",
      "We have not launched our Kiddy’s Meal yet, and we will be announcing the launch date soon. We also have exciting collaborations with a dessert brand called Mary N Dox coming soon.",
      "Follow us on social media and join our rewards program to be the first to know about new drops, exclusive offers and community events.",
    ],
  },
  {
    slug: "burger-updates",
    title: "Burger Updates Are Coming 🍔",
    image: "/GiveMeZunguburgerpromo.webp",
    category: "Burger Updates",
    date: "30/05/2026",
    author: "Tshepo M.",
    content: [
      "Our burgers are getting even better. GenZ Kitchen is working on more exciting burger options, meal combinations and bold sauces.",
      "From Give Me Zungu to Matla Thata, we are building meals that bring big flavor, good value and a proper GenZ Kitchen experience.",
      "Keep checking our news page for new burger drops, combo updates and limited-time specials.",
    ],
  },
  {
    slug: "delivery-news",
    title: "Delivery News Around Kagiso 🚚",
    image: "/GiveMeZunguburgerpromo.webp",
    category: "Delivery News",
    date: "30/05/2026",
    author: "Tshepo M.",
    content: [
      "GenZ Kitchen provides delivery around Kagiso, making it easier for customers to enjoy their favorite meals without leaving home.",
      "We are improving our ordering flow, delivery communication and customer updates so every order feels smooth from checkout to delivery.",
      "More delivery updates will be announced as we continue improving the GenZ Kitchen experience.",
    ],
  },
  {
    slug: "community",
    title: "Built With The Community 💚",
    image: "/CheesyJalapenoFries.webp",
    category: "Community",
    date: "30/05/2026",
    author: "Tshepo M.",
    content: [
      "GenZ Kitchen is more than food. It is about community, culture and building something fresh from Kagiso.",
      "From influencer challenges to customer rewards, we want our customers to feel part of the journey.",
      "Thank you for supporting GenZ Kitchen. We are just getting started.",
    ],
  },
];

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 text-center text-black">
        <div>
          <h1 className="text-3xl font-black">Article not found.</h1>

          <Link
            href="/blog"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 font-black text-white"
          >
            Return To News
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] sm:aspect-[16/9] sm:rounded-[32px]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="mt-8 md:mt-10">
          <p className="text-sm font-black uppercase tracking-wide text-lime-600">
            {article.category}
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight text-black sm:text-4xl md:text-6xl">
            {article.title}
          </h1>

          <p className="mt-4 text-sm font-bold text-zinc-500">
            Published {article.date}
          </p>

          <div className="mt-8 space-y-5 text-base leading-relaxed text-zinc-700 sm:text-lg md:mt-10">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex w-full items-center rounded-full bg-black/5 px-4 py-3 sm:w-80">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-400 text-lg font-black text-black">
                  {article.author.charAt(0)}
                </div>

                <div className="ml-3">
                  <p className="font-bold text-black">{article.author}</p>
                  <p className="text-xs text-zinc-500">Verified Customer</p>
                </div>
              </div>

              <Link
                href="/blog"
                className="flex h-14 w-full items-center justify-center rounded-full border-2 border-black bg-black/70 text-base font-black text-white transition hover:bg-black sm:h-16 sm:w-80 sm:text-lg"
              >
                Return To News
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}