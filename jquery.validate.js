/*
 * jQuery validator for forms by Den Suslov.
 *
 * validate form for: required fields [required], min length[min_length],
 *                    regular expression[regexp], equal[equalTo: jQuery object],
 *                    not equal[notEqualTo: jQuery object].
 *
 * EXAMPLE:
 *
 *$("form").validate({
 *    error_position: 'after',  // or 'before'
 *    error_source: '<label>[]</label>',  // [] - error message
 *    elements: [
 *    {
 *        object: $("input"), // for all imputs on form
 *        validators: {required: true, min_length: 5, regexp: /\w\d/g, equalTo: $('input'), notEqualTo: $('input')},
 *        errors: {required: 'message for required error for current element'}
 *    },
 *    {
 *        object: $('#id1'),
 *        validators: {notEqualTo: $('#id2')}
 *    },
 *    {
 *        object: $(".textarea"),
 *        validators: {required: true, min_length: 2, regexp: /\w/g, equalTo: $('input'), notEqualTo: $('input')},
 *        errors: {required: 'Это поле обязательное', min_length: 'Минимальная длина 2 символов', regexp: 'Регексп не случился'}
 *    },
 *    {
 *        object: $("#select"),
 *        validators: {required: true, min_length: 5, regexp: '/\w/'},
 *        errors: {required: 'This field is req.', min_length: 'min length is 5 digits.', regexp: 'some error'}
 *    }]
 *});
 *
 */
(function($){
    var defaults = {
        error_position: 'after',
        error_source: '<label>[]</label>',  // [] - error message
    }
    var methods = {
        init: function(uoptions) {
            var options = $.extend({
                elements: [],
                error_position: 'after',
                error_source: '<label>[]</label>',  // [] - error message
                validators: {
                    required: false,
                    min_length: 0,
                    regexp: false,
                    equalTo: false,
                    notEqualTo: false
                },
                errors: {
                    'required': 'This field is required.',
                    'min_length': 'Min length must be more then ',
                    'regexp': 'Validation error.',
                    'equalTo': 'These elements must be equal',
                    'notEqualTo': 'These elements must be different'
                }
            }, uoptions);

            return this.each(function () {
                defaults = $.extend(defaults, uoptions);
                defaults['elements'] = null;
                $(this.elements).each( function(key, object){
                    $.each(options.elements, function(i, option){
                        $.each(option.object, function(k, option_object) {
                            if(object == option_object) {
                                $this = $(object);
                                if (!$this.data('validators') || !$this.data('errors')) {
                                    var this_errors = $.extend(options.errors, option.errors);
                                    var this_validators = $.extend(options.validators, option.validators);
                                    $this.data('validators', this_validators);
                                    $this.data('errors', this_errors);
                                    methods.routeValidators($this, methods.checkType($this));
                                }
                            }
                        })
                    });
                });

            })
        },
        routeValidators: function($this, type) {
            if($this.data('validators').required == true && $this.data('validators').min_length == 0)
                methods.checkRequired($this, type);
            if(type == 'input' || type == 'textarea') {
                if($this.data('validators').min_length > 0 && (type == 'input' || type == 'textarea'))
                    methods.checkMinLength($this);
                if($this.data('validators').regexp)
                    methods.checkRegexp($this);
                if($this.data('validators').equalTo)
                    methods.checkEqualTo($this);
                if($this.data('validators').notEqualTo)
                    methods.checkNotEqalTo($this);
            }
        },
        checkType: function($this) {
            return $this.get(0).tagName.toLowerCase();
        },
        checkRequired: function($this, type) {
            var isEmpty = false;
            switch(type) {
                case 'input': 
                    if(!$this.val().match(/\S/))
                        isEmpty = true;
                    break;
                case 'textarea': 
                    if(!$this.val().match(/\S/))
                        isEmpty = true;
                    break;
                case 'select':
                    if($this.val() == 0)
                        isEmpty = true;
                    break;
            }
            if(isEmpty)
                methods.drowError($this, $this.data('errors').required); 
        },
        checkMinLength: function($this) {
            if($this.val().length < $this.data('validators').min_length) {
                methods.drowError($this, $this.data('errors').min_length); 
            }
        },
        checkRegexp: function($this) {
            var user_pattern = $this.data('validators').regexp;
            if(typeof user_pattern == 'string'){
                var flags = user_pattern.substr(user_pattern.lastIndexOf('/')+1, user_pattern.length);
                var pattern= user_pattern.substr(1, user_pattern.lastIndexOf('/')-1);
                var regexp = new RegExp(pattern, flags);
            } else {
                var regexp = user_pattern;
            }
            regexp.test($this.val());
            if(regexp.test($this.val()))
                methods.drowError($this, $this.data('errors').regexp); 
        },
        checkEqualTo: function ($this) {
            if($this.val() != $this.data('validators').equalTo.val())
                methods.drowError($this, $this.data('errors').equalTo); 
        },
        checkNotEqalTo: function ($this) {
            if($this.val() == $this.data('validators').notEqualTo.val())
                methods.drowError($this, $this.data('errors').notEqualTo); 
        },
        drowError: function($this, error) {
            var error_message = defaults.error_source.replace("[]", error);
            switch(defaults.error_position) {
                case 'before':
                    $this.before(error_message);
                    break;
                case 'after': 
                    $this.after(error_message);
                    break;
                default:
                    $this.after(error_message);
            }
        }

    };

    $.fn.validate = function (method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this,
                Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод ' + method + ' не существует в jQuery.validate');
        }

    };
})(jQuery)
