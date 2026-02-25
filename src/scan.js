
/*
Input: a full LaTeX file (meaning: all imports have been expanded)

Output: list of warnings, errors, and fatalErrors

2/22/26: first work
*/

import {deleteComments} from './utils.js'
import {badPlainTeX, badEverywhereMacros, badBodyEnvironments} from './data.js'

export function scanForAnomalies(str) {

   str = deleteComments(str);

   str = str.replace(/\\end{document}.*/s, "");  // do after deleting comments

   let preambleBodyBiblio = separatePieces(str);

   let preamble = preambleBodyBiblio[0];
   let maintext = preambleBodyBiblio[1];
   let bibliography = preambleBodyBiblio[2];

   maintext = noBodyMacros(maintext);

   for(const lookfor of badEverywhereMacros) {
console.log(lookfor);
      preamble = noPlainTeX(preamble, lookfor);
      maintext = noPlainTeX(maintext, lookfor)
   }

   for(const lookfor of badPlainTeX) {
      maintext = noPlainTeX(maintext, lookfor)
   }

   for(const lookfor of badBodyEnvironments) {
      maintext = noBadEnvironments(maintext, lookfor)
   }

   console.log("maintext",maintext);

   return preamble + "\\begin{document}\n" + maintext + "\\begin{thebobliography}\n" + bibliography

}

function separatePieces(str) {

   let twopieces = str.split("\\begin{document");

   if(twopieces.length != 2) {
      console.log("mising begin{document}")
   }
   const thepreamble = twopieces[0];
   let thebody = twopieces[1];

   let thebiblio = "";

   if(thebody.match(/begin{thebibliography}/)) {

      const bodyandbiblio = thebody.split("\\begin{thebibliography}");
      thebody = bodyandbiblio[0];
      thebiblio = bodyandbiblio[1]
   }

   return [thepreamble,thebody,thebiblio]
}

function noBodyMacros(str) {  // assumes str is body, so should not have any macros

   if(str.match(/\\newcommand/)) { 

       allErrors.push(["warning","macros_in_body"]);

       str = str.replace(/(\\newcommand.*)/g, '<span class="warning macros_in_body">$1</span>');
   }

   return str
}

function noBadEnvironments(str, lookingFor) {

   const thesetagsName = lookingFor[0];
   for(const lookfor of lookingFor[1]) {

      const re = new RegExp("(\\\\(begin|end){\\s*" + lookfor + "})", 'g');

      if(str.match(re)) {

          allErrors.push(["error", thesetagsName]);

          str = str.replace(re, '<span class="error ' + thesetagsName + '">$1</span>');
      }
   }

   return str
}


function noPlainTeX(str, lookingFor) {

console.log(lookingFor);
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


export function showErrors(errs) {

   let theseerrors = "";

   for (let err of errs){

     let thiserr = '<span class="' + err[0] + ' root' +  err[1] + '">' + err[1] + '</span>' + ' <span onclick="scrollToClass(' + "'" + err[1] + "'" + ')">find</span>' +  '\n' + "<br/>";

     theseerrors += thiserr

   }

   return theseerrors
}
