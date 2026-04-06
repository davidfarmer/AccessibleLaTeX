
/*
Input: a full LaTeX file (meaning: all imports have been expanded)

Output: list of warnings, errors, and fatalErrors

2/22/26: first work
*/

const anomalyStatus = document.getElementById('anomalyStatus');

// import {deleteComments, makeSafe} from './utils.js'
import {badPlainTeX, badPlainTeXdirectives, specialBadMacros, badEverywhereMacros, badEverywhereMacrosLine, badEverywhereMacrosPlus, badBodyEnvironments, alternatives} from './data.js'

// export function trimjunk(str) {
// 
//    str = deleteComments(str);
//    str = makeSafe(str);
//    str = str.replace(/\\end{document}.*/s, "");  // after deleting comments, in case an end was commented out
// 
//    return str
// }

export function scanForAnomalies(str) {

   let basicerrors = [];

   let preambleBodyBiblio = separatePieces(str);

   let preamble = preambleBodyBiblio[0];
   let maintext = preambleBodyBiblio[1];
   let bibliography = preambleBodyBiblio[2];

   maintext = fixPlainTeX(maintext,badPlainTeXdirectives);

   maintext = noBodyMacros(maintext);

console.log("maintext 1", maintext.substring(1,40));

   for(const lookfor of badEverywhereMacros) {
//console.log(lookfor);
      preamble = noPlainTeX(preamble, lookfor,"", "delete");
      maintext = noPlainTeX(maintext, lookfor,"", "delete");
   }
   for(const lookfor of specialBadMacros){
      preamble = noPlainTeX(preamble, lookfor,"", "delete", "in the preamble");
      maintext = noPlainTeX(maintext, lookfor,"", "delete", "in the main text")
}

console.log("maintext 2", maintext.substring(1,40));

   for(const lookfor of badEverywhereMacrosPlus) {
//console.log(lookfor);
      preamble = noPlainTeX(preamble, lookfor,"hasarg","delete");
      maintext = noPlainTeX(maintext, lookfor,"hasarg","delete")
   }
   for(const lookfor of badEverywhereMacrosLine) {
//console.log(lookfor);
      preamble = noPlainTeX(preamble, lookfor,"line", "delete"," -- only use 'newcommand' for macros");
      maintext = noPlainTeX(maintext, lookfor,"line", "delete"," -- only use 'newcommand', and only in the preamble")
   }

console.log("maintext 3", maintext.substring(1,40));

   for(const lookfor of badPlainTeX) {
      maintext = noPlainTeX(maintext, lookfor)
   }

   for(const lookfor of badBodyEnvironments) {
      maintext = noBadEnvironments(maintext, lookfor, "env", "delete")
   }

//   console.log("maintext",maintext);

   return preamble + "\\begin{document}\n" + maintext + "\\begin{thebibliography}\n" + bibliography

}

export function separatePieces(str) {

   let twopieces = str.split("\\begin{document}");

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

   if(str.match(/\\(re)?newcommand/)) { 

//       allErrors.push(["warning","macros_in_body"]);

       str = str.replace(/(\\(re)?newcommand.*)/g, '<span class="warning macros_in_body">1</span>');
   }

   return str
}

function noBadEnvironments(str, lookingFor,env="",action="", extra="") {

   const thesetagsName = lookingFor[0];
   const thesetagsType = lookingFor[1];
   for(const lookfor of lookingFor[2]) {

      const re = new RegExp("(\\\\(begin|end){\\s*" + lookfor + "})", 'g');

      if(str.match(re)) {

   //       allErrors.push(["error", thesetagsType, lookfor]);

        if(action=="delete") {
    showDeleteStatus(thesetagsName, lookfor, str.match(re).length, extra);
          str = str.replace(re, "");
      } else {
          str = str.replace(re, '<span tabindex="0" data-macro="' + lookfor + '" class="error ' + lookfor + '" onclick="addEditMenuTo(this)">$1</span>');
    showAnomalyStatus(thesetagsName, thesetagsType, lookfor);
      }
      }
   }

   return str
}


export function Xshoweditmenu() {
    console.log(this)
}

function fixPlainTeX(str, lookingFor) {

//console.log(lookingFor);
   const thesetagsType = lookingFor[0];
   const thesetagsName = lookingFor[1];
   for (const lookfor of lookingFor[2]) {
  //    const thesetagsOr = lookingFor[1].join("|");
//      console.log("checking lookfor",lookfor);
      var lookforname;
      var replacement;
      // if we are looking for a string, we want to delete it
      if(typeof lookfor === 'string') {
         lookforname = "\\\\" + lookfor + "\\b";
         replacement = ""
      } else if (thesetagsName == "tex_fonts") {
        lookforname = "{ *\\\\" + lookfor[0] + "\\b *";
        replacement = "\\" + lookfor[1] + "{"
      } else {
        lookforname = "\\\\" + lookfor[0] + "\\b *";
        replacement = "\\" + lookfor[1]
      }

     let re = new RegExp(lookforname, 'g');

//console.log("re",re);

     if(str.match(re)) {

        showUpdate('lookfor', 'error');
        errorsSoFar.push(["tex", thesetagsType, lookfor]);
        str = str.replace(re, replacement)
     }
  }
    return str
}

