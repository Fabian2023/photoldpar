import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import TermsAndConditions from "./TermsAndConditions";

const FormContact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false); // estado para el checkbox
  const [showTerms, setShowTerms] = useState(false); // estado para mostrar el modal
  const [modalMessage, setModalMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const saveDataToFirebase = async () => {
    try {
      await addDoc(collection(db, "users"), {
        name,
        email,
        timestamp: new Date(),
      });

      setName("");
      setEmail("");
      setAccepted(false);
      setModalMessage("Datos guardados exitosamente.");
    } catch (error) {
      console.error("Error al guardar los datos: ", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmailError(""); // Reiniciar el error de email al enviar el formulario
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email) {
      setModalMessage("Por favor, completa todos los campos.");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!accepted) {
      setModalMessage("Debes aceptar los términos y condiciones.");
      return;
    }
    saveDataToFirebase();
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center text-white">
    <img
      src="/bgForm.jpg"
      alt="Background"
      className="absolute top-0 left-0 w-full h-full object-cover object-center"
    />
  
    <h1 className="text-center text-2xl sm:text-6xl mb-4 mt-28 relative z-10 px-4">
      Dejanos tus datos y te la <br /> enviamos en segundos
    </h1>
  
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-10 p-6 sm:p-20 rounded-lg text-white "
    >
      {/* Campo Nombre */}
      <div className="relative flex items-center justify-center w-full">
        <img
          src="/nameIcon.png"
          alt="Icono Nombre"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4  sm:w-6 sm:h-6 brightness-20"
        />
        <input
          type="text"
          placeholder="Escribe tu nombre aquí"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="pl-14 py-3 sm:py-4 border border-white bg-white text-black rounded-xl w-full sm:w-2xl sm:text-4xl focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>
  
      {/* Campo Email */}
      <div className="relative flex flex-col items-center justify-center w-full">
        <div className="relative w-full flex items-center justify-center">
          <img
            src="/emailIcon.png"
            alt="Icono Email"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4  sm:w-6 sm:h-6 brightness-20"
          />
          <input
            type="email"
            placeholder="Escribe tu correo aquí"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
  
              if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                setEmailError("");
              }
            }}
            className={`pl-14 py-3 sm:py-4 border ${
              emailError ? "border-red-500" : "border-white"
            } bg-white text-black rounded-xl w-full sm:w-2xl  sm:text-4xl focus:outline-none focus:ring-2 focus:ring-white`}
          />
        </div>
        {emailError && (
          <p className="text-white text-sm sm:text-2xl mt-2">{emailError}</p>
        )}
      </div>
  
      {/* Checkbox de Términos y Condiciones */}
      <label className="flex items-center space-x-4 text-sm sm:text-4xl text-white">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="w-4 h-4 sm:w-6 sm:h-6"
        />
        <span>
          Acepto{" "}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="underline"
          >
            tratamiento de datos
          </button>
        </span>
      </label>
  
      {/* Botón */}
      <button
        type="submit"
        className="px-4 py-3 bg-[#E7AAFE] text-[#2C1733] font-bold rounded-md w-48 sm:w-64 text-lg sm:text-4xl hover:bg-[#6B21A8] transition"
      >
        Enviar
      </button>
    </form>
  
    {/* Modal de Términos y Condiciones */}
    {showTerms && (
      <div className="fixed inset-0 bg-[#2C1733]/40 flex items-center justify-center z-50">
        <div className="bg-[#2C1733] text-white p-8 rounded-lg max-w-lg w-full relative">
          <button
            onClick={() => setShowTerms(false)}
            className="absolute top-4 right-4 text-white text-4xl font-bold"
          >
            &times;
          </button>
          <TermsAndConditions />
        </div>
      </div>
    )}
  
    {/* Modal de Mensajes */}
    {modalMessage && (
      <div className="fixed inset-0 bg-[#2C1733]/60 flex items-center justify-center z-50">
        <div className="bg-[#2C1733] text-white p-8 rounded-2xl max-w-md w-full relative text-center space-y-10">
          <p className="text-2xl sm:text-3xl">{modalMessage}</p>
          <button
            onClick={() => setModalMessage("")}
            className="px-4 py-3 bg-[#E7AAFE] text-[#2C1733] font-bold rounded-md w-48 sm:w-64 text-lg sm:text-4xl hover:bg-[#6B21A8] transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default FormContact;
