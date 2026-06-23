export default function MoneyCard({ active, label, flag, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-56 bg-white rounded-2xl p-6 flex items-center gap-5 border-2 transition ${
        active ? "border-[#0726B4]" : "border-transparent"
      }`}
    >
      <span className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
        active ? "border-[#0726B4]" : "border-gray-400"
      }`}>
        {active && <span className="w-7 h-7 rounded-full bg-[#0726B4]" />}
      </span>

      <span className="text-3xl">{flag}</span>
      <span className="text-lg text-[#072146]">{label}</span>
    </button>
  );
}