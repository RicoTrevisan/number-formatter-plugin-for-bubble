try {
    let number = properties.number;
    let locale = properties.locale;

    let options;

    if (properties.advanced_options) {
        // Advanced mode: parse JSON directly, ignore all other fields
        options = JSON.parse(properties.advanced_options);
    } else {
        // Build options from individual fields
        options = {};

        // Style
        let style = properties.style || "decimal";
        options.style = style;

        // Notation
        let notation = properties.notation || "standard";
        options.notation = notation;

        // Compact display (only relevant when notation is "compact")
        if (notation === "compact") {
            options.compactDisplay = properties.compactDisplay || "short";
        }

        // Currency options (only relevant when style is "currency")
        if (style === "currency") {
            if (properties.currency) {
                options.currency = properties.currency;
            }
            if (properties.currencyDisplay) {
                options.currencyDisplay = properties.currencyDisplay;
            }
        }

        // Unit options (only relevant when style is "unit")
        if (style === "unit") {
            if (properties.unit) {
                options.unit = properties.unit;
            }
            if (properties.unitDisplay) {
                options.unitDisplay = properties.unitDisplay;
            }
        }

        // Precision
        if (properties.minimumFractionDigits != null && properties.minimumFractionDigits !== "") {
            options.minimumFractionDigits = Number(properties.minimumFractionDigits);
        }
        if (properties.maximumFractionDigits != null && properties.maximumFractionDigits !== "") {
            options.maximumFractionDigits = Number(properties.maximumFractionDigits);
        }

        // Grouping
        if (properties.useGrouping) {
            let grouping = properties.useGrouping;
            if (grouping === "false") {
                options.useGrouping = false;
            } else if (grouping === "always") {
                options.useGrouping = "always";
            }
            // "auto" is the default, no need to set
        }

        // Sign display
        if (properties.signDisplay && properties.signDisplay !== "auto") {
            options.signDisplay = properties.signDisplay;
        }
    }

    let formatter = new Intl.NumberFormat([locale, "en-US"], options);

    let formatted = formatter.format(number);
    let parts = JSON.stringify(formatter.formatToParts(number));

    // Publish all states
    instance.publishState("compacted_number", formatted);   // backward compat
    instance.publishState("formatted_number", formatted);
    instance.publishState("formatted_parts", parts);
    instance.publishState("error_message", "");

} catch (e) {
    instance.publishState("compacted_number", "");
    instance.publishState("formatted_number", "");
    instance.publishState("formatted_parts", "");
    instance.publishState("error_message", e.message);
}