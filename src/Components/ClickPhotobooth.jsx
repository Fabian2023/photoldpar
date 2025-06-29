import { useNavigate,useLocation } from "react-router-dom";
// import { useState } from "react";

const ClickPhotobooth = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const passed = location.state?.passed || false;
    // const [inputValue, setInputValue] = useState("");

    const handleDivClick = () => {
        // setInputValue(""); 
        navigate("/photo", { state: { passed } });
    };
    
    return (
        <div 
            className="relative w-full h-screen flex flex-col items-center justify-center text-center cursor-pointer"
            
        >
            {/* Imagen de fondo */}
            <img 
                src="/clickphoto.jpg" 
                alt="Background" 
                className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Input transparente */}
            <button 
                type="text" 
                // value={inputValue}
                // onChange={(e) => setInputValue(e.target.value)}
                onClick={handleDivClick}
                className="absolute top-[55%] h-[24%] w-[64%] text-5xl rounded-xl left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-transparent focus:outline-none"
            />

            {/* Div transparente con onClick */}

        </div>
    );
};

export default ClickPhotobooth;