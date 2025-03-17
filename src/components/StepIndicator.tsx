import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  progress: string;
}

export function StepIndicator({ currentStep, totalSteps, progress }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">
          Etapa {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-[#ffcf02]">{progress}</span>
      </div>
      <div className="h-2 bg-[#121212] rounded-full">
        <div
          className="h-2 bg-[#ffcf02] rounded-full transition-all duration-300 ease-in-out"
          style={{ width: progress }}
        />
      </div>
    </div>
  );
}