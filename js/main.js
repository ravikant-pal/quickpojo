var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  theme: "darcula",
  styleActiveLine: true,
  matchBrackets: true,
  mode: "text/x-java",
});
editor.setSize(null, 380);
$(function () {
  new ClipboardJS(".btn-outline-default", {
    text: function () {
      return $("#code").getCodeMirror().getDoc().getValue();
    },
  });
});

function submitData() {
  var data = $("#user-input :input").serializeArray();
  // console.log(data);

  dt = [];
  fn = [];
  cls = {};

  let toBeGenerate = {};
  const regexDt = /datatype/g;
  const regexFn = /fieldname/g;

  data.forEach((d) => {
    if (d.value === "on") {
      toBeGenerate[d.name] = true;
    } else if (d.name.match(regexDt)) {
      dt.push(d.value);
    } else if (d.name.match(regexFn)) {
      fn.push(d.value);
    } else {
      cls[d.name + "Name"] = d.value;
    }
  });

  // console.log(toBeGenerate);

  let str = "";

  if (toBeGenerate.noArgConstructor) {
    str += ganNoArgConstructor(cls);
  }
  if (toBeGenerate.allArgConstructor) {
    str += ganAllArgConstructor(cls, dt, fn);
  }
  if (toBeGenerate.getter) {
    str += ganGetter(dt, fn);
  }
  if (toBeGenerate.setter) {
    str += ganSetter(dt, fn);
  }
  if (toBeGenerate.equals) {
    str += ganEquals(cls);
  }
  if (toBeGenerate.hashCode) {
    str += ganHashCode(fn);
  }
  if (toBeGenerate.toStr) {
    str += ganToString(cls, dt, fn);
  }
  // console.log(str);
  setupEditor(str, cls, dt, fn);
}

function ganNoArgConstructor(cls) {
  return `
    public ${cls.className}() { 
    } \n`;
}

function ganAllArgConstructor(cls, dt, fn) {
  let len = dt.length;
  let args = "";
  let flds = "";
  for (let i = 0; i < len - 1; i++) {
    args += `${dt[i]} ${fn[i]}, `;
    flds += `\tthis.${fn[i]} = ${fn[i]};
    `;
  }
  args += `${dt[len - 1]} ${fn[len - 1]}`;
  flds += `\tthis.${fn[len - 1]} = ${fn[len - 1]};`;

  return `
    public ${cls.className}(${args}) { 
    ${flds}
    } \n`;
}

function ganGetter(dt, fn) {
  let len = dt.length;
  let str = "";
  for (let i = 0; i < len; i++) {
    str += `
    public ${dt[i]} get${fn[i][0].toUpperCase() + fn[i].slice(1)}() { 
        return ${fn[i]}; 
    } \n`;
  }
  return str;
}

function ganSetter(dt, fn) {
  let len = dt.length;
  let str = "";
  for (let i = 0; i < len; i++) {
    str += `
    public void set${fn[i][0].toUpperCase() + fn[i].slice(1)}(${dt[i]} ${
      fn[i]
    }) { 
        this.${fn[i]} = ${fn[i]}; 
    } \n`;
  }
  return str;
}

function ganEquals(cls) {
  return `
    @Override
    public boolean equals(Object o) { 
        if(this == o) return true;
        if(!(o instanceof ${cls.className})) return false;
        return true;
    } \n`;
}

function ganHashCode(fn) {
  let len = fn.length;
  let args = "";
  for (let i = 0; i < len - 1; i++) {
    args += `${fn[i]}, `;
  }
  args += `${fn[len - 1]}`;
  return `
    @Override
    public int hashCode() { 
        return Object.hash(${args})
    } \n`;
}

function ganToString(cls, dt, fn) {
  let len = fn.length;
  let str = "";
  for (let i = 0; i < len; i++) {
    if (i == 0) {
      if (dt[i] === "String") {
        str += `\t   "${fn[i]}='" + ${fn[i]} + '\\'' +\n`;
      } else {
        str += `\t   "${fn[i]}=" + ${fn[i]} + \n`;
      }
    } else {
      if (dt[i] === "String") {
        str += `\t\t\t   ", ${fn[i]}='" + ${fn[i]} + '\\'' +\n`;
      } else {
        str += `\t\t\t   ", ${fn[i]}=" + ${fn[i]} + \n`;
      }
    }
  }

  return `
    @Override
    public String toString() { 
        return "${cls.className}{" +
        ${str}\t\t\t   '}'; \n
    }`;
}

function setupEditor(str, cls, dt, fn) {
  let clsstr = `public class ${cls.className} {\n`;
  let len = fn.length;
  let tempvrls = "";
  for (let i = 0; i < len; i++) {
    tempvrls += `
    private ${dt[i]} ${fn[i]};`;
  }
  clsstr += tempvrls + "\n";
  clsstr += `${str}\n}`;
  editor.getDoc().setValue(clsstr);
}

(function ($) {
  $.fn.getCodeMirror = function () {
    return (this.is("textarea") ? this.next(".CodeMirror") : this).get(0)
      .CodeMirror;
  };
})(jQuery);

let msg = document.getElementById("msg");
function showMsg() {
  msg.classList.remove("d-none");
}

$(document).mouseup(function (e) {
  if (event.target.closest(".d-none")) return;
  msg.classList.add("d-none");
});
