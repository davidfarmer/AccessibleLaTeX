
# Now to write good LaTeX

The most important thing to do is use standard style files,
and use those macros as they were intended.

The recommended basic set of style files is (in LaTeX syntax
so you can just copy-paste):
```
\usepackage{amsart}
\usepackage{amsmath}
...
...
...
```

You may need to include `example` for some other specialized
mathematics.  That is fine.

You may be in the habit of including style files which help
you adjust the layout, such as `example1`, `example2`, or
`example3`, or a style file from a publisher,
You should **assume those will be ignored**.
If you are trying to make a PDF which includes some accessibility
features (note that we did not say "accessible PDF"), you may
encounter[[]].  If you are converting to other formats,
it may be impossible to provide the precise layout control you have
come to expect from LaTeX.


## Overall structure

three parts:

front matter, body, bibliography

## Structure of the document body

### Divisions

Set op the outline of your document using `\chapter`,
`\section`, and `subsection`.

### Environments (is that the right term?)

Definitions, examples, lemmas, etc are marked with
```
\begin{X}[Optional title]
 ...
\end{X}
```
where `X` is anything from the long list provided by the
`amsart` class: theorem, proposition, lemma, definition,
remark, and many more (including common abbreviations,
such as thm, def, and rem).

### Lists

Lists, numbered or not, are available with the `enumerate`
or `itemize`, respectively.  It is possible to customize
the list markers, such as
```
\begin{enumerate}[something here]
\end{enumerate}
```
Those items will be labeled A), B), C), etc.
Do not assume that you will get the markers you asked for
however.  And that is okay:  you should use `\label{...}`
and `\ref{...}` if you need to refer to a list item.

Do not use the `\item[...]` option to change the marker
on an individual item.  If you are making a glossary or
other list were all the items have a custom label,
make a description list:
```
\begin{description}
\item[avocado]  The fruit used to make guacamole.
\item[banana] A fruit that has to be picked before it is ripe
so that seeds don't form.
\item[tomato] Yes, that is also a fruit, and some people put it
 in guacamole.
\end{description}
```

### Tables

Tables are fine for information that is inherently tabular.
This means that the items in each row have something in common,
the items in each column have something in common, and all
(or almost all) cells have content.  In particular, the table is
not being used for the visual arrangement of non-tabular data.

[[put description of table markup here]]

### Figures

[[ describe the usual way]]

## Paragraph content

Most of the textual content is within a paragraph,
or in a list item or caption.

[[ emphasis, alert, terminology, inline math,
display math

## Labels and references

Put at most one label in each numbered environment,
preferably at the start.  Use a meaningful readable label,
because in some output formats it may be visible to the reader.

Use `\eqref{...}` to refer to an equation and `\ref{...}` to
other labels.  

## Macros

Macros are useful for describing your content, particularly
_good macros_, which by definition are named in a way that
conveys what they mean.
Examples of good macros:
```
\newcommand{\term}[1]{\textbf{#1}}  % for new terminology
\newcommand{\abs}[1]{|#1|}
\newcommand{\card}[1]{|#1|}
```
A good macro is characterized by: you lose information when you
expand the macro.  Think about that for a bit.
Your future self, and your coauthors, will thank you for using
good macros, because you don;t have to guess what the markup means.

You may be in the habit of using "shortcut" or "bad" macros so that
you type a cryptic short string instead of a meaningful longer
string.  It would be better to learn to use a modern editing program
that can manage shortcuts for you.  But whatever macros you use,
define them with the `\newcommand`, as shown above.

Those macro definitions must be in the preamble, not in the body(?) of
the document.

Do not use TeX-style `\def` or `\let`, nor use `\renewcommand`.

### Conditionals: `\if`.

If you keep multiple versions in the same source file,
using `\if...\then...\else...`, assume that *all of every version
will appear in the output*.  You cannot assume that other ways of
processing your content have the sophistication of TeX,
so (usually) the safe choice is made: include everything.


## Avoid TeX primitives

In addition to not using TeX-style definitions, there is
