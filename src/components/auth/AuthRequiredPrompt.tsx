'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AuthModal } from './AuthModal'
import { Lock } from 'lucide-react'

interface AuthRequiredPromptProps {
  message?: string
  className?: string
}

export function AuthRequiredPrompt({
  message = 'Sign in to analyze this vehicle',
  className = '',
}: AuthRequiredPromptProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <div className={`flex flex-col items-center justify-center p-8 rounded-lg border border-white/10 bg-[#0F1012]/80 backdrop-blur-xl ${className}`}>
        <div className="w-12 h-12 rounded-full bg-[#F8B4D9]/10 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-[#F8B4D9]" />
        </div>
        <h3 className="text-lg font-semibold text-[#F2F0E9] mb-2">
          Analysis Requires Sign In
        </h3>
        <p className="text-[#9CA3AF] text-center mb-6 max-w-sm">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setShowAuthModal(true)}
            className="bg-[#F8B4D9] text-[#050505] hover:bg-[#F8B4D9]/90 font-semibold"
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAuthModal(true)}
            className="border-white/10 text-[#F2F0E9] hover:bg-white/5"
          >
            Create Account
          </Button>
        </div>
        <p className="text-xs text-[#4B5563] mt-4">
          New accounts receive 3 free analysis credits
        </p>
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultMode="signin"
      />
    </>
  )
}
