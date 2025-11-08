// app/hooks/useVoice.js
'use client';

import { useEffect, useState, useCallback } from 'react';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives = 1;
        
        recognitionInstance.onstart = () => {
          console.log('Voice recognition started');
          setIsListening(true);
        };

        recognitionInstance.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          console.log('Speech result:', speechResult);
          setTranscript(speechResult);
          setIsListening(false);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          console.log('Voice recognition ended');
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
        setIsSupported(true);
      } else {
        console.warn('Speech recognition not supported');
      }
    }
  }, []);

  const startListening = useCallback((language = 'en') => {
    if (recognition && !isListening) {
      setTranscript(''); // Clear previous transcript
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [recognition, isListening]);

  const speak = useCallback((text, language = 'en') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // For longer text, break into sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      let currentIndex = 0;

      const speakNext = () => {
        if (currentIndex < sentences.length) {
          utterance.text = sentences[currentIndex];
          utterance.onend = () => {
            currentIndex++;
            speakNext();
          };
          window.speechSynthesis.speak(utterance);
        }
      };

      speakNext();
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported
  };
}