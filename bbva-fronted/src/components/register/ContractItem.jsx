import { FileText } from "lucide-react";

export default function ContractItem({ title }) {
  return (
    <div className="
      bg-white
      rounded-2xl
      p-6
      flex
      items-center
      gap-4
      mb-4
      text-[#0726B4]
      font-bold
      text-xl
      cursor-pointer
      hover:bg-blue-50
      transition
    ">
      <FileText size={24} />

      {title}
    </div>
  );
}