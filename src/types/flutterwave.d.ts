declare module 'flutterwave-node-v3' {
  class Flutterwave {
    constructor(publicKey: string, secretKey: string)
    Charge: {
      card: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>
    }
    Transaction: {
      verify: (payload: { id: string }) => Promise<Record<string, unknown>>
    }
  }
  export default Flutterwave
}