(() => {
  // src/public/ts/utils.ts
  function create(tagName, attributes, content) {
    const element = document.createElement(tagName);
    if (attributes)
      for (const key in attributes)
        element.setAttribute(key, attributes[key]);
    if (content)
      if (typeof content === "string") element.textContent = content;
      else for (const child of content)
        if (typeof child === "string") element.appendChild(document.createTextNode(child));
        else element.appendChild(child);
    return element;
  }
  function formatMoneyCell(cell, money, autoColor) {
    if (autoColor)
      cell.classList.add("monospace", money >= 0 ? "text-success" : "text-danger");
    cell.textContent = formatMoney(money, true);
    return cell;
  }
  function formatMoney(money, positiveSign) {
    return (positiveSign && money >= 0 ? "+" : "") + money.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }
  var Icons = {
    get Plus() {
      return create("i", { class: "bi-plus-lg" });
    },
    get Minus() {
      return create("i", { class: "bi-dash-lg" });
    },
    get Check() {
      return create("i", { class: "bi-check-lg" });
    },
    get Cross() {
      return create("i", { class: "bi-x-lg" });
    },
    get Edit() {
      return create("i", { class: "bi-pencil-fill" });
    },
    get Save() {
      return create("i", { class: "bi-floppy-fill" });
    },
    get Trash() {
      return create("i", { class: "bi-trash-fill" });
    },
    get Nametag() {
      return create("i", { class: "bi-tag-fill" });
    },
    get Person() {
      return create("i", { class: "bi-person-fill" });
    },
    get Dollar() {
      return create("i", { class: "bi-currency-dollar" });
    },
    get Card() {
      return create("i", { class: "bi-credit-card-fill" });
    },
    get ID() {
      return create("i", { class: "bi-person-vcard-fill" });
    },
    get Bag() {
      return create("i", { class: "bi-bag-fill" });
    },
    get Briefcase() {
      return create("i", { class: "bi-briefcase-fill" });
    },
    get Wrench() {
      return create("i", { class: "bi-wrench-adjustable" });
    },
    get Coin() {
      return create("i", { class: "bi-coin" });
    },
    get CashCoin() {
      return create("i", { class: "bi-cash-coin" });
    },
    get CashStack() {
      return create("i", { class: "bi-cash-stack" });
    },
    get Vault() {
      return create("i", { class: "bi-safe2-fill" });
    },
    get Upload() {
      return create("i", { class: "bi-cloud-arrow-up-fill" });
    },
    get Upload2() {
      return create("i", { class: "bi-cloud-upload-fill" });
    },
    get Download() {
      return create("i", { class: "bi-cloud-arrow-down-fill" });
    },
    get Download2() {
      return create("i", { class: "bi-cloud-download-fill" });
    },
    get PieChart() {
      return create("i", { class: "bi-pie-chart-fill" });
    },
    get BarChart() {
      return create("i", { class: "bi-bar-chart-line-fill" });
    },
    get NestedList() {
      return create("i", { class: "bi-list-nested" });
    },
    get Bookmarks() {
      return create("i", { class: "bi-bookmarks-fill" });
    },
    get QuestionMarkCloud() {
      return create("i", { class: "bi-patch-question-fill" });
    },
    get Bidirectional() {
      return create("i", { class: "bi-arrow-left-right" });
    }
  };
  var Buttons = {
    get Edit() {
      return create("button", { class: "btn btn-outline-secondary" }, [Icons.Edit]);
    },
    get Save() {
      return create("button", { class: "btn btn-outline-success" }, [Icons.Save]);
    },
    get Delete() {
      return create("button", { class: "btn btn-outline-danger" }, [Icons.Trash]);
    },
    get Cancel() {
      return create("button", { class: "btn btn-outline-warning" }, [Icons.Cross]);
    },
    get Add() {
      return create("button", { class: "btn btn-outline-primary" }, [Icons.Plus]);
    }
  };
  var Tooltips = class {
    static list = [];
    static create(element, placement = "top", title) {
      const tooltip = new bootstrap.Tooltip(element, {
        title,
        placement,
        trigger: "hover focus",
        html: true
      });
      this.list.push(tooltip);
    }
  };
  function resetForm(form) {
    [
      ...form.querySelectorAll("input"),
      ...form.querySelectorAll("select")
    ].forEach((element) => {
      if (element instanceof HTMLInputElement) element.value = "";
      else if (element instanceof HTMLSelectElement) element.selectedIndex = 0;
      element.classList.remove("is-valid", "is-invalid");
    });
  }
  function goToElement(element) {
    if (element && document.contains(element)) {
      console.log("Going to element:", element);
      const rect = element.getBoundingClientRect();
      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.style.position = "absolute";
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      element.style.position = "relative";
      element.appendChild(overlay);
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth"
      });
      setTimeout(() => {
        overlay.remove();
      }, 1e3);
    }
  }

  // src/public/ts/entries/entry.ts
  var Entry = class {
    budget;
    uuid;
    row;
    constructor(budget2, data) {
      this.budget = budget2;
      this.uuid = data.uuid;
      this.row = create("tr", { id: this.uuid });
    }
    static unknownLink() {
      return create("a", { class: "text-danger" }, "Unknown");
    }
  };

  // src/public/ts/entries/category.ts
  var Category = class _Category extends Entry {
    static Constraints = {
      Name: {
        MinLength: 3,
        MaxLength: 12
      }
    };
    icon;
    name;
    constructor(budget2, data) {
      super(budget2, data);
      this.icon = data.icon;
      this.name = data.name;
    }
    createIcon() {
      return create("i", { class: this.icon });
    }
    createLink() {
      return create("a", { class: "text-primary" }, [this.createIcon(), " " + this.name]);
    }
    build() {
      this.row.innerHTML = "";
      this.row.append(create("td", { colspan: 2 }, [this.createIcon(), " " + this.name]));
      const actions = this.row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      actions.appendChild(Buttons.Edit).addEventListener("click", () => this.edit());
      actions.appendChild(Buttons.Delete).addEventListener("click", () => this.delete());
      return this.row;
    }
    edit() {
      _Category.buildForm(this.row, this.budget, this);
    }
    save() {
      if (_Category.validateForm(this.row)) {
        const [categorySelect, nameInput] = _Category.getFields(this.row);
        this.icon = categorySelect.value;
        this.name = nameInput.value;
        budget.refreshAll();
      }
    }
    delete() {
      if (confirm("Are you sure you want to delete this entry?")) {
        budget.categories.delete(this.uuid);
        budget.refreshAll();
      }
    }
    toJson() {
      return {
        uuid: this.uuid,
        icon: this.icon,
        name: this.name
      };
    }
    static buildForm(row, budget2, editTarget) {
      row.innerHTML = "";
      const group = row.appendChild(create("td", { colspan: 2 })).appendChild(create("div", { class: "input-group" }));
      const iconSelect = group.appendChild(create("select", { class: "form-select" }));
      iconSelect.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Icon"));
      for (const [name, icon] of Object.entries(Icons))
        iconSelect.options.add(create("option", { value: icon.className }, name));
      iconSelect.addEventListener("change", this.validateForm.bind(this, row));
      const nameInput = group.appendChild(create("input", {
        class: "form-control",
        type: "text",
        placeholder: "Name"
      }));
      nameInput.addEventListener("input", this.validateForm.bind(this, row));
      Tooltips.create(nameInput, "bottom", `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`);
      const actions = row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      if (editTarget) {
        actions.appendChild(Buttons.Save).addEventListener("click", () => editTarget.save());
        actions.appendChild(Buttons.Cancel).addEventListener("click", () => editTarget.build());
      } else {
        actions.appendChild(Buttons.Add).addEventListener("click", (e) => {
          nameInput.value = nameInput.value.trim();
          if (this.validateForm(row)) {
            const uuid = crypto.randomUUID();
            budget2.categories.set(uuid, new this(budget2, {
              uuid,
              icon: iconSelect.value,
              name: nameInput.value
            }));
            budget2.refreshAll();
            resetForm(row);
          }
        });
      }
      if (editTarget) {
        iconSelect.value = editTarget.icon;
        nameInput.value = editTarget.name;
      }
      return row;
    }
    static getFields(form) {
      return [
        form.cells[0].getElementsByTagName("select")[0],
        // iconSelect
        form.cells[0].getElementsByTagName("input")[0]
        // nameInput
      ];
    }
    static validateForm(form) {
      const [iconSelect, nameInput] = this.getFields(form);
      const results = [];
      results.push([iconSelect, iconSelect.value !== ""]);
      results.push([nameInput, nameInput.value.trim().length >= _Category.Constraints.Name.MinLength && nameInput.value.trim().length <= _Category.Constraints.Name.MaxLength]);
      for (const [element, valid] of results) {
        element.classList.toggle("is-invalid", !valid);
        element.classList.toggle("is-valid", valid);
      }
      return results.every((result) => result[1]);
    }
    static generateSelectOptions(budget2, select) {
      select.innerHTML = "";
      select.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Category"));
      for (const category of budget2.categories.values())
        select.options.add(create("option", { value: category.uuid }, category.name));
    }
  };

  // src/public/ts/entries/cycle.ts
  var CYCLE_DAYS = {
    ["day" /* DAY */]: 1,
    ["week" /* WEEK */]: 7,
    ["month" /* MONTH */]: 30,
    ["year" /* YEAR */]: 365
  };

  // src/public/ts/entries/person.ts
  var Person = class _Person extends Entry {
    static Constraints = {
      Name: {
        MinLength: 3,
        MaxLength: 15
      }
    };
    name;
    constructor(budget2, data) {
      super(budget2, data);
      this.name = data.name;
    }
    createLink() {
      return create("a", { class: "text-primary" }, [Icons.Person, " " + this.name]);
    }
    build() {
      this.row.innerHTML = "";
      this.row.insertCell().textContent = this.name;
      const actions = this.row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      actions.appendChild(Buttons.Edit).addEventListener("click", () => this.edit());
      actions.appendChild(Buttons.Delete).addEventListener("click", () => this.delete());
      return this.row;
    }
    edit() {
      _Person.buildForm(this.row, this.budget, this);
    }
    save() {
      if (_Person.validateForm(this.row)) {
        const [nameInput] = _Person.getFields(this.row);
        this.name = nameInput.value;
        budget.refreshAll();
      }
    }
    delete() {
      if (confirm("Are you sure you want to delete this entry?")) {
        budget.people.delete(this.uuid);
        budget.refreshAll();
      }
    }
    toJson() {
      return {
        uuid: this.uuid,
        name: this.name
      };
    }
    static buildForm(row, budget2, editTarget) {
      row.innerHTML = "";
      const nameInput = row.insertCell().appendChild(create("input", {
        class: "form-control",
        type: "text",
        placeholder: "Name"
      }));
      nameInput.addEventListener("input", this.validateForm.bind(this, row));
      Tooltips.create(nameInput, "bottom", `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`);
      const actions = row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      if (editTarget) {
        actions.appendChild(Buttons.Save).addEventListener("click", () => editTarget.save());
        actions.appendChild(Buttons.Cancel).addEventListener("click", () => editTarget.build());
      } else {
        actions.appendChild(Buttons.Add).addEventListener("click", (e) => {
          nameInput.value = nameInput.value.trim();
          if (this.validateForm(row)) {
            const uuid = crypto.randomUUID();
            budget2.people.set(uuid, new this(budget2, { uuid, name: nameInput.value }));
            budget2.refreshAll();
            resetForm(row);
          }
        });
      }
      if (editTarget) {
        nameInput.value = editTarget.name;
      }
      return row;
    }
    static getFields(form) {
      return [
        form.cells[0].getElementsByTagName("input")[0]
        // nameInput
      ];
    }
    static validateForm(form) {
      const [nameInput] = this.getFields(form);
      const results = [];
      results.push([nameInput, nameInput.value.trim().length >= _Person.Constraints.Name.MinLength && nameInput.value.trim().length <= _Person.Constraints.Name.MaxLength]);
      for (const [element, valid] of results) {
        element.classList.toggle("is-invalid", !valid);
        element.classList.toggle("is-valid", valid);
      }
      return results.every((result) => result[1]);
    }
    static generateSelectOptions(budget2, select) {
      select.innerHTML = "";
      select.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Person"));
      for (const person of budget2.people.values())
        select.options.add(create("option", { value: person.uuid }, person.name));
    }
  };

  // src/public/ts/entries/payment-method.ts
  var PaymentMethod = class _PaymentMethod extends Entry {
    static Constraints = {
      Name: {
        MinLength: 3,
        MaxLength: 25
      }
    };
    name;
    owner_uuid;
    get owner() {
      return this.budget.people.get(this.owner_uuid);
    }
    constructor(budget2, data) {
      super(budget2, data);
      this.name = data.name;
      this.owner_uuid = data.owner_uuid;
    }
    createLink() {
      return create("a", { class: "text-primary" }, [Icons.Dollar, " " + this.name]);
    }
    build() {
      this.row.innerHTML = "";
      this.row.insertCell().textContent = this.name;
      this.row.insertCell().appendChild(this.owner?.createLink() ?? Entry.unknownLink()).addEventListener("click", (e) => goToElement(this.owner?.row));
      const actions = this.row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      actions.appendChild(Buttons.Edit).addEventListener("click", () => this.edit());
      actions.appendChild(Buttons.Delete).addEventListener("click", () => this.delete());
      return this.row;
    }
    edit() {
      _PaymentMethod.buildForm(this.row, this.budget, this);
    }
    save() {
      if (_PaymentMethod.validateForm(this.row)) {
        const [nameInput, ownerSelect] = _PaymentMethod.getFields(this.row);
        this.name = nameInput.value;
        this.owner_uuid = ownerSelect.value;
        this.budget.refreshAll();
      }
    }
    delete() {
      if (confirm("Are you sure you want to delete this entry?")) {
        this.budget.paymentMethods.delete(this.uuid);
        this.budget.refreshAll();
      }
    }
    toJson() {
      return {
        uuid: this.uuid,
        name: this.name,
        owner_uuid: this.owner_uuid
      };
    }
    static buildForm(row, budget2, editTarget) {
      row.innerHTML = "";
      const nameInput = row.insertCell().appendChild(create("input", {
        class: "form-control",
        type: "text",
        placeholder: "Name"
      }));
      nameInput.addEventListener("input", this.validateForm.bind(this, row));
      Tooltips.create(nameInput, "bottom", `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`);
      const ownerSelect = row.insertCell().appendChild(create("select", { class: "form-select" }));
      Person.generateSelectOptions(budget2, ownerSelect);
      ownerSelect.addEventListener("focusin", (e) => Person.generateSelectOptions(budget2, ownerSelect));
      ownerSelect.addEventListener("change", this.validateForm.bind(this, row));
      const actions = row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      if (editTarget) {
        actions.appendChild(Buttons.Save).addEventListener("click", () => editTarget.save());
        actions.appendChild(Buttons.Cancel).addEventListener("click", () => editTarget.build());
      } else {
        actions.appendChild(Buttons.Add).addEventListener("click", (e) => {
          nameInput.value = nameInput.value.trim();
          if (this.validateForm(row)) {
            const uuid = crypto.randomUUID();
            budget2.paymentMethods.set(uuid, new this(budget2, {
              uuid,
              name: nameInput.value,
              owner_uuid: ownerSelect.value
            }));
            budget2.refreshAll();
            resetForm(row);
          }
        });
      }
      if (editTarget) {
        nameInput.value = editTarget.name;
        ownerSelect.value = editTarget.owner_uuid;
      }
      return row;
    }
    static getFields(form) {
      return [
        form.cells[0].getElementsByTagName("input")[0],
        // nameInput
        form.cells[1].getElementsByTagName("select")[0]
        // ownerSelect
      ];
    }
    static validateForm(form) {
      const [nameInput, ownerSelect] = this.getFields(form);
      const results = [];
      results.push([nameInput, nameInput.value.trim().length >= _PaymentMethod.Constraints.Name.MinLength && nameInput.value.trim().length <= _PaymentMethod.Constraints.Name.MaxLength]);
      results.push([ownerSelect, ownerSelect.value !== ""]);
      for (const [element, valid] of results) {
        element.classList.toggle("is-invalid", !valid);
        element.classList.toggle("is-valid", valid);
      }
      return results.every((result) => result[1]);
    }
    static generateSelectOptions(budget2, select) {
      select.innerHTML = "";
      select.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Payment Method"));
      for (const paymentMethod of budget2.paymentMethods.values())
        select.options.add(create("option", { value: paymentMethod.uuid }, paymentMethod.name));
    }
  };

  // src/public/ts/entries/transaction.ts
  var Transaction = class _Transaction extends Entry {
    static Constraints = {
      Name: {
        MinLength: 3,
        MaxLength: 25
      },
      BillingCycle: {
        Min: 1
      }
    };
    category_uuid;
    name;
    #amount;
    payment_method_uuid;
    billing_cycle;
    get amount() {
      return this.#amount;
    }
    set amount(value) {
      this.#amount = Math.round(value * 100) / 100;
    }
    get category() {
      return this.budget.categories.get(this.category_uuid);
    }
    get paymentMethod() {
      return this.budget.paymentMethods.get(this.payment_method_uuid);
    }
    constructor(budget2, data) {
      super(budget2, data);
      this.category_uuid = data.category_uuid;
      this.name = data.name;
      this.amount = data.amount;
      this.payment_method_uuid = data.payment_method_uuid;
      this.billing_cycle = data.billing_cycle;
    }
    amountPer(targetDays) {
      const originalDays = CYCLE_DAYS[this.billing_cycle[1]] * this.billing_cycle[0];
      return this.amount * targetDays / originalDays;
    }
    createLink() {
      return create("a", { class: "text-primary" }, [Icons.Bidirectional, " " + this.name]);
    }
    build() {
      this.row.innerHTML = "";
      this.row.insertCell().appendChild(this.category?.createLink() ?? Entry.unknownLink()).addEventListener("click", (e) => goToElement(this.category?.row));
      this.row.insertCell().textContent = this.name;
      const isPositive = this.amount >= 0;
      const sign = isPositive ? "+" : "-";
      const amount = Math.abs(this.amount);
      this.row.insertCell().append(create(
        "span",
        { class: "monospace " + (isPositive ? "text-success" : "text-danger") },
        `${sign}$${amount.toFixed(2)}`
      ));
      this.row.insertCell().appendChild(this.paymentMethod?.createLink() ?? Entry.unknownLink()).addEventListener("click", (e) => goToElement(this.paymentMethod?.row));
      this.row.insertCell().textContent = `${this.billing_cycle[0]} ${this.billing_cycle[1] + (this.billing_cycle[0] > 1 ? "s" : "")}`;
      const actions = this.row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      actions.appendChild(Buttons.Edit).addEventListener("click", () => this.edit());
      actions.appendChild(Buttons.Delete).addEventListener("click", () => this.delete());
      return this.row;
    }
    edit() {
      _Transaction.buildForm(this.row, this.budget, this);
    }
    save() {
      if (_Transaction.validateForm(this.row)) {
        const [categorySelect, nameInput, amountInput, paymentMethodSelect, cycleInput, cycleSelect] = _Transaction.getFields(this.row);
        this.category_uuid = categorySelect.value;
        this.name = nameInput.value;
        this.amount = parseFloat(amountInput.value);
        this.payment_method_uuid = paymentMethodSelect.value;
        this.billing_cycle = [parseInt(cycleInput.value), cycleSelect.value];
        this.budget.refreshAll();
      }
    }
    delete() {
      if (confirm("Are you sure you want to delete this entry?")) {
        this.budget.transactions.delete(this.uuid);
        this.budget.refreshAll();
      }
    }
    toJson() {
      return {
        uuid: this.uuid,
        category_uuid: this.category_uuid,
        name: this.name,
        amount: this.amount,
        payment_method_uuid: this.payment_method_uuid,
        billing_cycle: this.billing_cycle
      };
    }
    static buildForm(row, budget2, targetListOrEntry) {
      row.innerHTML = "";
      const categorySelect = row.insertCell().appendChild(create("select", { class: "form-select" }));
      Category.generateSelectOptions(budget2, categorySelect);
      categorySelect.addEventListener("focusin", (e) => Category.generateSelectOptions(budget2, categorySelect));
      categorySelect.addEventListener("change", this.validateForm.bind(this, row));
      const nameInput = row.insertCell().appendChild(create("input", {
        class: "form-control",
        type: "text",
        placeholder: "Name"
      }));
      nameInput.addEventListener("input", this.validateForm.bind(this, row));
      Tooltips.create(nameInput, "bottom", `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`);
      const amountInput = row.insertCell().appendChild(create("input", {
        class: "form-control",
        type: "number",
        placeholder: "Amount",
        step: "0.01"
      }));
      amountInput.addEventListener("input", this.validateForm.bind(this, row));
      Tooltips.create(amountInput, "bottom", "Non-zero amount, negative for expenses and positive for income");
      const paymentMethodSelect = row.insertCell().appendChild(create("select", { class: "form-select" }));
      PaymentMethod.generateSelectOptions(budget2, paymentMethodSelect);
      paymentMethodSelect.addEventListener("focusin", (e) => PaymentMethod.generateSelectOptions(budget2, paymentMethodSelect));
      paymentMethodSelect.addEventListener("change", this.validateForm.bind(this, row));
      const group = row.insertCell().appendChild(create("div", { class: "input-group" }));
      const cycleInput = group.appendChild(create("input", {
        class: "form-control",
        type: "number",
        placeholder: "Count",
        step: "1",
        min: "1"
      }));
      cycleInput.addEventListener("input", this.validateForm.bind(this, row));
      Tooltips.create(cycleInput, "bottom", "Number of days, weeks, months, or years. Must be greater than 0.");
      const cycleSelect = group.appendChild(create("select", { class: "form-select" }));
      cycleSelect.options.add(new Option("Cycle", "", true, true));
      cycleSelect.options.add(new Option("Day", "day" /* DAY */));
      cycleSelect.options.add(new Option("Week", "week" /* WEEK */));
      cycleSelect.options.add(new Option("Month", "month" /* MONTH */));
      cycleSelect.options.add(new Option("Year", "year" /* YEAR */));
      cycleSelect.options[0].disabled = true;
      cycleSelect.options[0].hidden = true;
      cycleSelect.addEventListener("change", this.validateForm.bind(this, row));
      const actions = row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      if (targetListOrEntry instanceof _Transaction) {
        actions.appendChild(Buttons.Save).addEventListener("click", () => targetListOrEntry.save());
        actions.appendChild(Buttons.Cancel).addEventListener("click", () => targetListOrEntry.build());
      } else if (targetListOrEntry instanceof Map) {
        actions.appendChild(Buttons.Add).addEventListener("click", (e) => {
          nameInput.value = nameInput.value.trim();
          if (this.validateForm(row)) {
            const uuid = crypto.randomUUID();
            targetListOrEntry.set(uuid, new this(budget2, {
              uuid,
              category_uuid: categorySelect.value,
              name: nameInput.value,
              amount: parseFloat(amountInput.value),
              payment_method_uuid: paymentMethodSelect.value,
              billing_cycle: [parseInt(cycleInput.value), cycleSelect.value]
            }));
            budget2.refreshAll();
            resetForm(row);
          }
        });
      }
      if (targetListOrEntry instanceof _Transaction) {
        categorySelect.value = targetListOrEntry.category_uuid;
        nameInput.value = targetListOrEntry.name;
        amountInput.value = targetListOrEntry.amount.toString();
        paymentMethodSelect.value = targetListOrEntry.payment_method_uuid;
        cycleInput.value = targetListOrEntry.billing_cycle[0].toString();
        cycleSelect.value = targetListOrEntry.billing_cycle[1];
      }
      return row;
    }
    static getFields(form) {
      return [
        form.cells[0].getElementsByTagName("select")[0],
        // categorySelect
        form.cells[1].getElementsByTagName("input")[0],
        // nameInput
        form.cells[2].getElementsByTagName("input")[0],
        // amountInput
        form.cells[3].getElementsByTagName("select")[0],
        // paymentMethodSelect
        form.cells[4].getElementsByTagName("input")[0],
        // cycleInput
        form.cells[4].getElementsByTagName("select")[0]
        // cycleSelect
      ];
    }
    static validateForm(form) {
      const [categorySelect, nameInput, amountInput, paymentMethodSelect, cycleInput, cycleSelect] = this.getFields(form);
      const results = [];
      results.push([categorySelect, categorySelect.value !== ""]);
      results.push([nameInput, nameInput.value.trim().length >= _Transaction.Constraints.Name.MinLength && nameInput.value.trim().length <= _Transaction.Constraints.Name.MaxLength]);
      results.push([amountInput, !isNaN(+amountInput.value) && +amountInput.value !== 0]);
      results.push([paymentMethodSelect, paymentMethodSelect.value !== ""]);
      results.push([cycleInput, +cycleInput.value >= _Transaction.Constraints.BillingCycle.Min]);
      results.push([cycleSelect, cycleSelect.value !== ""]);
      for (const [element, valid] of results) {
        element.classList.toggle("is-invalid", !valid);
        element.classList.toggle("is-valid", valid);
      }
      return results.every((result) => result[1]);
    }
    static generateSelectOptions(budget2, select) {
      select.innerHTML = "";
      select.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Transaction"));
      for (const transaction of budget2.transactions.values())
        select.options.add(create("option", { value: transaction.uuid }, transaction.name));
    }
  };

  // src/public/ts/budget.ts
  var Budget = class {
    people;
    peopleTable;
    peopleTHead;
    peopleTBody;
    peopleForm;
    refreshPeople;
    paymentMethods;
    paymentMethodsTable;
    paymentMethodsTHead;
    paymentMethodsTBody;
    paymentMethodsForm;
    refreshPaymentMethods;
    categories;
    categoriesTable;
    categoriesTHead;
    categoriesTBody;
    categoriesForm;
    refreshCategories;
    transactions;
    transactionsTable;
    transactionsTHead;
    transactionsTBody;
    transactionsForm;
    refreshTransactions;
    summaryCycleInput;
    summaryCycleSelect;
    summaryIncomeChart;
    summaryIncomeChartLegend;
    summaryIncomeChartProgressBar;
    summaryExpenseChart;
    summaryExpenseChartLegend;
    summaryExpenseChartProgressBar;
    summaryCumulativeTable;
    summaryCumulativeTHead;
    summaryCumulativeTBody;
    refreshSummary;
    validateSummaryCycleChange;
    refreshAll;
    downloadButton;
    uploadButton;
    constructor() {
      this.people = /* @__PURE__ */ new Map();
      this.peopleTable = create("table", { class: "table table-hover" });
      this.peopleTHead = this.peopleTable.createTHead();
      this.peopleTBody = this.peopleTable.createTBody();
      this.peopleTHead.appendChild(create("tr")).append(
        create("th", { scope: "col" }, "Name"),
        create("th", { scope: "col", class: "fit" }, "Actions")
      );
      this.peopleForm = create("tr");
      Person.buildForm(this.peopleForm, this);
      this.refreshPeople = () => {
        this.peopleTBody.innerHTML = "";
        for (const person of this.people.values())
          this.peopleTBody.append(person.build());
        this.peopleTBody.append(this.peopleForm);
      };
      this.paymentMethods = /* @__PURE__ */ new Map();
      this.paymentMethodsTable = create("table", { class: "table table-hover" });
      this.paymentMethodsTHead = this.paymentMethodsTable.createTHead();
      this.paymentMethodsTBody = this.paymentMethodsTable.createTBody();
      this.paymentMethodsTHead.appendChild(create("tr")).append(
        create("th", { scope: "col" }, "Name"),
        create("th", { scope: "col" }, "Owner"),
        create("th", { scope: "col", class: "fit" }, "Actions")
      );
      this.paymentMethodsForm = create("tr");
      PaymentMethod.buildForm(this.paymentMethodsForm, this);
      this.refreshPaymentMethods = () => {
        this.paymentMethodsTBody.innerHTML = "";
        for (const paymentMethod of this.paymentMethods.values())
          this.paymentMethodsTBody.append(paymentMethod.build());
        this.paymentMethodsTBody.append(this.paymentMethodsForm);
      };
      this.categories = /* @__PURE__ */ new Map();
      this.categoriesTable = create("table", { class: "table table-hover" });
      this.categoriesTHead = this.categoriesTable.createTHead();
      this.categoriesTBody = this.categoriesTable.createTBody();
      this.categoriesTHead.appendChild(create("tr")).append(
        create("th", { scope: "col", colspan: 2 }, "Name"),
        create("th", { scope: "col", class: "fit" }, "Actions")
      );
      this.categoriesForm = create("tr");
      Category.buildForm(this.categoriesForm, this);
      this.refreshCategories = () => {
        this.categoriesTBody.innerHTML = "";
        for (const category of this.categories.values())
          this.categoriesTBody.append(category.build());
        this.categoriesTBody.append(this.categoriesForm);
      };
      this.transactions = /* @__PURE__ */ new Map();
      this.transactionsTable = create("table", { class: "table table-hover" });
      this.transactionsTHead = this.transactionsTable.createTHead();
      this.transactionsTBody = this.transactionsTable.createTBody();
      this.transactionsTHead.appendChild(create("tr", { style: "white-space: nowrap" })).append(
        create("th", { scope: "col", class: "fit" }, "Category"),
        create("th", { scope: "col", class: "fit" }, "Name"),
        create("th", { scope: "col", class: "fit" }, "Amount"),
        create("th", { scope: "col", class: "fit" }, "Payment Method"),
        create("th", { scope: "col", class: "fit" }, "Billing Cycle"),
        create("th", { scope: "col", class: "fit" }, "Actions")
      );
      this.transactionsForm = create("tr");
      Transaction.buildForm(this.transactionsForm, this, this.transactions);
      this.refreshTransactions = () => {
        this.transactionsTBody.innerHTML = "";
        for (const category of this.categories.values()) {
          const transactions = [...this.transactions.values()].filter((transaction) => transaction.category_uuid === category.uuid);
          if (transactions.length) {
            this.transactionsTBody.append(create("tr", {}, [
              create("th", { colspan: 6, class: "text-center bg-body-tertiary" }, category.name)
            ]));
            for (const transaction of transactions)
              this.transactionsTBody.append(transaction.build());
          }
        }
        const unknownCategoryTransactions = [...this.transactions.values()].filter((transaction) => !this.categories.has(transaction.category_uuid));
        if (unknownCategoryTransactions.length) {
          this.transactionsTBody.append(create("tr", {}, [
            create("th", { colspan: 6, class: "text-center bg-body-tertiary" }, "Unknown")
          ]));
          for (const transaction of unknownCategoryTransactions)
            this.transactionsTBody.append(transaction.build());
        }
        this.transactionsTBody.append(this.transactionsForm);
      };
      const cycleGroup = create("div", { class: "input-group" });
      this.summaryCycleInput = cycleGroup.appendChild(create("input", {
        class: "form-control",
        type: "number",
        placeholder: "Count",
        step: "1",
        min: "1",
        value: "1"
      }));
      this.summaryCycleInput.addEventListener("input", () => this.validateSummaryCycleChange());
      Tooltips.create(this.summaryCycleInput, "bottom", "Number of days, weeks, months, or years. Must be greater than 0.");
      this.summaryCycleSelect = cycleGroup.appendChild(create("select", { class: "form-select" }));
      this.summaryCycleSelect.options.add(new Option("Day", "day" /* DAY */, false, false));
      this.summaryCycleSelect.options.add(new Option("Week", "week" /* WEEK */, false, false));
      this.summaryCycleSelect.options.add(new Option("Month", "month" /* MONTH */, true, true));
      this.summaryCycleSelect.options.add(new Option("Year", "year" /* YEAR */, false, false));
      this.summaryCycleSelect.addEventListener("change", () => this.validateSummaryCycleChange());
      this.validateSummaryCycleChange = () => {
        console.log(+this.summaryCycleInput.value);
        if (!this.summaryCycleInput.value || +this.summaryCycleInput.value < 1)
          return this.summaryCycleInput.classList.add("is-invalid");
        else {
          this.summaryCycleInput.classList.remove("is-invalid");
          this.refreshSummary();
        }
      };
      this.summaryCumulativeTable = create("table", { class: "table table-hover mt-3" });
      this.summaryCumulativeTHead = this.summaryCumulativeTable.createTHead();
      this.summaryCumulativeTBody = this.summaryCumulativeTable.createTBody();
      this.summaryCumulativeTHead.appendChild(create("tr")).append(
        create("th", { scope: "col" }, "Category"),
        create("th", { scope: "col" }, "Subtotal"),
        create("th", { scope: "col", class: "fit" }, "Cumulative")
      );
      this.summaryIncomeChart = create("div", { class: "d-flex flex-column gap-2 my-3 flex-grow-1" });
      this.summaryIncomeChartLegend = this.summaryIncomeChart.appendChild(create("div", { class: "d-flex justify-content-around align-items-center w-100" }));
      this.summaryIncomeChartProgressBar = this.summaryIncomeChart.appendChild(create("div", { class: "progress-stacked", style: "height: 2em" }));
      this.summaryExpenseChart = create("div", { class: "d-flex flex-column gap-2 my-3 flex-grow-1" });
      this.summaryExpenseChartLegend = this.summaryExpenseChart.appendChild(create("div", { class: "d-flex justify-content-around align-items-center w-100" }));
      this.summaryExpenseChartProgressBar = this.summaryExpenseChart.appendChild(create("div", { class: "progress-stacked", style: "height: 2em" }));
      this.refreshSummary = () => {
        const cycleDays = CYCLE_DAYS[this.summaryCycleSelect.value] * +this.summaryCycleInput.value;
        this.summaryCumulativeTBody.innerHTML = "";
        this.summaryIncomeChartLegend.innerHTML = "";
        this.summaryIncomeChartProgressBar.innerHTML = "";
        this.summaryExpenseChartLegend.innerHTML = "";
        this.summaryExpenseChartProgressBar.innerHTML = "";
        const totalIncome = [...this.transactions.values()].filter((transaction) => transaction.amountPer(cycleDays) > 0).reduce((total, transaction) => total + transaction.amountPer(cycleDays), 0);
        const totalExpense = [...this.transactions.values()].filter((transaction) => transaction.amountPer(cycleDays) < 0).reduce((total, transaction) => total + transaction.amountPer(cycleDays), 0);
        const cumulativeSubtotals = [...this.calculateSubtotals(cycleDays).entries()].sort((a, b) => b[1] - a[1]);
        const incomeSubtotals = [...this.calculateSubtotals(cycleDays, (transaction) => transaction.amountPer(cycleDays) <= 0).entries()].sort((a, b) => b[1] - a[1]);
        const expenseSubtotals = [...this.calculateSubtotals(cycleDays, (transaction) => transaction.amountPer(cycleDays) >= 0).entries()].sort((a, b) => b[1] - a[1]);
        let cumulative = 0;
        var unknownSubtotal = 0;
        for (const [categoryUUID, subtotal] of cumulativeSubtotals) {
          const category = this.categories.get(categoryUUID);
          if (category === void 0) unknownSubtotal += subtotal;
          else {
            if (subtotal === 0) continue;
            else cumulative += subtotal;
            const row = this.summaryCumulativeTBody.insertRow();
            row.insertCell().appendChild(create("a", { class: "text-primary" }, [category.createIcon(), " " + category.name])).addEventListener("click", (e) => goToElement(category.row));
            formatMoneyCell(row.insertCell(), subtotal, true);
            formatMoneyCell(row.insertCell(), cumulative, false);
          }
        }
        if (unknownSubtotal !== 0) {
          const row = this.summaryCumulativeTBody.insertRow();
          row.insertCell().appendChild(Entry.unknownLink());
          formatMoneyCell(row.insertCell(), unknownSubtotal, true);
          formatMoneyCell(row.insertCell(), cumulative + unknownSubtotal, false);
        }
        var unknownSubtotal = 0;
        for (const [categoryUUID, subtotal] of incomeSubtotals) {
          const category = this.categories.get(categoryUUID);
          if (category === void 0) unknownSubtotal += subtotal;
          else {
            if (subtotal === 0) continue;
            const percent = Math.abs(subtotal) / (Math.abs(totalIncome) || 1) * 100;
            this.summaryIncomeChartLegend.append(create("span", {}, [create("span", { class: "text-success" }, [Icons.PieChart]), ` ${category.name} (${formatMoney(subtotal)})`]));
            this.summaryIncomeChartProgressBar.append(create("div", { class: "progress-bar bg-success", style: `width: ${percent}%` }, category.name));
          }
        }
        if (unknownSubtotal !== 0) {
          const percent = Math.abs(unknownSubtotal) / (Math.abs(totalIncome) || 1) * 100;
          this.summaryIncomeChartLegend.append(create("span", {}, [create("span", {}, [Icons.PieChart]), ` Unknown (${formatMoney(unknownSubtotal)})`]));
          this.summaryIncomeChartProgressBar.append(create("div", { class: "progress-bar bg-dark", style: `width: ${percent}%` }, "Unknown"));
        }
        var unknownSubtotal = 0;
        for (const [categoryUUID, subtotal] of expenseSubtotals) {
          const category = this.categories.get(categoryUUID);
          if (category === void 0) unknownSubtotal += subtotal;
          else {
            if (subtotal === 0) continue;
            const percent = Math.abs(subtotal) / (Math.abs(totalExpense) || 1) * 100;
            this.summaryExpenseChartLegend.append(create("span", {}, [create("span", { class: "text-danger" }, [Icons.PieChart]), ` ${category.name} (${formatMoney(subtotal)})`]));
            this.summaryExpenseChartProgressBar.append(create("div", { class: "progress-bar bg-danger", style: `width: ${percent}%` }, category.name));
          }
        }
        if (unknownSubtotal !== 0) {
          const percent = Math.abs(unknownSubtotal) / (Math.abs(totalExpense) || 1) * 100;
          this.summaryExpenseChartLegend.append(create("span", {}, [create("span", {}, [Icons.PieChart]), ` Unknown (${formatMoney(unknownSubtotal)})`]));
          this.summaryExpenseChartProgressBar.append(create("div", { class: "progress-bar bg-dark", style: `width: ${percent}%` }, "Unknown"));
        }
      };
      this.refreshAll = () => {
        this.refreshPeople();
        this.refreshPaymentMethods();
        this.refreshCategories();
        this.refreshTransactions();
        this.refreshSummary();
      };
      this.downloadButton = create("button", { class: "btn btn-primary " }, [Icons.Download, " Download"]);
      this.downloadButton.addEventListener("click", () => {
        const data = {
          people: [...this.people.values()].map((person) => person.toJson()),
          paymentMethods: [...this.paymentMethods.values()].map((paymentMethod) => paymentMethod.toJson()),
          transactions: [...this.transactions.values()].map((transaction) => transaction.toJson())
        };
        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = create("a", { href: url, download: "budget.json" });
        a.click();
        URL.revokeObjectURL(url);
      });
      this.uploadButton = create("button", { class: "btn btn-secondary" }, [Icons.Upload, " Upload"]);
      this.uploadButton.addEventListener("click", () => {
        const input = create("input", { type: "file", accept: "application/json", style: "display: none" });
        input.addEventListener("change", () => {
          const file = input.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const data = JSON.parse(reader.result);
              for (const person of data.people)
                this.people.set(person.uuid, new Person(this, person));
              for (const paymentMethod of data.paymentMethods)
                this.paymentMethods.set(paymentMethod.uuid, new PaymentMethod(this, paymentMethod));
              for (const transaction of data.transactions)
                this.transactions.set(transaction.uuid, new Transaction(this, transaction));
              this.refreshAll();
            };
            reader.readAsText(file);
          }
        });
        input.click();
      });
      this.refreshAll();
    }
    render(root2) {
      root2.append(
        create("div", { class: "d-flex gap-5" }, [
          create("div", { class: "flex-fill" }, [
            create("h2", { class: "fit" }, [Icons.Person, " People"]),
            this.peopleTable
          ]),
          create("div", { class: "flex-fill" }, [
            create("h2", { class: "fit" }, [Icons.Card, " Payment Methods"]),
            this.paymentMethodsTable
          ])
        ]),
        create("h2", { class: "fit mt-5" }, [Icons.Bookmarks, " Categories"]),
        this.categoriesTable,
        create("h2", { class: "fit mt-5" }, [Icons.Bidirectional, " Transactions"]),
        this.transactionsTable,
        create("div", { class: "d-flex gap-3 mt-5" }, [
          create("h2", { style: "white-space: nowrap" }, [Icons.BarChart, " Summary"]),
          create("div", { class: "input-group w-auto" }, [
            this.summaryCycleInput,
            this.summaryCycleSelect
          ])
        ]),
        this.summaryCumulativeTable,
        create("div", { class: "d-flex gap-5 mt-3" }, [
          create("h3", { class: "flex-grow-1 m-0 text-center" }, "Income"),
          create("h3", { class: "flex-grow-1 m-0 text-center" }, "Expenses")
        ]),
        create("div", { class: "d-flex gap-5 mb-3" }, [
          this.summaryIncomeChart,
          this.summaryExpenseChart
        ]),
        create("div", { class: "d-flex gap-2 justify-content-center w-100 my-5" }, [
          this.downloadButton,
          this.uploadButton
        ])
      );
    }
    calculateSubtotals(cycleDays, excludeFilter) {
      return new Map(
        [...(/* @__PURE__ */ new Set([
          ...[...this.categories.values()].map((category) => category.uuid),
          ...[...this.transactions.values()].map((transaction) => transaction.category_uuid)
        ])).values()].map((categoryUUID) => [
          categoryUUID,
          [...this.transactions.values()].filter((transaction) => transaction.category_uuid === categoryUUID).reduce((total, transaction) => excludeFilter?.(transaction) ? total : total + transaction.amountPer(cycleDays), 0)
        ])
      );
    }
  };

  // src/public/ts/index.ts
  var budget = new Budget();
  var personMe = new Person(budget, { uuid: crypto.randomUUID(), name: "Me" });
  var paymentMethodCash = new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: "Cash", owner_uuid: personMe.uuid });
  var paymentMethodBankAccount = new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: "Bank Account", owner_uuid: personMe.uuid });
  var categorySalaries = new Category(budget, { uuid: crypto.randomUUID(), icon: Icons.CashStack.className, name: "Salaries" });
  var categoryBills = new Category(budget, { uuid: crypto.randomUUID(), icon: Icons.Card.className, name: "Bills" });
  var transactionSalary = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: categorySalaries.uuid, name: "Salary", amount: 5432.1, payment_method_uuid: paymentMethodBankAccount.uuid, billing_cycle: [1, "month" /* MONTH */] });
  var transactionRent = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: categoryBills.uuid, name: "Rent", amount: -1234.56, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, "month" /* MONTH */] });
  var transactionUnknownIncome = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: "...", name: "Misc (Unknown)", amount: 1500, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, "month" /* MONTH */] });
  var transactionUnknownExpense = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: "...", name: "Misc (Unknown)", amount: -150, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, "month" /* MONTH */] });
  budget.people.set(personMe.uuid, personMe);
  budget.paymentMethods.set(paymentMethodCash.uuid, paymentMethodCash);
  budget.paymentMethods.set(paymentMethodBankAccount.uuid, paymentMethodBankAccount);
  budget.categories.set(categorySalaries.uuid, categorySalaries);
  budget.categories.set(categoryBills.uuid, categoryBills);
  budget.transactions.set(transactionSalary.uuid, transactionSalary);
  budget.transactions.set(transactionRent.uuid, transactionRent);
  budget.transactions.set(transactionUnknownIncome.uuid, transactionUnknownIncome);
  budget.transactions.set(transactionUnknownExpense.uuid, transactionUnknownExpense);
  budget.refreshAll();
  var root = document.getElementById("root");
  if (root)
    budget.render(root);
})();
