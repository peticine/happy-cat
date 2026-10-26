/**
 * Free-sample address form. Callers pass pageSource, optional copy, and getLead.
 * The checkbox starts unticked. Picky eater is sent only when that box is ticked.
 * Does not fire lead pixels.
 */
(function () {
  const ADDRESS_MAX = 1000;
  const DEFAULT_COPY = {
    want: "Would you like to try a free sample treat for your cat?",
    picky: "Tick this if your cat is a picky eater",
    addressLabel: "Address",
    addressPlaceholder: "House, street, city, PIN",
    note: "We'll only use this to send your sample.",
    submit: "Submit",
    saving: "Saving…",
    confirm: "Saved. We'll send your sample to this address.",
    addressRequired: "Enter an address so we can send the sample.",
    addressTooLong: "That address is too long.",
    preview: "This preview doesn't save a sample.",
    unmatched: "We couldn't match your request. Please try again in a moment.",
    saveFailed: "We couldn't save your address. Please try again.",
  };

  function field(form, name) {
    return form.querySelector(`[data-sample-${name}]`);
  }

  function showMessage(node, text) {
    if (!node) return;
    if (!text) {
      node.hidden = true;
      node.textContent = "";
      return;
    }
    node.hidden = false;
    node.textContent = text;
  }

  function copyFrom(options) {
    const custom = options && options.copy && typeof options.copy === "object" ? options.copy : {};
    const copy = Object.assign({}, DEFAULT_COPY);
    Object.keys(DEFAULT_COPY).forEach((key) => {
      if (typeof custom[key] === "string" && custom[key].trim()) copy[key] = custom[key];
    });
    return copy;
  }

  function pageSourceValue(value) {
    const source = String(value || "").trim();
    return /^[a-z0-9_-]{1,64}$/i.test(source) ? source : "";
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderForm(copy) {
    const form = document.createElement("form");
    form.className = "sample-opt-in";
    form.noValidate = true;
    form.setAttribute("data-sample-opt-in", "");

    const wantBox = document.createElement("input");
    wantBox.type = "checkbox";
    wantBox.setAttribute("data-sample-want", "");
    const want = element("label", "sample-opt-in-choice");
    want.append(wantBox, element("span", "", copy.want));

    const more = element("div", "sample-opt-in-more");
    more.setAttribute("data-sample-more", "");
    more.hidden = true;

    const pickyBox = document.createElement("input");
    pickyBox.type = "checkbox";
    pickyBox.setAttribute("data-sample-picky", "");
    const picky = element("label", "sample-opt-in-choice");
    picky.append(pickyBox, element("span", "", copy.picky));

    const address = document.createElement("textarea");
    address.setAttribute("data-sample-address", "");
    address.rows = 3;
    address.maxLength = ADDRESS_MAX;
    address.autocomplete = "street-address";
    address.placeholder = copy.addressPlaceholder;
    const addressLabel = element("label", "sample-opt-in-label");
    addressLabel.append(document.createTextNode(copy.addressLabel), address);

    const button = element("button", "btn btn-block btn-get-started", copy.submit);
    button.type = "submit";
    button.setAttribute("data-sample-submit", "");

    const error = element("p", "flow-error");
    error.setAttribute("data-sample-error", "");
    error.hidden = true;

    const confirm = element("p", "sample-opt-in-confirm");
    confirm.setAttribute("data-sample-confirm", "");
    confirm.hidden = true;
    confirm.setAttribute("role", "status");

    more.append(
      picky,
      addressLabel,
      element("p", "sample-opt-in-note", copy.note),
      button,
      error,
      confirm
    );
    form.append(want, more);
    return form;
  }

  function resetSampleOptIn(root) {
    const scope = root && root.querySelector ? root : document;
    scope.querySelectorAll("[data-sample-opt-in]").forEach((form) => {
      form.reset();
      const more = field(form, "more");
      if (more) more.hidden = true;
      showMessage(field(form, "error"), "");
      showMessage(field(form, "confirm"), "");
      const button = field(form, "submit");
      const copy = form._sampleCopy || DEFAULT_COPY;
      if (button) {
        button.disabled = false;
        button.textContent = copy.submit;
      }
    });
  }

  async function postSample(body, saveFailed) {
    let response;
    try {
      response = await fetch("/api/sample-opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error(saveFailed);
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(typeof data.error === "string" && data.error ? data.error : saveFailed);
    }
    return data;
  }

  function mountSampleOptIn(root, options) {
    const mount = root && root.querySelector ? root : null;
    if (!mount || mount.dataset.sampleBound === "1") return;
    mount.dataset.sampleBound = "1";

    const copy = copyFrom(options);
    const pageSource = pageSourceValue(options && options.pageSource);
    const form = renderForm(copy);
    form._sampleCopy = copy;
    mount.replaceChildren(form);

    const want = field(form, "want");
    const more = field(form, "more");
    const picky = field(form, "picky");
    const address = field(form, "address");
    const error = field(form, "error");
    const confirm = field(form, "confirm");
    const button = field(form, "submit");

    want?.addEventListener("change", () => {
      if (!more || !want) return;
      more.hidden = !want.checked;
      if (!want.checked) showMessage(error, "");
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!want?.checked) return;

      showMessage(confirm, "");
      const value = String(address?.value || "").trim();
      if (!value) {
        showMessage(error, copy.addressRequired);
        address?.focus();
        return;
      }
      if (value.length > ADDRESS_MAX) {
        showMessage(error, copy.addressTooLong);
        address?.focus();
        return;
      }
      if (options && options.preview) {
        showMessage(error, copy.preview);
        return;
      }

      if (button) {
        button.disabled = true;
        button.textContent = copy.saving;
      }
      showMessage(error, "");

      try {
        const lead = options && options.getLead ? await options.getLead() : null;
        const leadId = lead && lead.lead_id;
        const caseId = lead && lead.case_id;
        if (!leadId || !caseId) {
          showMessage(error, copy.unmatched);
          return;
        }
        const body = {
          lead_id: leadId,
          case_id: caseId,
          address: value,
        };
        if (picky && picky.checked) body.picky_eater = true;
        if (pageSource) body.page_source = pageSource;
        await postSample(body, copy.saveFailed);
        showMessage(confirm, copy.confirm);
      } catch (err) {
        showMessage(error, err && err.message ? err.message : copy.saveFailed);
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = copy.submit;
        }
      }
    });
  }

  window.mountSampleOptIn = mountSampleOptIn;
  window.resetSampleOptIn = resetSampleOptIn;
})();
