/**
 * Yii2 Editable Cell
 * 
 * @author Yurii Martynchuk <yura@martynchuk.com>
 */
(function($) {
    'use strict';

    $(document).on('click', '[data-editable="true"]', function() {
        var $cell = $(this);
        
        if ($cell.hasClass('editing')) {
            return;
        }

        var cellElement = $cell[0];
        
        // Get attribute - use getAttribute for exact HTML value
        var attribute = cellElement ? cellElement.getAttribute('data-attribute') : null;
        if (!attribute && cellElement && cellElement.dataset) {
            attribute = cellElement.dataset.attribute;
        }
        if (!attribute) {
            attribute = $cell.attr('data-attribute');
        }
        
        // Get primary key
        var primaryKey = cellElement ? cellElement.getAttribute('data-primary-key') : null;
        if (!primaryKey && cellElement && cellElement.dataset) {
            primaryKey = cellElement.dataset.primaryKey;
        }
        if (!primaryKey) {
            primaryKey = $cell.attr('data-primary-key');
        }
        
        // Get other attributes
        var type = (cellElement && cellElement.getAttribute('data-type')) 
            || (cellElement && cellElement.dataset && cellElement.dataset.type)
            || $cell.attr('data-type') 
            || 'text';
        var url = (cellElement && cellElement.getAttribute('data-url'))
            || (cellElement && cellElement.dataset && cellElement.dataset.url)
            || $cell.attr('data-url');
        var options = $cell.data('options') || {};
        var currentValue = $cell.text().trim();

        // Debug logging
        if (!attribute) {
            console.error('EditableCell: attribute is not set', {
                element: cellElement,
                getAttribute: cellElement ? cellElement.getAttribute('data-attribute') : 'no element',
                dataset: cellElement && cellElement.dataset ? cellElement.dataset.attribute : 'no dataset',
                attr: $cell.attr('data-attribute'),
                data: $cell.data('attribute'),
                html: cellElement ? cellElement.outerHTML.substring(0, 300) : 'no element',
                allAttributes: cellElement ? Array.from(cellElement.attributes).map(function(attr) {
                    return attr.name + '="' + attr.value + '"';
                }).join(', ') : 'no element'
            });
            showError($cell, 'Attribute is not configured');
            return;
        }

        if (!primaryKey) {
            console.error('EditableCell: primary key is not set');
            showError($cell, 'Primary key is not set');
            return;
        }

        // Store original value for cancel/rollback
        $cell.data('original-value', currentValue);

        $cell.addClass('editing');

        var $input = createInput(type, currentValue, options);
        $cell.html($input);
        $input.focus().select();

        // Save on blur or Enter key
        $input.on('blur', function() {
            saveValue($cell, $input, attribute, primaryKey, url, type);
        });

        $input.on('keydown', function(e) {
            if (e.keyCode === 13) { // Enter
                e.preventDefault();
                saveValue($cell, $input, attribute, primaryKey, url, type);
            } else if (e.keyCode === 27) { // Escape
                e.preventDefault();
                cancelEdit($cell, currentValue);
            }
        });
    });

    function createInput(type, value, options) {
        var $input;

        switch(type) {
            case 'textarea':
                $input = $('<textarea>').val(value);
                if (options.rows) {
                    $input.attr('rows', options.rows);
                }
                if (options.cols) {
                    $input.attr('cols', options.cols);
                }
                break;
            case 'select':
                $input = $('<select>');
                if (options.items && Array.isArray(options.items)) {
                    options.items.forEach(function(item) {
                        var $option = $('<option>').val(item.value).text(item.label);
                        if (item.value == value) {
                            $option.attr('selected', true);
                        }
                        $input.append($option);
                    });
                }
                break;
            case 'date':
                $input = $('<input>').attr('type', 'date').val(value);
                break;
            case 'number':
                $input = $('<input>').attr('type', 'number').val(value);
                if (options.min !== undefined) {
                    $input.attr('min', options.min);
                }
                if (options.max !== undefined) {
                    $input.attr('max', options.max);
                }
                if (options.step !== undefined) {
                    $input.attr('step', options.step);
                }
                break;
            default:
                $input = $('<input>').attr('type', 'text').val(value);
        }

        $input.addClass('form-control editable-input');
        return $input;
    }

    function saveValue($cell, $input, attribute, primaryKey, url, type) {
        if (!attribute) {
            console.error('EditableCell: Cannot save - attribute is not set');
            showError($cell, 'Attribute is not configured');
            cancelEdit($cell, $cell.data('original-value') || '');
            return;
        }

        var newValue = $input.val();
        var originalValue = $cell.data('original-value') || $cell.text().trim();

        if (newValue === originalValue) {
            cancelEdit($cell, originalValue);
            return;
        }

        $cell.addClass('saving');
        $input.prop('disabled', true);

        var data = {};
        data[attribute] = newValue;
        data['id'] = primaryKey;
        data['attribute'] = attribute;

        $.ajax({
            url: url,
            method: 'POST',
            data: data,
            dataType: 'json',
            success: function(response) {
                $cell.removeClass('editing saving');
                
                if (response.success) {
                    $cell.text(response.value || newValue);
                    $cell.addClass('saved');
                    setTimeout(function() {
                        $cell.removeClass('saved');
                    }, 2000);

                    var afterSave = $cell.data('after-save');
                    if (afterSave && typeof window[afterSave] === 'function') {
                        window[afterSave](response, $cell);
                    }
                } else {
                    $cell.text(originalValue);
                    showError($cell, response.message || 'Save error');
                }
            },
            error: function(xhr) {
                $cell.removeClass('editing saving');
                $cell.text(originalValue);
                
                var errorMessage = 'Save error';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }

                showError($cell, errorMessage);

                var onError = $cell.data('on-error');
                if (onError && typeof window[onError] === 'function') {
                    window[onError](xhr, $cell);
                }
            }
        });
    }

    function cancelEdit($cell, originalValue) {
        $cell.removeClass('editing saving');
        $cell.text(originalValue);
    }

    function showError($cell, message) {
        $cell.addClass('error');
        var $error = $('<span class="error-message">').text(message);
        $cell.append($error);
        
        setTimeout(function() {
            $cell.removeClass('error');
            $error.remove();
        }, 3000);
    }

})(jQuery);

