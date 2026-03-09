
/*
Input: a full LaTeX file (meaning: all imports have been expanded)

Output: list of warnings, errors, and fatalErrors

2/22/26: first work
*/

import {deleteComments} from './utils.js'
import {badPlainTeX, badEverywhereMacros, badBodyEnvironments, alternatives} from './data.js'

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

//   console.log("maintext",maintext);

   return preamble + "\\begin{document}\n" + maintext + "\\begin{thebibliography}\n" + bibliography

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


export function Xshoweditmenu() {
    console.log(this)
}

function noPlainTeX(str, lookingFor) {

console.log(lookingFor);
   const thesetagsType = lookingFor[0];
   const thesetagsName = lookingFor[1];
   for (const lookfor of lookingFor[2]) {
  //    const thesetagsOr = lookingFor[1].join("|");
      const thesetagsOr = lookfor;  
      console.log("checking ",thesetagsOr);

//   const re = new RegExp(`(\\\\(${thesetagsOr})\\b)`, 'g');
      const re = new RegExp("(\\\\(" + thesetagsOr + ")\\b)", 'g');

      if(str.match(re)) {

          allErrors.push(["error", thesetagsType , lookfor]);

          str = str.replace(re, '<span tabindex="0" data-macro="' + lookfor + '" ' +  'class="error' + ' ' + thesetagsType + ' ' + lookfor + '">$1</span>');
      }

   }

//console.log(str.slice(1,50));
   return str
}


export function showErrors(errs) {

   let theseerrors = "";

   for (let err of errs){

     let thiserr = '<span class="' + err[0] + ' ' + 'root' +  err[2] + ' ' + err[1]  + '">' + err[2] + '</span>' + ' <span onclick="scrollToClass(' + "'" + err[2] + "',0" + ')">first</span>' + ' ' + '<span onclick="scrollToClass(' + "'" + err[2] + "',-1" + ')">last</span>' +  '\n' + "<br/>";

     theseerrors += thiserr

   }

   return theseerrors
}

// =========== editing  ========

let editorLog = console.log;
var prev_prev_char = "";
var prev_char = "";
var this_char = "";

document.addEventListener('keydown', logKeyDown);

function logKeyDown(e) {
    if (e.code == "ShiftLeft" || e.code == "ShiftRight" || e.code == "Shift") { return }
    prev_prev_char = prev_char;
    prev_char = this_char;
    this_char = e;
    editorLog("logKey",e,"XXX",e.code);
    editorLog("are we editing", document.getElementById('actively_editing'));
    editorLog("is there already an edit menu?", document.getElementById('edit_menu_holder'));

    var themenu =  document.getElementById('edit_menu_holder');
    var input_region = document.activeElement;
    editorLog("input_region", input_region);

    if (e.code == "Enter" && themenu) {
       console.log("changing:", themenu)
    } else if (e.code == "Enter") {
       console.log("adding menu")
       addEditMenuTo(input_region);
//       let edit_menu = document.createElement('span');
//       edit_menu.setAttribute("id", "edit_menu_holder");
//       edit_menu.innerHTML = "<span id='edit_choice'>change to</span>";
//       input_region.appendChild(edit_menu)
    }
    if (e.code == "Tab" && themenu) {
       e.preventDefault();
       console.log("moving:", themenu)
    }
}

function addEditMenuTo(elem) {
   let theseclasses = elem.className;
   console.log("element has classes:", theseclasses);
   let toreplace = elem.getAttribute("data-macro");

   var options = [];
   if(toreplace in alternatives) {
      options = alternatives[toreplace];
   }
//   let options = ["textit", [["emph","emphasis"], ["term","terminology"]]];
//   let toreplace = options[0];

   var innermenu = '<span class="option" tabindex="0" >Leave as-is (will be ignored later)</span>';
   innermenu += '<span class="option" tabindex="0"  onClick="replacetex(' + "'" + toreplace + "'" + ',0' + ',0)">Delete</span>';
   innermenu += '<span class="option" tabindex="0"  onClick="replacetex(' + "'" + toreplace + "'" + ',-1' + ',-1)">Delete everywhere</span>';
  for(const optionpair of options) {
      var thisoption = '<span onClick="replacetex(' + toreplace + "," + optionpair[0] + ',1)" tabindex="0"  class="option">';
      thisoption +=  optionpair[0]
      thisoption +=  '</span>\n';
      thisoption +=  '<span onClick="replacetex('  + toreplace + ","+ optionpair[0] + ',1000)" tabindex="0"  class="option">';
      thisoption +=  optionpair[0] + ' (replace everywhere)';
      thisoption +=  '</span>\n';
   
      innermenu += thisoption   
   }
   let edit_menu = document.createElement('span');
   edit_menu.setAttribute("id", "edit_menu_holder");
   edit_menu.innerHTML = innermenu;
   elem.appendChild(edit_menu);
   document.getElementById('edit_menu_holder').firstChild.focus();
console.log("active now:",document.activeElement);
}
