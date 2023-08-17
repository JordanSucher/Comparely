import React, { useState, useEffect } from 'react';

const TypingEffectCell = ({ fullText, doTypingEffect }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let words
    if (fullText) { 
        words = fullText.split(' ')
    }
    let currentText = "";
    let index = 0;
    
    // Start animation
    const interval = setInterval(() => {
      if (words && index < words.length) {
        currentText += words[index] + " ";
        setDisplayedText(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80); // 300ms between each word, adjust as needed

    // Clean up on component unmount or if fullText changes
    return () => clearInterval(interval);
  }, [fullText]);

  if (doTypingEffect) {
    return <td>{displayedText}</td>;
  } else {
    return <td>{fullText}</td>
  }
  
};

export default TypingEffectCell