/**
 * @file Tree-sitter grammar for VBA (minimal, Zed-friendly)
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

function escapeRegexLiteral(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ci(word) {
    // Case-insensitive ASCII regex with NO assertions (\b, ^, $, lookarounds).
    const body = [...word]
        .map((ch) => {
            if (/[A-Za-z]/.test(ch)) return `[${ch.toLowerCase()}${ch.toUpperCase()}]`;
            return escapeRegexLiteral(ch);
        })
        .join("");
    return new RegExp(body);
}

function kw(word) {
    // Give keywords precedence over identifiers for equal-length matches.
    return token(prec(10, ci(word)));
}

function commaSep1(rule) {
    return seq(rule, repeat(seq(",", rule)));
}

module.exports = grammar({
    name: "vba",

    // VBA is newline-sensitive, so don't treat newlines as extras.
    extras: ($) => [/[ \t\f]+/, $.comment],

    word: ($) => $.bare_identifier,

    rules: {
        // Root
        source_file: ($) => seq(repeat($._newline), repeat(seq($._top_level, repeat($._newline)))),

        _top_level: ($) => choice($.sub_definition, $.function_definition, $._statement),

        // Newlines
        _newline: (_) => /\r?\n/,

        // Comments
        comment: (_) =>
            token(
                choice(
                    seq("'", /[^\r\n]*/),
                    // REM comment without \b (Tree-sitter doesn't support assertions)
                    seq(/[Rr][Ee][Mm]/, optional(seq(/[ \t]+/, /[^\r\n]*/)))
                )
            ),

        // Identifiers
        bare_identifier: (_) => /[A-Za-z_][A-Za-z0-9_]*/,

        // VBA allows [identifier with spaces]
        bracketed_identifier: (_) => token(seq("[", /[^\]\r\n]+/, "]")),

        identifier: ($) => choice($.bare_identifier, $.bracketed_identifier),

        // Literals
        string_literal: (_) => token(seq('"', repeat(choice(/[^"\r\n]/, '""')), '"')),

        number_literal: (_) =>
            token(
                choice(
                    /\d+(\.\d+)?([eE][+-]?\d+)?/,
                    /&H[0-9A-Fa-f]+/,
                    /&O[0-7]+/
                )
            ),

        boolean_literal: (_) => choice(kw("True"), kw("False")),
        nothing_literal: (_) => kw("Nothing"),
        null_literal: (_) => kw("Null"),

        literal: ($) =>
            choice(
                $.string_literal,
                $.number_literal,
                $.boolean_literal,
                $.nothing_literal,
                $.null_literal
            ),

        // Top-level blocks
        sub_definition: ($) =>
            seq(
                optional($.access_modifier),
                kw("Sub"),
                field("name", $.identifier),
                optional($.parameter_list),
                $._newline,
                repeat($._statement),
                kw("End"),
                kw("Sub"),
                $._newline
            ),

        function_definition: ($) =>
            seq(
                optional($.access_modifier),
                kw("Function"),
                field("name", $.identifier),
                optional($.parameter_list),
                optional(seq(kw("As"), $.type)),
                $._newline,
                repeat($._statement),
                kw("End"),
                kw("Function"),
                $._newline
            ),

        access_modifier: (_) => choice(kw("Public"), kw("Private"), kw("Friend"), kw("Global")),

        // Parameters & types (minimal)
        parameter_list: ($) => seq("(", optional(commaSep1($.parameter)), ")"),

        parameter: ($) =>
            seq(
                optional(choice(kw("ByVal"), kw("ByRef"))),
                field("name", $.identifier),
                optional(seq(kw("As"), $.type)),
                optional(seq("=", $.expression))
            ),

        type: ($) =>
            choice(
                kw("String"),
                kw("Integer"),
                kw("Long"),
                kw("LongPtr"),
                kw("Double"),
                kw("Single"),
                kw("Boolean"),
                kw("Variant"),
                kw("Currency"),
                kw("Byte"),
                kw("Date"),
                kw("Object"),
                $.identifier
            ),

        // Statements (minimal set to make editor features useful)
        _statement: ($) =>
            choice(
                $.if_statement,
                $.for_statement,
                $.assignment_statement,
                $.call_statement,
                $.dim_statement,
                $.const_statement,
                $.label_statement,
                $.goto_statement,
                $.exit_statement,
                $.stop_statement
            ),

        dim_statement: ($) =>
            seq(choice(kw("Dim"), kw("Static"), kw("Public"), kw("Private"), kw("Global")), commaSep1($.variable_declarator), $._newline),

        variable_declarator: ($) =>
            seq(field("name", $.identifier), optional(seq(kw("As"), $.type)), optional(seq("=", $.expression))),

        const_statement: ($) =>
            seq(optional(choice(kw("Public"), kw("Private"), kw("Global"))), kw("Const"), commaSep1($.const_declarator), $._newline),

        const_declarator: ($) =>
            seq(field("name", $.identifier), optional(seq(kw("As"), $.type)), "=", $.expression),

        assignment_statement: ($) =>
            seq(field("target", $.lvalue), "=", field("value", $.expression), $._newline),

        lvalue: ($) => prec(10, choice($.identifier, $.member_access, $.indexed_expression)),

        call_statement: ($) => seq(optional(kw("Call")), choice($.call_expression, $.member_access, $.indexed_expression), $._newline),

        label_statement: ($) => seq(field("label", $.identifier), ":", $._newline),

        goto_statement: ($) => seq(kw("GoTo"), $.identifier, $._newline),

        exit_statement: ($) =>
            seq(
                kw("Exit"),
                choice(kw("Sub"), kw("Function"), kw("For"), kw("Do"), kw("While")),
                $._newline
            ),

        stop_statement: ($) => seq(kw("Stop"), $._newline),

        if_statement: ($) =>
            seq(
                kw("If"),
                $.expression,
                kw("Then"),
                $._newline,
                repeat($._statement),
                optional(seq(kw("Else"), $._newline, repeat($._statement))),
                kw("End"),
                kw("If"),
                $._newline
            ),

        for_statement: ($) =>
            seq(
                kw("For"),
                field("var", $.identifier),
                "=",
                field("from", $.expression),
                kw("To"),
                field("to", $.expression),
                optional(seq(kw("Step"), $.expression)),
                $._newline,
                repeat($._statement),
                kw("Next"),
                optional($.identifier),
                $._newline
            ),

        // Expressions (enough for basic highlighting / structure)
        expression: ($) =>
            choice(
                $.binary_expression,
                $.unary_expression,
                $.call_expression,
                $.member_access,
                $.indexed_expression,
                $.parenthesized_expression,
                $.literal,
                $.identifier
            ),

        parenthesized_expression: ($) => seq("(", $.expression, ")"),

        call_expression: ($) =>
            prec.left(2, seq(field("function", choice($.identifier, $.member_access)), optional($.argument_list))),

        argument_list: ($) => seq("(", optional(commaSep1($.expression)), ")"),

        member_access: ($) =>
            prec.left(3, seq(field("object", $.expression), ".", field("member", $.identifier))),

        indexed_expression: ($) =>
            prec.left(4, seq(field("object", choice($.identifier, $.member_access)), "(", commaSep1($.expression), ")")),

        unary_expression: ($) =>
            prec(9, seq(field("operator", choice("+", "-", kw("Not"))), field("argument", $.expression))),

        binary_expression: ($) =>
            choice(
                ...[
                    [kw("Or"), 1],
                    [kw("Xor"), 2],
                    [kw("And"), 3],
                    ["=", 4],
                    ["<>", 4],
                    ["<", 4],
                    ["<=", 4],
                    [">", 4],
                    [">=", 4],
                    [kw("Like"), 4],
                    ["&", 5],
                    ["+", 6],
                    ["-", 6],
                    ["*", 7],
                    ["/", 7],
                    ["\\", 7],
                    [kw("Mod"), 7],
                    ["^", 8]
                ].map(([op, p]) =>
                    prec.left(p, seq(field("left", $.expression), field("operator", op), field("right", $.expression)))
                )
            )
    }
});
