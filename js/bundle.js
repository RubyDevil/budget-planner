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
  function withFloatingLabel(label, control) {
    const id = control.id ?? (control.id = Math.random().toString(36).substring(2));
    return create("div", { class: "form-floating" }, [control, create("label", { class: "form-label", for: id }, label)]);
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
  function isHexColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
  }
  function blendColors(colorA = "#000000", colorB = "#000000", amount = 0.5) {
    const [rA, gA, bA] = colorA.match(/\w\w/g)?.map((c) => parseInt(c, 16)) ?? [0, 0, 0];
    const [rB, gB, bB] = colorB.match(/\w\w/g)?.map((c) => parseInt(c, 16)) ?? [0, 0, 0];
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, "0");
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, "0");
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, "0");
    return "#" + r + g + b;
  }
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
    },
    get Percent() {
      return create("i", { class: "bi-percent" });
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
  var bsIcons = ["bi-0-circle", "bi-0-circle-fill", "bi-0-square", "bi-0-square-fill", "bi-1-circle", "bi-1-circle-fill", "bi-1-square", "bi-1-square-fill", "bi-123", "bi-2-circle", "bi-2-circle-fill", "bi-2-square", "bi-2-square-fill", "bi-3-circle", "bi-3-circle-fill", "bi-3-square", "bi-3-square-fill", "bi-4-circle", "bi-4-circle-fill", "bi-4-square", "bi-4-square-fill", "bi-5-circle", "bi-5-circle-fill", "bi-5-square", "bi-5-square-fill", "bi-6-circle", "bi-6-circle-fill", "bi-6-square", "bi-6-square-fill", "bi-7-circle", "bi-7-circle-fill", "bi-7-square", "bi-7-square-fill", "bi-8-circle", "bi-8-circle-fill", "bi-8-square", "bi-8-square-fill", "bi-9-circle", "bi-9-circle-fill", "bi-9-square", "bi-9-square-fill", "bi-activity", "bi-airplane", "bi-airplane-engines", "bi-airplane-engines-fill", "bi-airplane-fill", "bi-alarm", "bi-alarm-fill", "bi-alexa", "bi-align-bottom", "bi-align-center", "bi-align-end", "bi-align-middle", "bi-align-start", "bi-align-top", "bi-alipay", "bi-alphabet", "bi-alphabet-uppercase", "bi-alt", "bi-amazon", "bi-amd", "bi-android", "bi-android2", "bi-app", "bi-app-indicator", "bi-apple", "bi-archive", "bi-archive-fill", "bi-arrow-90deg-down", "bi-arrow-90deg-left", "bi-arrow-90deg-right", "bi-arrow-90deg-up", "bi-arrow-bar-down", "bi-arrow-bar-left", "bi-arrow-bar-right", "bi-arrow-bar-up", "bi-arrow-clockwise", "bi-arrow-counterclockwise", "bi-arrow-down", "bi-arrow-down-circle", "bi-arrow-down-circle-fill", "bi-arrow-down-left-circle", "bi-arrow-down-left-circle-fill", "bi-arrow-down-left-square", "bi-arrow-down-left-square-fill", "bi-arrow-down-right-circle", "bi-arrow-down-right-circle-fill", "bi-arrow-down-right-square", "bi-arrow-down-right-square-fill", "bi-arrow-down-square", "bi-arrow-down-square-fill", "bi-arrow-down-left", "bi-arrow-down-right", "bi-arrow-down-short", "bi-arrow-down-up", "bi-arrow-left", "bi-arrow-left-circle", "bi-arrow-left-circle-fill", "bi-arrow-left-square", "bi-arrow-left-square-fill", "bi-arrow-left-right", "bi-arrow-left-short", "bi-arrow-repeat", "bi-arrow-return-left", "bi-arrow-return-right", "bi-arrow-right", "bi-arrow-right-circle", "bi-arrow-right-circle-fill", "bi-arrow-right-square", "bi-arrow-right-square-fill", "bi-arrow-right-short", "bi-arrow-through-heart", "bi-arrow-through-heart-fill", "bi-arrow-up", "bi-arrow-up-circle", "bi-arrow-up-circle-fill", "bi-arrow-up-left-circle", "bi-arrow-up-left-circle-fill", "bi-arrow-up-left-square", "bi-arrow-up-left-square-fill", "bi-arrow-up-right-circle", "bi-arrow-up-right-circle-fill", "bi-arrow-up-right-square", "bi-arrow-up-right-square-fill", "bi-arrow-up-square", "bi-arrow-up-square-fill", "bi-arrow-up-left", "bi-arrow-up-right", "bi-arrow-up-short", "bi-arrows", "bi-arrows-angle-contract", "bi-arrows-angle-expand", "bi-arrows-collapse", "bi-arrows-collapse-vertical", "bi-arrows-expand", "bi-arrows-expand-vertical", "bi-arrows-fullscreen", "bi-arrows-move", "bi-arrows-vertical", "bi-aspect-ratio", "bi-aspect-ratio-fill", "bi-asterisk", "bi-at", "bi-award", "bi-award-fill", "bi-back", "bi-backpack", "bi-backpack-fill", "bi-backpack2", "bi-backpack2-fill", "bi-backpack3", "bi-backpack3-fill", "bi-backpack4", "bi-backpack4-fill", "bi-backspace", "bi-backspace-fill", "bi-backspace-reverse", "bi-backspace-reverse-fill", "bi-badge-3d", "bi-badge-3d-fill", "bi-badge-4k", "bi-badge-4k-fill", "bi-badge-8k", "bi-badge-8k-fill", "bi-badge-ad", "bi-badge-ad-fill", "bi-badge-ar", "bi-badge-ar-fill", "bi-badge-cc", "bi-badge-cc-fill", "bi-badge-hd", "bi-badge-hd-fill", "bi-badge-sd", "bi-badge-sd-fill", "bi-badge-tm", "bi-badge-tm-fill", "bi-badge-vo", "bi-badge-vo-fill", "bi-badge-vr", "bi-badge-vr-fill", "bi-badge-wc", "bi-badge-wc-fill", "bi-bag", "bi-bag-check", "bi-bag-check-fill", "bi-bag-dash", "bi-bag-dash-fill", "bi-bag-fill", "bi-bag-heart", "bi-bag-heart-fill", "bi-bag-plus", "bi-bag-plus-fill", "bi-bag-x", "bi-bag-x-fill", "bi-balloon", "bi-balloon-fill", "bi-balloon-heart", "bi-balloon-heart-fill", "bi-ban", "bi-ban-fill", "bi-bandaid", "bi-bandaid-fill", "bi-bank", "bi-bank2", "bi-bar-chart", "bi-bar-chart-fill", "bi-bar-chart-line", "bi-bar-chart-line-fill", "bi-bar-chart-steps", "bi-basket", "bi-basket-fill", "bi-basket2", "bi-basket2-fill", "bi-basket3", "bi-basket3-fill", "bi-battery", "bi-battery-charging", "bi-battery-full", "bi-battery-half", "bi-behance", "bi-bell", "bi-bell-fill", "bi-bell-slash", "bi-bell-slash-fill", "bi-bezier", "bi-bezier2", "bi-bicycle", "bi-bing", "bi-binoculars", "bi-binoculars-fill", "bi-blockquote-left", "bi-blockquote-right", "bi-bluetooth", "bi-body-text", "bi-book", "bi-book-fill", "bi-book-half", "bi-bookmark", "bi-bookmark-check", "bi-bookmark-check-fill", "bi-bookmark-dash", "bi-bookmark-dash-fill", "bi-bookmark-fill", "bi-bookmark-heart", "bi-bookmark-heart-fill", "bi-bookmark-plus", "bi-bookmark-plus-fill", "bi-bookmark-star", "bi-bookmark-star-fill", "bi-bookmark-x", "bi-bookmark-x-fill", "bi-bookmarks", "bi-bookmarks-fill", "bi-bookshelf", "bi-boombox", "bi-boombox-fill", "bi-bootstrap", "bi-bootstrap-fill", "bi-bootstrap-reboot", "bi-border", "bi-border-all", "bi-border-bottom", "bi-border-center", "bi-border-inner", "bi-border-left", "bi-border-middle", "bi-border-outer", "bi-border-right", "bi-border-style", "bi-border-top", "bi-border-width", "bi-bounding-box", "bi-bounding-box-circles", "bi-box", "bi-box-arrow-down-left", "bi-box-arrow-down-right", "bi-box-arrow-down", "bi-box-arrow-in-down", "bi-box-arrow-in-down-left", "bi-box-arrow-in-down-right", "bi-box-arrow-in-left", "bi-box-arrow-in-right", "bi-box-arrow-in-up", "bi-box-arrow-in-up-left", "bi-box-arrow-in-up-right", "bi-box-arrow-left", "bi-box-arrow-right", "bi-box-arrow-up", "bi-box-arrow-up-left", "bi-box-arrow-up-right", "bi-box-fill", "bi-box-seam", "bi-box-seam-fill", "bi-box2", "bi-box2-fill", "bi-box2-heart", "bi-box2-heart-fill", "bi-boxes", "bi-braces", "bi-braces-asterisk", "bi-bricks", "bi-briefcase", "bi-briefcase-fill", "bi-brightness-alt-high", "bi-brightness-alt-high-fill", "bi-brightness-alt-low", "bi-brightness-alt-low-fill", "bi-brightness-high", "bi-brightness-high-fill", "bi-brightness-low", "bi-brightness-low-fill", "bi-brilliance", "bi-broadcast", "bi-broadcast-pin", "bi-browser-chrome", "bi-browser-edge", "bi-browser-firefox", "bi-browser-safari", "bi-brush", "bi-brush-fill", "bi-bucket", "bi-bucket-fill", "bi-bug", "bi-bug-fill", "bi-building", "bi-building-add", "bi-building-check", "bi-building-dash", "bi-building-down", "bi-building-exclamation", "bi-building-fill", "bi-building-fill-add", "bi-building-fill-check", "bi-building-fill-dash", "bi-building-fill-down", "bi-building-fill-exclamation", "bi-building-fill-gear", "bi-building-fill-lock", "bi-building-fill-slash", "bi-building-fill-up", "bi-building-fill-x", "bi-building-gear", "bi-building-lock", "bi-building-slash", "bi-building-up", "bi-building-x", "bi-buildings", "bi-buildings-fill", "bi-bullseye", "bi-bus-front", "bi-bus-front-fill", "bi-c-circle", "bi-c-circle-fill", "bi-c-square", "bi-c-square-fill", "bi-cake", "bi-cake-fill", "bi-cake2", "bi-cake2-fill", "bi-calculator", "bi-calculator-fill", "bi-calendar", "bi-calendar-check", "bi-calendar-check-fill", "bi-calendar-date", "bi-calendar-date-fill", "bi-calendar-day", "bi-calendar-day-fill", "bi-calendar-event", "bi-calendar-event-fill", "bi-calendar-fill", "bi-calendar-heart", "bi-calendar-heart-fill", "bi-calendar-minus", "bi-calendar-minus-fill", "bi-calendar-month", "bi-calendar-month-fill", "bi-calendar-plus", "bi-calendar-plus-fill", "bi-calendar-range", "bi-calendar-range-fill", "bi-calendar-week", "bi-calendar-week-fill", "bi-calendar-x", "bi-calendar-x-fill", "bi-calendar2", "bi-calendar2-check", "bi-calendar2-check-fill", "bi-calendar2-date", "bi-calendar2-date-fill", "bi-calendar2-day", "bi-calendar2-day-fill", "bi-calendar2-event", "bi-calendar2-event-fill", "bi-calendar2-fill", "bi-calendar2-heart", "bi-calendar2-heart-fill", "bi-calendar2-minus", "bi-calendar2-minus-fill", "bi-calendar2-month", "bi-calendar2-month-fill", "bi-calendar2-plus", "bi-calendar2-plus-fill", "bi-calendar2-range", "bi-calendar2-range-fill", "bi-calendar2-week", "bi-calendar2-week-fill", "bi-calendar2-x", "bi-calendar2-x-fill", "bi-calendar3", "bi-calendar3-event", "bi-calendar3-event-fill", "bi-calendar3-fill", "bi-calendar3-range", "bi-calendar3-range-fill", "bi-calendar3-week", "bi-calendar3-week-fill", "bi-calendar4", "bi-calendar4-event", "bi-calendar4-range", "bi-calendar4-week", "bi-camera", "bi-camera2", "bi-camera-fill", "bi-camera-reels", "bi-camera-reels-fill", "bi-camera-video", "bi-camera-video-fill", "bi-camera-video-off", "bi-camera-video-off-fill", "bi-capslock", "bi-capslock-fill", "bi-capsule", "bi-capsule-pill", "bi-car-front", "bi-car-front-fill", "bi-card-checklist", "bi-card-heading", "bi-card-image", "bi-card-list", "bi-card-text", "bi-caret-down", "bi-caret-down-fill", "bi-caret-down-square", "bi-caret-down-square-fill", "bi-caret-left", "bi-caret-left-fill", "bi-caret-left-square", "bi-caret-left-square-fill", "bi-caret-right", "bi-caret-right-fill", "bi-caret-right-square", "bi-caret-right-square-fill", "bi-caret-up", "bi-caret-up-fill", "bi-caret-up-square", "bi-caret-up-square-fill", "bi-cart", "bi-cart-check", "bi-cart-check-fill", "bi-cart-dash", "bi-cart-dash-fill", "bi-cart-fill", "bi-cart-plus", "bi-cart-plus-fill", "bi-cart-x", "bi-cart-x-fill", "bi-cart2", "bi-cart3", "bi-cart4", "bi-cash", "bi-cash-coin", "bi-cash-stack", "bi-cassette", "bi-cassette-fill", "bi-cast", "bi-cc-circle", "bi-cc-circle-fill", "bi-cc-square", "bi-cc-square-fill", "bi-chat", "bi-chat-dots", "bi-chat-dots-fill", "bi-chat-fill", "bi-chat-heart", "bi-chat-heart-fill", "bi-chat-left", "bi-chat-left-dots", "bi-chat-left-dots-fill", "bi-chat-left-fill", "bi-chat-left-heart", "bi-chat-left-heart-fill", "bi-chat-left-quote", "bi-chat-left-quote-fill", "bi-chat-left-text", "bi-chat-left-text-fill", "bi-chat-quote", "bi-chat-quote-fill", "bi-chat-right", "bi-chat-right-dots", "bi-chat-right-dots-fill", "bi-chat-right-fill", "bi-chat-right-heart", "bi-chat-right-heart-fill", "bi-chat-right-quote", "bi-chat-right-quote-fill", "bi-chat-right-text", "bi-chat-right-text-fill", "bi-chat-square", "bi-chat-square-dots", "bi-chat-square-dots-fill", "bi-chat-square-fill", "bi-chat-square-heart", "bi-chat-square-heart-fill", "bi-chat-square-quote", "bi-chat-square-quote-fill", "bi-chat-square-text", "bi-chat-square-text-fill", "bi-chat-text", "bi-chat-text-fill", "bi-check", "bi-check-all", "bi-check-circle", "bi-check-circle-fill", "bi-check-lg", "bi-check-square", "bi-check-square-fill", "bi-check2", "bi-check2-all", "bi-check2-circle", "bi-check2-square", "bi-chevron-bar-contract", "bi-chevron-bar-down", "bi-chevron-bar-expand", "bi-chevron-bar-left", "bi-chevron-bar-right", "bi-chevron-bar-up", "bi-chevron-compact-down", "bi-chevron-compact-left", "bi-chevron-compact-right", "bi-chevron-compact-up", "bi-chevron-contract", "bi-chevron-double-down", "bi-chevron-double-left", "bi-chevron-double-right", "bi-chevron-double-up", "bi-chevron-down", "bi-chevron-expand", "bi-chevron-left", "bi-chevron-right", "bi-chevron-up", "bi-circle", "bi-circle-fill", "bi-circle-half", "bi-slash-circle", "bi-circle-square", "bi-clipboard", "bi-clipboard-check", "bi-clipboard-check-fill", "bi-clipboard-data", "bi-clipboard-data-fill", "bi-clipboard-fill", "bi-clipboard-heart", "bi-clipboard-heart-fill", "bi-clipboard-minus", "bi-clipboard-minus-fill", "bi-clipboard-plus", "bi-clipboard-plus-fill", "bi-clipboard-pulse", "bi-clipboard-x", "bi-clipboard-x-fill", "bi-clipboard2", "bi-clipboard2-check", "bi-clipboard2-check-fill", "bi-clipboard2-data", "bi-clipboard2-data-fill", "bi-clipboard2-fill", "bi-clipboard2-heart", "bi-clipboard2-heart-fill", "bi-clipboard2-minus", "bi-clipboard2-minus-fill", "bi-clipboard2-plus", "bi-clipboard2-plus-fill", "bi-clipboard2-pulse", "bi-clipboard2-pulse-fill", "bi-clipboard2-x", "bi-clipboard2-x-fill", "bi-clock", "bi-clock-fill", "bi-clock-history", "bi-cloud", "bi-cloud-arrow-down", "bi-cloud-arrow-down-fill", "bi-cloud-arrow-up", "bi-cloud-arrow-up-fill", "bi-cloud-check", "bi-cloud-check-fill", "bi-cloud-download", "bi-cloud-download-fill", "bi-cloud-drizzle", "bi-cloud-drizzle-fill", "bi-cloud-fill", "bi-cloud-fog", "bi-cloud-fog-fill", "bi-cloud-fog2", "bi-cloud-fog2-fill", "bi-cloud-hail", "bi-cloud-hail-fill", "bi-cloud-haze", "bi-cloud-haze-fill", "bi-cloud-haze2", "bi-cloud-haze2-fill", "bi-cloud-lightning", "bi-cloud-lightning-fill", "bi-cloud-lightning-rain", "bi-cloud-lightning-rain-fill", "bi-cloud-minus", "bi-cloud-minus-fill", "bi-cloud-moon", "bi-cloud-moon-fill", "bi-cloud-plus", "bi-cloud-plus-fill", "bi-cloud-rain", "bi-cloud-rain-fill", "bi-cloud-rain-heavy", "bi-cloud-rain-heavy-fill", "bi-cloud-slash", "bi-cloud-slash-fill", "bi-cloud-sleet", "bi-cloud-sleet-fill", "bi-cloud-snow", "bi-cloud-snow-fill", "bi-cloud-sun", "bi-cloud-sun-fill", "bi-cloud-upload", "bi-cloud-upload-fill", "bi-clouds", "bi-clouds-fill", "bi-cloudy", "bi-cloudy-fill", "bi-code", "bi-code-slash", "bi-code-square", "bi-coin", "bi-collection", "bi-collection-fill", "bi-collection-play", "bi-collection-play-fill", "bi-columns", "bi-columns-gap", "bi-command", "bi-compass", "bi-compass-fill", "bi-cone", "bi-cone-striped", "bi-controller", "bi-cookie", "bi-copy", "bi-cpu", "bi-cpu-fill", "bi-credit-card", "bi-credit-card-2-back", "bi-credit-card-2-back-fill", "bi-credit-card-2-front", "bi-credit-card-2-front-fill", "bi-credit-card-fill", "bi-crop", "bi-crosshair", "bi-crosshair2", "bi-cup", "bi-cup-fill", "bi-cup-hot", "bi-cup-hot-fill", "bi-cup-straw", "bi-currency-bitcoin", "bi-currency-dollar", "bi-currency-euro", "bi-currency-exchange", "bi-currency-pound", "bi-currency-rupee", "bi-currency-yen", "bi-cursor", "bi-cursor-fill", "bi-cursor-text", "bi-dash", "bi-dash-circle", "bi-dash-circle-dotted", "bi-dash-circle-fill", "bi-dash-lg", "bi-dash-square", "bi-dash-square-dotted", "bi-dash-square-fill", "bi-database", "bi-database-add", "bi-database-check", "bi-database-dash", "bi-database-down", "bi-database-exclamation", "bi-database-fill", "bi-database-fill-add", "bi-database-fill-check", "bi-database-fill-dash", "bi-database-fill-down", "bi-database-fill-exclamation", "bi-database-fill-gear", "bi-database-fill-lock", "bi-database-fill-slash", "bi-database-fill-up", "bi-database-fill-x", "bi-database-gear", "bi-database-lock", "bi-database-slash", "bi-database-up", "bi-database-x", "bi-device-hdd", "bi-device-hdd-fill", "bi-device-ssd", "bi-device-ssd-fill", "bi-diagram-2", "bi-diagram-2-fill", "bi-diagram-3", "bi-diagram-3-fill", "bi-diamond", "bi-diamond-fill", "bi-diamond-half", "bi-dice-1", "bi-dice-1-fill", "bi-dice-2", "bi-dice-2-fill", "bi-dice-3", "bi-dice-3-fill", "bi-dice-4", "bi-dice-4-fill", "bi-dice-5", "bi-dice-5-fill", "bi-dice-6", "bi-dice-6-fill", "bi-disc", "bi-disc-fill", "bi-discord", "bi-display", "bi-display-fill", "bi-displayport", "bi-displayport-fill", "bi-distribute-horizontal", "bi-distribute-vertical", "bi-door-closed", "bi-door-closed-fill", "bi-door-open", "bi-door-open-fill", "bi-dot", "bi-download", "bi-dpad", "bi-dpad-fill", "bi-dribbble", "bi-dropbox", "bi-droplet", "bi-droplet-fill", "bi-droplet-half", "bi-duffle", "bi-duffle-fill", "bi-ear", "bi-ear-fill", "bi-earbuds", "bi-easel", "bi-easel-fill", "bi-easel2", "bi-easel2-fill", "bi-easel3", "bi-easel3-fill", "bi-egg", "bi-egg-fill", "bi-egg-fried", "bi-eject", "bi-eject-fill", "bi-emoji-angry", "bi-emoji-angry-fill", "bi-emoji-astonished", "bi-emoji-astonished-fill", "bi-emoji-dizzy", "bi-emoji-dizzy-fill", "bi-emoji-expressionless", "bi-emoji-expressionless-fill", "bi-emoji-frown", "bi-emoji-frown-fill", "bi-emoji-grimace", "bi-emoji-grimace-fill", "bi-emoji-grin", "bi-emoji-grin-fill", "bi-emoji-heart-eyes", "bi-emoji-heart-eyes-fill", "bi-emoji-kiss", "bi-emoji-kiss-fill", "bi-emoji-laughing", "bi-emoji-laughing-fill", "bi-emoji-neutral", "bi-emoji-neutral-fill", "bi-emoji-smile", "bi-emoji-smile-fill", "bi-emoji-smile-upside-down", "bi-emoji-smile-upside-down-fill", "bi-emoji-sunglasses", "bi-emoji-sunglasses-fill", "bi-emoji-surprise", "bi-emoji-surprise-fill", "bi-emoji-tear", "bi-emoji-tear-fill", "bi-emoji-wink", "bi-emoji-wink-fill", "bi-envelope", "bi-envelope-arrow-down", "bi-envelope-arrow-down-fill", "bi-envelope-arrow-up", "bi-envelope-arrow-up-fill", "bi-envelope-at", "bi-envelope-at-fill", "bi-envelope-check", "bi-envelope-check-fill", "bi-envelope-dash", "bi-envelope-dash-fill", "bi-envelope-exclamation", "bi-envelope-exclamation-fill", "bi-envelope-fill", "bi-envelope-heart", "bi-envelope-heart-fill", "bi-envelope-open", "bi-envelope-open-fill", "bi-envelope-open-heart", "bi-envelope-open-heart-fill", "bi-envelope-paper", "bi-envelope-paper-fill", "bi-envelope-paper-heart", "bi-envelope-paper-heart-fill", "bi-envelope-plus", "bi-envelope-plus-fill", "bi-envelope-slash", "bi-envelope-slash-fill", "bi-envelope-x", "bi-envelope-x-fill", "bi-eraser", "bi-eraser-fill", "bi-escape", "bi-ethernet", "bi-ev-front", "bi-ev-front-fill", "bi-ev-station", "bi-ev-station-fill", "bi-exclamation", "bi-exclamation-circle", "bi-exclamation-circle-fill", "bi-exclamation-diamond", "bi-exclamation-diamond-fill", "bi-exclamation-lg", "bi-exclamation-octagon", "bi-exclamation-octagon-fill", "bi-exclamation-square", "bi-exclamation-square-fill", "bi-exclamation-triangle", "bi-exclamation-triangle-fill", "bi-exclude", "bi-explicit", "bi-explicit-fill", "bi-exposure", "bi-eye", "bi-eye-fill", "bi-eye-slash", "bi-eye-slash-fill", "bi-eyedropper", "bi-eyeglasses", "bi-facebook", "bi-fan", "bi-fast-forward", "bi-fast-forward-btn", "bi-fast-forward-btn-fill", "bi-fast-forward-circle", "bi-fast-forward-circle-fill", "bi-fast-forward-fill", "bi-feather", "bi-feather2", "bi-file", "bi-file-arrow-down", "bi-file-arrow-down-fill", "bi-file-arrow-up", "bi-file-arrow-up-fill", "bi-file-bar-graph", "bi-file-bar-graph-fill", "bi-file-binary", "bi-file-binary-fill", "bi-file-break", "bi-file-break-fill", "bi-file-check", "bi-file-check-fill", "bi-file-code", "bi-file-code-fill", "bi-file-diff", "bi-file-diff-fill", "bi-file-earmark", "bi-file-earmark-arrow-down", "bi-file-earmark-arrow-down-fill", "bi-file-earmark-arrow-up", "bi-file-earmark-arrow-up-fill", "bi-file-earmark-bar-graph", "bi-file-earmark-bar-graph-fill", "bi-file-earmark-binary", "bi-file-earmark-binary-fill", "bi-file-earmark-break", "bi-file-earmark-break-fill", "bi-file-earmark-check", "bi-file-earmark-check-fill", "bi-file-earmark-code", "bi-file-earmark-code-fill", "bi-file-earmark-diff", "bi-file-earmark-diff-fill", "bi-file-earmark-easel", "bi-file-earmark-easel-fill", "bi-file-earmark-excel", "bi-file-earmark-excel-fill", "bi-file-earmark-fill", "bi-file-earmark-font", "bi-file-earmark-font-fill", "bi-file-earmark-image", "bi-file-earmark-image-fill", "bi-file-earmark-lock", "bi-file-earmark-lock-fill", "bi-file-earmark-lock2", "bi-file-earmark-lock2-fill", "bi-file-earmark-medical", "bi-file-earmark-medical-fill", "bi-file-earmark-minus", "bi-file-earmark-minus-fill", "bi-file-earmark-music", "bi-file-earmark-music-fill", "bi-file-earmark-pdf", "bi-file-earmark-pdf-fill", "bi-file-earmark-person", "bi-file-earmark-person-fill", "bi-file-earmark-play", "bi-file-earmark-play-fill", "bi-file-earmark-plus", "bi-file-earmark-plus-fill", "bi-file-earmark-post", "bi-file-earmark-post-fill", "bi-file-earmark-ppt", "bi-file-earmark-ppt-fill", "bi-file-earmark-richtext", "bi-file-earmark-richtext-fill", "bi-file-earmark-ruled", "bi-file-earmark-ruled-fill", "bi-file-earmark-slides", "bi-file-earmark-slides-fill", "bi-file-earmark-spreadsheet", "bi-file-earmark-spreadsheet-fill", "bi-file-earmark-text", "bi-file-earmark-text-fill", "bi-file-earmark-word", "bi-file-earmark-word-fill", "bi-file-earmark-x", "bi-file-earmark-x-fill", "bi-file-earmark-zip", "bi-file-earmark-zip-fill", "bi-file-easel", "bi-file-easel-fill", "bi-file-excel", "bi-file-excel-fill", "bi-file-fill", "bi-file-font", "bi-file-font-fill", "bi-file-image", "bi-file-image-fill", "bi-file-lock", "bi-file-lock-fill", "bi-file-lock2", "bi-file-lock2-fill", "bi-file-medical", "bi-file-medical-fill", "bi-file-minus", "bi-file-minus-fill", "bi-file-music", "bi-file-music-fill", "bi-file-pdf", "bi-file-pdf-fill", "bi-file-person", "bi-file-person-fill", "bi-file-play", "bi-file-play-fill", "bi-file-plus", "bi-file-plus-fill", "bi-file-post", "bi-file-post-fill", "bi-file-ppt", "bi-file-ppt-fill", "bi-file-richtext", "bi-file-richtext-fill", "bi-file-ruled", "bi-file-ruled-fill", "bi-file-slides", "bi-file-slides-fill", "bi-file-spreadsheet", "bi-file-spreadsheet-fill", "bi-file-text", "bi-file-text-fill", "bi-file-word", "bi-file-word-fill", "bi-file-x", "bi-file-x-fill", "bi-file-zip", "bi-file-zip-fill", "bi-files", "bi-files-alt", "bi-filetype-aac", "bi-filetype-ai", "bi-filetype-bmp", "bi-filetype-cs", "bi-filetype-css", "bi-filetype-csv", "bi-filetype-doc", "bi-filetype-docx", "bi-filetype-exe", "bi-filetype-gif", "bi-filetype-heic", "bi-filetype-html", "bi-filetype-java", "bi-filetype-jpg", "bi-filetype-js", "bi-filetype-json", "bi-filetype-jsx", "bi-filetype-key", "bi-filetype-m4p", "bi-filetype-md", "bi-filetype-mdx", "bi-filetype-mov", "bi-filetype-mp3", "bi-filetype-mp4", "bi-filetype-otf", "bi-filetype-pdf", "bi-filetype-php", "bi-filetype-png", "bi-filetype-ppt", "bi-filetype-pptx", "bi-filetype-psd", "bi-filetype-py", "bi-filetype-raw", "bi-filetype-rb", "bi-filetype-sass", "bi-filetype-scss", "bi-filetype-sh", "bi-filetype-sql", "bi-filetype-svg", "bi-filetype-tiff", "bi-filetype-tsx", "bi-filetype-ttf", "bi-filetype-txt", "bi-filetype-wav", "bi-filetype-woff", "bi-filetype-xls", "bi-filetype-xlsx", "bi-filetype-xml", "bi-filetype-yml", "bi-film", "bi-filter", "bi-filter-circle", "bi-filter-circle-fill", "bi-filter-left", "bi-filter-right", "bi-filter-square", "bi-filter-square-fill", "bi-fingerprint", "bi-fire", "bi-flag", "bi-flag-fill", "bi-floppy", "bi-floppy-fill", "bi-floppy2", "bi-floppy2-fill", "bi-flower1", "bi-flower2", "bi-flower3", "bi-folder", "bi-folder-check", "bi-folder-fill", "bi-folder-minus", "bi-folder-plus", "bi-folder-symlink", "bi-folder-symlink-fill", "bi-folder-x", "bi-folder2", "bi-folder2-open", "bi-fonts", "bi-forward", "bi-forward-fill", "bi-front", "bi-fuel-pump", "bi-fuel-pump-diesel", "bi-fuel-pump-diesel-fill", "bi-fuel-pump-fill", "bi-fullscreen", "bi-fullscreen-exit", "bi-funnel", "bi-funnel-fill", "bi-gear", "bi-gear-fill", "bi-gear-wide", "bi-gear-wide-connected", "bi-gem", "bi-gender-ambiguous", "bi-gender-female", "bi-gender-male", "bi-gender-neuter", "bi-gender-trans", "bi-geo", "bi-geo-alt", "bi-geo-alt-fill", "bi-geo-fill", "bi-gift", "bi-gift-fill", "bi-git", "bi-github", "bi-gitlab", "bi-globe", "bi-globe-americas", "bi-globe-asia-australia", "bi-globe-central-south-asia", "bi-globe-europe-africa", "bi-globe2", "bi-google", "bi-google-play", "bi-gpu-card", "bi-graph-down", "bi-graph-down-arrow", "bi-graph-up", "bi-graph-up-arrow", "bi-grid", "bi-grid-1x2", "bi-grid-1x2-fill", "bi-grid-3x2", "bi-grid-3x2-gap", "bi-grid-3x2-gap-fill", "bi-grid-3x3", "bi-grid-3x3-gap", "bi-grid-3x3-gap-fill", "bi-grid-fill", "bi-grip-horizontal", "bi-grip-vertical", "bi-h-circle", "bi-h-circle-fill", "bi-h-square", "bi-h-square-fill", "bi-hammer", "bi-hand-index", "bi-hand-index-fill", "bi-hand-index-thumb", "bi-hand-index-thumb-fill", "bi-hand-thumbs-down", "bi-hand-thumbs-down-fill", "bi-hand-thumbs-up", "bi-hand-thumbs-up-fill", "bi-handbag", "bi-handbag-fill", "bi-hash", "bi-hdd", "bi-hdd-fill", "bi-hdd-network", "bi-hdd-network-fill", "bi-hdd-rack", "bi-hdd-rack-fill", "bi-hdd-stack", "bi-hdd-stack-fill", "bi-hdmi", "bi-hdmi-fill", "bi-headphones", "bi-headset", "bi-headset-vr", "bi-heart", "bi-heart-arrow", "bi-heart-fill", "bi-heart-half", "bi-heart-pulse", "bi-heart-pulse-fill", "bi-heartbreak", "bi-heartbreak-fill", "bi-hearts", "bi-heptagon", "bi-heptagon-fill", "bi-heptagon-half", "bi-hexagon", "bi-hexagon-fill", "bi-hexagon-half", "bi-highlighter", "bi-highlights", "bi-hospital", "bi-hospital-fill", "bi-hourglass", "bi-hourglass-bottom", "bi-hourglass-split", "bi-hourglass-top", "bi-house", "bi-house-add", "bi-house-add-fill", "bi-house-check", "bi-house-check-fill", "bi-house-dash", "bi-house-dash-fill", "bi-house-door", "bi-house-door-fill", "bi-house-down", "bi-house-down-fill", "bi-house-exclamation", "bi-house-exclamation-fill", "bi-house-fill", "bi-house-gear", "bi-house-gear-fill", "bi-house-heart", "bi-house-heart-fill", "bi-house-lock", "bi-house-lock-fill", "bi-house-slash", "bi-house-slash-fill", "bi-house-up", "bi-house-up-fill", "bi-house-x", "bi-house-x-fill", "bi-houses", "bi-houses-fill", "bi-hr", "bi-hurricane", "bi-hypnotize", "bi-image", "bi-image-alt", "bi-image-fill", "bi-images", "bi-inbox", "bi-inbox-fill", "bi-inboxes-fill", "bi-inboxes", "bi-incognito", "bi-indent", "bi-infinity", "bi-info", "bi-info-circle", "bi-info-circle-fill", "bi-info-lg", "bi-info-square", "bi-info-square-fill", "bi-input-cursor", "bi-input-cursor-text", "bi-instagram", "bi-intersect", "bi-journal", "bi-journal-album", "bi-journal-arrow-down", "bi-journal-arrow-up", "bi-journal-bookmark", "bi-journal-bookmark-fill", "bi-journal-check", "bi-journal-code", "bi-journal-medical", "bi-journal-minus", "bi-journal-plus", "bi-journal-richtext", "bi-journal-text", "bi-journal-x", "bi-journals", "bi-joystick", "bi-justify", "bi-justify-left", "bi-justify-right", "bi-kanban", "bi-kanban-fill", "bi-key", "bi-key-fill", "bi-keyboard", "bi-keyboard-fill", "bi-ladder", "bi-lamp", "bi-lamp-fill", "bi-laptop", "bi-laptop-fill", "bi-layer-backward", "bi-layer-forward", "bi-layers", "bi-layers-fill", "bi-layers-half", "bi-layout-sidebar", "bi-layout-sidebar-inset-reverse", "bi-layout-sidebar-inset", "bi-layout-sidebar-reverse", "bi-layout-split", "bi-layout-text-sidebar", "bi-layout-text-sidebar-reverse", "bi-layout-text-window", "bi-layout-text-window-reverse", "bi-layout-three-columns", "bi-layout-wtf", "bi-life-preserver", "bi-lightbulb", "bi-lightbulb-fill", "bi-lightbulb-off", "bi-lightbulb-off-fill", "bi-lightning", "bi-lightning-charge", "bi-lightning-charge-fill", "bi-lightning-fill", "bi-line", "bi-link", "bi-link-45deg", "bi-linkedin", "bi-list", "bi-list-check", "bi-list-columns", "bi-list-columns-reverse", "bi-list-nested", "bi-list-ol", "bi-list-stars", "bi-list-task", "bi-list-ul", "bi-lock", "bi-lock-fill", "bi-luggage", "bi-luggage-fill", "bi-lungs", "bi-lungs-fill", "bi-magic", "bi-magnet", "bi-magnet-fill", "bi-mailbox", "bi-mailbox-flag", "bi-mailbox2", "bi-mailbox2-flag", "bi-map", "bi-map-fill", "bi-markdown", "bi-markdown-fill", "bi-marker-tip", "bi-mask", "bi-mastodon", "bi-medium", "bi-megaphone", "bi-megaphone-fill", "bi-memory", "bi-menu-app", "bi-menu-app-fill", "bi-menu-button", "bi-menu-button-fill", "bi-menu-button-wide", "bi-menu-button-wide-fill", "bi-menu-down", "bi-menu-up", "bi-messenger", "bi-meta", "bi-mic", "bi-mic-fill", "bi-mic-mute", "bi-mic-mute-fill", "bi-microsoft", "bi-microsoft-teams", "bi-minecart", "bi-minecart-loaded", "bi-modem", "bi-modem-fill", "bi-moisture", "bi-moon", "bi-moon-fill", "bi-moon-stars", "bi-moon-stars-fill", "bi-mortarboard", "bi-mortarboard-fill", "bi-motherboard", "bi-motherboard-fill", "bi-mouse", "bi-mouse-fill", "bi-mouse2", "bi-mouse2-fill", "bi-mouse3", "bi-mouse3-fill", "bi-music-note", "bi-music-note-beamed", "bi-music-note-list", "bi-music-player", "bi-music-player-fill", "bi-newspaper", "bi-nintendo-switch", "bi-node-minus", "bi-node-minus-fill", "bi-node-plus", "bi-node-plus-fill", "bi-noise-reduction", "bi-nut", "bi-nut-fill", "bi-nvidia", "bi-nvme", "bi-nvme-fill", "bi-octagon", "bi-octagon-fill", "bi-octagon-half", "bi-opencollective", "bi-optical-audio", "bi-optical-audio-fill", "bi-option", "bi-outlet", "bi-p-circle", "bi-p-circle-fill", "bi-p-square", "bi-p-square-fill", "bi-paint-bucket", "bi-palette", "bi-palette-fill", "bi-palette2", "bi-paperclip", "bi-paragraph", "bi-pass", "bi-pass-fill", "bi-passport", "bi-passport-fill", "bi-patch-check", "bi-patch-check-fill", "bi-patch-exclamation", "bi-patch-exclamation-fill", "bi-patch-minus", "bi-patch-minus-fill", "bi-patch-plus", "bi-patch-plus-fill", "bi-patch-question", "bi-patch-question-fill", "bi-pause", "bi-pause-btn", "bi-pause-btn-fill", "bi-pause-circle", "bi-pause-circle-fill", "bi-pause-fill", "bi-paypal", "bi-pc", "bi-pc-display", "bi-pc-display-horizontal", "bi-pc-horizontal", "bi-pci-card", "bi-pci-card-network", "bi-pci-card-sound", "bi-peace", "bi-peace-fill", "bi-pen", "bi-pen-fill", "bi-pencil", "bi-pencil-fill", "bi-pencil-square", "bi-pentagon", "bi-pentagon-fill", "bi-pentagon-half", "bi-people", "bi-person-circle", "bi-people-fill", "bi-percent", "bi-person", "bi-person-add", "bi-person-arms-up", "bi-person-badge", "bi-person-badge-fill", "bi-person-bounding-box", "bi-person-check", "bi-person-check-fill", "bi-person-dash", "bi-person-dash-fill", "bi-person-down", "bi-person-exclamation", "bi-person-fill", "bi-person-fill-add", "bi-person-fill-check", "bi-person-fill-dash", "bi-person-fill-down", "bi-person-fill-exclamation", "bi-person-fill-gear", "bi-person-fill-lock", "bi-person-fill-slash", "bi-person-fill-up", "bi-person-fill-x", "bi-person-gear", "bi-person-heart", "bi-person-hearts", "bi-person-lines-fill", "bi-person-lock", "bi-person-plus", "bi-person-plus-fill", "bi-person-raised-hand", "bi-person-rolodex", "bi-person-slash", "bi-person-square", "bi-person-standing", "bi-person-standing-dress", "bi-person-up", "bi-person-vcard", "bi-person-vcard-fill", "bi-person-video", "bi-person-video2", "bi-person-video3", "bi-person-walking", "bi-person-wheelchair", "bi-person-workspace", "bi-person-x", "bi-person-x-fill", "bi-phone", "bi-phone-fill", "bi-phone-flip", "bi-phone-landscape", "bi-phone-landscape-fill", "bi-phone-vibrate", "bi-phone-vibrate-fill", "bi-pie-chart", "bi-pie-chart-fill", "bi-piggy-bank", "bi-piggy-bank-fill", "bi-pin", "bi-pin-angle", "bi-pin-angle-fill", "bi-pin-fill", "bi-pin-map", "bi-pin-map-fill", "bi-pinterest", "bi-pip", "bi-pip-fill", "bi-play", "bi-play-btn", "bi-play-btn-fill", "bi-play-circle", "bi-play-circle-fill", "bi-play-fill", "bi-playstation", "bi-plug", "bi-plug-fill", "bi-plugin", "bi-plus", "bi-plus-circle", "bi-plus-circle-dotted", "bi-plus-circle-fill", "bi-plus-lg", "bi-plus-slash-minus", "bi-plus-square", "bi-plus-square-dotted", "bi-plus-square-fill", "bi-postage", "bi-postage-fill", "bi-postage-heart", "bi-postage-heart-fill", "bi-postcard", "bi-postcard-fill", "bi-postcard-heart", "bi-postcard-heart-fill", "bi-power", "bi-prescription", "bi-prescription2", "bi-printer", "bi-printer-fill", "bi-projector", "bi-projector-fill", "bi-puzzle", "bi-puzzle-fill", "bi-qr-code", "bi-qr-code-scan", "bi-question", "bi-question-circle", "bi-question-diamond", "bi-question-diamond-fill", "bi-question-circle-fill", "bi-question-lg", "bi-question-octagon", "bi-question-octagon-fill", "bi-question-square", "bi-question-square-fill", "bi-quora", "bi-quote", "bi-r-circle", "bi-r-circle-fill", "bi-r-square", "bi-r-square-fill", "bi-radar", "bi-radioactive", "bi-rainbow", "bi-receipt", "bi-receipt-cutoff", "bi-reception-0", "bi-reception-1", "bi-reception-2", "bi-reception-3", "bi-reception-4", "bi-record", "bi-record-btn", "bi-record-btn-fill", "bi-record-circle", "bi-record-circle-fill", "bi-record-fill", "bi-record2", "bi-record2-fill", "bi-recycle", "bi-reddit", "bi-regex", "bi-repeat", "bi-repeat-1", "bi-reply", "bi-reply-all", "bi-reply-all-fill", "bi-reply-fill", "bi-rewind", "bi-rewind-btn", "bi-rewind-btn-fill", "bi-rewind-circle", "bi-rewind-circle-fill", "bi-rewind-fill", "bi-robot", "bi-rocket", "bi-rocket-fill", "bi-rocket-takeoff", "bi-rocket-takeoff-fill", "bi-router", "bi-router-fill", "bi-rss", "bi-rss-fill", "bi-rulers", "bi-safe", "bi-safe-fill", "bi-safe2", "bi-safe2-fill", "bi-save", "bi-save-fill", "bi-save2", "bi-save2-fill", "bi-scissors", "bi-scooter", "bi-screwdriver", "bi-sd-card", "bi-sd-card-fill", "bi-search", "bi-search-heart", "bi-search-heart-fill", "bi-segmented-nav", "bi-send", "bi-send-arrow-down", "bi-send-arrow-down-fill", "bi-send-arrow-up", "bi-send-arrow-up-fill", "bi-send-check", "bi-send-check-fill", "bi-send-dash", "bi-send-dash-fill", "bi-send-exclamation", "bi-send-exclamation-fill", "bi-send-fill", "bi-send-plus", "bi-send-plus-fill", "bi-send-slash", "bi-send-slash-fill", "bi-send-x", "bi-send-x-fill", "bi-server", "bi-shadows", "bi-share", "bi-share-fill", "bi-shield", "bi-shield-check", "bi-shield-exclamation", "bi-shield-fill", "bi-shield-fill-check", "bi-shield-fill-exclamation", "bi-shield-fill-minus", "bi-shield-fill-plus", "bi-shield-fill-x", "bi-shield-lock", "bi-shield-lock-fill", "bi-shield-minus", "bi-shield-plus", "bi-shield-shaded", "bi-shield-slash", "bi-shield-slash-fill", "bi-shield-x", "bi-shift", "bi-shift-fill", "bi-shop", "bi-shop-window", "bi-shuffle", "bi-sign-dead-end", "bi-sign-dead-end-fill", "bi-sign-do-not-enter", "bi-sign-do-not-enter-fill", "bi-sign-intersection", "bi-sign-intersection-fill", "bi-sign-intersection-side", "bi-sign-intersection-side-fill", "bi-sign-intersection-t", "bi-sign-intersection-t-fill", "bi-sign-intersection-y", "bi-sign-intersection-y-fill", "bi-sign-merge-left", "bi-sign-merge-left-fill", "bi-sign-merge-right", "bi-sign-merge-right-fill", "bi-sign-no-left-turn", "bi-sign-no-left-turn-fill", "bi-sign-no-parking", "bi-sign-no-parking-fill", "bi-sign-no-right-turn", "bi-sign-no-right-turn-fill", "bi-sign-railroad", "bi-sign-railroad-fill", "bi-sign-stop", "bi-sign-stop-fill", "bi-sign-stop-lights", "bi-sign-stop-lights-fill", "bi-sign-turn-left", "bi-sign-turn-left-fill", "bi-sign-turn-right", "bi-sign-turn-right-fill", "bi-sign-turn-slight-left", "bi-sign-turn-slight-left-fill", "bi-sign-turn-slight-right", "bi-sign-turn-slight-right-fill", "bi-sign-yield", "bi-sign-yield-fill", "bi-signal", "bi-signpost", "bi-signpost-2", "bi-signpost-2-fill", "bi-signpost-fill", "bi-signpost-split", "bi-signpost-split-fill", "bi-sim", "bi-sim-fill", "bi-sim-slash", "bi-sim-slash-fill", "bi-sina-weibo", "bi-skip-backward", "bi-skip-backward-btn", "bi-skip-backward-btn-fill", "bi-skip-backward-circle", "bi-skip-backward-circle-fill", "bi-skip-backward-fill", "bi-skip-end", "bi-skip-end-btn", "bi-skip-end-btn-fill", "bi-skip-end-circle", "bi-skip-end-circle-fill", "bi-skip-end-fill", "bi-skip-forward", "bi-skip-forward-btn", "bi-skip-forward-btn-fill", "bi-skip-forward-circle", "bi-skip-forward-circle-fill", "bi-skip-forward-fill", "bi-skip-start", "bi-skip-start-btn", "bi-skip-start-btn-fill", "bi-skip-start-circle", "bi-skip-start-circle-fill", "bi-skip-start-fill", "bi-skype", "bi-slack", "bi-slash", "bi-slash-circle-fill", "bi-slash-lg", "bi-slash-square", "bi-slash-square-fill", "bi-sliders", "bi-sliders2", "bi-sliders2-vertical", "bi-smartwatch", "bi-snapchat", "bi-snow", "bi-snow2", "bi-snow3", "bi-sort-alpha-down", "bi-sort-alpha-down-alt", "bi-sort-alpha-up", "bi-sort-alpha-up-alt", "bi-sort-down", "bi-sort-down-alt", "bi-sort-numeric-down", "bi-sort-numeric-down-alt", "bi-sort-numeric-up", "bi-sort-numeric-up-alt", "bi-sort-up", "bi-sort-up-alt", "bi-soundwave", "bi-sourceforge", "bi-speaker", "bi-speaker-fill", "bi-speedometer", "bi-speedometer2", "bi-spellcheck", "bi-spotify", "bi-square", "bi-square-fill", "bi-square-half", "bi-stack", "bi-stack-overflow", "bi-star", "bi-star-fill", "bi-star-half", "bi-stars", "bi-steam", "bi-stickies", "bi-stickies-fill", "bi-sticky", "bi-sticky-fill", "bi-stop", "bi-stop-btn", "bi-stop-btn-fill", "bi-stop-circle", "bi-stop-circle-fill", "bi-stop-fill", "bi-stoplights", "bi-stoplights-fill", "bi-stopwatch", "bi-stopwatch-fill", "bi-strava", "bi-stripe", "bi-subscript", "bi-substack", "bi-subtract", "bi-suit-club", "bi-suit-club-fill", "bi-suit-diamond", "bi-suit-diamond-fill", "bi-suit-heart", "bi-suit-heart-fill", "bi-suit-spade", "bi-suit-spade-fill", "bi-suitcase", "bi-suitcase-fill", "bi-suitcase-lg", "bi-suitcase-lg-fill", "bi-suitcase2", "bi-suitcase2-fill", "bi-sun", "bi-sun-fill", "bi-sunglasses", "bi-sunrise", "bi-sunrise-fill", "bi-sunset", "bi-sunset-fill", "bi-superscript", "bi-symmetry-horizontal", "bi-symmetry-vertical", "bi-table", "bi-tablet", "bi-tablet-fill", "bi-tablet-landscape", "bi-tablet-landscape-fill", "bi-tag", "bi-tag-fill", "bi-tags", "bi-tags-fill", "bi-taxi-front", "bi-taxi-front-fill", "bi-telegram", "bi-telephone", "bi-telephone-fill", "bi-telephone-forward", "bi-telephone-forward-fill", "bi-telephone-inbound", "bi-telephone-inbound-fill", "bi-telephone-minus", "bi-telephone-minus-fill", "bi-telephone-outbound", "bi-telephone-outbound-fill", "bi-telephone-plus", "bi-telephone-plus-fill", "bi-telephone-x", "bi-telephone-x-fill", "bi-tencent-qq", "bi-terminal", "bi-terminal-dash", "bi-terminal-fill", "bi-terminal-plus", "bi-terminal-split", "bi-terminal-x", "bi-text-center", "bi-text-indent-left", "bi-text-indent-right", "bi-text-left", "bi-text-paragraph", "bi-text-right", "bi-text-wrap", "bi-textarea", "bi-textarea-resize", "bi-textarea-t", "bi-thermometer", "bi-thermometer-half", "bi-thermometer-high", "bi-thermometer-low", "bi-thermometer-snow", "bi-thermometer-sun", "bi-threads", "bi-threads-fill", "bi-three-dots", "bi-three-dots-vertical", "bi-thunderbolt", "bi-thunderbolt-fill", "bi-ticket", "bi-ticket-detailed", "bi-ticket-detailed-fill", "bi-ticket-fill", "bi-ticket-perforated", "bi-ticket-perforated-fill", "bi-tiktok", "bi-toggle-off", "bi-toggle-on", "bi-toggle2-off", "bi-toggle2-on", "bi-toggles", "bi-toggles2", "bi-tools", "bi-tornado", "bi-train-freight-front", "bi-train-freight-front-fill", "bi-train-front", "bi-train-front-fill", "bi-train-lightrail-front", "bi-train-lightrail-front-fill", "bi-translate", "bi-transparency", "bi-trash", "bi-trash-fill", "bi-trash2", "bi-trash2-fill", "bi-trash3", "bi-trash3-fill", "bi-tree", "bi-tree-fill", "bi-trello", "bi-triangle", "bi-triangle-fill", "bi-triangle-half", "bi-trophy", "bi-trophy-fill", "bi-tropical-storm", "bi-truck", "bi-truck-flatbed", "bi-truck-front", "bi-truck-front-fill", "bi-tsunami", "bi-tv", "bi-tv-fill", "bi-twitch", "bi-twitter", "bi-twitter-x", "bi-type", "bi-type-bold", "bi-type-h1", "bi-type-h2", "bi-type-h3", "bi-type-h4", "bi-type-h5", "bi-type-h6", "bi-type-italic", "bi-type-strikethrough", "bi-type-underline", "bi-ubuntu", "bi-ui-checks", "bi-ui-checks-grid", "bi-ui-radios", "bi-ui-radios-grid", "bi-umbrella", "bi-umbrella-fill", "bi-unindent", "bi-union", "bi-unity", "bi-universal-access", "bi-universal-access-circle", "bi-unlock", "bi-unlock-fill", "bi-upc", "bi-upc-scan", "bi-upload", "bi-usb", "bi-usb-c", "bi-usb-c-fill", "bi-usb-drive", "bi-usb-drive-fill", "bi-usb-fill", "bi-usb-micro", "bi-usb-micro-fill", "bi-usb-mini", "bi-usb-mini-fill", "bi-usb-plug", "bi-usb-plug-fill", "bi-usb-symbol", "bi-valentine", "bi-valentine2", "bi-vector-pen", "bi-view-list", "bi-view-stacked", "bi-vignette", "bi-vimeo", "bi-vinyl", "bi-vinyl-fill", "bi-virus", "bi-virus2", "bi-voicemail", "bi-volume-down", "bi-volume-down-fill", "bi-volume-mute", "bi-volume-mute-fill", "bi-volume-off", "bi-volume-off-fill", "bi-volume-up", "bi-volume-up-fill", "bi-vr", "bi-wallet", "bi-wallet-fill", "bi-wallet2", "bi-watch", "bi-water", "bi-webcam", "bi-webcam-fill", "bi-wechat", "bi-whatsapp", "bi-wifi", "bi-wifi-1", "bi-wifi-2", "bi-wifi-off", "bi-wikipedia", "bi-wind", "bi-window", "bi-window-dash", "bi-window-desktop", "bi-window-dock", "bi-window-fullscreen", "bi-window-plus", "bi-window-sidebar", "bi-window-split", "bi-window-stack", "bi-window-x", "bi-windows", "bi-wordpress", "bi-wrench", "bi-wrench-adjustable", "bi-wrench-adjustable-circle", "bi-wrench-adjustable-circle-fill", "bi-x", "bi-x-circle", "bi-x-circle-fill", "bi-x-diamond", "bi-x-diamond-fill", "bi-x-lg", "bi-x-octagon", "bi-x-octagon-fill", "bi-x-square", "bi-x-square-fill", "bi-xbox", "bi-yelp", "bi-yin-yang", "bi-youtube", "bi-zoom-in", "bi-zoom-out"];

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
    color;
    constructor(budget2, data) {
      super(budget2, data);
      this.icon = data.icon;
      this.name = data.name;
      this.color = data.color ?? "#000000";
    }
    createIcon() {
      return create("i", { class: this.icon });
    }
    createLink() {
      return create("a", { class: "text-primary" }, [this.createIcon(), " " + this.name]);
    }
    accentColor(amount = 0.05) {
      return blendColors("#ffffff", this.color, amount);
    }
    buildRow() {
      this.row.style.backgroundColor = this.accentColor();
      this.row.innerHTML = "";
      this.row.append(create("td", { colspan: 2 }, [this.createIcon(), " " + this.name]));
      this.row.insertCell().appendChild(create("div", { style: `height: 1em; border: 1px solid black; background-color: ${this.color}` }));
      const actions = this.row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      actions.appendChild(Buttons.Edit).addEventListener("click", () => this.edit());
      actions.appendChild(Buttons.Delete).addEventListener("click", () => this.delete());
      this.row.querySelectorAll("td")?.forEach((td) => td.style.background = "inherit");
      return this.row;
    }
    edit() {
      _Category.buildForm(this.row, this.budget, this);
    }
    save() {
      if (_Category.validateForm(this.row)) {
        const [iconSelect, nameInput, colorInput] = _Category.getFields(this.row);
        this.icon = iconSelect.value;
        this.name = nameInput.value;
        this.color = colorInput.value;
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
        name: this.name,
        color: this.color
      };
    }
    static buildForm(row, budget2, editTarget) {
      row.innerHTML = "";
      const group = row.appendChild(create("td", { colspan: 2 })).appendChild(create("div", { class: "input-group" }));
      const iconSelect = group.appendChild(create("select", { class: "form-select" }));
      iconSelect.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Icon"));
      for (const iconClass of bsIcons)
        iconSelect.options.add(new Option(iconClass, iconClass, false, iconClass === editTarget?.icon));
      iconSelect.addEventListener("change", this.validateForm.bind(this, row));
      const nameInput = group.appendChild(create("input", {
        class: "form-control",
        type: "text",
        placeholder: "Name"
      }));
      nameInput.addEventListener("input", this.validateForm.bind(this, row));
      Tooltips.create(nameInput, "bottom", `${this.Constraints.Name.MinLength} to ${this.Constraints.Name.MaxLength} characters`);
      const colorInput = row.insertCell().appendChild(create("input", {
        class: "form-control",
        type: "color",
        value: "#FFFFFF"
      }));
      colorInput.addEventListener("input", this.validateForm.bind(this, row));
      Tooltips.create(colorInput, "bottom", "Hexadecimal color in the format #FFFFFF");
      const actions = row.insertCell().appendChild(create("span", { class: "d-flex gap-2" }));
      if (editTarget) {
        actions.appendChild(Buttons.Save).addEventListener("click", () => editTarget.save());
        actions.appendChild(Buttons.Cancel).addEventListener("click", () => editTarget.buildRow());
      } else {
        actions.appendChild(Buttons.Add).addEventListener("click", (e) => {
          nameInput.value = nameInput.value.trim();
          if (this.validateForm(row)) {
            const uuid = crypto.randomUUID();
            budget2.categories.set(uuid, new this(budget2, {
              uuid,
              icon: iconSelect.value,
              name: nameInput.value,
              color: colorInput.value
            }));
            budget2.refreshAll();
            resetForm(row);
          }
        });
      }
      if (editTarget) {
        iconSelect.value = editTarget.icon;
        nameInput.value = editTarget.name;
        colorInput.value = editTarget.color;
      }
      row.querySelectorAll("td")?.forEach((td) => td.style.background = "inherit");
      return row;
    }
    static getFields(form) {
      return [
        form.cells[0].getElementsByTagName("select")[0],
        // iconSelect
        form.cells[0].getElementsByTagName("input")[0],
        // nameInput
        form.cells[1].getElementsByTagName("input")[0]
        // colorInput
      ];
    }
    static validateForm(form) {
      const [iconSelect, nameInput, colorInput] = this.getFields(form);
      const results = [];
      results.push([iconSelect, iconSelect.value !== ""]);
      results.push([nameInput, nameInput.value.trim().length >= _Category.Constraints.Name.MinLength && nameInput.value.trim().length <= _Category.Constraints.Name.MaxLength]);
      results.push([colorInput, isHexColor(colorInput.value)]);
      for (const [element, valid] of results) {
        element.classList.toggle("is-invalid", !valid);
        element.classList.toggle("is-valid", valid);
      }
      return results.every((result) => result[1]);
    }
    static generateSelectOptions(budget2, select) {
      select.innerHTML = "";
      select.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Select..."));
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
    buildRow() {
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
        actions.appendChild(Buttons.Cancel).addEventListener("click", () => editTarget.buildRow());
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
      select.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Select..."));
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
    buildRow() {
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
        actions.appendChild(Buttons.Cancel).addEventListener("click", () => editTarget.buildRow());
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
      select.options.add(create("option", { value: "", selected: "", disabled: "", hidden: "" }, "Select..."));
      for (const paymentMethod of budget2.paymentMethods.values())
        select.options.add(create("option", { value: paymentMethod.uuid }, paymentMethod.name));
    }
  };

  // src/public/ts/modal.ts
  var Modal = class {
    static root = document.body.appendChild(create("div", { class: "modal fade", tabindex: -1, "data-bs-backdrop": "static", "data-bs-keyboard": "false" }));
    static dialog = this.root.appendChild(create("div", { class: "modal-dialog modal-dialog-centered modal-dialog-scrollable" }));
    static content = this.dialog.appendChild(create("div", { class: "modal-content" }));
    static header = this.content.appendChild(create("div", { class: "modal-header" }));
    static body = this.content.appendChild(create("div", { class: "modal-body container-fluid" }));
    static footer = this.content.appendChild(create("div", { class: "modal-footer" }));
    static title = this.header.appendChild(create("h5", { class: "modal-title" }));
    static #closeButton = this.header.appendChild(create("button", { type: "button", class: "btn-close", "data-bs-dismiss": "modal", "aria-label": "Close" }));
    /* @ts-ignore */
    static #bsInstance = new bootstrap.Modal(this.root);
    static rebuild(title, dismissable, callback) {
      this.root = document.body.appendChild(create("div", { class: "modal fade", tabindex: -1, "data-bs-backdrop": dismissable || "static", "data-bs-keyboard": dismissable }));
      this.dialog = this.root.appendChild(create("div", { class: "modal-dialog modal-dialog-centered modal-dialog-scrollable" }));
      this.content = this.dialog.appendChild(create("div", { class: "modal-content" }));
      this.header = this.content.appendChild(create("div", { class: "modal-header" }));
      this.body = this.content.appendChild(create("div", { class: "modal-body container-fluid" }));
      this.footer = this.content.appendChild(create("div", { class: "modal-footer" }));
      this.title = this.header.appendChild(create("h5", { class: "modal-title" }, title));
      this.#closeButton = this.header.appendChild(create("button", { type: "button", class: "btn-close", "data-bs-dismiss": "modal", "aria-label": "Close" }));
      if (!dismissable) this.#closeButton.remove();
      this.#bsInstance.dispose();
      this.#bsInstance = new bootstrap.Modal(this.root);
      this.root.addEventListener("hidden.bs.modal", () => callback?.());
    }
    static show() {
      this.#bsInstance.show();
    }
    static hide() {
      this.#bsInstance.hide();
    }
    static toggle() {
      this.#bsInstance.toggle();
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
    payers;
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
      this.category_uuid = data.category_uuid ?? "";
      this.name = data.name ?? "";
      this.amount = data.amount ?? 0;
      this.payment_method_uuid = data.payment_method_uuid ?? "";
      this.billing_cycle = data.billing_cycle ?? [0, ""];
      this.payers = new Map(Object.entries(data.payers ?? {}));
    }
    amountFor(targetDays, targetPerson) {
      const originalDays = CYCLE_DAYS[this.billing_cycle[1]] * this.billing_cycle[0];
      const total = this.amount * targetDays / originalDays;
      const percentage = targetPerson ? this.payers.get(targetPerson.uuid) ?? 0 : 100;
      return Math.ceil(total * percentage) / 100;
    }
    createLink() {
      return create("a", { class: "text-primary" }, [Icons.Bidirectional, " " + this.name]);
    }
    buildRow() {
      this.row.style.backgroundColor = this.category?.accentColor() ?? "#ffffff";
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
      this.row.querySelectorAll("td")?.forEach((td) => td.style.background = "inherit");
      this.row.cells[0].classList.add("d-none", "d-lg-table-cell");
      this.row.cells[3].classList.add("d-none", "d-lg-table-cell");
      this.row.cells[4].classList.add("d-none", "d-lg-table-cell");
      return this.row;
    }
    edit() {
      Modal.rebuild("Edit Transaction", true);
      const updateCategoryColor = () => {
        const category = this.budget.categories.get(categorySelect.value);
        if (category) Modal.header.style.backgroundColor = category.accentColor(0.2);
      };
      const categorySelect = create("select", { class: "form-select" });
      categorySelect.addEventListener("change", () => validateForm() && updateCategoryColor());
      categorySelect.addEventListener("focusin", () => Category.generateSelectOptions(this.budget, categorySelect));
      Category.generateSelectOptions(this.budget, categorySelect);
      categorySelect.value = this.category_uuid;
      updateCategoryColor();
      const nameInput = create("input", { type: "text", class: "form-control", value: this.name });
      nameInput.addEventListener("input", () => validateForm());
      const amountInput = create("input", { type: "number", class: "form-control", value: this.amount, step: "0.01" });
      amountInput.addEventListener("input", () => validateForm());
      const paymentMethodSelect = create("select", { class: "form-select" });
      paymentMethodSelect.addEventListener("change", () => validateForm());
      paymentMethodSelect.addEventListener("focusin", () => PaymentMethod.generateSelectOptions(this.budget, paymentMethodSelect));
      PaymentMethod.generateSelectOptions(this.budget, paymentMethodSelect);
      paymentMethodSelect.value = this.payment_method_uuid;
      const cycleInput = create("input", { type: "number", class: "form-control", value: this.billing_cycle[0] });
      cycleInput.addEventListener("input", () => validateForm());
      const cycleSelect = create("select", { class: "form-select" });
      cycleSelect.addEventListener("change", () => validateForm());
      cycleSelect.options.add(new Option("Select...", "", true, false));
      cycleSelect.options.add(new Option("Day", "day" /* DAY */, false, this.billing_cycle[1] === "day" /* DAY */));
      cycleSelect.options.add(new Option("Week", "week" /* WEEK */, false, this.billing_cycle[1] === "week" /* WEEK */));
      cycleSelect.options.add(new Option("Month", "month" /* MONTH */, false, this.billing_cycle[1] === "month" /* MONTH */));
      cycleSelect.options.add(new Option("Year", "year" /* YEAR */, false, this.billing_cycle[1] === "year" /* YEAR */));
      const payerList = Modal.body.appendChild(create("ul", { class: "list-group" }));
      const addPayerListItem = (person, amount) => {
        const percentInput = create("input", { type: "number", class: "form-control", style: "width: 5em;", "data-person-uuid": person.uuid, value: this.payers.get(person.uuid) ?? 0 });
        percentInput.addEventListener("input", () => validateForm());
        const deleteButton = Buttons.Delete;
        deleteButton.addEventListener("click", () => deleteButton.closest("li")?.remove());
        payerList.appendChild(create("li", { class: "list-group-item d-flex justify-content-between align-items-center" }, [
          person.name,
          create("span", { class: "w-auto d-flex gap-2" }, [
            create("span", { class: "input-group w-auto" }, [
              percentInput,
              create("span", { class: "input-group-text" }, [Icons.Percent])
            ]),
            deleteButton
          ])
        ]));
      };
      for (const [uuid, amount] of this.payers) {
        const person = this.budget.people.get(uuid);
        if (!person) throw new Error("Person not found");
        addPayerListItem(person, amount);
      }
      const payerSelect = create("select", { class: "form-select" });
      Person.generateSelectOptions(this.budget, payerSelect);
      const validatePayerSelect = () => {
        const isInvalid = payerSelect.value === "" || [...payerList.querySelectorAll('input[type="number"]').values()].some((input) => input.getAttribute("data-person-uuid") === payerSelect.value);
        payerSelect.classList.toggle("is-invalid", isInvalid);
        if (isInvalid) payerSelect.focus();
        return !isInvalid;
      };
      payerSelect.addEventListener("change", () => validatePayerSelect());
      const payerAddButton = create("button", { class: "btn btn-primary" }, [Icons.Plus]);
      payerAddButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (validatePayerSelect()) {
          const person = this.budget.people.get(payerSelect.value);
          if (!person) throw new Error("Person not found");
          addPayerListItem(person, 0);
        }
      });
      Modal.body.appendChild(create("form", { class: "d-flex flex-column gap-2" }, [
        withFloatingLabel("Category", categorySelect),
        withFloatingLabel("Name", nameInput),
        withFloatingLabel("Amount", amountInput),
        withFloatingLabel("Payment Method", paymentMethodSelect),
        create("div", { class: "input-group" }, [
          withFloatingLabel("Cycle Count", cycleInput),
          withFloatingLabel("Cycle Type", cycleSelect)
        ]),
        create("h5", {}, ["Payers ", create("small", { class: "text-muted" }, "(Total must be 100%)")]),
        payerList,
        create("div", { class: "d-flex gap-2" }, [
          payerSelect,
          payerAddButton
        ])
      ]));
      const saveButton = Modal.footer.appendChild(create("button", { class: "btn btn-success" }, "Save"));
      saveButton.addEventListener("click", () => {
        if (validateForm()) {
          this.category_uuid = categorySelect.value;
          this.name = nameInput.value;
          this.amount = +amountInput.value;
          this.payment_method_uuid = paymentMethodSelect.value;
          this.billing_cycle = [+cycleInput.value, cycleSelect.value];
          this.payers.clear();
          for (const input of payerList.querySelectorAll('input[type="number"]').values())
            if (input.getAttribute("data-person-uuid"))
              this.payers.set(input.getAttribute("data-person-uuid"), +input["value"]);
          if (!this.budget.transactions.has(this.uuid))
            this.budget.transactions.set(this.uuid, this);
          Modal.hide();
          this.budget.refreshAll();
        }
      });
      Modal.show();
      function validateForm() {
        const results = [];
        results.push([categorySelect, categorySelect.value !== ""]);
        results.push([nameInput, nameInput.value.trim().length >= _Transaction.Constraints.Name.MinLength && nameInput.value.trim().length <= _Transaction.Constraints.Name.MaxLength]);
        results.push([amountInput, !isNaN(+amountInput.value) && +amountInput.value !== 0]);
        results.push([paymentMethodSelect, paymentMethodSelect.value !== ""]);
        results.push([cycleInput, +cycleInput.value >= _Transaction.Constraints.BillingCycle.Min]);
        results.push([cycleSelect, cycleSelect.value !== ""]);
        results.push([payerSelect, payerList.children.length > 0]);
        for (const input of payerList.querySelectorAll('input[type="number"]'))
          results.push([input, +input["value"] >= 0 && [...payerList.querySelectorAll('input[type="number"]').values()].reduce((acc, input2) => acc + +input2["value"] || 0, 0) === 100]);
        for (const [element, valid] of results) {
          element.classList.toggle("is-invalid", !valid);
          element.classList.toggle("border", !valid);
          element.classList.toggle("border-danger", !valid);
        }
        return results.every((result) => result[1]);
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
        billing_cycle: this.billing_cycle,
        payers: Object.fromEntries(this.payers)
      };
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
    transactionsAddButton;
    refreshTransactions;
    summaryPersonSelect;
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
          this.peopleTBody.append(person.buildRow());
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
          this.paymentMethodsTBody.append(paymentMethod.buildRow());
        this.paymentMethodsTBody.append(this.paymentMethodsForm);
      };
      this.categories = /* @__PURE__ */ new Map();
      this.categoriesTable = create("table", { class: "table table-hover" });
      this.categoriesTHead = this.categoriesTable.createTHead();
      this.categoriesTBody = this.categoriesTable.createTBody();
      this.categoriesTHead.appendChild(create("tr")).append(
        create("th", { scope: "col", colspan: 2 }, "Name"),
        create("th", { scope: "col" }, "Color"),
        create("th", { scope: "col", class: "fit" }, "Actions")
      );
      this.categoriesForm = create("tr");
      Category.buildForm(this.categoriesForm, this);
      this.refreshCategories = () => {
        this.categoriesTBody.innerHTML = "";
        for (const category of this.categories.values())
          this.categoriesTBody.append(category.buildRow());
        this.categoriesTBody.append(this.categoriesForm);
      };
      this.transactions = /* @__PURE__ */ new Map();
      this.transactionsTable = create("table", { class: "table table-hover" });
      this.transactionsTHead = this.transactionsTable.createTHead();
      this.transactionsTBody = this.transactionsTable.createTBody();
      this.transactionsTHead.appendChild(create("tr", { style: "white-space: nowrap" })).append(
        create("th", { scope: "col", class: "d-none d-lg-table-cell" }, "Category"),
        create("th", { scope: "col", class: "" }, "Name"),
        create("th", { scope: "col", class: "" }, "Amount"),
        create("th", { scope: "col", class: "d-none d-lg-table-cell" }, "Payment Method"),
        create("th", { scope: "col", class: "d-none d-lg-table-cell" }, "Billing Cycle"),
        create("th", { scope: "col", class: "fit" }, "Actions")
      );
      this.transactionsAddButton = create("button", { class: "btn btn-success" }, ["Add ", Icons.Plus]);
      this.transactionsAddButton.addEventListener("click", () => new Transaction(this, {}).edit());
      this.refreshTransactions = () => {
        this.transactionsTBody.innerHTML = "";
        for (const category of this.categories.values()) {
          const transactions = [...this.transactions.values()].filter((transaction) => transaction.category_uuid === category.uuid);
          if (transactions.length) {
            this.transactionsTBody.append(create("tr", {}, [
              create("th", { colspan: 6, class: "text-center", style: `background-color: ${category.accentColor(0.1)}` }, category.name)
            ]));
            for (const transaction of transactions)
              this.transactionsTBody.append(transaction.buildRow());
          }
        }
        const unknownCategoryTransactions = [...this.transactions.values()].filter((transaction) => !this.categories.has(transaction.category_uuid));
        if (unknownCategoryTransactions.length) {
          this.transactionsTBody.append(create("tr", {}, [
            create("th", { colspan: 6, class: "text-center bg-body-tertiary" }, "Unknown")
          ]));
          for (const transaction of unknownCategoryTransactions)
            this.transactionsTBody.append(transaction.buildRow());
        }
      };
      this.summaryPersonSelect = create("select", { class: "form-select w-auto" });
      this.summaryPersonSelect.addEventListener("change", () => this.refreshSummary());
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
      this.summaryIncomeChart = create("div", { class: "d-flex flex-column gap-2 my-3 justify-content-end" });
      this.summaryIncomeChartLegend = this.summaryIncomeChart.appendChild(create("div", { class: "d-flex justify-content-around align-items-center w-100 flex-wrap gap-1" }));
      this.summaryIncomeChartProgressBar = this.summaryIncomeChart.appendChild(create("div", { class: "progress-stacked", style: "height: 2em" }));
      this.summaryExpenseChart = create("div", { class: "d-flex flex-column gap-2 my-3 justify-content-end" });
      this.summaryExpenseChartLegend = this.summaryExpenseChart.appendChild(create("div", { class: "d-flex justify-content-around align-items-center w-100 flex-wrap gap-1" }));
      this.summaryExpenseChartProgressBar = this.summaryExpenseChart.appendChild(create("div", { class: "progress-stacked", style: "height: 2em" }));
      this.refreshSummary = () => {
        const previousPerson = this.summaryPersonSelect.value;
        this.summaryPersonSelect.innerHTML = "";
        this.summaryPersonSelect.options.add(new Option("All People", "", true, false));
        for (const person2 of this.people.values())
          this.summaryPersonSelect.options.add(new Option(person2.name, person2.uuid, false, person2.uuid === previousPerson));
        const person = this.people.get(this.summaryPersonSelect.value);
        const cycleDays = CYCLE_DAYS[this.summaryCycleSelect.value] * +this.summaryCycleInput.value;
        this.summaryCumulativeTBody.innerHTML = "";
        this.summaryIncomeChartLegend.innerHTML = "";
        this.summaryIncomeChartProgressBar.innerHTML = "";
        this.summaryExpenseChartLegend.innerHTML = "";
        this.summaryExpenseChartProgressBar.innerHTML = "";
        const totalIncome = [...this.transactions.values()].filter((transaction) => transaction.amountFor(cycleDays, person) > 0).reduce((total, transaction) => total + transaction.amountFor(cycleDays, person), 0);
        const totalExpense = [...this.transactions.values()].filter((transaction) => transaction.amountFor(cycleDays, person) < 0).reduce((total, transaction) => total + transaction.amountFor(cycleDays, person), 0);
        const cumulativeSubtotals = [...this.calculateSubtotals(cycleDays, person).entries()].sort((a, b) => b[1] - a[1]);
        const incomeSubtotals = [...this.calculateSubtotals(cycleDays, person, (transaction) => transaction.amountFor(cycleDays, person) <= 0).entries()].sort((a, b) => b[1] - a[1]);
        const expenseSubtotals = [...this.calculateSubtotals(cycleDays, person, (transaction) => transaction.amountFor(cycleDays, person) >= 0).entries()].sort((a, b) => a[1] - b[1]);
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
            this.summaryIncomeChartLegend.append(create("span", {}, [create("span", { style: `color: ${category.color} !important` }, [Icons.PieChart]), ` ${category.name} (${formatMoney(subtotal)})`]));
            this.summaryIncomeChartProgressBar.append(create(
              "div",
              { class: "progress-bar bg-success", style: `width: ${percent}%; background-color: ${category.color} !important` }
              /*, category.name*/
            ));
          }
        }
        if (unknownSubtotal !== 0) {
          const percent = Math.abs(unknownSubtotal) / (Math.abs(totalIncome) || 1) * 100;
          this.summaryIncomeChartLegend.append(create("span", {}, [create("span", {}, [Icons.PieChart]), ` Unknown (${formatMoney(unknownSubtotal)})`]));
          this.summaryIncomeChartProgressBar.append(create(
            "div",
            { class: "progress-bar bg-dark", style: `width: ${percent}%` }
            /*, 'Unknown'*/
          ));
        }
        var unknownSubtotal = 0;
        for (const [categoryUUID, subtotal] of expenseSubtotals) {
          const category = this.categories.get(categoryUUID);
          if (category === void 0) unknownSubtotal += subtotal;
          else {
            if (subtotal === 0) continue;
            const percent = Math.abs(subtotal) / (Math.abs(totalExpense) || 1) * 100;
            this.summaryExpenseChartLegend.append(create("span", {}, [create("span", { style: `color: ${category.color} !important` }, [Icons.PieChart]), ` ${category.name} (${formatMoney(subtotal)})`]));
            this.summaryExpenseChartProgressBar.append(create(
              "div",
              { class: "progress-bar bg-danger", style: `width: ${percent}%; background-color: ${category.color} !important` }
              /*, category.name*/
            ));
          }
        }
        if (unknownSubtotal !== 0) {
          const percent = Math.abs(unknownSubtotal) / (Math.abs(totalExpense) || 1) * 100;
          this.summaryExpenseChartLegend.append(create("span", {}, [create("span", {}, [Icons.PieChart]), ` Unknown (${formatMoney(unknownSubtotal)})`]));
          this.summaryExpenseChartProgressBar.append(create(
            "div",
            { class: "progress-bar bg-dark", style: `width: ${percent}%` }
            /*, 'Unknown'*/
          ));
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
          categories: [...this.categories.values()].map((category) => category.toJson()),
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
              if (!confirm("Are you sure you want to upload this file? Unsaved changes will be lost.")) return;
              const data = JSON.parse(reader.result);
              this.people.clear();
              this.paymentMethods.clear();
              this.categories.clear();
              this.transactions.clear();
              if (data.people && Array.isArray(data.people))
                for (const person of data.people)
                  this.people.set(person.uuid, new Person(this, person));
              if (data.paymentMethods && Array.isArray(data.paymentMethods))
                for (const paymentMethod of data.paymentMethods)
                  this.paymentMethods.set(paymentMethod.uuid, new PaymentMethod(this, paymentMethod));
              if (data.categories && Array.isArray(data.categories))
                for (const category of data.categories)
                  this.categories.set(category.uuid, new Category(this, category));
              if (data.transactions && Array.isArray(data.transactions))
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
        create("div", { class: "d-flex flex-wrap gap-5" }, [
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
        create("a", { href: "https://icons.getbootstrap.com/#icons", target: "_blank" }, "See the full list of icons"),
        create("h2", { class: "fit mt-5" }, [Icons.Bidirectional, " Transactions ", this.transactionsAddButton]),
        this.transactionsTable,
        create("div", { class: "d-flex gap-3 mt-5" }, [
          create("h2", { style: "white-space: nowrap" }, [Icons.BarChart, " Summary"]),
          create("div", { class: "input-group w-auto" }, [
            this.summaryCycleInput,
            this.summaryCycleSelect
          ]),
          this.summaryPersonSelect
        ]),
        this.summaryCumulativeTable,
        // create('div', { class: 'd-flex gap-5 mt-3' }, [
        //    create('h3', { class: 'flex-grow-1 m-0 text-center' }, 'Income'),
        //    create('h3', { class: 'flex-grow-1 m-0 text-center' }, 'Expenses')
        // ]),
        // create('div', { class: 'd-flex gap-5 mb-3' }, [
        //    this.summaryIncomeChart,
        //    this.summaryExpenseChart,
        // ]),
        create("h3", { class: "fit mt-5" }, "Income"),
        this.summaryIncomeChart,
        create("h3", { class: "fit mt-5" }, "Expenses"),
        this.summaryExpenseChart,
        create("div", { class: "d-flex gap-2 justify-content-center w-100 my-5" }, [
          this.downloadButton,
          this.uploadButton
        ])
      );
    }
    calculateSubtotals(cycleDays, person, excludeFilter) {
      return new Map(
        [...(/* @__PURE__ */ new Set([
          ...[...this.categories.values()].map((category) => category.uuid),
          ...[...this.transactions.values()].map((transaction) => transaction.category_uuid)
        ])).values()].map((categoryUUID) => [
          categoryUUID,
          [...this.transactions.values()].filter((transaction) => transaction.category_uuid === categoryUUID).reduce((total, transaction) => excludeFilter?.(transaction) ? total : total + transaction.amountFor(cycleDays, person), 0)
        ])
      );
    }
  };

  // src/public/ts/index.ts
  var budget = new Budget();
  var personMe = new Person(budget, { uuid: crypto.randomUUID(), name: "Me" });
  var personOther = new Person(budget, { uuid: crypto.randomUUID(), name: "Someone else" });
  var paymentMethodCash = new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: "Cash", owner_uuid: personMe.uuid });
  var paymentMethodBankAccount = new PaymentMethod(budget, { uuid: crypto.randomUUID(), name: "Bank Account", owner_uuid: personMe.uuid });
  var categorySalaries = new Category(budget, { uuid: crypto.randomUUID(), icon: Icons.CashStack.className, name: "Salaries", color: "#00ff00" });
  var categoryBills = new Category(budget, { uuid: crypto.randomUUID(), icon: Icons.Card.className, name: "Bills", color: "#ff0000" });
  var transactionSalary = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: categorySalaries.uuid, name: "Salary", amount: 5432.1, payment_method_uuid: paymentMethodBankAccount.uuid, billing_cycle: [1, "month" /* MONTH */], payers: { [personMe.uuid]: 100 } });
  var transactionRent = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: categoryBills.uuid, name: "Rent", amount: -1234.56, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, "month" /* MONTH */], payers: { [personMe.uuid]: 50, [personOther.uuid]: 50 } });
  var transactionUnknownIncome = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: "...", name: "Misc (Unknown)", amount: 1500, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, "month" /* MONTH */], payers: { [personMe.uuid]: 100 } });
  var transactionUnknownExpense = new Transaction(budget, { uuid: crypto.randomUUID(), category_uuid: "...", name: "Misc (Unknown)", amount: -150, payment_method_uuid: paymentMethodCash.uuid, billing_cycle: [1, "month" /* MONTH */], payers: { [personOther.uuid]: 100 } });
  budget.people.set(personMe.uuid, personMe);
  budget.people.set(personOther.uuid, personOther);
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
