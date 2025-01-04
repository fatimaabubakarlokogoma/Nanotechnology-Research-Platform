import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'marketplace': {
      functions: {
        'create-listing': vi.fn(),
        'purchase-listing': vi.fn(),
        'cancel-listing': vi.fn(),
        'get-listing': vi.fn(),
        'get-listing-count': vi.fn(),
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

describe('Marketplace Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-listing', () => {
    it('should create a listing successfully', async () => {
      const title = 'Carbon Nanotubes'
      const description = 'High-quality carbon nanotubes for research'
      const price = 1000
      const category = 'materials'
      mockClarity.contracts['marketplace'].functions['create-listing'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('marketplace', 'create-listing', [title, description, price, category])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('purchase-listing', () => {
    it('should purchase a listing successfully', async () => {
      const listingId = 1
      mockClarity.contracts['marketplace'].functions['purchase-listing'].mockReturnValue({ success: true })
      
      const result = await callContract('marketplace', 'purchase-listing', [listingId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if listing does not exist', async () => {
      const listingId = 999
      mockClarity.contracts['marketplace'].functions['purchase-listing'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('marketplace', 'purchase-listing', [listingId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('cancel-listing', () => {
    it('should cancel a listing successfully', async () => {
      const listingId = 1
      mockClarity.contracts['marketplace'].functions['cancel-listing'].mockReturnValue({ success: true })
      
      const result = await callContract('marketplace', 'cancel-listing', [listingId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the listing owner', async () => {
      const listingId = 1
      mockClarity.contracts['marketplace'].functions['cancel-listing'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('marketplace', 'cancel-listing', [listingId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-listing', () => {
    it('should return listing data', async () => {
      const listingId = 1
      const listingData = {
        seller: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        title: 'Carbon Nanotubes',
        description: 'High-quality carbon nanotubes for research',
        price: 1000,
        category: 'materials'
      }
      mockClarity.contracts['marketplace'].functions['get-listing'].mockReturnValue({ success: true, value: listingData })
      
      const result = await callContract('marketplace', 'get-listing', [listingId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(listingData)
    })
  })
  
  describe('get-listing-count', () => {
    it('should return the total number of listings', async () => {
      mockClarity.contracts['marketplace'].functions['get-listing-count'].mockReturnValue({ success: true, value: 5 })
      
      const result = await callContract('marketplace', 'get-listing-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(5)
    })
  })
})

console.log('Marketplace Contract tests completed')