function noPlainTeX(str, lookingFor, type="", action="", extra="") {

//console.log(lookingFor);
   const thesetagsType = lookingFor[0];
   const thesetagsName = lookingFor[1];
   for (const lookfor of lookingFor[2]) {
  //    const thesetagsOr = lookingFor[1].join("|");
  //    console.log("checking ",lookfor);
      var lookforname;
      if(typeof lookfor === 'string') { lookforname = lookfor }
      else { lookforname = lookfor[0] }

      let re = new RegExp("(\\\\(" + lookforname + ")\\b)", 'g');
//console.log("             Q         re",lookforname,"Q",re);

      if(type=="hasarg") {
          let researchstring = "(\\\\(" + lookforname + ")\\b\\*?";
          for(let i=0; i < lookfor[1]; ++i) {
             researchstring += "{[^{}]*}"
          }
          researchstring += ")";
          re = new RegExp(researchstring, 'g');
//console.log("                      re",lookforname,"P",re);
      }

      if(type=="line") {
          re = new RegExp("(\\\\(" + lookforname + ")\\b.*)", 'g');
      }

      if(str.match(re)) {

//          allErrors.push(["error", thesetagsType , lookforname]);

          if(action == "delete") {
            showDeleteStatus(thesetagsType, lookforname, str.match(re).length, extra);
            str = str.replace(re, "");
          } else {
            showAnomalyStatus(thesetagsType, thesetagsName, lookfor);
            str = str.replace(re, '<span tabindex="0" data-macro="' + lookforname + '" ' +  'class="error' + ' ' + thesetagsType + ' ' + lookforname + '">$1</span>');
          }
      }

   }

//console.log(str.slice(1,50));
   return str
}


export function showErrors(errs, type="error") {

   let theseerrors = "";

   for (let err of errs){
     if(err[0] == type) {
//console.log("typeof ", err[2], "X",typeof err[2]);
       let thiserr = '<span class="' + err[0] + ' ' + 'root' +  err[2] + ' ' + err[1]  + '">' + err[2] + '</span>' + ' <span onclick="scrollToClass(' + "'" + err[2] + "',0" + ')">first</span>' + ' ' + '<span onclick="scrollToClass(' + "'" + err[2] + "',-1" + ')">last</span>' +  '\n' + "<br/>";

       theseerrors += thiserr
     }

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
       document.activeElement.click();
       console.log("clicked:", document.activeElement)
    } else if (e.code == "Enter") {
       console.log("adding menu")
       addEditMenuTo(input_region);
    }
    if (e.code == "Tab" && themenu) {
       e.preventDefault();
       let thismenuitem = document.activeElement;
       if(thismenuitem.nextElementSibling) { thismenuitem.nextElementSibling.focus() }
       else { thismenuitem.parentElement.children[0].focus() }
       console.log("moved to:", document.activeElement)
    }
}

function wrapq(str) {
   return "'" + str + "'"
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

   var innermenu = '<span class="option" tabindex="0" onClick="closemenu()">Leave as-is (will be ignored later)</span>';
   innermenu += '<span class="option" tabindex="0"  onClick="replacetex(' + wrapq(toreplace) + ',0' + ',0)">Delete</span>';
   innermenu += '<span class="option" tabindex="0"  onClick="replacetex(' + wrapq(toreplace) + ',-1' + ',-1)">Delete everywhere</span>';
  for(const optionpair of options) {
      var thisoption = '<span onClick="replacetex(' + wrapq(toreplace) + "," + "'" + optionpair[0]+ "'" + ',1)" tabindex="0"  class="option">';
      thisoption +=  optionpair[1]
      thisoption +=  '</span>';
      thisoption +=  '<span onClick="replacetex('  + wrapq(toreplace) + ","+ wrapq(optionpair[0]) + ',1000)" tabindex="0"  class="option">';
      thisoption +=  optionpair[1] + ' (replace everywhere)';
      thisoption +=  '</span>';
   
      innermenu += thisoption   
   }
   let edit_menu = document.createElement('span');
   edit_menu.setAttribute("id", "edit_menu_holder");
   edit_menu.innerHTML = innermenu;
   elem.appendChild(edit_menu);
   document.getElementById('edit_menu_holder').firstChild.focus();
console.log("active now:",document.activeElement);
}

function showAnomalyStatus(err0, err1, err2) {
   document.getElementById('anomalySection').className = `show status`;

   var thiserrWrapper = document.createElement('div');
   thiserrWrapper.className = "error";
   let thiserr = '<span class="oldmarkup ' + err0 + ' ' + 'root' +  err2 + ' ' + err1  + '">' + err2 + '</span>';

   var thisdefault = "<em>delete</em>";
   if(err2 in alternatives) { thisdefault = alternatives[err2][0][0] }

   thiserr += '<span class="default">' + thisdefault + '</span>';

    thiserr += ' <span onclick="scrollToClass(' + "'" + err2 + "',0" + ')">first</span>' + ' ... ' + '<span onclick="scrollToClass(' + "'" + err2 + "',-1" + ')">last example</span>' +  '\n' ;
   thiserrWrapper.innerHTML = thiserr;
   anomalyStatus.appendChild(thiserrWrapper);
}

function showDeleteStatus(type, substitution, num, extra="") {
   document.getElementById('deletedSection').className = `show status`;
   let message = substitution;
   message += " " + num + " times " + extra + "\n";
   deletedStatus.textContent += message;
}
