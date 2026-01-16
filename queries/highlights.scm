; =========
; VBA highlights that don't depend on kw_* token nodes
; =========
; Comments & literals (these should exist in your grammar)
(comment) @comment

(string_literal) @string

(number_literal) @number

(boolean_literal) @boolean

(nothing_literal) @constant.builtin

(null_literal) @constant.builtin

; Declarations (structure-based, robust)
(sub_definition
  name: (identifier) @function)

(function_definition
  name: (identifier) @function)

(variable_declarator
  name: (identifier) @variable)

(const_declarator
  name: (identifier) @constant)

(parameter
  name: (identifier) @variable.parameter)

(label_statement
  label: (identifier) @label)

; Calls
(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (member_access
    member: (identifier) @function.call))

; Member access punctuation
(member_access
  "." @punctuation.delimiter)

; Operators (match literal tokens that exist as anonymous nodes)
[
  "="
  "<>"
  "<"
  "<="
  ">"
  ">="
  "+"
  "-"
  "*"
  "/"
  "\\"
  "^"
  "&"
] @operator

; If your grammar has these as literal operator tokens too, keep them:
; (Some grammars model them as identifiers/keywords instead.)
