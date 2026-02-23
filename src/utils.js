
export function deleteComments(str) {

   str = str.replace(/([^\\])%.*/g, "$1");  //  \% is a literal percent
   str = str.replace(/^%.*/, "");  // start of document

   return str
}
