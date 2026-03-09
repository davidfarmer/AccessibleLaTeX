
export let badPlainTeX = [
   ["unused","conditionals", ["if","fi","then","else","loop","repeat"]],
   ["presentation","tex_fonts", ["rm","em","it", "itshape","bf","bfseries","sf", "sffamily","textsl","normalfont"]],
   ["presentation","font_size", ["tiny","scriptsize","footnotesize","small","normalsize",
                  "large","Large","LARGE", "huge", "Huge"]],
   ["presentation","latex_fonts", ["textrm","textit","textbf", "textsc","texttt"]],
   ["presentation","spacing_vertical", ["smallskip","medskip","bigskip", "vfil","vfill"]],
   ["presentation","archaic_tex", ["centerline",  "noindent", "par"]],
];

// NewDocumentCommand
//  declaretheorem , declaretheoremstyle
// newenvironment
// \vspace{1cm} medskip

export let badEverywhereMacros = [
   ["accessibility","colors", ["textcolor", "mathcolor","definecolor"]],
   ["accessibility","consistency", ["renewcommand"]],
   ["mistake","nonstructural", ["ensuremath"]],
   ["archaic","use_newcommand_only",["def","let","edef","gdef","xdef","global","long"]],
   ["archaic","low_level_tex", ["relax","makeatletter","makeatother","catcode",
        "csname","endcsname", "shipout", "noexpand","expandafter","clearpage"]],
   ["archaic","file_manipulation", ["newwrite","newread","immediate","write","write18",
        "read","readline","readfile",
        "openin","openout", "jobname"]],
   ["presentation","spacing_vertical", ["vspace"]],
];

export let badBodyEnvironments = [
          ["presentation","nonstructural", ["center", "minipage"]]
];

export let typeOfError = {
    "unused": "LaTeX-specific markup",
    "presentation": "Presentation does not go into PreTeXt source",
    "accessibility": "Accessibility issue",
    "mistake": "This feature should not have been added to LaTeX",
    "archaic": "plain TeX that shoudl not be in LaTeX source"
};

// need to handle def and let somewhere
// and edef, gdef, xdef
// and global, long
// newif
