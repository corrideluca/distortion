export default function Footer() {
  return (
    <footer className="bg-[#000000] text-[#ffffff] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              <span className="text-[#ffffff]">Dis</span>
              <span className="text-[#ffffff]">tortion</span>
            </h3>
            <p className="text-[#ffffff] mb-6 sm:mb-8 text-sm sm:text-base">
              Streetwear con identidad propia
            </p>

            <div className="space-y-3 sm:space-y-4">
              {/* WhatsApp */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffffff] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <a
                  href="https://wa.me/5491160286919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ffffff] hover:text-[#ebebeb] transition-colors font-medium text-sm sm:text-base"
                >
                  +54 9 11 6028-6919
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffffff] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@distortionbrand.com"
                  className="text-[#ffffff] hover:text-[#ebebeb] transition-colors font-medium text-sm sm:text-base break-all"
                >
                  info@distortionbrand.com
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffffff] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-[#ffffff] text-sm sm:text-base">
                  CP B1617 — Gral. Pacheco, Buenos Aires
                </span>
              </div>
            </div>
          </div>

          {/* Google Maps — area view, no specific address pin */}
          <div className="h-[250px] sm:h-[300px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d26322!2d-58.638!3d-34.459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sar!4v1706123456789!5m2!1sen!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Distortion Zone"
            ></iframe>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-[#ffffff]/20">
          <p className="text-[#ffffff]/70 text-sm">
            © 2025 Distortion. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
