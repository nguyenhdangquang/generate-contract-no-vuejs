import { assert } from 'chai'
import sinon from 'sinon'
import { purchaseOrder } from '@/store/modules/purchase-order'

describe('store/purchaseOrder', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should be a namespaced module', () => {
    assert.isTrue(purchaseOrder.namespaced)
  })

  describe('state', () => {
    it('should create initial state', () => {
      assert.deepEqual(
        purchaseOrder.state(),
        {
          createdPO: null
        }
      )
    })
  })

  describe('mutations', () => {
    it('should set createdPO when calling setCreatedPO', () => {
      const state = {
        createdPO: null
      }

      const newCreatedPO = {
        id: '12345'
      }

      purchaseOrder.mutations.setCreatedPO(state, newCreatedPO)
      assert.deepEqual(state.createdPO, newCreatedPO)
    })
  })

  describe('actions', () => {
    it('should commit setCreatedPO when invoking setCreatedActions', () => {
      const mockedCommit = sinon.stub()
      const context = {
        commit: mockedCommit
      }
      const mockCreatedPO = {
        id: 'abcde'
      }

      purchaseOrder.actions.setCreatedPO(context, mockCreatedPO)
      assert.isTrue(mockedCommit.calledOnce)
      assert.deepEqual(mockedCommit.args[0], ['setCreatedPO', mockCreatedPO])
    })
  })

  describe('getters', () => {
    it('should return createdPO when calling getCreatedPO', () => {
      const mockCreatedPO = { id: '12345', title: 'Test PO' }
      const mockedState = {
        createdPO: mockCreatedPO
      }

      assert.deepEqual(purchaseOrder.getters.createdPO(mockedState), mockCreatedPO)
    })
  })
})
