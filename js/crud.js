let variables = [];
let autoGenId = 0;

function addVariable() {
  const dt = document.getElementById("datatype");
  const fieldname = document.getElementById("fieldname");
  const variable = {
    id: autoGenId++,
    datatype: dt.value,
    fieldname: fieldname.value,
  };
  variables.push(variable);
  dt.value = "";
  fieldname.value = "";
  displayItems();
}

function displayItems() {
  const dynamic_list = document.getElementById("dyn");
  dynamic_list.innerHTML = "";
  variables.forEach(function (variable) {
    dynamic_list.innerHTML += `<div class="form-row" id="rv_${variable.id}">
    <div class="col-5">
      <input
        type="text"
        class="form-control form-control-sm mb-2 font-weight-bold dtvl"
        name="datatype_VrD${variables.id}"
        value="${variable.datatype}"
        placeholder="data type"
        required
      />
    </div>
    <div class="col-5">
      <input
        type="text"
        class="form-control form-control-sm mb-2 alvl"
        name="fieldname_VrD${variables.id}"
        value="${variable.fieldname}"
        placeholder="field name"
        required
      />
    </div>
    <div class="col-2">
      <div class="row">
        <div class="col-md-12 text-center">
          <button type="button" class="btn btn-link text-danger" onclick="remove(${variable.id})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
    </div>`;
  });
}

function remove(id) {
  variables = variables.filter((variable) => !(variable.id === id));
  displayItems();
}
