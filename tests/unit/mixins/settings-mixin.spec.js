import sinon from 'sinon'
import StorageHelper from '@/utils/storageHelper'
import * as Authenticator from '@/repositories/Authenticator'
import { settingsMixin } from '@/mixins/settings-mixin'
import { createMockSettingsModule, createStore } from '../store-utils'
import { createAppLocalVue, shallowMountPage } from '../utils'
import { assert } from 'chai'
import errorsTH from '@/views/create-po/utils/errorsTH'

describe('settings-mixins', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  it('should get access token if not available', async () => {
    window.scrollTo = () => {}
    const stubGetItem = sinon.stub(StorageHelper, 'getItem').returns(null)
    const stubSetItem = sinon.stub(StorageHelper, 'setItem')
    const mockToken = 'Sample-token'
    const stubAuthenticator = sinon.stub(Authenticator, 'generateAccessToken').resolves(mockToken)
    const localVue = createAppLocalVue()
    const store = createStore()
    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    await shallowMountPage(component, {
      localVue,
      store
    })

    sinon.assert.calledOnceWithExactly(stubGetItem, 'tka')
    sinon.assert.calledOnce(stubAuthenticator)
    sinon.assert.calledOnceWithExactly(stubSetItem, 'tka', mockToken)
  })

  it('should get settings when mount', async () => {
    const sampleToken = 'sample-token'
    sinon.stub(StorageHelper, 'getItem').returns(sampleToken)
    const localVue = createAppLocalVue()
    const mockGetSettings = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        actions: {
          getSettings: mockGetSettings
        }
      })
    })

    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    await shallowMountPage(component, {
      localVue,
      store
    })

    sinon.assert.calledOnce(mockGetSettings)
  })

  it('should not get settings if already in store', async () => {
    const sampleToken = 'sample-token'
    sinon.stub(StorageHelper, 'getItem').returns(sampleToken)
    const localVue = createAppLocalVue()
    const mockGetSettings = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: {
            country: {
              code: 'SG'
            }
          }
        }),
        actions: {
          getSettings: mockGetSettings
        }
      })
    })

    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    await shallowMountPage(component, {
      localVue,
      store,
      props: {
        countryCode: {
          type: String
        }
      },
      propsData: {
        countryCode: 'sg'
      }
    })

    sinon.assert.notCalled(mockGetSettings)
  })

  it('should get settings if not in store', async () => {
    const sampleToken = 'sample-token'
    sinon.stub(StorageHelper, 'getItem').returns(sampleToken)
    const localVue = createAppLocalVue()
    const mockGetSettings = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: {
            country: {
              code: 'HK'
            }
          }
        }),
        actions: {
          getSettings: mockGetSettings
        }
      })
    })

    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    await shallowMountPage(component, {
      localVue,
      store,
      props: {
        countryCode: {
          type: String
        }
      },
      propsData: {
        countryCode: 'sg'
      }
    })

    sinon.assert.calledOnce(mockGetSettings)
    assert.deepEqual(mockGetSettings.args[0][1], 'sg')
  })

  it('should get settings if countryCode is undefined', async () => {
    const sampleToken = 'sample-token'
    sinon.stub(StorageHelper, 'getItem').returns(sampleToken)
    const localVue = createAppLocalVue()
    const mockGetSettings = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: {
            country: {
              code: 'HK'
            }
          }
        }),
        actions: {
          getSettings: mockGetSettings
        }
      })
    })

    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    await shallowMountPage(component, {
      localVue,
      store,
      props: {
        countryCode: {
          type: String
        }
      }
    })

    sinon.assert.calledOnce(mockGetSettings)
    assert.deepEqual(mockGetSettings.args[0][1], undefined)
  })

  it('should get settings if countryCode is invalid', async () => {
    const sampleToken = 'sample-token'
    sinon.stub(StorageHelper, 'getItem').returns(sampleToken)
    const localVue = createAppLocalVue()
    const mockGetSettings = sinon.stub()
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: {
            country: {
              code: 'HK'
            }
          }
        }),
        actions: {
          getSettings: mockGetSettings
        }
      })
    })

    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    await shallowMountPage(component, {
      localVue,
      store,
      props: {
        countryCode: {
          type: String
        }
      }
    })

    sinon.assert.calledOnce(mockGetSettings)
    assert.deepEqual(mockGetSettings.args[0][1], undefined)
  })

  it('should navigate use countryCode from response when countryCode is not defined', async () => {
    const sampleToken = 'sample-token'
    sinon.stub(StorageHelper, 'getItem').returns(sampleToken)
    const localVue = createAppLocalVue()
    const mockSettings = {
      country: {
        code: 'SG'
      }
    }
    sinon.stub(window, 'scrollTo')
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: null
        }),
        actions: {
          getSettings: sinon.stub().callsFake(() => {
            store.dispatch('settings/setSettings', mockSettings)
          })
        }
      })
    })

    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    const wrapper = await shallowMountPage(component, {
      localVue,
      store,
      props: {
        countryCode: {
          type: String
        }
      }
    })

    assert.deepEqual(wrapper.vm.$route.params, { countryCode: 'sg' })
  })

  it('should navigate use countryCode from response when countryCode is invalid', async () => {
    const sampleToken = 'sample-token'
    sinon.stub(StorageHelper, 'getItem').returns(sampleToken)
    const localVue = createAppLocalVue()
    const mockSettings = {
      country: {
        code: 'SG'
      }
    }
    sinon.stub(window, 'scrollTo')
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: null
        }),
        actions: {
          getSettings: sinon.stub().callsFake(() => {
            store.dispatch('settings/setSettings', mockSettings)
          })
        }
      })
    })

    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    const wrapper = await shallowMountPage(component, {
      localVue,
      store,
      props: {
        countryCode: {
          type: String
        }
      },
      propsData: {
        countryCode: 'INVALID'
      }
    })

    assert.deepEqual(wrapper.vm.$route.params, { countryCode: 'sg' })
  })

  it('should get error message for thailand country', async () => {
    const sampleToken = 'sample-token'
    sinon.stub(StorageHelper, 'getItem').returns(sampleToken)
    const localVue = createAppLocalVue()
    const mockSettings = {
      country: {
        code: 'TH'
      }
    }
    sinon.stub(window, 'scrollTo')
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: null
        }),
        actions: {
          getSettings: sinon.stub().callsFake(() => {
            store.dispatch('settings/setSettings', mockSettings)
          })
        }
      })
    })

    const component = {
      mixins: [settingsMixin],
      render () {}
    }
    const wrapper = await shallowMountPage(component, {
      localVue,
      store,
      props: {
        countryCode: {
          type: String
        }
      },
      propsData: {
        countryCode: 'th'
      }
    })

    assert.deepEqual(wrapper.vm.errorMessageByCountry, errorsTH)
  })
})
