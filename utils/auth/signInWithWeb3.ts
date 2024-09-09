"use server";

import { AuthResponse } from "@supabase/supabase-js";
import { Hex } from "viem";
import { createClient } from "../supabase/server";
import { generateSecurePassword } from "./generateSecurePassword";
import { createAdminClient } from "../supabase/admin";
import {
  getAddressFromMessage,
  getChainIdFromMessage,
  verifySignature,
} from "@web3modal/siwe";

export async function signInWithWeb3(
  message: string,
  signature: Hex
): Promise<AuthResponse> {
  const supabase = createClient();

  try {
    const chainId = getChainIdFromMessage(message);
    const address = getAddressFromMessage(message);

    // Verify the signature and derive the address
    const isValid = await verifySignature({
      address,
      message,
      signature,
      chainId,
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    });

    // Check if the derived address matches the claimed address
    if (!isValid) {
      throw new Error("Derived address does not match claimed address");
    }

    // Check if a user with this wallet address exists
    const { data: existingWallet, error: fetchError } = await supabase
      .from("wallet_addresses_public")
      .select("id")
      .eq("address", address.toLowerCase())
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingWallet?.id) {
      // User exists, sign them in
      const adminClient = createAdminClient();
      const { data: userData, error: userError } =
        await adminClient.auth.admin.getUserById(existingWallet.id);
      if (userError) throw userError;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.user.email!,
        password: userData.user.user_metadata.web3_password,
      });
      if (error) throw error;
      return { data, error: null };
    } else {
      // User doesn't exist, create a new user
      const email = `${address.toLowerCase()}@web3.user`;
      const password = await generateSecurePassword();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            web3_password: password, // Store the password in user metadata
          },
        },
      });

      if (error) throw error;

      // Add wallet address to the public.wallet_addresses table
      const { error: insertError } = await supabase
        .from("wallet_addresses")
        .insert({ id: data.user!.id, address: address.toLowerCase() });

      if (insertError) throw insertError;

      // After successful signup, immediately sign in the user
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      return { data: signInData, error: null };
    }
  } catch (error) {
    console.error("Error in signInWithWeb3:", error);
    throw error;
  }
}
