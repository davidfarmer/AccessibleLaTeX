
export function deleteComments(str) {

   str = str.replace(/\s+%.*/g, "");  //  don't leave a blank line
   str = str.replace(/([^\\])%.*/g, "$1");  //  \% is a literal percent
   str = str.replace(/^%.*/, "");  // start of document

   return str
}
