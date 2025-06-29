/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

 export const PhotoContext = createContext();

export const usePhoto = () => useContext(PhotoContext);

export const PhotoProvider = ({ children }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [emails, setEmails] = useState("");  

  return (
    <PhotoContext.Provider value={{ imageUrl, setImageUrl, emails, setEmails }}>
      {children}
    </PhotoContext.Provider>
  );
};
