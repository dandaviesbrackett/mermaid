grammar Tubemap
//horrible inline import of common as per radar
//import "../common/common";

interface Common {
  accDescr?: string;
  accTitle?: string;
  title?: string;
}

fragment TitleAndAccessibilities:
  ((accDescr=ACC_DESCR | accTitle=ACC_TITLE | title=TITLE) EOL)+
;

fragment EOL returns string:
  NEWLINE+ | EOF
;

terminal NEWLINE: /\r?\n/;
terminal ACC_DESCR: /[\t ]*accDescr(?:[\t ]*:([^\n\r]*?(?=%%)|[^\n\r]*)|\s*{([^}]*)})/;
terminal ACC_TITLE: /[\t ]*accTitle[\t ]*:(?:[^\n\r]*?(?=%%)|[^\n\r]*)/;
terminal TITLE: /[\t ]*title(?:[\t ][^\n\r]*?(?=%%)|[\t ][^\n\r]*|)/;

hidden terminal WHITESPACE: /[\t ]+/;
hidden terminal YAML: /---[\t ]*\r?\n(?:[\S\s]*?\r?\n)?---(?:\r?\n|(?!\S))/;
hidden terminal DIRECTIVE: /[\t ]*%%{[\S\s]*?}%%(?:\r?\n|(?!\S))/;
hidden terminal SINGLE_LINE_COMMENT: /[\t ]*%%[^\n\r]*/;

entry Tubemap:
    NEWLINE*
    'tubemap-beta'
    (
        NEWLINE* TitleAndAccessibilities Phrase*
        | NEWLINE+ Phrase+
        | NEWLINE*

    )
;

fragment Phrase:
    (
        stops += StopDef
        | lines += LineDef
    ) EOL
;

StopDef:
    'stop' (
        name=ID Label?
        | name=STRING
    )
;

LineDef:
    'line' name=ID Label? StopList
;

fragment StopList:
    (
        stops+=[StopDef:ID]
        | '[' stops += StopDef ']'
    ) 
    (',' (
        stops+=[StopDef:ID]
        | '[' stops += StopDef ']'
    ))*
;

fragment Label:
    'as' label=STRING
;

terminal ID returns string: /[_a-zA-Z][\w_]*/;
terminal NUMBER returns number: /(0|[1-9][0-9]*)(\.[0-9]+)?/;
terminal BOOLEAN returns boolean: 'true' | 'false';    
terminal STRING returns string: /"[^"]*"|'[^']*'/;
