'use server'


import { AuthResponse } from '@supabase/supabase-js'
import { Hex, verifyMessage } from 'viem'
import { createClient } from '../supabase/server'
import { generateSecurePassword } from './generateSecurePassword'

export async function signInWithWeb3(address: Hex, message: string, signature: Hex): Promise<AuthResponse> {
  const supabase = createClient()

  try {
    // Verify the signature and derive the address
    const isMatch = verifyMessage({message, signature, address})

    // Check if the derived address matches the claimed address
    if (!isMatch) {
      throw new Error("Derived address does not match claimed address")
    }

    // Check if a user with this wallet address exists
    const { data: existingWallet, error: fetchError } = await supabase
      .from('wallet_addresses')
      .select('id')
      .eq('address', address.toLowerCase())
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (existingWallet) {
      // User exists, sign them in
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.user.email!,
        password: userData.user.user_metadata.web3_password,
      })
      if (error) throw error
      return { data, error: null }
    } else {
      // User doesn't exist, create a new user
      const email = `${address.toLowerCase()}@web3.user`
      const password = await generateSecurePassword()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            web3_password: password, // Store the password in user metadata
          },
        },
      })

      if (error) throw error

      // Add wallet address to the public.wallet_addresses table
      const { error: insertError } = await supabase
        .from('wallet_addresses')
        .insert({ id: data.user!.id, address: address.toLowerCase() })

      if (insertError) throw insertError

      // After successful signup, immediately sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      return { data: signInData, error: null }
    }
  } catch (error) {
    console.error('Error in signInWithWeb3:', error)
    throw error
  }
}