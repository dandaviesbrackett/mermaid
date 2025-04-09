grammar Tubemap
import "../common/common";

entry Tubemap:
    NEWLINE*
    'tubemap-beta'
    (
        TitleAndAccessibilities
        | Phrase
        | NEWLINE
    )*
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
