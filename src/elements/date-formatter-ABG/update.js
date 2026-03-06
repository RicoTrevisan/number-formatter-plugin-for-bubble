try {
    var date = properties.date;
    var locale = properties.locale;

    // Guard: no date provided
    if (!date) {
        instance.publishState("formatted_date", "");
        instance.publishState("formatted_range", "");
        instance.publishState("formatted_parts", "");
        instance.publishState("error_message", "");
        return;
    }

    var options;

    if (properties.advanced_options) {
        // Advanced mode: parse JSON directly, ignore all other fields
        options = JSON.parse(properties.advanced_options);
    } else {
        options = {};
        var mode = properties.mode || "preset";

        // Timezone (applies to both modes)
        if (properties.timeZone) {
            options.timeZone = properties.timeZone;
        }

        if (mode === "preset") {
            // Preset mode: use dateStyle and timeStyle
            var dateStyle = properties.dateStyle || "medium";
            var timeStyle = properties.timeStyle || "none";

            if (dateStyle && dateStyle !== "none") {
                options.dateStyle = dateStyle;
            }
            if (timeStyle && timeStyle !== "none") {
                options.timeStyle = timeStyle;
            }

            // If both are "none", default to medium dateStyle so we get some output
            if (!options.dateStyle && !options.timeStyle) {
                options.dateStyle = "medium";
            }
        } else {
            // Custom mode: use individual component fields
            var componentFields = {
                weekday: properties.weekday,
                year: properties.year,
                month: properties.month,
                day: properties.day,
                hour: properties.hour,
                minute: properties.minute,
                second: properties.second
            };

            var hasAnyComponent = false;
            for (var key in componentFields) {
                var val = componentFields[key];
                if (val && val !== "none") {
                    options[key] = val;
                    hasAnyComponent = true;
                }
            }

            // If no components selected, default to a sensible output
            if (!hasAnyComponent) {
                options.year = "numeric";
                options.month = "long";
                options.day = "numeric";
            }

            // Hour cycle (only relevant in custom mode when hour is set)
            if (options.hour && properties.hourCycle && properties.hourCycle !== "auto") {
                options.hourCycle = properties.hourCycle;
            }
        }
    }

    var formatter = new Intl.DateTimeFormat([locale, "en-US"], options);

    // Format main date
    var formatted = formatter.format(date);
    var parts = JSON.stringify(formatter.formatToParts(date));

    // Publish main states
    instance.publishState("formatted_date", formatted);
    instance.publishState("formatted_parts", parts);
    instance.publishState("error_message", "");

    // Format range if end_date is provided
    if (properties.end_date) {
        try {
            var rangeFormatted = formatter.formatRange(date, properties.end_date);
            instance.publishState("formatted_range", rangeFormatted);
        } catch (rangeErr) {
            // formatRange may not be available in all browsers
            instance.publishState("formatted_range", "");
            instance.publishState("error_message", "formatRange error: " + rangeErr.message);
        }
    } else {
        instance.publishState("formatted_range", "");
    }

} catch (e) {
    instance.publishState("formatted_date", "");
    instance.publishState("formatted_range", "");
    instance.publishState("formatted_parts", "");
    instance.publishState("error_message", e.message);
}