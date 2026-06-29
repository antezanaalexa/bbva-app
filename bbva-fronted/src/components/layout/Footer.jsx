export default function Footer() {
    return (
        <footer className="px-6 pb-10 relative">
            <div className="
                max-w-7xl
                mx-auto
                bg-[#0726B4]
                rounded-[30px]
                px-10
                py-8
                text-white
                relative
                border border-[#051D80]/20
            ">
                {/* Top Section: Logo and Social Media */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#051D80]/30 pb-5 mb-5 gap-4">
                    <span className="text-3xl font-extrabold tracking-tight">BBVA</span>
                    <div className="flex gap-4 text-white">
                        <a href="#" className="hover:text-blue-300 transition-colors" aria-label="Facebook">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                        </a>
                        <a href="#" className="hover:text-blue-300 transition-colors" aria-label="Twitter">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        <a href="#" className="hover:text-blue-300 transition-colors" aria-label="Instagram">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                        </a>
                        <a href="#" className="hover:text-blue-300 transition-colors" aria-label="LinkedIn">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                        <a href="#" className="hover:text-blue-300 transition-colors" aria-label="Youtube">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.023 0 12 0 12s0 3.977.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11c.502-1.86.502-5.837.502-5.837s0-3.977-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                    </div>
                </div>

                {/* Middle Section: Links */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-gray-300 mb-3">
                    <a href="#" className="hover:underline hover:text-white transition-colors">Seguridad</a>
                    <a href="#" className="hover:underline hover:text-white transition-colors">Aviso Legal</a>
                    <a href="#" className="hover:underline hover:text-white transition-colors">Cláusulas Generales de Contratación</a>
                    <a href="#" className="hover:underline hover:text-white transition-colors">Mapa del Sitio</a>
                    <a href="#" className="hover:underline hover:text-white transition-colors">Libro de Reclamaciones</a>
                </div>

                {/* Info Section */}
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-gray-400 mb-5">
                    <span>Llámanos (01) 595-0000</span>
                    <span>Banco BBVA Perú - RUC 20100130204</span>
                    <span>Av. República de Panamá 3055 - San Isidro</span>
                </div>

                {/* Bottom Section: Copyright */}
                <p className="text-[11px] text-gray-400">
                    © 2026 Banco Bilbao Vizcaya Argentaria, S.A.
                </p>
            </div>
        </footer>
    );
}