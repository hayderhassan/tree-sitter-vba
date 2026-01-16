; Increase indent after these
[
  (sub_definition)
  (function_definition)
  (property_get_definition)
  (property_let_definition)
  (property_set_definition)
  (type_definition)
  (enum_definition)
  (if_statement)
  (elseif_clause)
  (else_clause)
  (select_case_statement)
  (case_clause)
  (case_else_clause)
  (for_statement)
  (for_each_statement)
  (while_statement)
  (do_statement)
  (with_statement)
] @indent.begin

; Decrease indent at these endings
[
  "End"
  "Loop"
  "Wend"
  "Next"
] @indent.end

; Labels outdent to column 0
(label_statement) @indent.branch
