import sinon from 'sinon'
import { assert } from 'chai'

import { createAppLocalVue, shallowMountPage } from '../../utils'
import { createMockSettingsModule, createStore } from '../../store-utils'
import EpPageTitle from '@/components/atoms/EpPageTitle'
import UserGuidePage from '@/views/user-guide/Index.vue'
import StorageHelper from '@/utils/storageHelper'

const localVue = createAppLocalVue()
const baseSettings = {
  country: {
    code: 'SG',
    defaultCurrency: {
      code: 'SGD',
      decimalPlaces: '2',
      thousandSeparator: ',',
      bankMaxAmount: 200000
    },
    userGuide: {
      filePath: '/files/E-Payment User Guide.pdf',
      publicationDate: '25 Jun 2021',
      lastUpdated: '25 Jun 2021',
      fileSize: '1.17 Mb'
    }
  }
}

describe('<UserGuide />: General', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })

  beforeEach(() => {
    sinon.stub(StorageHelper, 'getItem').returns('tka')
    sinon.stub(StorageHelper, 'setItem')
  })

  it('should render <EpPageTitle />', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(UserGuidePage, { localVue, store })

    assert.isTrue(wrapper.findComponent(EpPageTitle).isVisible())
    assert.equal(wrapper.findComponent(EpPageTitle).text(), 'USER GUIDE')
  })

  it('should render <a> tag to download pdf file', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(UserGuidePage, { localVue, store })

    let downloadLink = wrapper.find('.download-pdf').attributes('href')
    downloadLink = downloadLink.indexOf('?') !== -1 ? downloadLink.substr(0, downloadLink.indexOf('?')) : downloadLink
    const text = wrapper.find('.download-pdf').text()

    assert.equal(downloadLink, '/files/E-Payment User Guide.pdf')
    assert.equal(text, 'E-Payment User Guide.pdf')
  })

  it('should render publication date', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(UserGuidePage, { localVue, store })

    assert.equal(wrapper.find('[data-testid="publication-date"]').text(), 'Publication date:25 Jun 2021')
  })

  it('should render last updated date', async () => {
    const store = createStore({
      settingsModule: createMockSettingsModule({
        state: () => ({
          settings: baseSettings
        })
      })
    })
    const wrapper = await shallowMountPage(UserGuidePage, { localVue, store })

    assert.equal(wrapper.find('[data-testid="last-updated"]').text(), 'Last updated:25 Jun 2021')
  })
})
