declare global {
    namespace NodeJS {
      interface ProcessEnv {
        YOUR_WALLET_MNEMONIC: string;
      }
    }
  }
  
  export {};
  