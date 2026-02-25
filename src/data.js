
export let badPlainTeX = [
   ["conditionals", ["if","fi","then","else","loop","repeat"]],
   ["tex_fonts", ["rm","em","it", "itshape","bf","bfseries","sf", "sffamily","textsl","normalfont"]],
   ["font_size", ["tiny","scriptsize","footnotesize","small","normalsize",
                  "large","Large","LARGE", "huge", "Huge"]],
   ["latex_fonts", ["textrm","textit","textbf", "textsc","texttt"]],
   ["archaic_tex", ["centerline",  "noindent", "par"]],
];

// NewDocumentCommand
//  declaretheorem , declaretheoremstyle
// newenvironment
// \vspace{1cm} medskip

export let badEverywhereMacros = [
   ["not_accessible", ["textcolor", "mathcolor","definecolor","renewcommand"]],
   ["nonstructural", ["ensuremath"]],
   ["use_newcommand_only",["def","let","edef","gdef","xdef","global","long"]],
   ["low_level_tex", ["relax","makeatletter","makeatother","catcode",
        "csname","endcsname", "shipout", "noexpand","expandafter","clearpage"]],
   ["file_manipulation", ["newwrite","newread","immediate","write","write18",
        "read","readline","readfile",
        "openin","openout", "jobname"]],
];

export let badBodyEnvironments = [
          ["not_structural", ["center", "minipage"]]
];

// need to handle def and let somewhere
// and edef, gdef, xdef
// and global, long
// newif
