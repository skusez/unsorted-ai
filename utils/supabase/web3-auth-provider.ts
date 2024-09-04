import { createClient } from './server';
import { AuthResponse } from '@supabase/supabase-js';

export async function signInWithWeb3(address: string): Promise<AuthResponse> {
  const supabase = createClient();

  // Check if the user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select()
    .eq('wallet_address', address)
    .single();

  if (existingUser) {
    // User exists, sign them in
    return supabase.auth.signInWithIdToken(existingUser.id);
  } else {
    // User doesn't exist, create a new user
    const { data: newUser, error } = await supabase.auth.signUp({
      email: `${address}@web3.user`,
      password: crypto.randomUUID(), // Generate a random password
      options: {
        data: {
          wallet_address: address,
        },
      },
    });

    if (error) throw error;

    return { data: newUser, error: null };
  }
}