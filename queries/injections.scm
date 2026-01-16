;
; SQL inside strings
;
((string_literal) @injection.content
  (#match? @injection.content "(?i)^\"?(SELECT|UPDATE|INSERT|DELETE|WITH|CREATE|ALTER|DROP)\\b")
  (#set! injection.language "sql"))

;
; Excel formulas inside strings
;
((string_literal) @injection.content
  (#match? @injection.content "^=\"")
  (#set! injection.language "excel"))

;
; XML inside strings
;
((string_literal) @injection.content
  (#match? @injection.content "^<\\?*\\w")
  (#set! injection.language "xml"))

;
; JSON inside strings
;
((string_literal) @injection.content
  (#match? @injection.content "^\\s*[{[]")
  (#set! injection.language "json"))

;
; CSV inside strings (simple heuristic)
;
((string_literal) @injection.content
  (#match? @injection.content "^[A-Za-z0-9_]+(,[A-Za-z0-9_]+)+$")
  (#set! injection.language "csv"))

;
; Regular expressions inside strings (VBScript-style)
;
((string_literal) @injection.content
  (#match? @injection.content "^\"[\\^$.*+?()[\\]{}|]")
  (#set! injection.language "regex"))

;
; Comment-based injections
; Example:
; ' language=sql
; "SELECT * FROM Users"
;
((comment) @comment
  (#match? @comment "(?i)language=sql")
  (#set! injection.language "sql")
  (#set! injection.include-children true))

((comment) @comment
  (#match? @comment "(?i)language=xml")
  (#set! injection.language "xml")
  (#set! injection.include-children true))

((comment) @comment
  (#match? @comment "(?i)language=json")
  (#set! injection.language "json")
  (#set! injection.include-children true))

((comment) @comment
  (#match? @comment "(?i)language=regex")
  (#set! injection.language "regex")
  (#set! injection.include-children true))
