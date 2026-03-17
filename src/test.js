
import { scanForAnomalies } from './main.js'
import { showErrors, Xshoweditmenu} from './scan.js'

// export { scanForAnomalies }

if (sourceTextArea.addEventListener) {
  sourceTextArea.addEventListener('input', function() {
//       allErrors = [];
//      scannedTextArea.innerHTML = scanForAnomalies(sourceTextArea.value);
//      errorsDisplayArea.innerHTML = showErrors(allErrors);
   processsource()
  });
}

function processsource() {
      allErrors = [];
      scannedTextArea.innerHTML = scanForAnomalies(sourceTextArea.value);
      errorsDisplayArea.innerHTML = showErrors(allErrors, "tex") + "XXXX" + showErrors(allErrors);
}
