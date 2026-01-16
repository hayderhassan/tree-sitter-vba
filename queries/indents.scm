[
  (sub_definition)
  (function_definition)
  (if_statement)
  (for_statement)
] @indent.begin

(label_statement) @indent.branch

; End-dedent can be inferred by Zed from @indent.begin in many cases.
; Keeping it simple avoids node-type mismatches.
