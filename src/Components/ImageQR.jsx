import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; // Asegúrate de tener instalada esta librería

const ImageQR = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = location.state?.imageUrl;
  
  
  const handleRestart = () => {
    navigate("/"); // Cambia esta ruta si necesitas ir a otra diferente
  };
  
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src="/vistaFinal.png" // Ruta de la imagen de fondo
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover"
        />

      {/* Mostrar la imagen final encima de la imagen de fondo */}
      <div className="flex mt-150 gap-12 items-center justify-center relative">
        {imageUrl && (
          <div className=" mb-20  flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Imagen final"
              className="w-[50%] h-[50%] object-contain" // Ajusta el tamaño máximo de la imagen
              />
          </div>
        )}

        {/* Mostrar el QR debajo de la imagen final */
         console.log("imagen pasada al Qr",imageUrl)
        }
        {imageUrl && (
          <div className=" top-3/4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            
            <QRCodeCanvas value={imageUrl} size={256}   />
            <a
              href={imageUrl}
              download="foto.png"
              className="block mt-4 text-center text-white"
            >
              Descargar imagen
            </a>
          </div>
        )}
      </div>

      {/* Botón reiniciar debajo del QR */}
      <button
        onClick={handleRestart}
        className="absolute w-[30%] h-[5%] text-5xl bottom-44 px-6 py-2 bg-transparent  text-white border-4  rounded-xl hover:bg-gray-200 transition"
      >
        Reiniciar
      </button>
    </div>
  );
};

export default ImageQR;
