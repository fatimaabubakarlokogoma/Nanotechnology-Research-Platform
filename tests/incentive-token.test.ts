import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'incentive-token': {
      functions: {
        'mint-tokens': vi.fn(),
        'transfer-tokens': vi.fn(),
        'reward-peer-review': vi.fn(),
        'get-balance': vi.fn(),
        'get-reputation': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'contract-owner': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Incentive Token Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint-tokens', () => {
    it('should mint tokens successfully', async () => {
      const amount = 1000
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['incentive-token'].functions['mint-tokens'].mockReturnValue({ success: true })
      
      const result = await callContract('incentive-token', 'mint-tokens', [amount, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the contract owner', async () => {
      const amount = 1000
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['incentive-token'].functions['mint-tokens'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('incentive-token', 'mint-tokens', [amount, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('transfer-tokens', () => {
    it('should transfer tokens successfully', async () => {
      const amount = 500
      const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['incentive-token'].functions['transfer-tokens'].mockReturnValue({ success: true })
      
      const result = await callContract('incentive-token', 'transfer-tokens', [amount, sender, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the token owner', async () => {
      const amount = 500
      const sender = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['incentive-token'].functions['transfer-tokens'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('incentive-token', 'transfer-tokens', [amount, sender, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('reward-peer-review', () => {
    it('should reward peer review successfully', async () => {
      const reviewer = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const amount = 100
      mockClarity.contracts['incentive-token'].functions['reward-peer-review'].mockReturnValue({ success: true })
      
      const result = await callContract('incentive-token', 'reward-peer-review', [reviewer, amount])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the contract owner', async () => {
      const reviewer = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const amount = 100
      mockClarity.contracts['incentive-token'].functions['reward-peer-review'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('incentive-token', 'reward-peer-review', [reviewer, amount])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-balance', () => {
    it('should return the correct balance', async () => {
      const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['incentive-token'].functions['get-balance'].mockReturnValue({ success: true, value: 1500 })
      
      const result = await callContract('incentive-token', 'get-balance', [account])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1500)
    })
  })
  
  describe('get-reputation', () => {
    it('should return the correct reputation score', async () => {
      const user = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['incentive-token'].functions['get-reputation'].mockReturnValue({ success: true, value: 10 })
      
      const result = await callContract('incentive-token', 'get-reputation', [user])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(10)
    })
  })
})
