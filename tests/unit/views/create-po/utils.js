import { findByTestId, triggerInputChange } from '../../utils'
import PayerInformationForm from '@/views/create-po/components/PayerInformationForm.vue'

export function findAllBlRows (wrapper) {
  return wrapper.findAll('[data-testid="bl-row"]')
}

export function findBlNumberInput (blRow) {
  return blRow.find('[aria-label="BL number"]')
}

export function findBlAmountInput (blRow) {
  return blRow.find('[aria-label="BL amount"]')
}

export function findBlRemarkInput (blRow) {
  return blRow.find('[aria-label="BL remark"]')
}

export function findBlCurrencyInput (blRow) {
  return blRow.find('[aria-label="BL currency"]')
}

export function findBlRemoveButton (blRow) {
  return blRow.find('[data-testid="bl-remove-button"]')
}

export function findBlNumberError (wrapper, index) {
  return wrapper.find(`[data-testid="bl-number-error-${index}"]`)
}

export function findBlAmountError (wrapper, index) {
  return wrapper.find(`[data-testid="bl-amount-error-${index}"]`)
}

export function findBlRemarkError (wrapper, index) {
  return wrapper.find(`[data-testid="bl-remark-error-${index}"]`)
}

export function findSaveAndProceedToPayButton (wrapper) {
  return findByTestId(wrapper, 'save-and-proceed-to-pay-button')
}

export function findSaveAndEmailButton (wrapper) {
  return findByTestId(wrapper, 'save-and-email-button')
}

export function fillPayerInformationForm (wrapper, {
  company,
  email,
  contactNumber
} = {}) {
  const payerInformationForm = wrapper.findComponent(PayerInformationForm)

  if (typeof company === 'string') {
    payerInformationForm.vm.$emit('update:companyName', company)
    payerInformationForm.vm.$emit('companyNameBlur')
  }

  if (typeof email === 'string') {
    payerInformationForm.vm.$emit('update:email', email)
    payerInformationForm.vm.$emit('emailBlur')
  }

  if (typeof contactNumber === 'string') {
    payerInformationForm.vm.$emit('update:contactNumber', contactNumber)
    payerInformationForm.vm.$emit('contactNumberBlur')
  }
}

export function fillBlRow (blRow, {
  number = 'abcde',
  amount = '10000',
  remark = 'Sample remark'
} = {}) {
  if (number !== null && number !== undefined) {
    const firstBlNumberInput = findBlNumberInput(blRow)
    triggerInputChange(firstBlNumberInput, number)
  }

  if (amount !== null && amount !== undefined) {
    const firstBlAmountInput = findBlAmountInput(blRow)
    triggerInputChange(firstBlAmountInput, amount)
  }

  if (remark !== null && remark !== undefined) {
    const remarkInput = findBlRemarkInput(blRow)
    triggerInputChange(remarkInput, remark)
  }
}

export function removeBlRow (blRow) {
  const removeButton = findBlRemoveButton(blRow)
  removeButton.vm.$emit('click')
}
