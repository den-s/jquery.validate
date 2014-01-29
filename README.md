jquery.validate
===============

validate form for: required fields [required], min length[min_length],
                   regular expression[regexp], equal[equalTo: jQuery object],
                   not equal[notEqualTo: jQuery object].
 
 EXAMPLE:
 
 $("form").validate({
     error_position: 'after',  // or 'before'
     error_source: '<label>[]</label>',  // [] - error message
     elements: [
     {
         object: $("input"), // for all imputs on form
         validators: {required: true, min_length: 5, regexp: /\w\d/g, equalTo: $('input'), notEqualTo: $('input')},
         errors: {required: 'message for required error for current element'}
     },
     {
         object: $('#id1'),
         validators: {notEqualTo: $('#id2')}
     },
     {
         object: $(".textarea"),
         validators: {required: true, min_length: 2, regexp: /\w/g, equalTo: $('input'), notEqualTo: $('input')},
         errors: {required: 'Это поле обязательное', min_length: 'Минимальная длина 2 символов', regexp: 'Регексп не случился'}
      },
      {
          object: $("#select"),
          validators: {required: true, min_length: 5, regexp: '/\w/'},
          errors: {required: 'This field is req.', min_length: 'min length is 5 digits.', regexp: 'some error'}
      }]
  });
