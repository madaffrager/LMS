'use client'

import { useConfettiStore } from "@/hooks/useConfettiStore"
import Confetti from 'react-confetti';

export const ConfettiProvider = ()=>{
    const confetti = useConfettiStore()
    if(!confetti.isOpen){
        return null
    }
    return (<Confetti
          className="pointer-events-none z-[100]"
          numberOfPieces={500}
          recycle={false}
          onConfettiComplete={() => {
            confetti.onClose();
          }}
        />)            
}