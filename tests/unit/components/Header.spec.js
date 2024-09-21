import { assert } from 'chai'
import sinon from 'sinon'

import { createAppLocalVue, shallowMountPage } from '../utils'
import Header from '@/components/Header.vue'
import EpDropdown from '@/components/EpDropdown.vue'

const localVue = createAppLocalVue()
describe('<Header />: General', () => {
  afterEach(() => {
    sinon.verifyAndRestore()
  })
  it('should render dropdown country', async () => {
    sinon.stub(window, 'scrollTo')
    const wrapper = await shallowMountPage(Header, {
      localVue,
      propsData: {
        flagList: [
          {
            urlImage: 'http://flag-sg.svg',
            countryCode: 'SG',
            countryValue: 'Singapore'
          },
          {
            urlImage: 'http://flag-hk.svg',
            countryCode: 'HK',
            countryValue: 'HongKong'
          }
        ]
      }
    })

    const epDropdownComponent = wrapper.findComponent(EpDropdown)
    assert.isTrue(epDropdownComponent.isVisible())
  })

  it('should render selected country', async () => {
    sinon.stub(window, 'scrollTo')
    const flagList = [
      {
        urlImage: 'http://flag-sg.svg',
        countryCode: 'SG',
        countryValue: 'Singapore'
      },
      {
        urlImage: 'http://flag-hk.svg',
        countryCode: 'HK',
        countryValue: 'HongKong'
      }
    ]
    const wrapper = await shallowMountPage(Header, {
      localVue,
      propsData: { flagList }
    })

    const epDropdownComponent = wrapper.findComponent(EpDropdown)
    epDropdownComponent.vm.$emit('update:selectedItem', flagList[1])

    assert.equal(wrapper.emitted('flagChange')[0][0], flagList[1].countryCode)
  })

  it('should add style and calculate position when has Y is over 2 times than header range', async () => {
    sinon.stub(window, 'scrollTo')
    const wrapper = await shallowMountPage(Header, {
      localVue,
      propsData: {
        flagList: [
          {
            urlImage: 'http://flag-sg.svg',
            countryCode: 'SG',
            countryValue: 'Singapore'
          },
          {
            urlImage: 'http://flag-hk.svg',
            countryCode: 'HK',
            countryValue: 'HongKong'
          }
        ]
      }
    })

    const classList = {
      add: () => {
        return true
      },
      remove: () => {
        return true
      }
    }
    const spyAdd = sinon.spy(classList, 'add')
    const stubGetElement = sinon.stub(document, 'getElementById').returns({ classList })
    window.pageYOffset = 123
    wrapper.vm.handleScroll()

    const epDropdownComponent = wrapper.findComponent(EpDropdown)
    assert.isTrue(epDropdownComponent.isVisible())
    sinon.assert.calledOnce(stubGetElement)
    sinon.assert.calledWith(stubGetElement, 'ep__header')
    sinon.assert.calledOnce(spyAdd)
    sinon.assert.calledWith(spyAdd, 'header__sticky')
    assert.isNull(wrapper.vm.$data.top)
  })

  it('should remove style and do not calculate position when has Y is less than header range', async () => {
    sinon.stub(window, 'scrollTo')
    const wrapper = await shallowMountPage(Header, {
      localVue,
      propsData: {
        flagList: [
          {
            urlImage: 'http://flag-sg.svg',
            countryCode: 'SG',
            countryValue: 'Singapore'
          },
          {
            urlImage: 'http://flag-hk.svg',
            countryCode: 'HK',
            countryValue: 'HongKong'
          }
        ]
      }
    })

    const classList = {
      add: () => {
        return true
      },
      remove: () => {
        return true
      }
    }
    const spyRemove = sinon.spy(classList, 'remove')
    const stubGetElement = sinon.stub(document, 'getElementById').returns({ classList })
    window.pageYOffset = 6
    wrapper.vm.handleScroll()

    const epDropdownComponent = wrapper.findComponent(EpDropdown)
    assert.isTrue(epDropdownComponent.isVisible())
    sinon.assert.calledOnce(stubGetElement)
    sinon.assert.calledWith(stubGetElement, 'ep__header')
    sinon.assert.calledOnce(spyRemove)
    sinon.assert.calledWith(spyRemove, 'header__sticky')
    assert.isNull(wrapper.vm.$data.top)
  })

  it('should add style and calculate position when has Y greater but not over 2 times than header range', async () => {
    sinon.stub(window, 'scrollTo')
    const wrapper = await shallowMountPage(Header, {
      localVue,
      propsData: {
        flagList: [
          {
            urlImage: 'http://flag-sg.svg',
            countryCode: 'SG',
            countryValue: 'Singapore'
          },
          {
            urlImage: 'http://flag-hk.svg',
            countryCode: 'HK',
            countryValue: 'HongKong'
          }
        ]
      }
    })

    const classList = {
      add: () => {
        return true
      },
      remove: () => {
        return true
      }
    }
    const spyAdd = sinon.spy(classList, 'add')
    const stubGetElement = sinon.stub(document, 'getElementById').returns({ classList })
    window.pageYOffset = 29.4
    wrapper.vm.handleScroll()

    const epDropdownComponent = wrapper.findComponent(EpDropdown)
    assert.isTrue(epDropdownComponent.isVisible())
    sinon.assert.calledOnce(stubGetElement)
    sinon.assert.calledWith(stubGetElement, 'ep__header')
    sinon.assert.calledOnce(spyAdd)
    sinon.assert.calledWith(spyAdd, 'header__sticky')
    assert.equal(wrapper.vm.$data.top, 3)
  })
})
