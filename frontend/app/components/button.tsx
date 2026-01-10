interface ButtonProps {
  text: string;
  type?: "button" | "submit";
}

export default function Button({ text, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      className="w-full bg-indigo-500 text-white py-2 rounded-md font-medium hover:bg-purple-500 transition"
    >
      {text}
    </button>
  );
}
