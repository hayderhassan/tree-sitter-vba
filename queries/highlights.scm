; Keywords (case-insensitive tokens defined as named nodes)
[
  (kw_sub)
  (kw_function)
  (kw_property)
  (kw_get)
  (kw_let)
  (kw_set)
  (kw_type)
  (kw_enum)
  (kw_if)
  (kw_then)
  (kw_else)
  (kw_elseif)
  (kw_end)
  (kw_select)
  (kw_case)
  (kw_for)
  (kw_each)
  (kw_in)
  (kw_next)
  (kw_to)
  (kw_step)
  (kw_while)
  (kw_wend)
  (kw_do)
  (kw_loop)
  (kw_until)
  (kw_with)
  (kw_option)
  (kw_explicit)
  (kw_base)
  (kw_compare)
  (kw_private)
  (kw_public)
  (kw_const)
  (kw_dim)
  (kw_static)
  (kw_global)
  (kw_redim)
  (kw_preserve)
  (kw_erase)
  (kw_goto)
  (kw_exit)
  (kw_on)
  (kw_error)
  (kw_resume)
  (kw_stop)
  (kw_attribute)
  (kw_friend)
] @keyword

; Builtin types
[
  (kw_string)
  (kw_integer)
  (kw_long)
  (kw_longptr)
  (kw_double)
  (kw_single)
  (kw_boolean)
  (kw_variant)
  (kw_currency)
  (kw_byte)
  (kw_date)
  (kw_object)
  (kw_any)
] @type.builtin

; Declarations
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

(type_definition
  name: (identifier) @type)

(enum_definition
  name: (identifier) @type)

(enum_member
  name: (identifier) @constant)

(variable_declarator
  name: (identifier) @variable)

(const_declarator
  name: (identifier) @constant)

(parameter
  name: (identifier) @variable.parameter)

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
  (kw_and)
  (kw_or)
  (kw_xor)
  (kw_not)
  (kw_like)
  (kw_mod)
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

; Member access punctuation
(member_access
  "." @punctuation.delimiter)

; Calls
(call_expression
  function: (identifier) @function.call)

; Comments
(comment) @comment
