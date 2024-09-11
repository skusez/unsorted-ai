"use server";

import { Hex } from "viem";
import { createClient } from "../supabase/server";
import { generateSecurePassword } from "./generateSecurePassword";
import { createAdminClient } from "../supabase/admin";
import {
  getAddressFromMessage,
  getChainIdFromMessage,
  verifySignature,
} from "@web3modal/siwe";
const enableDebug = true;
export async function signInWithWeb3(
  message: string,
  signature: Hex
): Promise<{ success: boolean }> {
  const supabase = createClient();
  const adminClient = createAdminClient();
  const logDebug = (message: string, data?: any) => {
    if (enableDebug) {
      console.debug(`[signInWithWeb3] ${message}`, data);
    }
  };
  try {
    const chainId = getChainIdFromMessage(message);
    const address = getAddressFromMessage(message);

    logDebug("Verifying signature");

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
      throw new Error("Invalid signature");
    }

    // Check if a user with this wallet address exists
    logDebug("Checking for existing wallet");

    const { data: profile, error: fetchError } = await supabase
      .from("user_profiles")
      .select()
      .eq("wallet_address", address.toLowerCase())
      .single();
    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (profile?.id) {
      logDebug("Existing profile found, signing in");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email!,
        password: profile.web3_password!,
      });
      if (error) throw error;
      return { success: true };
    } else {
      logDebug("No existing profile, creating new user");
      const email = `${address.toLowerCase()}@web3.user`;
      const password = await generateSecurePassword();

      const { data: auth_account, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            web3_password: password, // Store the password in user metadata
          },
        },
      });

      if (error) throw error;

      logDebug("New user created, creating profile");
      const { error: insertError } = await adminClient.from("profiles").insert({
        id: auth_account.user!.id,
        wallet_address: address.toLowerCase(),
      });

      if (insertError) throw insertError;

      logDebug("Signing in user");
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      return { success: true };
    }
  } catch (error) {
    logDebug("Error in signInWithWeb3:", error);
    throw error;
  }
}
