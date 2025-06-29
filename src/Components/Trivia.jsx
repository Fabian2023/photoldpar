/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const questions = [
  {
    question: "¿Qué valor te define como mamá??",
    options: ["Fortaleza", "Ternura", "Paciencia", "Pasión"],
    answer: "Fortaleza",
  },
  {
    question: "¿Que sueño te mueve hoy como mujer y madre?",
    options: ["ver crecer a mi familia con amor", "cumplir un proyecto personal o profesional", "Tener mas tiempo para mi", "Seguir aprendiendo y creciendo"],
    answer: "ver crecer a mi familia con amor",
  },
  {
    question: "¿Que es lo mas valisoso que quieres dejarle a los tuyos?",
    options: ["Mis enseñanzas", "Mi ejemplo", "Mi amor incondicional", "Mis momentos con ellos"],
    answer: "Mis enseñanzas",
  },
];

const Trivia = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
   const [isCorrect, setIsCorrect] = useState(null);

  const handleSelect = (option) => {
    if (selectedOption !== null) return; // evitar múltiples clics

    const isAnswerCorrect = option === questions[currentQuestion].answer;
     setIsCorrect(isAnswerCorrect);
    setSelectedOption(option);

    if (isAnswerCorrect) {
      setScore((prev) => prev + 1);
    }

    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
         setSubmitted(true);
        setTimeout(() => {
          navigate("/clickPhoto", { state: { passed: score + (isAnswerCorrect ? 1 : 0) >= 2 } });
        }, 100);
      }
    }, 1000); // espera 2 segundos antes de pasar a la siguiente pregunta
  };

  // const getMessage = () => {
  //   if (score <= 1) {
  //     return `¡Lo sentimos, Tu puntaje fue ${score}/3! Tómate la photo IA y vuélvelo a intentar.`;
  //   } else {
  //     return `¡Felicidades! Tu puntaje fue ${score}/3. Tómate la photo IA que mostrará la súper mamá que eres.`;
  //   }
  // };

  const currentQ = questions[currentQuestion];

  return (
    <div
  className="relative h-screen flex flex-col items-center justify-center p-4 text-center bg-cover bg-center"
  style={{ backgroundImage: "url('/trivia.jpg')" }}
>
      
      

      <div className="w-full  max-w-4xl mt-120  rounded-xl ">
        <p className="text-5xl font-semibold mb-22 text-white">{currentQ.question}</p>
        <div className={`gap-4 ${currentQuestion === 1 ? 'grid grid-cols-2 ' : 'grid grid-cols-1 place-items-center'}`}>

          {currentQ.options.map((option, i) => {
            let buttonStyle = ` text-black 
            ${currentQuestion === 1 ? 'text-4xl py-4 px-2 max-w-[460px] h-40 whitespace-normal' : 'text-3xl py-6 px-4 w-2/3 '}
          `;
          

            // if (selectedOption) {
            //   if (option === currentQ.answer) {
            //     buttonStyle = "bg-green-400 text-white";
            //   } else if (option === selectedOption) {
            //     buttonStyle = "bg-red-400 text-white";
            //   }
            // }

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                className={`py-2 h-25 px-4 bg-transparent text-white border-4 border-white rounded-3xl text-3xl transition-all duration-300 ${buttonStyle}  active:bg-white active:text-black`}

                // disabled={selectedOption !== null}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-2xl text-purple-700 text-3xl font-semibold text-center animate-fade-in">
            {getMessage()}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Trivia;
