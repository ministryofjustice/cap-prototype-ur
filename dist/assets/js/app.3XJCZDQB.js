(() => {
  // node_modules/govuk-frontend/dist/govuk/common/index.mjs
  function getBreakpoint(name) {
    const property = `--govuk-breakpoint-${name}`;
    const value = window.getComputedStyle(document.documentElement).getPropertyValue(property);
    return {
      property,
      value: value || void 0
    };
  }
  function setFocus($element, options = {}) {
    var _options$onBeforeFocu;
    const isFocusable = $element.getAttribute("tabindex");
    if (!isFocusable) {
      $element.setAttribute("tabindex", "-1");
    }
    function onFocus() {
      $element.addEventListener("blur", onBlur, {
        once: true
      });
    }
    function onBlur() {
      var _options$onBlur;
      (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
      if (!isFocusable) {
        $element.removeAttribute("tabindex");
      }
    }
    $element.addEventListener("focus", onFocus, {
      once: true
    });
    (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
    $element.focus();
  }
  function isInitialised($root, moduleName) {
    return $root instanceof HTMLElement && $root.hasAttribute(`data-${moduleName}-init`);
  }
  function isSupported($scope = document.body) {
    if (!$scope) {
      return false;
    }
    return $scope.classList.contains("govuk-frontend-supported");
  }
  function isArray(option) {
    return Array.isArray(option);
  }
  function isObject(option) {
    return !!option && typeof option === "object" && !isArray(option);
  }
  function isScope($scope) {
    return !!$scope && ($scope instanceof Element || $scope instanceof Document);
  }
  function formatErrorMessage(Component2, message) {
    return `${Component2.moduleName}: ${message}`;
  }

  // node_modules/govuk-frontend/dist/govuk/errors/index.mjs
  var GOVUKFrontendError = class extends Error {
    constructor(...args) {
      super(...args);
      this.name = "GOVUKFrontendError";
    }
  };
  var SupportError = class extends GOVUKFrontendError {
    /**
     * Checks if GOV.UK Frontend is supported on this page
     *
     * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
     */
    constructor($scope = document.body) {
      const supportMessage = "noModule" in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : "GOV.UK Frontend is not supported in this browser";
      super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
      this.name = "SupportError";
    }
  };
  var ConfigError = class extends GOVUKFrontendError {
    constructor(...args) {
      super(...args);
      this.name = "ConfigError";
    }
  };
  var ElementError = class extends GOVUKFrontendError {
    constructor(messageOrOptions) {
      let message = typeof messageOrOptions === "string" ? messageOrOptions : "";
      if (isObject(messageOrOptions)) {
        const {
          component,
          identifier,
          element,
          expectedType
        } = messageOrOptions;
        message = identifier;
        message += element ? ` is not of type ${expectedType != null ? expectedType : "HTMLElement"}` : " not found";
        if (component) {
          message = formatErrorMessage(component, message);
        }
      }
      super(message);
      this.name = "ElementError";
    }
  };
  var InitError = class extends GOVUKFrontendError {
    constructor(componentOrMessage) {
      const message = typeof componentOrMessage === "string" ? componentOrMessage : formatErrorMessage(componentOrMessage, `Root element (\`$root\`) already initialised`);
      super(message);
      this.name = "InitError";
    }
  };

  // node_modules/govuk-frontend/dist/govuk/component.mjs
  var Component = class {
    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {RootElementType} - the root element of component
     */
    get $root() {
      return this._$root;
    }
    constructor($root) {
      this._$root = void 0;
      const childConstructor = this.constructor;
      if (typeof childConstructor.moduleName !== "string") {
        throw new InitError(`\`moduleName\` not defined in component`);
      }
      if (!($root instanceof childConstructor.elementType)) {
        throw new ElementError({
          element: $root,
          component: childConstructor,
          identifier: "Root element (`$root`)",
          expectedType: childConstructor.elementType.name
        });
      } else {
        this._$root = $root;
      }
      childConstructor.checkSupport();
      this.checkInitialised();
      const moduleName = childConstructor.moduleName;
      this.$root.setAttribute(`data-${moduleName}-init`, "");
    }
    checkInitialised() {
      const constructor = this.constructor;
      const moduleName = constructor.moduleName;
      if (moduleName && isInitialised(this.$root, moduleName)) {
        throw new InitError(constructor);
      }
    }
    static checkSupport() {
      if (!isSupported()) {
        throw new SupportError();
      }
    }
  };
  Component.elementType = HTMLElement;

  // node_modules/govuk-frontend/dist/govuk/common/configuration.mjs
  var configOverride = Symbol.for("configOverride");
  var ConfigurableComponent = class extends Component {
    [configOverride](param) {
      return {};
    }
    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {ConfigurationType} - the root element of component
     */
    get config() {
      return this._config;
    }
    constructor($root, config) {
      super($root);
      this._config = void 0;
      const childConstructor = this.constructor;
      if (!isObject(childConstructor.defaults)) {
        throw new ConfigError(formatErrorMessage(childConstructor, "Config passed as parameter into constructor but no defaults defined"));
      }
      const datasetConfig = normaliseDataset(childConstructor, this._$root.dataset);
      this._config = mergeConfigs(childConstructor.defaults, config != null ? config : {}, this[configOverride](datasetConfig), datasetConfig);
    }
  };
  function normaliseString(value, property) {
    const trimmedValue = value ? value.trim() : "";
    let output;
    let outputType = property == null ? void 0 : property.type;
    if (!outputType) {
      if (["true", "false"].includes(trimmedValue)) {
        outputType = "boolean";
      }
      if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
        outputType = "number";
      }
    }
    switch (outputType) {
      case "boolean":
        output = trimmedValue === "true";
        break;
      case "number":
        output = Number(trimmedValue);
        break;
      default:
        output = value;
    }
    return output;
  }
  function normaliseDataset(Component2, dataset) {
    if (!isObject(Component2.schema)) {
      throw new ConfigError(formatErrorMessage(Component2, "Config passed as parameter into constructor but no schema defined"));
    }
    const out = {};
    const entries = Object.entries(Component2.schema.properties);
    for (const entry of entries) {
      const [namespace, property] = entry;
      const field = namespace.toString();
      if (field in dataset) {
        out[field] = normaliseString(dataset[field], property);
      }
      if ((property == null ? void 0 : property.type) === "object") {
        out[field] = extractConfigByNamespace(Component2.schema, dataset, namespace);
      }
    }
    return out;
  }
  function normaliseOptions(scopeOrOptions) {
    let $scope = document;
    let onError;
    if (isObject(scopeOrOptions)) {
      const options = scopeOrOptions;
      if (isScope(options.scope) || options.scope === null) {
        $scope = options.scope;
      }
      if (typeof options.onError === "function") {
        onError = options.onError;
      }
    }
    if (isScope(scopeOrOptions)) {
      $scope = scopeOrOptions;
    } else if (scopeOrOptions === null) {
      $scope = null;
    } else if (typeof scopeOrOptions === "function") {
      onError = scopeOrOptions;
    }
    return {
      scope: $scope,
      onError
    };
  }
  function mergeConfigs(...configObjects) {
    const formattedConfigObject = {};
    for (const configObject of configObjects) {
      for (const key of Object.keys(configObject)) {
        const option = formattedConfigObject[key];
        const override = configObject[key];
        if (isObject(option) && isObject(override)) {
          formattedConfigObject[key] = mergeConfigs(option, override);
        } else {
          formattedConfigObject[key] = override;
        }
      }
    }
    return formattedConfigObject;
  }
  function extractConfigByNamespace(schema, dataset, namespace) {
    const property = schema.properties[namespace];
    if ((property == null ? void 0 : property.type) !== "object") {
      return;
    }
    const newObject = {
      [namespace]: {}
    };
    for (const [key, value] of Object.entries(dataset)) {
      let current = newObject;
      const keyParts = key.split(".");
      for (const [index, name] of keyParts.entries()) {
        if (isObject(current)) {
          if (index < keyParts.length - 1) {
            if (!isObject(current[name])) {
              current[name] = {};
            }
            current = current[name];
          } else if (key !== namespace) {
            current[name] = normaliseString(value);
          }
        }
      }
    }
    return newObject[namespace];
  }

  // node_modules/govuk-frontend/dist/govuk/i18n.mjs
  var I18n = class {
    constructor(translations = {}, config = {}) {
      var _config$locale;
      this.translations = void 0;
      this.locale = void 0;
      this.translations = translations;
      this.locale = (_config$locale = config.locale) != null ? _config$locale : document.documentElement.lang || "en";
    }
    t(lookupKey, options) {
      if (!lookupKey) {
        throw new Error("i18n: lookup key missing");
      }
      let translation = this.translations[lookupKey];
      if (typeof (options == null ? void 0 : options.count) === "number" && isObject(translation)) {
        const translationPluralForm = translation[this.getPluralSuffix(lookupKey, options.count)];
        if (translationPluralForm) {
          translation = translationPluralForm;
        }
      }
      if (typeof translation === "string") {
        if (translation.match(/%{(.\S+)}/)) {
          if (!options) {
            throw new Error("i18n: cannot replace placeholders in string if no option data provided");
          }
          return this.replacePlaceholders(translation, options);
        }
        return translation;
      }
      return lookupKey;
    }
    replacePlaceholders(translationString, options) {
      const formatter = Intl.NumberFormat.supportedLocalesOf(this.locale).length ? new Intl.NumberFormat(this.locale) : void 0;
      return translationString.replace(/%{(.\S+)}/g, function(placeholderWithBraces, placeholderKey) {
        if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
          const placeholderValue = options[placeholderKey];
          if (placeholderValue === false || typeof placeholderValue !== "number" && typeof placeholderValue !== "string") {
            return "";
          }
          if (typeof placeholderValue === "number") {
            return formatter ? formatter.format(placeholderValue) : `${placeholderValue}`;
          }
          return placeholderValue;
        }
        throw new Error(`i18n: no data found to replace ${placeholderWithBraces} placeholder in string`);
      });
    }
    hasIntlPluralRulesSupport() {
      return Boolean("PluralRules" in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length);
    }
    getPluralSuffix(lookupKey, count) {
      count = Number(count);
      if (!isFinite(count)) {
        return "other";
      }
      const translation = this.translations[lookupKey];
      const preferredForm = this.hasIntlPluralRulesSupport() ? new Intl.PluralRules(this.locale).select(count) : "other";
      if (isObject(translation)) {
        if (preferredForm in translation) {
          return preferredForm;
        } else if ("other" in translation) {
          console.warn(`i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`);
          return "other";
        }
      }
      throw new Error(`i18n: Plural form ".other" is required for "${this.locale}" locale`);
    }
  };

  // node_modules/govuk-frontend/dist/govuk/components/accordion/accordion.mjs
  var Accordion = class _Accordion extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for accordion
     * @param {AccordionConfig} [config] - Accordion config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.i18n = void 0;
      this.controlsClass = "govuk-accordion__controls";
      this.showAllClass = "govuk-accordion__show-all";
      this.showAllTextClass = "govuk-accordion__show-all-text";
      this.sectionClass = "govuk-accordion__section";
      this.sectionExpandedClass = "govuk-accordion__section--expanded";
      this.sectionButtonClass = "govuk-accordion__section-button";
      this.sectionHeaderClass = "govuk-accordion__section-header";
      this.sectionHeadingClass = "govuk-accordion__section-heading";
      this.sectionHeadingDividerClass = "govuk-accordion__section-heading-divider";
      this.sectionHeadingTextClass = "govuk-accordion__section-heading-text";
      this.sectionHeadingTextFocusClass = "govuk-accordion__section-heading-text-focus";
      this.sectionShowHideToggleClass = "govuk-accordion__section-toggle";
      this.sectionShowHideToggleFocusClass = "govuk-accordion__section-toggle-focus";
      this.sectionShowHideTextClass = "govuk-accordion__section-toggle-text";
      this.upChevronIconClass = "govuk-accordion-nav__chevron";
      this.downChevronIconClass = "govuk-accordion-nav__chevron--down";
      this.sectionSummaryClass = "govuk-accordion__section-summary";
      this.sectionSummaryFocusClass = "govuk-accordion__section-summary-focus";
      this.sectionContentClass = "govuk-accordion__section-content";
      this.$sections = void 0;
      this.$showAllButton = null;
      this.$showAllIcon = null;
      this.$showAllText = null;
      this.i18n = new I18n(this.config.i18n);
      const $sections = this.$root.querySelectorAll(`.${this.sectionClass}`);
      if (!$sections.length) {
        throw new ElementError({
          component: _Accordion,
          identifier: `Sections (\`<div class="${this.sectionClass}">\`)`
        });
      }
      this.$sections = $sections;
      this.initControls();
      this.initSectionHeaders();
      this.updateShowAllButton(this.areAllSectionsOpen());
    }
    initControls() {
      this.$showAllButton = document.createElement("button");
      this.$showAllButton.setAttribute("type", "button");
      this.$showAllButton.setAttribute("class", this.showAllClass);
      this.$showAllButton.setAttribute("aria-expanded", "false");
      this.$showAllIcon = document.createElement("span");
      this.$showAllIcon.classList.add(this.upChevronIconClass);
      this.$showAllButton.appendChild(this.$showAllIcon);
      const $accordionControls = document.createElement("div");
      $accordionControls.setAttribute("class", this.controlsClass);
      $accordionControls.appendChild(this.$showAllButton);
      this.$root.insertBefore($accordionControls, this.$root.firstChild);
      this.$showAllText = document.createElement("span");
      this.$showAllText.classList.add(this.showAllTextClass);
      this.$showAllButton.appendChild(this.$showAllText);
      this.$showAllButton.addEventListener("click", () => this.onShowOrHideAllToggle());
      if ("onbeforematch" in document) {
        document.addEventListener("beforematch", (event) => this.onBeforeMatch(event));
      }
    }
    initSectionHeaders() {
      this.$sections.forEach(($section, i) => {
        const $header = $section.querySelector(`.${this.sectionHeaderClass}`);
        if (!$header) {
          throw new ElementError({
            component: _Accordion,
            identifier: `Section headers (\`<div class="${this.sectionHeaderClass}">\`)`
          });
        }
        this.constructHeaderMarkup($header, i);
        this.setExpanded(this.isExpanded($section), $section);
        $header.addEventListener("click", () => this.onSectionToggle($section));
        this.setInitialState($section);
      });
    }
    constructHeaderMarkup($header, index) {
      const $span = $header.querySelector(`.${this.sectionButtonClass}`);
      const $heading = $header.querySelector(`.${this.sectionHeadingClass}`);
      const $summary = $header.querySelector(`.${this.sectionSummaryClass}`);
      if (!$heading) {
        throw new ElementError({
          component: _Accordion,
          identifier: `Section heading (\`.${this.sectionHeadingClass}\`)`
        });
      }
      if (!$span) {
        throw new ElementError({
          component: _Accordion,
          identifier: `Section button placeholder (\`<span class="${this.sectionButtonClass}">\`)`
        });
      }
      const $button = document.createElement("button");
      $button.setAttribute("type", "button");
      $button.setAttribute("aria-controls", `${this.$root.id}-content-${index + 1}`);
      for (const attr of Array.from($span.attributes)) {
        if (attr.name !== "id") {
          $button.setAttribute(attr.name, attr.value);
        }
      }
      const $headingText = document.createElement("span");
      $headingText.classList.add(this.sectionHeadingTextClass);
      $headingText.id = $span.id;
      const $headingTextFocus = document.createElement("span");
      $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
      $headingText.appendChild($headingTextFocus);
      Array.from($span.childNodes).forEach(($child) => $headingTextFocus.appendChild($child));
      const $showHideToggle = document.createElement("span");
      $showHideToggle.classList.add(this.sectionShowHideToggleClass);
      $showHideToggle.setAttribute("data-nosnippet", "");
      const $showHideToggleFocus = document.createElement("span");
      $showHideToggleFocus.classList.add(this.sectionShowHideToggleFocusClass);
      $showHideToggle.appendChild($showHideToggleFocus);
      const $showHideText = document.createElement("span");
      const $showHideIcon = document.createElement("span");
      $showHideIcon.classList.add(this.upChevronIconClass);
      $showHideToggleFocus.appendChild($showHideIcon);
      $showHideText.classList.add(this.sectionShowHideTextClass);
      $showHideToggleFocus.appendChild($showHideText);
      $button.appendChild($headingText);
      $button.appendChild(this.getButtonPunctuationEl());
      if ($summary) {
        const $summarySpan = document.createElement("span");
        const $summarySpanFocus = document.createElement("span");
        $summarySpanFocus.classList.add(this.sectionSummaryFocusClass);
        $summarySpan.appendChild($summarySpanFocus);
        for (const attr of Array.from($summary.attributes)) {
          $summarySpan.setAttribute(attr.name, attr.value);
        }
        Array.from($summary.childNodes).forEach(($child) => $summarySpanFocus.appendChild($child));
        $summary.remove();
        $button.appendChild($summarySpan);
        $button.appendChild(this.getButtonPunctuationEl());
      }
      $button.appendChild($showHideToggle);
      $heading.removeChild($span);
      $heading.appendChild($button);
    }
    onBeforeMatch(event) {
      const $fragment = event.target;
      if (!($fragment instanceof Element)) {
        return;
      }
      const $section = $fragment.closest(`.${this.sectionClass}`);
      if ($section) {
        this.setExpanded(true, $section);
      }
    }
    onSectionToggle($section) {
      const nowExpanded = !this.isExpanded($section);
      this.setExpanded(nowExpanded, $section);
      this.storeState($section, nowExpanded);
    }
    onShowOrHideAllToggle() {
      const nowExpanded = !this.areAllSectionsOpen();
      this.$sections.forEach(($section) => {
        this.setExpanded(nowExpanded, $section);
        this.storeState($section, nowExpanded);
      });
      this.updateShowAllButton(nowExpanded);
    }
    setExpanded(expanded, $section) {
      const $showHideIcon = $section.querySelector(`.${this.upChevronIconClass}`);
      const $showHideText = $section.querySelector(`.${this.sectionShowHideTextClass}`);
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      const $content = $section.querySelector(`.${this.sectionContentClass}`);
      if (!$content) {
        throw new ElementError({
          component: _Accordion,
          identifier: `Section content (\`<div class="${this.sectionContentClass}">\`)`
        });
      }
      if (!$showHideIcon || !$showHideText || !$button) {
        return;
      }
      const newButtonText = expanded ? this.i18n.t("hideSection") : this.i18n.t("showSection");
      $showHideText.textContent = newButtonText;
      $button.setAttribute("aria-expanded", `${expanded}`);
      const ariaLabelParts = [];
      const $headingText = $section.querySelector(`.${this.sectionHeadingTextClass}`);
      if ($headingText) {
        ariaLabelParts.push($headingText.textContent.trim());
      }
      const $summary = $section.querySelector(`.${this.sectionSummaryClass}`);
      if ($summary) {
        ariaLabelParts.push($summary.textContent.trim());
      }
      const ariaLabelMessage = expanded ? this.i18n.t("hideSectionAriaLabel") : this.i18n.t("showSectionAriaLabel");
      ariaLabelParts.push(ariaLabelMessage);
      $button.setAttribute("aria-label", ariaLabelParts.join(" , "));
      if (expanded) {
        $content.removeAttribute("hidden");
        $section.classList.add(this.sectionExpandedClass);
        $showHideIcon.classList.remove(this.downChevronIconClass);
      } else {
        $content.setAttribute("hidden", "until-found");
        $section.classList.remove(this.sectionExpandedClass);
        $showHideIcon.classList.add(this.downChevronIconClass);
      }
      this.updateShowAllButton(this.areAllSectionsOpen());
    }
    isExpanded($section) {
      return $section.classList.contains(this.sectionExpandedClass);
    }
    areAllSectionsOpen() {
      return Array.from(this.$sections).every(($section) => this.isExpanded($section));
    }
    updateShowAllButton(expanded) {
      if (!this.$showAllButton || !this.$showAllText || !this.$showAllIcon) {
        return;
      }
      this.$showAllButton.setAttribute("aria-expanded", expanded.toString());
      this.$showAllText.textContent = expanded ? this.i18n.t("hideAllSections") : this.i18n.t("showAllSections");
      this.$showAllIcon.classList.toggle(this.downChevronIconClass, !expanded);
    }
    /**
     * Get the identifier for a section
     *
     * We need a unique way of identifying each content in the Accordion.
     * Since an `#id` should be unique and an `id` is required for `aria-`
     * attributes `id` can be safely used.
     *
     * @param {Element} $section - Section element
     * @returns {string | undefined | null} Identifier for section
     */
    getIdentifier($section) {
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      return $button == null ? void 0 : $button.getAttribute("aria-controls");
    }
    storeState($section, isExpanded) {
      if (!this.config.rememberExpanded) {
        return;
      }
      const id = this.getIdentifier($section);
      if (id) {
        try {
          window.sessionStorage.setItem(id, isExpanded.toString());
        } catch (_unused) {
        }
      }
    }
    setInitialState($section) {
      if (!this.config.rememberExpanded) {
        return;
      }
      const id = this.getIdentifier($section);
      if (id) {
        try {
          const state = window.sessionStorage.getItem(id);
          if (state !== null) {
            this.setExpanded(state === "true", $section);
          }
        } catch (_unused2) {
        }
      }
    }
    getButtonPunctuationEl() {
      const $punctuationEl = document.createElement("span");
      $punctuationEl.classList.add("govuk-visually-hidden", this.sectionHeadingDividerClass);
      $punctuationEl.textContent = ", ";
      return $punctuationEl;
    }
  };
  Accordion.moduleName = "govuk-accordion";
  Accordion.defaults = Object.freeze({
    i18n: {
      hideAllSections: "Hide all sections",
      hideSection: "Hide",
      hideSectionAriaLabel: "Hide this section",
      showAllSections: "Show all sections",
      showSection: "Show",
      showSectionAriaLabel: "Show this section"
    },
    rememberExpanded: true
  });
  Accordion.schema = Object.freeze({
    properties: {
      i18n: {
        type: "object"
      },
      rememberExpanded: {
        type: "boolean"
      }
    }
  });

  // node_modules/govuk-frontend/dist/govuk/components/button/button.mjs
  var DEBOUNCE_TIMEOUT_IN_SECONDS = 1;
  var Button = class extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for button
     * @param {ButtonConfig} [config] - Button config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.debounceFormSubmitTimer = null;
      this.$root.addEventListener("keydown", (event) => this.handleKeyDown(event));
      this.$root.addEventListener("click", (event) => this.debounce(event));
    }
    handleKeyDown(event) {
      const $target = event.target;
      if (event.key !== " ") {
        return;
      }
      if ($target instanceof HTMLElement && $target.getAttribute("role") === "button") {
        event.preventDefault();
        $target.click();
      }
    }
    debounce(event) {
      if (!this.config.preventDoubleClick) {
        return;
      }
      if (this.debounceFormSubmitTimer) {
        event.preventDefault();
        return false;
      }
      this.debounceFormSubmitTimer = window.setTimeout(() => {
        this.debounceFormSubmitTimer = null;
      }, DEBOUNCE_TIMEOUT_IN_SECONDS * 1e3);
    }
  };
  Button.moduleName = "govuk-button";
  Button.defaults = Object.freeze({
    preventDoubleClick: false
  });
  Button.schema = Object.freeze({
    properties: {
      preventDoubleClick: {
        type: "boolean"
      }
    }
  });

  // node_modules/govuk-frontend/dist/govuk/common/closest-attribute-value.mjs
  function closestAttributeValue($element, attributeName) {
    const $closestElementWithAttribute = $element.closest(`[${attributeName}]`);
    return $closestElementWithAttribute ? $closestElementWithAttribute.getAttribute(attributeName) : null;
  }

  // node_modules/govuk-frontend/dist/govuk/components/checkboxes/checkboxes.mjs
  var Checkboxes = class _Checkboxes extends Component {
    /**
     * Checkboxes can be associated with a 'conditionally revealed' content block
     * – for example, a checkbox for 'Phone' could reveal an additional form field
     * for the user to enter their phone number.
     *
     * These associations are made using a `data-aria-controls` attribute, which
     * is promoted to an aria-controls attribute during initialisation.
     *
     * We also need to restore the state of any conditional reveals on the page
     * (for example if the user has navigated back), and set up event handlers to
     * keep the reveal in sync with the checkbox state.
     *
     * @param {Element | null} $root - HTML element to use for checkboxes
     */
    constructor($root) {
      super($root);
      this.$inputs = void 0;
      const $inputs = this.$root.querySelectorAll('input[type="checkbox"]');
      if (!$inputs.length) {
        throw new ElementError({
          component: _Checkboxes,
          identifier: 'Form inputs (`<input type="checkbox">`)'
        });
      }
      this.$inputs = $inputs;
      this.$inputs.forEach(($input) => {
        const targetId = $input.getAttribute("data-aria-controls");
        if (!targetId) {
          return;
        }
        if (!document.getElementById(targetId)) {
          throw new ElementError({
            component: _Checkboxes,
            identifier: `Conditional reveal (\`id="${targetId}"\`)`
          });
        }
        $input.setAttribute("aria-controls", targetId);
        $input.removeAttribute("data-aria-controls");
      });
      window.addEventListener("pageshow", () => this.syncAllConditionalReveals());
      this.syncAllConditionalReveals();
      this.$root.addEventListener("click", (event) => this.handleClick(event));
    }
    syncAllConditionalReveals() {
      this.$inputs.forEach(($input) => this.syncConditionalRevealWithInputState($input));
    }
    syncConditionalRevealWithInputState($input) {
      const targetId = $input.getAttribute("aria-controls");
      if (!targetId) {
        return;
      }
      const $target = document.getElementById(targetId);
      if ($target != null && $target.classList.contains("govuk-checkboxes__conditional")) {
        const inputIsChecked = $input.checked;
        $input.setAttribute("aria-expanded", inputIsChecked.toString());
        $target.classList.toggle("govuk-checkboxes__conditional--hidden", !inputIsChecked);
      }
    }
    unCheckAllInputsExcept($input) {
      const allInputsWithSameName = document.querySelectorAll(`input[type="checkbox"][name="${$input.name}"]`);
      allInputsWithSameName.forEach(($inputWithSameName) => {
        const hasSameFormOwner = $input.form === $inputWithSameName.form;
        if (hasSameFormOwner && $inputWithSameName !== $input) {
          $inputWithSameName.checked = false;
          this.syncConditionalRevealWithInputState($inputWithSameName);
        }
      });
    }
    unCheckExclusiveInputs($input) {
      const allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(`input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`);
      allInputsWithSameNameAndExclusiveBehaviour.forEach(($exclusiveInput) => {
        const hasSameFormOwner = $input.form === $exclusiveInput.form;
        if (hasSameFormOwner) {
          $exclusiveInput.checked = false;
          this.syncConditionalRevealWithInputState($exclusiveInput);
        }
      });
    }
    handleClick(event) {
      const $clickedInput = event.target;
      if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== "checkbox") {
        return;
      }
      const hasAriaControls = $clickedInput.getAttribute("aria-controls");
      if (hasAriaControls) {
        this.syncConditionalRevealWithInputState($clickedInput);
      }
      if (!$clickedInput.checked) {
        return;
      }
      const hasBehaviourExclusive = $clickedInput.getAttribute("data-behaviour") === "exclusive";
      if (hasBehaviourExclusive) {
        this.unCheckAllInputsExcept($clickedInput);
      } else {
        this.unCheckExclusiveInputs($clickedInput);
      }
    }
  };
  Checkboxes.moduleName = "govuk-checkboxes";

  // node_modules/govuk-frontend/dist/govuk/components/error-summary/error-summary.mjs
  var ErrorSummary = class extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for error summary
     * @param {ErrorSummaryConfig} [config] - Error summary config
     */
    constructor($root, config = {}) {
      super($root, config);
      if (!this.config.disableAutoFocus) {
        setFocus(this.$root);
      }
      this.$root.addEventListener("click", (event) => this.handleClick(event));
    }
    handleClick(event) {
      const $target = event.target;
      if ($target && this.focusTarget($target)) {
        event.preventDefault();
      }
    }
    focusTarget($target) {
      if (!($target instanceof HTMLAnchorElement)) {
        return false;
      }
      const inputId = $target.hash.replace("#", "");
      if (!inputId) {
        return false;
      }
      const $input = document.getElementById(inputId);
      if (!$input) {
        return false;
      }
      const $legendOrLabel = this.getAssociatedLegendOrLabel($input);
      if (!$legendOrLabel) {
        return false;
      }
      $legendOrLabel.scrollIntoView();
      $input.focus({
        preventScroll: true
      });
      return true;
    }
    getAssociatedLegendOrLabel($input) {
      var _document$querySelect;
      const $fieldset = $input.closest("fieldset");
      if ($fieldset) {
        const $legends = $fieldset.getElementsByTagName("legend");
        if ($legends.length) {
          const $candidateLegend = $legends[0];
          if ($input instanceof HTMLInputElement && ($input.type === "checkbox" || $input.type === "radio")) {
            return $candidateLegend;
          }
          const legendTop = $candidateLegend.getBoundingClientRect().top;
          const inputRect = $input.getBoundingClientRect();
          if (inputRect.height && window.innerHeight) {
            const inputBottom = inputRect.top + inputRect.height;
            if (inputBottom - legendTop < window.innerHeight / 2) {
              return $candidateLegend;
            }
          }
        }
      }
      return (_document$querySelect = document.querySelector(`label[for='${$input.getAttribute("id")}']`)) != null ? _document$querySelect : $input.closest("label");
    }
  };
  ErrorSummary.moduleName = "govuk-error-summary";
  ErrorSummary.defaults = Object.freeze({
    disableAutoFocus: false
  });
  ErrorSummary.schema = Object.freeze({
    properties: {
      disableAutoFocus: {
        type: "boolean"
      }
    }
  });

  // node_modules/govuk-frontend/dist/govuk/components/exit-this-page/exit-this-page.mjs
  var ExitThisPage = class _ExitThisPage extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element that wraps the Exit This Page button
     * @param {ExitThisPageConfig} [config] - Exit This Page config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.i18n = void 0;
      this.$button = void 0;
      this.$skiplinkButton = null;
      this.$updateSpan = null;
      this.$indicatorContainer = null;
      this.$overlay = null;
      this.keypressCounter = 0;
      this.lastKeyWasModified = false;
      this.timeoutTime = 5e3;
      this.keypressTimeoutId = null;
      this.timeoutMessageId = null;
      const $button = this.$root.querySelector(".govuk-exit-this-page__button");
      if (!($button instanceof HTMLAnchorElement)) {
        throw new ElementError({
          component: _ExitThisPage,
          element: $button,
          expectedType: "HTMLAnchorElement",
          identifier: "Button (`.govuk-exit-this-page__button`)"
        });
      }
      this.i18n = new I18n(this.config.i18n);
      this.$button = $button;
      const $skiplinkButton = document.querySelector(".govuk-js-exit-this-page-skiplink");
      if ($skiplinkButton instanceof HTMLAnchorElement) {
        this.$skiplinkButton = $skiplinkButton;
      }
      this.buildIndicator();
      this.initUpdateSpan();
      this.initButtonClickHandler();
      if (!("govukFrontendExitThisPageKeypress" in document.body.dataset)) {
        document.addEventListener("keyup", this.handleKeypress.bind(this), true);
        document.body.dataset.govukFrontendExitThisPageKeypress = "true";
      }
      window.addEventListener("pageshow", this.resetPage.bind(this));
    }
    initUpdateSpan() {
      this.$updateSpan = document.createElement("span");
      this.$updateSpan.setAttribute("role", "status");
      this.$updateSpan.className = "govuk-visually-hidden";
      this.$root.appendChild(this.$updateSpan);
    }
    initButtonClickHandler() {
      this.$button.addEventListener("click", this.handleClick.bind(this));
      if (this.$skiplinkButton) {
        this.$skiplinkButton.addEventListener("click", this.handleClick.bind(this));
      }
    }
    buildIndicator() {
      this.$indicatorContainer = document.createElement("div");
      this.$indicatorContainer.className = "govuk-exit-this-page__indicator";
      this.$indicatorContainer.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 3; i++) {
        const $indicator = document.createElement("div");
        $indicator.className = "govuk-exit-this-page__indicator-light";
        this.$indicatorContainer.appendChild($indicator);
      }
      this.$button.appendChild(this.$indicatorContainer);
    }
    updateIndicator() {
      if (!this.$indicatorContainer) {
        return;
      }
      this.$indicatorContainer.classList.toggle("govuk-exit-this-page__indicator--visible", this.keypressCounter > 0);
      const $indicators = this.$indicatorContainer.querySelectorAll(".govuk-exit-this-page__indicator-light");
      $indicators.forEach(($indicator, index) => {
        $indicator.classList.toggle("govuk-exit-this-page__indicator-light--on", index < this.keypressCounter);
      });
    }
    exitPage() {
      if (!this.$updateSpan) {
        return;
      }
      this.$updateSpan.textContent = "";
      document.body.classList.add("govuk-exit-this-page-hide-content");
      this.$overlay = document.createElement("div");
      this.$overlay.className = "govuk-exit-this-page-overlay";
      this.$overlay.setAttribute("role", "alert");
      document.body.appendChild(this.$overlay);
      this.$overlay.textContent = this.i18n.t("activated");
      window.location.href = this.$button.href;
    }
    handleClick(event) {
      event.preventDefault();
      this.exitPage();
    }
    handleKeypress(event) {
      if (!this.$updateSpan) {
        return;
      }
      if (event.key === "Shift" && !this.lastKeyWasModified) {
        this.keypressCounter += 1;
        this.updateIndicator();
        if (this.timeoutMessageId) {
          window.clearTimeout(this.timeoutMessageId);
          this.timeoutMessageId = null;
        }
        if (this.keypressCounter >= 3) {
          this.keypressCounter = 0;
          if (this.keypressTimeoutId) {
            window.clearTimeout(this.keypressTimeoutId);
            this.keypressTimeoutId = null;
          }
          this.exitPage();
        } else {
          if (this.keypressCounter === 1) {
            this.$updateSpan.textContent = this.i18n.t("pressTwoMoreTimes");
          } else {
            this.$updateSpan.textContent = this.i18n.t("pressOneMoreTime");
          }
        }
        this.setKeypressTimer();
      } else if (this.keypressTimeoutId) {
        this.resetKeypressTimer();
      }
      this.lastKeyWasModified = event.shiftKey;
    }
    setKeypressTimer() {
      if (this.keypressTimeoutId) {
        window.clearTimeout(this.keypressTimeoutId);
      }
      this.keypressTimeoutId = window.setTimeout(this.resetKeypressTimer.bind(this), this.timeoutTime);
    }
    resetKeypressTimer() {
      if (!this.$updateSpan) {
        return;
      }
      if (this.keypressTimeoutId) {
        window.clearTimeout(this.keypressTimeoutId);
        this.keypressTimeoutId = null;
      }
      const $updateSpan = this.$updateSpan;
      this.keypressCounter = 0;
      $updateSpan.textContent = this.i18n.t("timedOut");
      this.timeoutMessageId = window.setTimeout(() => {
        $updateSpan.textContent = "";
      }, this.timeoutTime);
      this.updateIndicator();
    }
    resetPage() {
      document.body.classList.remove("govuk-exit-this-page-hide-content");
      if (this.$overlay) {
        this.$overlay.remove();
        this.$overlay = null;
      }
      if (this.$updateSpan) {
        this.$updateSpan.setAttribute("role", "status");
        this.$updateSpan.textContent = "";
      }
      this.updateIndicator();
      if (this.keypressTimeoutId) {
        window.clearTimeout(this.keypressTimeoutId);
      }
      if (this.timeoutMessageId) {
        window.clearTimeout(this.timeoutMessageId);
      }
    }
  };
  ExitThisPage.moduleName = "govuk-exit-this-page";
  ExitThisPage.defaults = Object.freeze({
    i18n: {
      activated: "Loading.",
      timedOut: "Exit this page expired.",
      pressTwoMoreTimes: "Shift, press 2 more times to exit.",
      pressOneMoreTime: "Shift, press 1 more time to exit."
    }
  });
  ExitThisPage.schema = Object.freeze({
    properties: {
      i18n: {
        type: "object"
      }
    }
  });

  // node_modules/govuk-frontend/dist/govuk/components/header/header.mjs
  var Header = class _Header extends Component {
    /**
     * Apply a matchMedia for desktop which will trigger a state sync if the
     * browser viewport moves between states.
     *
     * @param {Element | null} $root - HTML element to use for header
     */
    constructor($root) {
      super($root);
      this.$menuButton = void 0;
      this.$menu = void 0;
      this.menuIsOpen = false;
      this.mql = null;
      const $menuButton = this.$root.querySelector(".govuk-js-header-toggle");
      if (!$menuButton) {
        return this;
      }
      this.$root.classList.add("govuk-header--with-js-navigation");
      const menuId = $menuButton.getAttribute("aria-controls");
      if (!menuId) {
        throw new ElementError({
          component: _Header,
          identifier: 'Navigation button (`<button class="govuk-js-header-toggle">`) attribute (`aria-controls`)'
        });
      }
      const $menu = document.getElementById(menuId);
      if (!$menu) {
        throw new ElementError({
          component: _Header,
          element: $menu,
          identifier: `Navigation (\`<ul id="${menuId}">\`)`
        });
      }
      this.$menu = $menu;
      this.$menuButton = $menuButton;
      this.setupResponsiveChecks();
      this.$menuButton.addEventListener("click", () => this.handleMenuButtonClick());
    }
    setupResponsiveChecks() {
      const breakpoint = getBreakpoint("desktop");
      if (!breakpoint.value) {
        throw new ElementError({
          component: _Header,
          identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
        });
      }
      this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
      if ("addEventListener" in this.mql) {
        this.mql.addEventListener("change", () => this.checkMode());
      } else {
        this.mql.addListener(() => this.checkMode());
      }
      this.checkMode();
    }
    checkMode() {
      if (!this.mql || !this.$menu || !this.$menuButton) {
        return;
      }
      if (this.mql.matches) {
        this.$menu.removeAttribute("hidden");
        this.$menuButton.setAttribute("hidden", "");
      } else {
        this.$menuButton.removeAttribute("hidden");
        this.$menuButton.setAttribute("aria-expanded", this.menuIsOpen.toString());
        if (this.menuIsOpen) {
          this.$menu.removeAttribute("hidden");
        } else {
          this.$menu.setAttribute("hidden", "");
        }
      }
    }
    handleMenuButtonClick() {
      this.menuIsOpen = !this.menuIsOpen;
      this.checkMode();
    }
  };
  Header.moduleName = "govuk-header";

  // node_modules/govuk-frontend/dist/govuk/components/password-input/password-input.mjs
  var PasswordInput = class _PasswordInput extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for password input
     * @param {PasswordInputConfig} [config] - Password input config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.i18n = void 0;
      this.$input = void 0;
      this.$showHideButton = void 0;
      this.$screenReaderStatusMessage = void 0;
      const $input = this.$root.querySelector(".govuk-js-password-input-input");
      if (!($input instanceof HTMLInputElement)) {
        throw new ElementError({
          component: _PasswordInput,
          element: $input,
          expectedType: "HTMLInputElement",
          identifier: "Form field (`.govuk-js-password-input-input`)"
        });
      }
      if ($input.type !== "password") {
        throw new ElementError("Password input: Form field (`.govuk-js-password-input-input`) must be of type `password`.");
      }
      const $showHideButton = this.$root.querySelector(".govuk-js-password-input-toggle");
      if (!($showHideButton instanceof HTMLButtonElement)) {
        throw new ElementError({
          component: _PasswordInput,
          element: $showHideButton,
          expectedType: "HTMLButtonElement",
          identifier: "Button (`.govuk-js-password-input-toggle`)"
        });
      }
      if ($showHideButton.type !== "button") {
        throw new ElementError("Password input: Button (`.govuk-js-password-input-toggle`) must be of type `button`.");
      }
      this.$input = $input;
      this.$showHideButton = $showHideButton;
      this.i18n = new I18n(this.config.i18n, {
        locale: closestAttributeValue(this.$root, "lang")
      });
      this.$showHideButton.removeAttribute("hidden");
      const $screenReaderStatusMessage = document.createElement("div");
      $screenReaderStatusMessage.className = "govuk-password-input__sr-status govuk-visually-hidden";
      $screenReaderStatusMessage.setAttribute("aria-live", "polite");
      this.$screenReaderStatusMessage = $screenReaderStatusMessage;
      this.$input.insertAdjacentElement("afterend", $screenReaderStatusMessage);
      this.$showHideButton.addEventListener("click", this.toggle.bind(this));
      if (this.$input.form) {
        this.$input.form.addEventListener("submit", () => this.hide());
      }
      window.addEventListener("pageshow", (event) => {
        if (event.persisted && this.$input.type !== "password") {
          this.hide();
        }
      });
      this.hide();
    }
    toggle(event) {
      event.preventDefault();
      if (this.$input.type === "password") {
        this.show();
        return;
      }
      this.hide();
    }
    show() {
      this.setType("text");
    }
    hide() {
      this.setType("password");
    }
    setType(type) {
      if (type === this.$input.type) {
        return;
      }
      this.$input.setAttribute("type", type);
      const isHidden = type === "password";
      const prefixButton = isHidden ? "show" : "hide";
      const prefixStatus = isHidden ? "passwordHidden" : "passwordShown";
      this.$showHideButton.innerText = this.i18n.t(`${prefixButton}Password`);
      this.$showHideButton.setAttribute("aria-label", this.i18n.t(`${prefixButton}PasswordAriaLabel`));
      this.$screenReaderStatusMessage.innerText = this.i18n.t(`${prefixStatus}Announcement`);
    }
  };
  PasswordInput.moduleName = "govuk-password-input";
  PasswordInput.defaults = Object.freeze({
    i18n: {
      showPassword: "Show",
      hidePassword: "Hide",
      showPasswordAriaLabel: "Show password",
      hidePasswordAriaLabel: "Hide password",
      passwordShownAnnouncement: "Your password is visible",
      passwordHiddenAnnouncement: "Your password is hidden"
    }
  });
  PasswordInput.schema = Object.freeze({
    properties: {
      i18n: {
        type: "object"
      }
    }
  });

  // node_modules/govuk-frontend/dist/govuk/components/radios/radios.mjs
  var Radios = class _Radios extends Component {
    /**
     * Radios can be associated with a 'conditionally revealed' content block –
     * for example, a radio for 'Phone' could reveal an additional form field for
     * the user to enter their phone number.
     *
     * These associations are made using a `data-aria-controls` attribute, which
     * is promoted to an aria-controls attribute during initialisation.
     *
     * We also need to restore the state of any conditional reveals on the page
     * (for example if the user has navigated back), and set up event handlers to
     * keep the reveal in sync with the radio state.
     *
     * @param {Element | null} $root - HTML element to use for radios
     */
    constructor($root) {
      super($root);
      this.$inputs = void 0;
      const $inputs = this.$root.querySelectorAll('input[type="radio"]');
      if (!$inputs.length) {
        throw new ElementError({
          component: _Radios,
          identifier: 'Form inputs (`<input type="radio">`)'
        });
      }
      this.$inputs = $inputs;
      this.$inputs.forEach(($input) => {
        const targetId = $input.getAttribute("data-aria-controls");
        if (!targetId) {
          return;
        }
        if (!document.getElementById(targetId)) {
          throw new ElementError({
            component: _Radios,
            identifier: `Conditional reveal (\`id="${targetId}"\`)`
          });
        }
        $input.setAttribute("aria-controls", targetId);
        $input.removeAttribute("data-aria-controls");
      });
      window.addEventListener("pageshow", () => this.syncAllConditionalReveals());
      this.syncAllConditionalReveals();
      this.$root.addEventListener("click", (event) => this.handleClick(event));
    }
    syncAllConditionalReveals() {
      this.$inputs.forEach(($input) => this.syncConditionalRevealWithInputState($input));
    }
    syncConditionalRevealWithInputState($input) {
      const targetId = $input.getAttribute("aria-controls");
      if (!targetId) {
        return;
      }
      const $target = document.getElementById(targetId);
      if ($target != null && $target.classList.contains("govuk-radios__conditional")) {
        const inputIsChecked = $input.checked;
        $input.setAttribute("aria-expanded", inputIsChecked.toString());
        $target.classList.toggle("govuk-radios__conditional--hidden", !inputIsChecked);
      }
    }
    handleClick(event) {
      const $clickedInput = event.target;
      if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== "radio") {
        return;
      }
      const $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');
      const $clickedInputForm = $clickedInput.form;
      const $clickedInputName = $clickedInput.name;
      $allInputs.forEach(($input) => {
        const hasSameFormOwner = $input.form === $clickedInputForm;
        const hasSameName = $input.name === $clickedInputName;
        if (hasSameName && hasSameFormOwner) {
          this.syncConditionalRevealWithInputState($input);
        }
      });
    }
  };
  Radios.moduleName = "govuk-radios";

  // node_modules/govuk-frontend/dist/govuk/components/skip-link/skip-link.mjs
  var SkipLink = class _SkipLink extends Component {
    /**
     * @param {Element | null} $root - HTML element to use for skip link
     * @throws {ElementError} when $root is not set or the wrong type
     * @throws {ElementError} when $root.hash does not contain a hash
     * @throws {ElementError} when the linked element is missing or the wrong type
     */
    constructor($root) {
      var _this$$root$getAttrib;
      super($root);
      const hash = this.$root.hash;
      const href = (_this$$root$getAttrib = this.$root.getAttribute("href")) != null ? _this$$root$getAttrib : "";
      if (this.$root.origin !== window.location.origin || this.$root.pathname !== window.location.pathname) {
        return;
      }
      const linkedElementId = hash.replace("#", "");
      if (!linkedElementId) {
        throw new ElementError(`Skip link: Target link (\`href="${href}"\`) has no hash fragment`);
      }
      const $linkedElement = document.getElementById(linkedElementId);
      if (!$linkedElement) {
        throw new ElementError({
          component: _SkipLink,
          element: $linkedElement,
          identifier: `Target content (\`id="${linkedElementId}"\`)`
        });
      }
      this.$root.addEventListener("click", () => setFocus($linkedElement, {
        onBeforeFocus() {
          $linkedElement.classList.add("govuk-skip-link-focused-element");
        },
        onBlur() {
          $linkedElement.classList.remove("govuk-skip-link-focused-element");
        }
      }));
    }
  };
  SkipLink.elementType = HTMLAnchorElement;
  SkipLink.moduleName = "govuk-skip-link";

  // node_modules/govuk-frontend/dist/govuk/init.mjs
  function createAll(Component2, config, scopeOrOptions) {
    let $elements;
    const options = normaliseOptions(scopeOrOptions);
    try {
      var _options$scope;
      if (!isSupported()) {
        throw new SupportError();
      }
      if (options.scope === null) {
        throw new ElementError({
          element: options.scope,
          component: Component2,
          identifier: "Scope element (`$scope`)"
        });
      }
      $elements = (_options$scope = options.scope) == null ? void 0 : _options$scope.querySelectorAll(`[data-module="${Component2.moduleName}"]`);
    } catch (error) {
      if (options.onError) {
        options.onError(error, {
          component: Component2,
          config
        });
      } else {
        console.log(error);
      }
      return [];
    }
    return Array.from($elements != null ? $elements : []).map(($element) => {
      try {
        return typeof config !== "undefined" ? new Component2($element, config) : new Component2($element);
      } catch (error) {
        if (options.onError) {
          options.onError(error, {
            element: $element,
            component: Component2,
            config
          });
        } else {
          console.log(error);
        }
        return null;
      }
    }).filter(Boolean);
  }

  // assets/js/accessibleExitThisPage.js
  var setupAccessibleExitThisPage = () => {
    const exitThisPageComponents = document.querySelectorAll('[data-module="govuk-exit-this-page"]');
    if (exitThisPageComponents.length === 0) {
      return;
    }
    if (document.body.dataset.accessibleExitThisPageKeypress) {
      return;
    }
    exitThisPageComponents.forEach((component) => {
      const button = component.querySelector(".govuk-exit-this-page__button");
      const updateSpan = component.querySelector('[role="status"]');
      if (!button || !updateSpan) {
        return;
      }
      const indicator = component.querySelector(".govuk-exit-this-page__indicator");
      if (indicator) {
        indicator.remove();
      }
      const srText = button.querySelector(".govuk-visually-hidden");
      if (srText) {
        srText.textContent = "Emergency exit this page (Press Escape key for keyboard shortcut)";
      }
    });
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey) {
        const activeElement = document.activeElement;
        const isInputField = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.tagName === "SELECT" || activeElement.isContentEditable);
        const isInDialog = activeElement && activeElement.closest('[role="dialog"]');
        if (isInputField || isInDialog) {
          return;
        }
        const component = exitThisPageComponents[0];
        const button = component.querySelector(".govuk-exit-this-page__button");
        const updateSpan = component.querySelector('[role="status"]');
        if (!button || !updateSpan) {
          return;
        }
        const exitUrl = button.getAttribute("href");
        event.preventDefault();
        updateSpan.textContent = "Loading.";
        document.body.classList.add("govuk-exit-this-page-hide-content");
        const overlay = document.createElement("div");
        overlay.className = "govuk-exit-this-page-overlay";
        overlay.setAttribute("role", "alert");
        overlay.textContent = "Loading.";
        document.body.appendChild(overlay);
        window.location.href = exitUrl;
      }
    };
    document.addEventListener("keydown", handleEscapeKey, true);
    document.body.dataset.accessibleExitThisPageKeypress = "true";
  };
  var accessibleExitThisPage_default = setupAccessibleExitThisPage;

  // assets/js/cookieBanner.js
  var setupCookieBanner = () => {
    function confirmCookiesChoice(acceptAnalytics) {
      document.getElementById("cookie-banner-main").hidden = true;
      const confirmationMessage = acceptAnalytics === "Yes" ? document.getElementById("cookie-banner-accepted") : document.getElementById("cookie-banner-rejected");
      confirmationMessage.hidden = false;
      confirmationMessage.tabIndex = -1;
      confirmationMessage.role = "alert";
      confirmationMessage.focus();
      const cookiePageRadio = document.querySelector(`input[name=acceptAnalytics][value=${acceptAnalytics}]`);
      if (cookiePageRadio) {
        cookiePageRadio.checked = true;
      }
      setAnalyticsPreferenceCookie(acceptAnalytics);
    }
    function hideCookiesConfirmation(banner) {
      banner.querySelectorAll("#cookie-banner-accepted, #cookie-banner-rejected").forEach((message) => message.hidden = true);
      banner.hidden = true;
    }
    function removeAnalyticsCookies() {
      const domain = location.hostname;
      const expires = (/* @__PURE__ */ new Date(0)).toUTCString();
      const ga4Id = document.querySelector("[data-ga4-id]").getAttribute("data-ga4-id").replace("G-", "");
      const secure = location.protocol === "https:";
      document.cookie = `_ga=; domain=${domain}; expires=${expires}; path=/; ${secure ? "Secure; " : ""}`;
      document.cookie = `_ga_${ga4Id}=; domain=${domain}; expires=${expires}; path=/; ${secure ? "Secure; " : ""}`;
    }
    function setAnalyticsPreferenceCookie(acceptAnalytics) {
      const expires = /* @__PURE__ */ new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      const secure = location.protocol === "https:";
      document.cookie = `cookie_policy=${encodeURIComponent(JSON.stringify({ acceptAnalytics }))}; expires=${expires.toUTCString()}; path=/;${secure ? "Secure; " : ""} SameSite=Lax`;
      if (acceptAnalytics === "No") {
        removeAnalyticsCookies();
      }
    }
    const cookieBanner = document.getElementById("cookie-banner");
    if (cookieBanner) {
      cookieBanner.hidden = false;
      cookieBanner.querySelectorAll("#cookie-banner-main button").forEach((button) => {
        button.addEventListener("click", () => confirmCookiesChoice(button.value));
      });
      cookieBanner.querySelectorAll("#cookie-banner-accepted button, #cookie-banner-rejected button").forEach((button) => {
        button.addEventListener("click", () => hideCookiesConfirmation(cookieBanner));
      });
    }
  };
  var cookieBanner_default = setupCookieBanner;

  // assets/js/exitTracker.js
  var setupExitTracking = () => {
    if (window.analyticsEnvironmentEnabled === false) {
      return;
    }
    let hasLoggedPageExit = false;
    let isFormSubmitting = false;
    let isInternalNavigation = false;
    let isDownloading = false;
    let isExternalNavigation = false;
    function sendAnalyticsEvent(endpoint, data) {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        navigator.sendBeacon(endpoint, blob);
      } else {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(() => {
        });
      }
    }
    function logPageExit(destination) {
      if (hasLoggedPageExit || isFormSubmitting || isInternalNavigation || isDownloading) {
        return;
      }
      hasLoggedPageExit = true;
      const eventData = { exitPage: window.location.pathname };
      if (destination) {
        eventData.destinationUrl = destination;
      }
      sendAnalyticsEvent("/api/analytics/page-exit", eventData);
    }
    function logQuickExit() {
      sendAnalyticsEvent("/api/analytics/quick-exit", { exitPage: window.location.pathname });
    }
    document.addEventListener("submit", () => {
      isFormSubmitting = true;
    });
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      const isNavigatingAway = link && link.hostname === window.location.hostname && !link.hasAttribute("download") && link.target !== "_blank" && !link.pathname.startsWith("/download") && link.pathname !== window.location.pathname;
      if (isNavigatingAway) {
        isInternalNavigation = true;
      }
      if (link && link.hostname !== window.location.hostname) {
        isExternalNavigation = true;
      }
      const staysOnPage = link && (link.hasAttribute("download") || link.pathname.startsWith("/download") || link.target === "_blank");
      if (staysOnPage) {
        isDownloading = true;
        setTimeout(() => {
          isDownloading = false;
        }, 1e3);
      }
      const exitButton = event.target.closest(".govuk-exit-this-page__button");
      if (exitButton) {
        logQuickExit();
      }
    });
    window.addEventListener("pagehide", (event) => {
      if (!event.persisted || isExternalNavigation) {
        logPageExit();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
        return;
      }
      const exitButton = document.querySelector(".govuk-exit-this-page__button");
      if (!exitButton) {
        return;
      }
      const activeElement = document.activeElement;
      const isInputField = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.tagName === "SELECT" || activeElement.isContentEditable);
      const isInDialog = activeElement && activeElement.closest('[role="dialog"]');
      if (!isInputField && !isInDialog) {
        logQuickExit();
      }
    });
  };
  var exitTracker_default = setupExitTracking;

  // assets/js/linkTracker.js
  var setupLinkTracking = () => {
    if (window.analyticsEnvironmentEnabled === false) {
      return;
    }
    function logLinkClick(url, linkText, linkType) {
      const currentPage = window.location.pathname;
      const eventData = {
        url,
        linkText,
        linkType,
        currentPage
      };
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(eventData)], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/link-click", blob);
      } else {
        fetch("/api/analytics/link-click", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(eventData),
          keepalive: true
        }).catch(() => {
        });
      }
    }
    function isExternalLink(url) {
      try {
        const linkHost = new URL(url, window.location.origin).hostname;
        const currentHost = window.location.hostname;
        return linkHost !== currentHost;
      } catch (e) {
        return false;
      }
    }
    function shouldTrackLink(href) {
      if (!href) {
        return false;
      }
      if (href.startsWith("#")) {
        return false;
      }
      return true;
    }
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) {
        return;
      }
      if (link.classList.contains("govuk-exit-this-page__button")) {
        return;
      }
      const href = link.getAttribute("href");
      if (!shouldTrackLink(href)) {
        return;
      }
      const linkType = isExternalLink(href) ? "external" : "internal";
      const linkText = link.textContent.trim();
      logLinkClick(href, linkText, linkType);
    });
  };
  var linkTracker_default = setupLinkTracking;

  // assets/js/perChildAnswers.js
  function setupPerChildAnswers() {
    const addButton = document.getElementById("add-another-child-btn");
    if (!addButton) return;
    const template = document.getElementById("per-child-entry-template");
    const container = document.getElementById("additional-children-container");
    const defaultAnswerSection = document.querySelector(".default-answer-section");
    const defaultAnswerLabel = document.querySelector(".default-answer-label");
    if (!container) return;
    const designMode = addButton.dataset.designMode || "design1";
    const isDesign4 = designMode === "design4";
    const numberOfChildren = parseInt(addButton.dataset.numberOfChildren, 10);
    const childOptions = JSON.parse(addButton.dataset.childOptions || "[]");
    const _namesOfChildren = JSON.parse(addButton.dataset.namesOfChildren || "[]");
    const fieldBaseName = addButton.dataset.fieldBaseName;
    let entryCounter = 1;
    const assignedChildren = /* @__PURE__ */ new Set();
    function updateDefaultAnswerSection() {
      const numAssigned = assignedChildren.size;
      if (numAssigned === 0) {
        if (defaultAnswerLabel) {
          defaultAnswerLabel.textContent = "For all children:";
        }
        if (defaultAnswerSection) {
          defaultAnswerSection.style.display = "";
        }
      } else if (numAssigned >= numberOfChildren) {
        if (defaultAnswerSection) {
          defaultAnswerSection.style.display = "none";
        }
      } else {
        if (defaultAnswerLabel) {
          defaultAnswerLabel.textContent = "For all other children:";
        }
        if (defaultAnswerSection) {
          defaultAnswerSection.style.display = "";
        }
      }
    }
    function addChildEntry() {
      const entryIndex = entryCounter++;
      const fieldName = `${fieldBaseName}-${entryIndex}`;
      const templateEl = isDesign4 ? document.getElementById("per-child-entry-template-d4") : template;
      if (!templateEl) return;
      const templateContent = templateEl.content.cloneNode(true);
      const entryDiv = templateContent.querySelector(".per-child-entry");
      if (isDesign4) {
        const checkboxContainer = entryDiv.querySelector(".d4-child-checkboxes");
        if (checkboxContainer) {
          checkboxContainer.id = `child-checkboxes-${entryIndex}`;
          childOptions.forEach(function(option) {
            const item = document.createElement("div");
            item.className = "govuk-checkboxes__item";
            item.innerHTML = '<input class="govuk-checkboxes__input" id="child-checkbox-' + entryIndex + "-" + option.value + '" name="child-checkbox-' + entryIndex + '" type="checkbox" value="' + option.value + '"><label class="govuk-label govuk-checkboxes__label" for="child-checkbox-' + entryIndex + "-" + option.value + '">' + option.text + "</label>";
            checkboxContainer.appendChild(item);
          });
          if (window.GOVUKFrontend && window.GOVUKFrontend.Checkboxes) {
            try {
              new window.GOVUKFrontend.Checkboxes(checkboxContainer).init();
            } catch (e) {
            }
          }
        }
        const removeBtn2 = entryDiv.querySelector(".remove-child-entry-btn");
        if (removeBtn2) {
          removeBtn2.addEventListener("click", function() {
            entryDiv.remove();
            updateAddButtonVisibility();
          });
        }
        container.appendChild(entryDiv);
        updateAddButtonVisibility();
        return;
      }
      entryDiv.dataset.entryIndex = entryIndex;
      const selector = entryDiv.querySelector("select");
      const selectorId = `child-selector-${entryIndex}`;
      selector.id = selectorId;
      selector.name = selectorId;
      const selectorLabel = entryDiv.querySelector(`label[for="child-selector-ENTRY_INDEX"]`);
      if (selectorLabel) {
        selectorLabel.setAttribute("for", selectorId);
      }
      childOptions.forEach((option) => {
        const optionEl = document.createElement("option");
        optionEl.value = option.value;
        optionEl.textContent = option.text;
        selector.appendChild(optionEl);
      });
      selector.addEventListener("change", function() {
        const selectedChildIndex = parseInt(this.value, 10);
        const previousValue = this.dataset.previousValue;
        if (previousValue !== void 0 && previousValue !== "") {
          assignedChildren.delete(parseInt(previousValue, 10));
        }
        if (!isNaN(selectedChildIndex)) {
          assignedChildren.add(selectedChildIndex);
          this.dataset.previousValue = selectedChildIndex;
        }
        updateDefaultAnswerSection();
        updateAddButtonVisibility();
      });
      const textarea = entryDiv.querySelector("textarea");
      if (textarea && !textarea.closest(".govuk-radios__conditional")) {
        textarea.id = fieldName;
        textarea.name = fieldName;
        const textareaLabel = entryDiv.querySelector(`label[for="FIELD_NAME"]`);
        if (textareaLabel) {
          textareaLabel.setAttribute("for", fieldName);
        }
      }
      const radioInputs = entryDiv.querySelectorAll('input[type="radio"]');
      if (radioInputs.length > 0) {
        radioInputs.forEach((radio) => {
          const oldName = radio.getAttribute("name");
          if (oldName === "FIELD_NAME") {
            radio.setAttribute("name", fieldName);
          }
          const oldId = radio.getAttribute("id");
          if (oldId && oldId.includes("FIELD_NAME")) {
            const newId = oldId.replace(/FIELD_NAME/g, fieldName);
            radio.setAttribute("id", newId);
            const label = entryDiv.querySelector(`label[for="${oldId}"]`);
            if (label) {
              label.setAttribute("for", newId);
            }
            const ariaControls = radio.getAttribute("data-aria-controls");
            if (ariaControls && ariaControls.includes("FIELD_NAME")) {
              const newAriaControls = ariaControls.replace(/FIELD_NAME/g, fieldName);
              radio.setAttribute("data-aria-controls", newAriaControls);
            }
          }
        });
        const conditionals = entryDiv.querySelectorAll(".govuk-radios__conditional");
        conditionals.forEach((conditional) => {
          const oldId = conditional.getAttribute("id");
          if (oldId && oldId.includes("FIELD_NAME")) {
            const newId = oldId.replace(/FIELD_NAME/g, fieldName);
            conditional.setAttribute("id", newId);
            const conditionalTextarea = conditional.querySelector("textarea");
            if (conditionalTextarea) {
              const describeFieldName = `${fieldBaseName}-describe-arrangement-${entryIndex}`;
              const oldTextareaId = conditionalTextarea.getAttribute("id");
              if (oldTextareaId === "DESCRIBE_FIELD_NAME") {
                conditionalTextarea.setAttribute("id", describeFieldName);
                conditionalTextarea.setAttribute("name", describeFieldName);
                const textareaLabel = conditional.querySelector(`label[for="DESCRIBE_FIELD_NAME"]`);
                if (textareaLabel) {
                  textareaLabel.setAttribute("for", describeFieldName);
                }
              }
            }
          }
        });
        const radiosModule = entryDiv.querySelector('[data-module="govuk-radios"]');
        if (radiosModule && window.GOVUKFrontend && window.GOVUKFrontend.Radios) {
          new window.GOVUKFrontend.Radios(radiosModule).init();
        }
      }
      const checkboxInputs = entryDiv.querySelectorAll('input[type="checkbox"]');
      if (checkboxInputs.length > 0) {
        checkboxInputs.forEach((checkbox) => {
          const oldName = checkbox.getAttribute("name");
          if (oldName === "FIELD_NAME") {
            checkbox.setAttribute("name", fieldName);
          }
          const oldId = checkbox.getAttribute("id");
          if (oldId && oldId.includes("FIELD_NAME")) {
            const newId = oldId.replace(/FIELD_NAME/g, fieldName);
            checkbox.setAttribute("id", newId);
            const label = entryDiv.querySelector(`label[for="${oldId}"]`);
            if (label) {
              label.setAttribute("for", newId);
            }
            const ariaControls = checkbox.getAttribute("data-aria-controls");
            if (ariaControls && ariaControls.includes("FIELD_NAME")) {
              const newAriaControls = ariaControls.replace(/FIELD_NAME/g, fieldName);
              checkbox.setAttribute("data-aria-controls", newAriaControls);
            }
          }
        });
        const checkboxConditionals = entryDiv.querySelectorAll(".govuk-checkboxes__conditional");
        checkboxConditionals.forEach((conditional) => {
          const oldId = conditional.getAttribute("id");
          if (oldId && oldId.includes("FIELD_NAME")) {
            const newId = oldId.replace(/FIELD_NAME/g, fieldName);
            conditional.setAttribute("id", newId);
            const conditionalTextarea = conditional.querySelector("textarea");
            if (conditionalTextarea) {
              const someoneElseFieldName = fieldBaseName.includes("where-handover") ? `${fieldBaseName}-someone-else-${entryIndex}` : `${fieldBaseName}-describe-arrangement-${entryIndex}`;
              const oldTextareaId = conditionalTextarea.getAttribute("id");
              if (oldTextareaId === "SOMEONE_ELSE_FIELD_NAME" || oldTextareaId === "DESCRIBE_FIELD_NAME") {
                conditionalTextarea.setAttribute("id", someoneElseFieldName);
                conditionalTextarea.setAttribute("name", someoneElseFieldName);
                const textareaLabel = conditional.querySelector(`label[for="${oldTextareaId}"]`);
                if (textareaLabel) {
                  textareaLabel.setAttribute("for", someoneElseFieldName);
                }
              }
            }
          }
        });
        const checkboxesModule = entryDiv.querySelector('[data-module="govuk-checkboxes"]');
        if (checkboxesModule && window.GOVUKFrontend && window.GOVUKFrontend.Checkboxes) {
          new window.GOVUKFrontend.Checkboxes(checkboxesModule).init();
        }
      }
      const removeBtn = entryDiv.querySelector(".remove-child-entry-btn");
      removeBtn.addEventListener("click", () => {
        const selectedValue = selector.value;
        if (selectedValue !== "") {
          assignedChildren.delete(parseInt(selectedValue, 10));
        }
        entryDiv.remove();
        updateDefaultAnswerSection();
        updateAddButtonVisibility();
      });
      container.appendChild(entryDiv);
      updateAddButtonVisibility();
      updateDefaultAnswerSection();
      selector.focus();
    }
    function updateAddButtonVisibility() {
      const existingEntries2 = container.querySelectorAll(".per-child-entry").length;
      if (existingEntries2 >= numberOfChildren) {
        addButton.style.display = "none";
      } else {
        addButton.style.display = "";
      }
    }
    addButton.addEventListener("click", addChildEntry);
    updateAddButtonVisibility();
    const existingEntries = container.querySelectorAll(".per-child-entry");
    existingEntries.forEach((entry) => {
      const selector = entry.querySelector("select");
      if (selector && selector.value !== "") {
        assignedChildren.add(parseInt(selector.value, 10));
      }
    });
    updateDefaultAnswerSection();
  }
  var perChildAnswers_default = setupPerChildAnswers;

  // assets/js/index.js
  document.body.dataset.govukFrontendExitThisPageKeypress = "true";
  var components = [Accordion, Button, Checkboxes, ErrorSummary, ExitThisPage, Header, Radios, SkipLink, PasswordInput];
  components.forEach((Component2) => {
    createAll(Component2);
  });
  cookieBanner_default();
  accessibleExitThisPage_default();
  if (window.analyticsEnvironmentEnabled !== false) {
    linkTracker_default();
    exitTracker_default();
  }
  perChildAnswers_default();
})();
/*! Bundled license information:

govuk-frontend/dist/govuk/components/accordion/accordion.mjs:
  (**
   * Accordion component
   *
   * This allows a collection of sections to be collapsed by default, showing only
   * their headers. Sections can be expanded or collapsed individually by clicking
   * their headers. A "Show all sections" button is also added to the top of the
   * accordion, which switches to "Hide all sections" when all the sections are
   * expanded.
   *
   * The state of each section is saved to the DOM via the `aria-expanded`
   * attribute, which also provides accessibility.
   *
   * @preserve
   * @augments ConfigurableComponent<AccordionConfig>
   *)

govuk-frontend/dist/govuk/components/button/button.mjs:
  (**
   * JavaScript enhancements for the Button component
   *
   * @preserve
   * @augments ConfigurableComponent<ButtonConfig>
   *)

govuk-frontend/dist/govuk/components/checkboxes/checkboxes.mjs:
  (**
   * Checkboxes component
   *
   * @preserve
   *)

govuk-frontend/dist/govuk/components/error-summary/error-summary.mjs:
  (**
   * Error summary component
   *
   * Takes focus on initialisation for accessible announcement, unless disabled in
   * configuration.
   *
   * @preserve
   * @augments ConfigurableComponent<ErrorSummaryConfig>
   *)

govuk-frontend/dist/govuk/components/exit-this-page/exit-this-page.mjs:
  (**
   * Exit this page component
   *
   * @preserve
   * @augments ConfigurableComponent<ExitThisPageConfig>
   *)

govuk-frontend/dist/govuk/components/header/header.mjs:
  (**
   * Header component
   *
   * @preserve
   *)

govuk-frontend/dist/govuk/components/password-input/password-input.mjs:
  (**
   * Password input component
   *
   * @preserve
   * @augments ConfigurableComponent<PasswordInputConfig>
   *)

govuk-frontend/dist/govuk/components/radios/radios.mjs:
  (**
   * Radios component
   *
   * @preserve
   *)

govuk-frontend/dist/govuk/components/skip-link/skip-link.mjs:
  (**
   * Skip link component
   *
   * @preserve
   * @augments Component<HTMLAnchorElement>
   *)
*/
//# sourceMappingURL=app.3XJCZDQB.js.map
