import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { storage } from "../firebase/firebaseConfig";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { applyVikingStyle } from "../Components/services/replicateService";
//import { usePhoto } from "../Components/Context/PhotoContext";
import { useLocation } from "react-router-dom";

const FotoBooth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showPreparado, setShowPreparado] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [finalImageURL, setFinalImageURL] = useState(null);
  
  //si el user respondio 2 o 3 preguntas correctas passed = true
  //si el user respondio 0 o 1 preguntas correctas passed = false
  const location = useLocation();
  const passed = location.state?.passed;
  console.log("Passed:", passed);

  

  const [isMobile, setIsMobile] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const marcoRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
  }, []);

  useEffect(() => {
    if (!loading) {
      setShowPreparado(true);
      setTimeout(() => {
        setShowPreparado(false);
        startCountdown();
      }, 4500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        capturePhoto();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const capturePhoto = async () => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (video && context) {
      const marco = marcoRef.current;
      const canvasWidth = marco ? marco.width : 1080;
      const canvasHeight = marco ? marco.height : 1920;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      const videoAspectRatio = videoWidth / videoHeight;
      const targetAspectRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (videoAspectRatio > targetAspectRatio) {
        drawHeight = canvasHeight;
        drawWidth = drawHeight * videoAspectRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / videoAspectRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // 1. Dibujar imagen original (normal) en el canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
      context.setTransform(1, 0, 0, 1, 0, 0);

      // 2. Dibujar marco sobre la imagen original
      if (marco) {
        context.drawImage(marco, 0, 0, canvas.width, canvas.height);
      }

      // 3. Mostrar imagen original con marco mientras IA trabaja
      const displayImage = canvas.toDataURL("image/png");
      setCapturedImage(displayImage);

      setTimeout(() => {
        setCapturedImage("/loading.gif");
      }, 4000);
      
      // 4. Subir imagen sin marco para IA
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
      context.setTransform(1, 0, 0, 1, 0, 0);
      const imageOnlyPhoto = canvas.toDataURL("image/png");

      const storageRef = ref(storage, `fotos/original-${Date.now()}.png`);
      try {
       
        await uploadString(storageRef, imageOnlyPhoto, "data_url");
        const downloadURL = await getDownloadURL(storageRef);
        console.log("✅ Imagen original subida:", downloadURL);

        // 5. Aplicar estilo IA
        console.log(`imagen original URL🚀:`, downloadURL, "passed:", passed);
        const vikingImageUrl = await applyVikingStyle(downloadURL, passed); 
        if (vikingImageUrl) {
          const transformedImage = new Image();
          transformedImage.crossOrigin = "anonymous";
          transformedImage.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(
              transformedImage,
              0,
              0,
              canvas.width,
              canvas.height
            );
            if (marco) {
              context.drawImage(marco, 0, 0, canvas.width, canvas.height);
            }

            // 6. Mostrar imagen final con IA y marco
            const finalImage = canvas.toDataURL("image/png");
            setCapturedImage(finalImage);
            setFinalImageURL(finalImage);

            // 7. Subir imagen final (opcional)
            const finalRef = ref(storage, `fotos/final-${Date.now()}.png`);
            uploadString(finalRef, finalImage, "data_url")
              .then(() => getDownloadURL(finalRef))
              .then((url) => {
                console.log("✅ Imagen final subida con URL:", url);
                setFinalImageURL(url); // Esta sí es la URL pública
              })
              .catch((err) => console.error("❌ Error al subir final:", err));
          };
          transformedImage.src = vikingImageUrl;
        }
      } catch (error) {
        console.error("❌ Error:", error);
      }
    }
  };

  const retake = () => {
    setFinalImageURL(null); 
    setCapturedImage(null);
    setLoading(false);
    setShowPreparado(true);
    setTimeout(() => {
      setShowPreparado(false);
      startCountdown();
    }, 1500);
  };

  

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {loading && (
        <img
          src="/loading.gif"
          alt="Cargando..."
          className="absolute w-24 h-24 animate-spin z-0"
        />
      )}

      {!capturedImage && (
        <Webcam
          ref={webcamRef}
          className={`absolute top-0 left-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          videoConstraints={{
            aspectRatio: isMobile ? 3 / 4 : 9 / 16,
            facingMode: "user",
          }}
          onUserMedia={() => setLoading(false)}
        />
      )}

      <canvas ref={canvasRef} className="hidden" />

      {(!capturedImage || capturedImage.includes("loading.gif")) && (
  <img
    ref={marcoRef}
    src="/marco.png"
    alt="Marco Photobooth"
    className="absolute w-full h-full pointer-events-none z-20"
  />
)}


      {showPreparado && (
        <img
          src="/preparate.png"
          alt="Prepárate para la foto"
          className="absolute mt-[-1200px] w-[70%] h-24"
        />
      )}

      {countdown !== null && (
        <img
          src={`/${countdown}.png`}
          alt={`Número ${countdown}`}
          className="absolute mt-[-400px] w-12 h-12"
        />
      )}

{capturedImage && (
  <img
    src={capturedImage}
    alt="Foto tomada"
    className={`absolute pointer-events-none ${
      capturedImage.includes("loading.gif")
        ? "w-24 h-24 object-contain  z-0"
        : "w-full h-full object-cover  z-10"
    }`}
  />
)}

{finalImageURL && (
  <button
    alt="Botón Return"
    className={`absolute z-[9999] bg-white w-20 h-8 mt-[115%] mr-40 
      md:w-64 md:h-20 md:mt-[132%] md:mr-[45%] 
      xl:w-20 xl:h-28 xl:mt-[100%] xl:mr-48 
      py-2 px-4 rounded-3xl text-4xl transition-all duration-300 
      hover:bg-gray-200 active:bg-white active:text-black`}
    onClick={() => {
      retake();
      setCapturedImage(null);
    }}
  >
    Repetir
  </button>
)}

{/* 
      <img
        src="/cam.png"
        alt="cam"
        className="absolute w-10 h-10 mt-[115%] mr-0 md:w-24 md:h-20 md:mt-[100%] md:mr-[1%] xl:w-20 xl:h-28 xl:mt-[100%] xl:mr-48"
      /> */}

{finalImageURL && (
        <button
          disabled={!finalImageURL?.includes("firebasestorage.googleapis.com")}
          className={`absolute z-[9999] bg-white w-20 h-[5%] mt-[115%] ml-40 
            md:w-64 md:h-[4.8%] md:mt-[132%] md:ml-[45%] xl:w-22 xl:h-28 xl:mt-[98%] xl:ml-48 
            py-2 px-4 rounded-3xl text-4xl transition-all duration-300 
            ${!finalImageURL?.includes("firebasestorage.googleapis.com") ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-200 active:bg-white active:text-black'}`}
          onClick={() => {
            navigate("/qr", { state: { imageUrl: finalImageURL } });
          }}
        >
          Finalizar
        </button>
      )}


    </div>
  );
};

export default FotoBooth;
