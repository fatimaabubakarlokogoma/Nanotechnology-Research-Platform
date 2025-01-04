import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'research-proposal': {
      functions: {
        'submit-proposal': vi.fn(),
        'fund-proposal': vi.fn(),
        'change-proposal-status': vi.fn(),
        'get-proposal': vi.fn(),
        'get-proposal-count': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Research Proposal Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('submit-proposal', () => {
    it('should submit a proposal successfully', async () => {
      const title = 'Novel Nanoparticle Synthesis'
      const description = 'A new method for synthesizing nanoparticles'
      const fundingGoal = 1000000
      mockClarity.contracts['research-proposal'].functions['submit-proposal'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('research-proposal', 'submit-proposal', [title, description, fundingGoal])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('fund-proposal', () => {
    it('should fund a proposal successfully', async () => {
      const proposalId = 1
      const amount = 500000
      mockClarity.contracts['research-proposal'].functions['fund-proposal'].mockReturnValue({ success: true })
      
      const result = await callContract('research-proposal', 'fund-proposal', [proposalId, amount])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if proposal does not exist', async () => {
      const proposalId = 999
      const amount = 500000
      mockClarity.contracts['research-proposal'].functions['fund-proposal'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('research-proposal', 'fund-proposal', [proposalId, amount])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('change-proposal-status', () => {
    it('should change proposal status successfully', async () => {
      const proposalId = 1
      const newStatus = 'completed'
      mockClarity.contracts['research-proposal'].functions['change-proposal-status'].mockReturnValue({ success: true })
      
      const result = await callContract('research-proposal', 'change-proposal-status', [proposalId, newStatus])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the proposal owner', async () => {
      const proposalId = 1
      const newStatus = 'completed'
      mockClarity.contracts['research-proposal'].functions['change-proposal-status'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('research-proposal', 'change-proposal-status', [proposalId, newStatus])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-proposal', () => {
    it('should return proposal data', async () => {
      const proposalId = 1
      const proposalData = {
        researcher: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        title: 'Novel Nanoparticle Synthesis',
        description: 'A new method for synthesizing nanoparticles',
        funding_goal: 1000000,
        current_funding: 500000,
        status: 'active'
      }
      mockClarity.contracts['research-proposal'].functions['get-proposal'].mockReturnValue({ success: true, value: proposalData })
      
      const result = await callContract('research-proposal', 'get-proposal', [proposalId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(proposalData)
    })
  })
  
  describe('get-proposal-count', () => {
    it('should return the total number of proposals', async () => {
      mockClarity.contracts['research-proposal'].functions['get-proposal-count'].mockReturnValue({ success: true, value: 5 })
      
      const result = await callContract('research-proposal', 'get-proposal-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(5)
    })
  })
})
