// components/voice-button.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export function VoiceButton({ onTranscript, language = 'en' }: VoiceButtonProps) {
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoice();

  // When transcript changes, send it to parent
  useEffect(() => {
    if (transcript && transcript.trim()) {
      console.log('Sending transcript to parent:', transcript);
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "ghost"}
      size="icon"
      onClick={handleClick}
      className={`transition-all ${isListening ? 'animate-pulse' : ''}`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  );
}