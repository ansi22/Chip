import { chip, user } from "../types/user";

export default function Chip({ isHighlighted, name, img }: chip ) {
  return (
    <div className={`flex flex-row gap-2 justify-center items-center ${isHighlighted?"bg-gray-300":"bg-gray-100"} rounded-full px-8 py-2`}>
      <img src={img} className="w-6 h-6 rounded-full" alt="profile" />
      <p>{name}</p>
      <img src="/assets/close.png" alt="close" className="w-4 h-4" />
    </div>
  );
}
