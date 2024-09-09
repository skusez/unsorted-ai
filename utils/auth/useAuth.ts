import { useMemo } from 'react'

import { useSignMessage, useAccount } from 'wagmi'
import { useMutation, useQuery } from '@tanstack/react-query'

import { createClient } from '@supabase/supabase-js'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { signInWithWeb3 } from './signInWithWeb3'
import { projectConfig } from '@/project-config'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const useAuth = ({
  onSignIn = () => {},
  onSignOut = () => {},
}= {}) => {
  const { open } = useWeb3Modal()
  const { address } = useAccount()
  const router = useRouter()
  const message = useMemo(() => 
    `Sign this message to login to ${projectConfig.name}: ${Date.now()}`,
    []
  )
  const session = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data
    },
    enabled: !!address,
  })
  const { signMessageAsync } = useSignMessage()

  const signIn = useMutation({
    mutationFn: async () => {
      if (!address) {
        await open()
        if (!address) throw new Error("No address available after connecting wallet")
      }

      const signature = await signMessageAsync({ message })
      if (!signature) {
        throw new Error("No signature provided")
      }

      return signInWithWeb3(address, message, signature)
    },
    onSuccess: async (authResponse) => {
      if (authResponse.data?.user) {
        // Set the Supabase session
        const { data, error } = await supabase.auth.setSession({
          access_token: authResponse.data.session?.access_token!,
          refresh_token: authResponse.data.session?.refresh_token!,
        })
        if (error) throw error
        console.log("Successfully signed in and set Supabase session")
      }
      session.refetch()
      onSignIn()
    },
    onError: (error) => {
      console.error("Error signing in:", error)
    },
  })

  const signOut = useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut()

    },
    onSuccess: async () => {
      console.log("Successfully signed out")
      router.refresh()
      session.refetch()
      onSignOut()
    },
    onError: (error) => {
      console.error("Error signing out:", error)
    },
  })



  return {
    signIn,
    signOut,
    session,
    isLoading: signIn.isPending,
    isSuccess: signIn.isSuccess,
    isError: signIn.isError,
  }
}

export default useAuth