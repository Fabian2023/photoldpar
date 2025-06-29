import emailjs from 'emailjs-com';

const sendEmail = (email) => {
  if (!email) {
    alert("Por favor, ingrese un correo antes de enviar.");
    return;
  }

  const templateParams = {
    correo: email,
  };

  const serviceID = "tu_service_id";
  const templateID = "tu_template_id";
  const userID = "tu_user_id";

  // Enviar el correo con emailjs
  return emailjs.send(serviceID, templateID, templateParams, userID)
    .then(
      (result) => {
        console.log("Correo enviado con éxito:", result.text);
        alert("Correo enviado correctamente.");
      },
      (error) => {
        console.error("Error al enviar correo:", error.text);
        alert("Hubo un error al enviar el correo.");
      }
    );
};

export default sendEmail;
