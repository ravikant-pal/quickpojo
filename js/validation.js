$(function () {
  let javaKeyWords = [
    "abstract",
    "assert",
    "boolean",
    "break",
    "byte",
    "case",
    "catch",
    "char",
    "class",
    "const",
    "continue",
    "default",
    "double",
    "do",
    "else",
    "enum",
    "extends",
    "false",
    "final",
    "finally",
    "float",
    "for",
    "goto",
    "if",
    "implements",
    "import",
    "instanceof",
    "int",
    "interface",
    "long",
    "native",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "return",
    "short",
    "static",
    "strictfp",
    "String",
    "super",
    "switch",
    "synchronized",
    "this",
    "throw",
    "throws",
    "transient",
    "true",
    "try",
    "void",
    "volatile",
    "while",
  ];
  function isValidVar(val) {
    return !javaKeyWords.includes(val);
  }
  // Adding the custom validation

  //For java keywords
  $.validator.addMethod(
    "reservedWords",
    function (value, element) {
      return isValidVar(value);
    },
    `<p class="alert alert-danger small">opps! it's java keyword</p>`
  );

  //For valid java variable name
  $.validator.addMethod(
    "validVar",
    function (value, element) {
      return value.match("^[a-zA-Z_$][a-zA-Z_$0-9]*$");
    },
    `<p class="alert alert-danger small">Invalid name!</p>`
  );

  $("#user-input").on("submit", function (event) {
    // adding rules for inputs with class 'comment'
    $(".alvl").each(function () {
      $(this).rules("add", {
        required: true,
        validVar: true,
        reservedWords: true,
        messages: {
          required: `<p class="alert alert-danger small">opps! required</p>`,
        },
      });
    });

    $(".dtvl").each(function () {
      $(this).rules("add", {
        required: true,
        validVar: true,
        messages: {
          required: `<p class="alert alert-danger small">opps! required</p>`,
        },
      });
    });

    // prevent default submit action
    event.preventDefault();

    // test if form is valid
    if ($("#user-input").validate().form()) {
      console.log("validates");
      submitData();
    } else {
      console.log("does not validate");
    }
  });
  $("#user-input").validate();
});
