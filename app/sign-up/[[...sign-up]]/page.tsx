'use client'

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-16 px-4"
      style={{
        background: 'linear-gradient(160deg, #0a1628 0%, #0d1f4a 30%, #091535 55%, #0e1e48 80%, #080f2a 100%)',
      }}
    >
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#111111',
            colorBackground: '#ffffff',
            colorText: '#111111',
            colorTextSecondary: '#666666',
            colorInputBackground: '#ffffff',
            colorInputText: '#111111',
            borderRadius: '4px',
            fontFamily: 'Georgia, serif',
          },
          elements: {
            card: 'shadow-2xl border-0',
            headerTitle: 'font-serif text-gray-900',
            headerSubtitle: 'text-gray-500',
            formButtonPrimary: 'bg-gray-900 hover:bg-gray-700 tracking-widest text-xs',
            formFieldInput: 'border-gray-200 focus:border-gray-900',
            formFieldLabel: 'text-gray-500 text-xs tracking-widest uppercase',
            footerActionLink: 'text-gray-900 font-medium hover:text-gray-600',
            footerActionText: 'text-gray-500',
            footer: 'bg-gray-50 border-t border-gray-100',
          }
        }}
      />
    </div>
  )
}