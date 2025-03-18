import React from 'react'
import Header from './common/Header'
import { Outlet } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
//Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


function Rootlayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
      }}
    >
      <div>
        <Header />
        <div style={{ minHeight: "90vh" }}>
          <Outlet />
        </div>
      </div>
    </ClerkProvider>
  )
}

export default Rootlayout