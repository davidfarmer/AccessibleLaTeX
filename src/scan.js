
/*
Input: a full LaTeX file (meaning: all imports have been expanded)

Output: list of warnings, errors, and fatalErrors

2/22/26: first work
*/

import {deleteComments} from './utils.js'
import {plainTeX} from './data.js'

export function scanForAnomalies(str) {

   str = deleteComments(str);

   str = str.replace(/\\end{document}.*/s, "");  // do after deleting comments

   let preambleAndBody = separatePreamble(str);

   let preamble = preambleAndBody[0];
   let maintext = preambleAndBody[1];

   maintext = noBodyMacros(maintext);

   preamble = noLaTeXdef(preamble);
   maintext = noLaTeXdef(maintext);

   maintext = noIfThenElse(maintext);

   for(const lookfor of plainTeX) {
      maintext = noPlainTeX(maintext, lookfor)
   }

   console.log("maintext",maintext);

   return preamble + "\\begin{document}\n" + maintext

}

function separatePreamble(str) {

  let twopieces = str.split("\\begin{document");

  if(twopieces.length != 2) {
     console.log("mising begin{document}")
  }

  return twopieces
}

function noBodyMacros(str) {  // assumes str is body, so should not have any macros

   if(str.match(/\\newcommand/)) { 

       allErrors.push(["warning","macros in body"]);

       str = str.replace(/(\\newcommand.*)/g, '<span class="warning move">$1</span>');
   }

   return str
}

function noLaTeXdef(str) { 

   if(str.match(/(\\def\b|\\let\b)/)) {

       allErrors.push(["error","LaTeX definition"]);

       str = str.replace(/((\\def\b|\\let\b).*)/g, '<span class="error delete">$1</span>');
   }

   return str
}

function noPlainTeX(str, lookingFor) {

//   const thesetags = ["conditional", ["if","then","else"]];
   const thesetagsName = lookingFor[0];
   const thesetagsOr = lookingFor[1].join("|");
   console.log("checking ifthenelse");

//   const re = new RegExp(`(\\\\(${thesetagsOr})\\b)`, 'g');
   const re = new RegExp("(\\\\(" + thesetagsOr + ")\\b)", 'g');

   if(str.match(re)) {

       allErrors.push(["error", thesetagsName]);

       str = str.replace(re, '<span class="error ' + thesetagsName + '">$1</span>');
   }

   return str
}

function noIfThenElse(str) { 

return str

const thesetags = ["conditional", ["if","then","else"]];
const thesetagsName = thesetags[0];
const thesetagsOr = thesetags[1].join("|");
console.log("checking ifthenelse");

//   const re = new RegExp(`(\\\\(${thesetagsOr})\\b)`, 'g');
   const re = new RegExp("(\\\\(" + thesetagsOr + ")\\b)", 'g');
console.log("with regex", re, " on", str);
   if(str.match(re)) {

       allErrors.push(["error","If Then Else"]);

       str = str.replace(re, '<span class="error ' + thesetagsName + '">$1</span>');
   }
   const ree = new RegExp(/(\\if\b|\\then\b|\\else\b)/, 'g');
   if(str.match(ree)) {
       console.log("matched ree")
   }

   console.log(" match ree ", ree, "jjj", str.match(ree), "lll");

   return str
}


export function showErrors(errs) {

   let theseerrors = "";

   for (let err of errs){

     let thiserr = '<div class="' + err[0] + '">' + err[1] + '</div>' + '\n';

     theseerrors += thiserr

   }

   return theseerrors
}
