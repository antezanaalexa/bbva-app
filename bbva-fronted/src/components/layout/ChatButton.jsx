export default function ChatButton() {
    return (
        <div 
            className="fixed bottom-8 right-8 z-[9999] bg-white text-[#072146] flex flex-col items-center justify-center rounded-[20px] shadow-2xl w-[70px] h-[75px] cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 border border-gray-100/50"
            onClick={() => alert("Simulación: Abriendo chat de soporte de BBVA Perú Simulado.")}
        >
            <svg 
                className="w-6 h-6 stroke-current text-[#0726B4]" 
                viewBox="0 0 24 24" 
                fill="none" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            <span className="text-[10px] font-extrabold mt-1 uppercase tracking-wider select-none">
                Chat
            </span>
        </div>
    );
}
