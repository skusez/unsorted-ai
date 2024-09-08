import {  defaultWagmiConfig } from '@web3modal/wagmi/react'
import { cookieStorage, createStorage, http } from 'wagmi'
import { mainnet, arbitrum } from 'wagmi/chains'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  throw new Error('You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable')
}

// 2. Create wagmiConfig
export const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum] as const
export function getWagmiConfig() {
  return defaultWagmiConfig({ chains, projectId, metadata, ssr: true, storage: createStorage({
    storage: cookieStorage
  })  })
}
