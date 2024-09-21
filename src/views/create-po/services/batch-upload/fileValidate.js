import XLSX from 'xlsx'
import { ErrorMessage } from '@/repositories/ErrorMessage'
import { MAX_RECORDS_BL } from '@/utils/constants'
import { getTextByCountry } from '@/utils/displayTextResources'

function validateExcelContent (workbook, currencyCode, countryCode) {
  // process only first sheet
  var blList = []
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]
  const data = XLSX.utils.sheet_to_json(worksheet, {
    header: 1
  })
  if (
    !data[0] ||
    data[0].length !== 1 ||
    !data[0][0] ||
    typeof data[0][0] !== 'string'
  ) {
    throw new Error(ErrorMessage.EXCEL_FILE_INCORRECT_FORMAT)
  }

  if (
    !data[1] ||
    data[1].length !== 3 ||
    `${data[1][0]}`.trim() !== 'BL or Invoice Number' ||
    `${data[1][1]}`.trim() !== 'Amount' ||
    `${data[1][2]}`.trim() !== 'Remark'
  ) {
    throw new Error(ErrorMessage.EXCEL_FILE_INCORRECT_FORMAT)
  }

  if (data[0][0].indexOf(currencyCode) === -1) {
    throw new Error(ErrorMessage.CURRENCY_NOT_SUPPORTED)
  }

  let count = 0
  for (let i = 2; i < data.length; i++) {
    if (data[i][0] || data[i][1] || data[i][2]) {
      count++
      if (count > MAX_RECORDS_BL) {
        throw new Error(getTextByCountry(countryCode, 'createPOPage_totalBLRecords_uploadFile_errorMsg_reachedMax'))
      }
      blList.push({
        no: i,
        number: `${data[i][0]}`,
        currency: currencyCode,
        amount: data[i][1],
        remark: data[i][2] || '',
        error: '',
        numberError: null,
        amountError: null,
        remarkError: ''
      })
    }
  }

  if (count === 0) {
    throw new Error(ErrorMessage.EMPTY_FILE_UPLOAD)
  }

  return {
    state: 'success',
    data: blList,
    error_message: ''
  }
}

function validateExcelFile (file) {
  const fileName = file.name
  const fileExtension = fileName.split('.').pop()

  if (fileExtension !== 'xls' && fileExtension !== 'xlsx') {
    throw new Error(ErrorMessage.EXCEL_FILE_DOES_NOT_SUPPORT)
  }

  // File size should not exceed 300Kb
  if (file.size > (1024 * 300)) {
    throw new Error(ErrorMessage.EXCEL_MAX_SIZE_ERROR)
  }
}

// This is *Library code*, just ignore it from code coverage
/* istanbul ignore next */
async function readFileToWorkbook (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const bits = new Uint8Array(e.target.result)
        const workbook = XLSX.read(bits, {
          type: 'array'
        })

        resolve(workbook)
      } catch (error) {
        reject(new Error(ErrorMessage.EXCEL_FILE_DOES_NOT_SUPPORT))
      }
    }

    reader.onerror = () => reject(new Error(ErrorMessage.EXCEL_FILE_DOES_NOT_SUPPORT))

    reader.readAsArrayBuffer(file)
  })
}

export {
  validateExcelFile,
  validateExcelContent,
  readFileToWorkbook
}
