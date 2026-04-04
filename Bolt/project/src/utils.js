
export function deleteComments(str) {

   str = str.replace(/\s+%.*/g, "");  //  don't leave a blank line
   str = str.replace(/([^\\])%.*/g, "$1");  //  \% is a literal percent
   str = str.replace(/^%.*/, "");  // start of document

   return str
}

export function makeXMLSafe(str) {

   str = str.replace(/> */g, "\\gt ");
   str = str.replace(/< */g, "\\lt ");

   return str
}

export function trimjunk(str) {

   str = str.replace(/\\begin +/g, "\\begin");
   str = str.replace(/section +/g, "section");
   str = str.replace(/section\*/g, "section");
   str = deleteComments(str);
   str = makeXMLSafe(str);
   str = str.replace(/\\end{document}.*/s, "");  // after deleting comments, in case an end was commented out
   str = str.replace(/^\s+/, "");
   str = str.replace(/\n{3,}/g, "\n\n");

   return str
}

