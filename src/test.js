
import { scanForAnomalies } from './main.js'
import { showErrors } from './scan.js'

export { scanForAnomalies }

if (sourceTextArea.addEventListener) {
  sourceTextArea.addEventListener('input', function() {
       allErrors = [];
//      echosourceTextArea.value = scanForAnomalies(sourceTextArea.value);
      scannedTextArea.innerHTML = scanForAnomalies(sourceTextArea.value);
      errorsDisplayArea.innerHTML = showErrors(allErrors);
  });
}

