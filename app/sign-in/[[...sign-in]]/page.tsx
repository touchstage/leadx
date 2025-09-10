import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Welcome back</h1>
          <p className="text-stone-600 mt-2">Sign in to your LeadX account</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
              card: 'shadow-lg border border-gray-200',
              socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
              socialButtonsBlockButtonText: 'text-gray-700',
            }
          }}
        />
      </div>
    </div>
  )
}
