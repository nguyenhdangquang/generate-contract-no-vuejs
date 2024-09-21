import { assert } from 'chai'
import ContactUs from '@/views/contact-us/Index.vue'
import StorageHelper from '@/utils/storageHelper'
import sinon from 'sinon'
import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createStore, createMockSettingsModule } from '../../store-utils'

const localVue = createAppLocalVue()

describe('CONTACT US', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
    sinon.stub(window, 'scrollTo')
  })

  it('should render CONTACT US', async () => {
    const _settings = {
      country: {
        code: 'SG',
        defaultCurrency: {
          code: 'SGD',
          name: 'Singapore Dollar',
          fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
          decimalPlaces: '2',
          thousandSeparator: ',',
          bankMaxAmount: 200000
        },
        defaultReceivableOffice: {
          officeName: 'Singapore',
          address: 'dsadasdasdasdas',
          contactNumber: '+65 12313213',
          email: 'abc@abc.com',
          workingTime: '5:00 AM - 10:00 PM',
          mapImageFileNamePortrait: 'MapImagePortrait_SG.svg',
          mapImageFileNameLandscape: 'MapImageLandscape_SG.svg'
        }
      }
    }
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: _settings
        })
      })
    })
    const wrapper = await shallowMountPage(ContactUs, { localVue, store })
    const text = wrapper.find('[data-testid="headtitle"]').text()
    assert.equal(text, 'CONTACT US')
  })

  it('should render introduction text', async () => {
    const _settings = {
      country: {
        code: 'SG',
        defaultCurrency: {
          code: 'SGD',
          name: 'Singapore Dollar',
          fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
          decimalPlaces: '2',
          thousandSeparator: ',',
          bankMaxAmount: 200000
        },
        defaultReceivableOffice: {
          officeName: 'Singapore',
          address: 'dsadasdasdasdas',
          contactNumber: '+65 12313213',
          email: 'abc@abc.com',
          workingTime: '5:00 AM - 10:00 PM',
          mapImageFileNamePortrait: 'MapImagePortrait_SG.svg',
          mapImageFileNameLandscape: 'MapImageLandscape_SG.svg'
        }
      }
    }
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: _settings
        })
      })
    })
    const wrapper = await shallowMountPage(ContactUs, { localVue, store })
    const text = wrapper.find('[data-testid="introduction"]').text()
    assert.equal(text, 'We would love to help you if you have any questions or require further information.Here is how you can reach us.')
  })

  it('should render right contents information', async () => {
    const _settings = {
      country: {
        code: 'SG',
        defaultCurrency: {
          code: 'SGD',
          name: 'Singapore Dollar',
          fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
          decimalPlaces: '2',
          thousandSeparator: ',',
          bankMaxAmount: 200000
        },
        defaultReceivableOffice: {
          officeName: 'Singapore',
          address: 'dsadasdasdasdas',
          contactNumber: '+65 12313213',
          email: 'abc@abc.com',
          workingTime: '5:00 AM - 10:00 PM',
          mapImageFileName: 'MapImage_SG.svg'
        }
      }
    }
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: _settings
        })
      })
    })

    const wrapper = await shallowMountPage(ContactUs, { localVue, store })
    wrapper.vm.$data.widthAllowUseImagePortrait = 0
    await wrapper.vm.$nextTick
    const address = wrapper.find('[data-testid="Address"]').text()
    const tel = wrapper.find('[data-testid="Tel"]').text()
    const email = wrapper.find('[data-testid="Email"]').text()
    const workingHours = wrapper.find('[data-testid="WorkingHours"]').text()
    const mapImage = wrapper.find('[data-testid="MapImage"]')
    assert.equal(address, _settings.country.defaultReceivableOffice.address)
    assert.equal(tel, _settings.country.defaultReceivableOffice.contactNumber)
    assert.equal(email, _settings.country.defaultReceivableOffice.email)
    assert.equal(workingHours, _settings.country.defaultReceivableOffice.workingTime)
    assert.isTrue(mapImage.attributes('src').includes(_settings.country.defaultReceivableOffice.mapImageFileName))
  })

  it('should render empty contents information', async () => {
    const _settings = {
      country: {
        code: 'SG',
        defaultCurrency: {
          code: 'SGD',
          name: 'Singapore Dollar',
          fileNameTemplateImport: 'files/Batch_Upload_Template_SGD.xls',
          decimalPlaces: '2',
          thousandSeparator: ',',
          bankMaxAmount: 200000
        }
      }
    }
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: _settings
        })
      })
    })

    const wrapper = await shallowMountPage(ContactUs, { localVue, store })
    await wrapper.vm.$nextTick
    const address = wrapper.find('[data-testid="Address"]').text()
    const tel = wrapper.find('[data-testid="Tel"]').text()
    const email = wrapper.find('[data-testid="Email"]').text()
    const workingHours = wrapper.find('[data-testid="WorkingHours"]').text()
    const mapImage = wrapper.find('[data-testid="MapImage"]')
    assert.isEmpty(address)
    assert.isEmpty(tel)
    assert.isEmpty(email)
    assert.isEmpty(workingHours)
    assert.isUndefined(mapImage.attributes('src'))
  })
})
