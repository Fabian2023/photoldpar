import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Welcome = () => {
   const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");

    const handleDivClick = () => {
        setInputValue(""); // Limpiar el input
        
        navigate("/trivia"); // Navegar a /trivia
    };
    
    return (
        <div 
            className="relative w-full h-screen flex flex-col items-center justify-center text-center cursor-pointer"
            
        >
            {/* Imagen de fondo */}
            <img 
                src="/vista1.png" 
                alt="Background" 
                className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Input transparente */}
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                 
                className="absolute top-[55%] h-[5%] text-5xl rounded-xl left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 bg-transparent border border-white text-white text-center placeholder-white focus:outline-none"
            />

            
            <div 
                onClick={ handleDivClick} className="absolute top-[82%] left-[80%] transform -translate-x-1/2 w-1/3 h-[10%]   cursor-pointer"
                
            >
                {/* Puedes agregar contenido aquí si es necesario */}
            </div>
        </div>
    );
};

export default Welcome;