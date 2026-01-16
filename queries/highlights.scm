; Keywords
[
  "Sub"
  "Function"
  "Property"
  "Get"
  "Let"
  "Set"
  "Type"
  "Enum"
  "If"
  "Then"
  "Else"
  "ElseIf"
  "End"
  "Select"
  "Case"
  "For"
  "Each"
  "In"
  "Next"
  "To"
  "Step"
  "While"
  "Wend"
  "Do"
  "Loop"
  "Until"
  "With"
  "Option"
  "Explicit"
  "Base"
  "Compare"
  "Private"
  "Public"
  "Const"
  "Dim"
  "Static"
  "Global"
  "ReDim"
  "Preserve"
  "Erase"
  "GoTo"
  "Exit"
  "On"
  "Error"
  "Resume"
  "Stop"
] @keyword

; Types
(type
  (identifier) @type)

[
  "String"
  "Integer"
  "Long"
  "LongPtr"
  "Double"
  "Single"
  "Boolean"
  "Variant"
  "Currency"
  "Byte"
  "Date"
  "Object"
  "Any"
] @type.builtin

; Functions / subs / properties
(sub_definition
  name: (identifier) @function)

(function_definition
  name: (identifier) @function)

(property_get_definition
  name: (identifier) @function)

(property_let_definition
  name: (identifier) @function)

(property_set_definition
  name: (identifier) @function)

; Types / enums
(type_definition
  name: (identifier) @type)

(enum_definition
  name: (identifier) @type)

(enum_member
  name: (identifier) @constant)

; Variables / constants
(variable_declarator
  name: (identifier) @variable)

(const_declarator
  name: (identifier) @constant)

; Labels
(label_statement
  label: (identifier) @label)

; Literals
(string_literal) @string

(number_literal) @number

(boolean_literal) @boolean

(nothing_literal) @constant.builtin

(null_literal) @constant.builtin

; Operators
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
  "Mod"
  "And"
  "Or"
  "Xor"
  "Not"
  "Like"
  "&"
] @operator

; Member access / calls
(member_access
  "." @punctuation.delimiter)

(call_expression
  function: (identifier) @function.call)

; Parameters
(parameter
  name: (identifier) @variable.parameter)

; Comments
(comment) @comment
