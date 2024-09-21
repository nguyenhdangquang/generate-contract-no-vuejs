import { assert } from 'chai'
import sinon from 'sinon'
import * as settingsLogics from '@/repositories/Settings'
import { settings } from '@/store/modules/settings'

describe('store/settings', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should be a namespaced module', () => {
    assert.isTrue(settings.namespaced)
  })

  describe('state', () => {
    it('should return initial state', () => {
      assert.deepEqual(settings.state(), {
        settings: undefined
      })
    })
  })

  describe('mutations', () => {
    it('should set new settings when calling setSettings', () => {
      const mockState = {
        settings: undefined
      }
      const mockSettings = {
        country: 'SG'
      }

      settings.mutations.setSettings(mockState, mockSettings)
      assert.deepEqual(mockState.settings, mockSettings)
    })
  })

  describe('actions', () => {
    it('should fetch settings when invoking getSettings action', async () => {
      const mockedData = {
        country: 'HK',
        areaCode: '+65'
      }
      const mockedFindByCountryCode = sinon
        .stub(settingsLogics, 'findByCountryCode')
        .resolves(mockedData)
      const mockedCommit = sinon.stub()

      await settings.actions.getSettings({ commit: mockedCommit }, 'sg')

      assert.isTrue(mockedFindByCountryCode.calledOnce)
      assert.isTrue(mockedCommit.calledOnce)
      assert.deepEqual(mockedCommit.args[0], ['setSettings', mockedData])
    })

    it('should update settings when invoking updateSettings action', async () => {
      const payload = {
        countryCode: 'HK'
      }
      const mockedData = {
        country: 'HK',
        areaCode: '+65'
      }
      const mockedFindByCountryCode = sinon
        .stub(settingsLogics, 'findByCountryCode')
        .resolves(mockedData)
      const mockedCommit = sinon.stub()

      await settings.actions.updateSettings({ commit: mockedCommit }, payload)

      assert.isTrue(mockedFindByCountryCode.calledOnce)
      assert.isTrue(mockedCommit.calledOnce)
      assert.deepEqual(mockedCommit.args[0], ['setSettings', mockedData])
    })
  })

  describe('getters', () => {
    it('should return settings when calling settings getter', () => {
      const mockedState = {
        settings: { country: 'HK' }
      }

      assert.deepEqual(settings.getters.settings(mockedState), mockedState.settings)
    })

    it('should return country when calling country getter', () => {
      const mockedState = {
        settings: { country: 'HK' }
      }

      assert.equal(settings.getters.country(mockedState), mockedState.settings.country)
    })

    it('should return null when settings state is null when calling country getter', () => {
      const mockedState = {
        settings: null
      }

      assert.isNull(settings.getters.country(mockedState))
    })
  })
})
