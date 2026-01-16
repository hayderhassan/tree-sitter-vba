/**
 * @file Tree-sitter grammar for VBA
 * @author Hayder Hassan <hayderh@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: "vba",

    conflicts: $ => [],

    extras: $ => [
        /\s+/,
        $.comment
    ],

    word: $ => $.identifier,

    rules: {
        source_file: $ => repeat($._top_level_statement),

        _top_level_statement: $ => choice(
            $.sub_definition,
            $.function_definition,
            $.property_get_definition,
            $.property_let_definition,
            $.property_set_definition,
            $.type_definition,
            $.enum_definition,
            $.attribute_statement,
            $.option_statement,
            $._statement
        ),

        // ----- Modules / Members -----

        sub_definition: $ => seq(
            field("modifier", optional($.access_modifier)),
            "Sub",
            field("name", $.identifier),
            optional($.parameter_list),
            optional("Static"),
            $._newline,
            repeat($._statement),
            "End",
            "Sub",
            $._newline
        ),

        function_definition: $ => seq(
            field("modifier", optional($.access_modifier)),
            "Function",
            field("name", $.identifier),
            optional($.parameter_list),
            optional(seq("As", $.type)),
            $._newline,
            repeat($._statement),
            "End",
            "Function",
            $._newline
        ),

        property_get_definition: $ => seq(
            field("modifier", optional($.access_modifier)),
            "Property",
            "Get",
            field("name", $.identifier),
            optional($.parameter_list),
            optional(seq("As", $.type)),
            $._newline,
            repeat($._statement),
            "End",
            "Property",
            $._newline
        ),

        property_let_definition: $ => seq(
            field("modifier", optional($.access_modifier)),
            "Property",
            "Let",
            field("name", $.identifier),
            optional($.parameter_list),
            $._newline,
            repeat($._statement),
            "End",
            "Property",
            $._newline
        ),

        property_set_definition: $ => seq(
            field("modifier", optional($.access_modifier)),
            "Property",
            "Set",
            field("name", $.identifier),
            optional($.parameter_list),
            $._newline,
            repeat($._statement),
            "End",
            "Property",
            $._newline
        ),

        type_definition: $ => seq(
            "Type",
            field("name", $.identifier),
            $._newline,
            repeat1($.type_field),
            "End",
            "Type",
            $._newline
        ),

        type_field: $ => seq(
            field("name", $.identifier),
            optional(seq("As", $.type)),
            $._newline
        ),

        enum_definition: $ => seq(
            "Enum",
            field("name", $.identifier),
            $._newline,
            repeat1($.enum_member),
            "End",
            "Enum",
            $._newline
        ),

        enum_member: $ => seq(
            field("name", $.identifier),
            optional(seq("=", $.expression)),
            $._newline
        ),

        access_modifier: $ => choice(
            "Public",
            "Private",
            "Friend",
            "Global"
        ),

        option_statement: $ => seq(
            "Option",
            choice(
                "Explicit",
                "Base",
                "Compare",
                "Private",
                "Public"
            ),
            optional(choice("Text", "Binary", "Database")),
            $._newline
        ),

        attribute_statement: $ => seq(
            "Attribute",
            $.identifier,
            "=",
            $.expression,
            $._newline
        ),

        // ----- Parameters / Types -----

        parameter_list: $ => seq(
            "(",
            optional(commaSep1($.parameter)),
            ")"
        ),

        parameter: $ => seq(
            optional(choice("ByVal", "ByRef")),
            field("name", $.identifier),
            optional(seq("As", $.type)),
            optional(seq("=", $.expression))
        ),

        type: $ => choice(
            $.identifier,
            "String",
            "Integer",
            "Long",
            "LongPtr",
            "Double",
            "Single",
            "Boolean",
            "Variant",
            "Currency",
            "Byte",
            "Date",
            "Object",
            "Any"
        ),

        // ----- Statements -----

        _statement: $ => choice(
            $.if_statement,
            $.select_case_statement,
            $.for_statement,
            $.for_each_statement,
            $.while_statement,
            $.do_statement,
            $.with_statement,
            $.variable_declaration,
            $.const_declaration,
            $.assignment_statement,
            $.call_statement,
            $.exit_statement,
            $.error_statement,
            $.on_error_statement,
            $.redim_statement,
            $.erase_statement,
            $.goto_statement,
            $.label_statement,
            $.stop_statement,
            $.line_continuation_statement,
            $.empty_statement
        ),

        empty_statement: $ => $._newline,

        line_continuation_statement: $ => seq("_", $._newline),

        _newline: $ => /\r?\n/,

        if_statement: $ => seq(
            "If",
            $.expression,
            "Then",
            $._newline,
            repeat($._statement),
            repeat($.elseif_clause),
            optional($.else_clause),
            "End",
            "If",
            $._newline
        ),

        elseif_clause: $ => seq(
            "ElseIf",
            $.expression,
            "Then",
            $._newline,
            repeat($._statement)
        ),

        else_clause: $ => seq(
            "Else",
            $._newline,
            repeat($._statement)
        ),

        select_case_statement: $ => seq(
            "Select",
            "Case",
            $.expression,
            $._newline,
            repeat1($.case_clause),
            optional($.case_else_clause),
            "End",
            "Select",
            $._newline
        ),

        case_clause: $ => seq(
            "Case",
            commaSep1($.case_expression),
            $._newline,
            repeat($._statement)
        ),

        case_else_clause: $ => seq(
            "Case",
            "Else",
            $._newline,
            repeat($._statement)
        ),

        case_expression: $ => choice(
            $.expression,
            seq($.expression, "To", $.expression)
        ),

        for_statement: $ => seq(
            "For",
            field("var", $.identifier),
            "=",
            $.expression,
            "To",
            $.expression,
            optional(seq("Step", $.expression)),
            $._newline,
            repeat($._statement),
            "Next",
            optional($.identifier),
            $._newline
        ),

        for_each_statement: $ => seq(
            "For",
            "Each",
            field("var", $.identifier),
            "In",
            $.expression,
            $._newline,
            repeat($._statement),
            "Next",
            optional($.identifier),
            $._newline
        ),

        while_statement: $ => seq(
            "While",
            $.expression,
            $._newline,
            repeat($._statement),
            "Wend",
            $._newline
        ),

        do_statement: $ => choice(
            // Do [While/Until expr] ... Loop
            seq(
                "Do",
                optional(seq(choice("While", "Until"), $.expression)),
                $._newline,
                repeat($._statement),
                "Loop",
                $._newline
            ),

            // Do ... Loop While/Until expr  (post-condition)
            prec.right(1, seq(
                "Do",
                $._newline,
                repeat($._statement),
                "Loop",
                seq(choice("While", "Until"), $.expression),
                $._newline
            ))
        ),

        with_statement: $ => seq(
            "With",
            $.expression,
            $._newline,
            repeat($._statement),
            "End",
            "With",
            $._newline
        ),

        variable_declaration: $ => seq(
            optional(choice("Public", "Private", "Dim", "Static", "Global")),
            commaSep1($.variable_declarator),
            $._newline
        ),

        variable_declarator: $ => seq(
            field("name", $.identifier),
            optional(seq("As", $.type)),
            optional(seq("=", $.expression))
        ),

        const_declaration: $ => seq(
            "Const",
            commaSep1($.const_declarator),
            $._newline
        ),

        const_declarator: $ => seq(
            field("name", $.identifier),
            optional(seq("As", $.type)),
            "=",
            $.expression
        ),

        assignment_statement: $ => seq(
            field("target", $.lvalue),
            "=",
            $.expression,
            $._newline
        ),

        lvalue: $ => prec.left(10, choice(
            $.identifier,
            $.member_access,
            $.indexed_expression
        )),

        call_statement: $ => seq(
            optional("Call"),
            $.expression,
            $._newline
        ),

        exit_statement: $ => seq(
            "Exit",
            choice("Sub", "Function", "Property", "Do", "For", "While"),
            $._newline
        ),

        error_statement: $ => seq(
            "Error",
            $.expression,
            $._newline
        ),

        on_error_statement: $ => seq(
            "On",
            "Error",
            choice(
                seq("GoTo", $.identifier),
                seq("GoTo", "0"),
                seq("Resume", "Next")
            ),
            $._newline
        ),

        redim_statement: $ => seq(
            "ReDim",
            optional("Preserve"),
            commaSep1($.redim_target),
            $._newline
        ),

        redim_target: $ => seq(
            $.identifier,
            $.array_dimensions
        ),

        array_dimensions: $ => seq(
            "(",
            commaSep1($.expression),
            ")"
        ),

        erase_statement: $ => seq(
            "Erase",
            commaSep1($.identifier),
            $._newline
        ),

        goto_statement: $ => seq(
            "GoTo",
            $.identifier,
            $._newline
        ),

        label_statement: $ => seq(
            field("label", $.identifier),
            ":",
            $._newline
        ),

        stop_statement: $ => seq(
            "Stop",
            $._newline
        ),

        // ----- Expressions -----

        expression: $ => choice(
            $.binary_expression,
            $.unary_expression,
            $.call_expression,
            $.member_access,
            $.indexed_expression,
            $.parenthesized_expression,
            $.literal,
            $.identifier
        ),

        parenthesized_expression: $ => seq(
            "(",
            $.expression,
            ")"
        ),

        call_expression: $ => prec.left(2, seq(
            field("function", choice($.identifier, $.member_access)),
            optional($.argument_list)
        )),

        argument_list: $ => seq(
            "(",
            optional(commaSep1($.expression)),
            ")"
        ),

        member_access: $ => prec.left(3, seq(
            field("object", $.expression),
            ".",
            field("member", $.identifier)
        )),

        indexed_expression: $ => prec.left(5, seq(
            field("object", choice($.identifier, $.member_access)),
            "(",
            commaSep1($.expression),
            ")"
        )),

        unary_expression: $ => prec(9, seq(
            field("operator", choice("-", "+", "Not")),
            field("argument", $.expression)
        )),

        binary_expression: $ => choice(
            ...[
                ["Or", 1],
                ["Xor", 2],
                ["And", 3],
                ["=", 4],
                ["<>", 4],
                ["<", 4],
                ["<=", 4],
                [">", 4],
                [">=", 4],
                ["Like", 4],
                ["&", 5],
                ["+", 6],
                ["-", 6],
                ["*", 7],
                ["/", 7],
                ["\\", 7],
                ["Mod", 7],
                ["^", 8]
            ].map(([op, precLevel]) =>
                prec.left(precLevel, seq(
                    field("left", $.expression),
                    field("operator", op),
                    field("right", $.expression)
                ))
            )
        ),

        literal: $ => choice(
            $.string_literal,
            $.number_literal,
            $.boolean_literal,
            $.nothing_literal,
            $.null_literal
        ),

        string_literal: $ => /"([^"]|"")*"/,

        number_literal: $ => token(choice(
            /\d+(\.\d+)?([eE][+-]?\d+)?/,
            /&H[0-9A-Fa-f]+/,
            /&O[0-7]+/
        )),

        boolean_literal: $ => choice(
            "True",
            "False"
        ),

        nothing_literal: $ => "Nothing",

        null_literal: $ => "Null",

        identifier: $ => /[A-Za-z_][A-Za-z0-9_]*/,

        comment: $ => token(choice(
            seq("'", /.*/),
            seq(/[Rr][Ee][Mm]/, /[^\r\n]*/)
        ))
    }
});

function commaSep1(rule) {
    return seq(rule, repeat(seq(",", rule)));
}
