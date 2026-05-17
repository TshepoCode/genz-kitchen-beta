"use client";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-lime-400 text-black px-4 py-2 rounded-full hover:bg-lime-700 transition"
    >
      {children}
    </button>
  );
}