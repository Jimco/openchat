/*
* Placeholder plugin for jQuery
* 2012-08-20
*/

define(function(require, exports, module){

  function Placeholder(input) {
    this.input = input;
    if (input.attr('type') == 'password') {
      this.handlePassword();
    }
    $(input[0].form).submit(function() {
      if (input.hasClass('placeholder') && input[0].value == input.attr('placeholder')) {
        input[0].value = '';
      }
    });
  }
  Placeholder.prototype = {
    show : function(loading) {
      if (this.input[0].value === '' || (loading && this.valueIsPlaceholder())) {
        if (this.isPassword) {
          try {
            this.input[0].setAttribute('type', 'text');
          } catch (e) {
            this.input.before(this.fakePassword.show()).hide();
          }
        }
        this.input.addClass('placeholder');
        this.input[0].value = this.input.attr('placeholder');
      }
    },
    hide : function() {
      if (this.valueIsPlaceholder() && this.input.hasClass('placeholder')) {
        this.input.removeClass('placeholder');
        this.input[0].value = '';
        if (this.isPassword) {
          try {
            this.input[0].setAttribute('type', 'password');
          } catch (e) { }
          this.input.show();
          this.input[0].focus();
        }
      }
    },
    valueIsPlaceholder : function() {
      return this.input[0].value == this.input.attr('placeholder');
    },
    handlePassword: function() {
      var input = this.input;
      input.attr('realType', 'password');
      this.isPassword = true;
      if ($.browser.msie && input[0].outerHTML) {
        var fakeHTML = $(input[0].outerHTML.replace(/type=(['"])?password\1/gi, 'type=$1text$1'));
        this.fakePassword = fakeHTML.val(input.attr('placeholder')).addClass('placeholder').focus(function() {
            input.trigger('focus');
            $(this).hide();
          });
        $(input[0].form).submit(function() {
          fakeHTML.remove();
          input.show()
        });
      }
    }
  };
  var NATIVE_SUPPORT = !!("placeholder" in document.createElement( "input" ));
  $.fn.placeholder = function() {
    return NATIVE_SUPPORT ? this : this.each(function() {
      var input = $(this);
      var placeholder = new Placeholder(input);
      placeholder.show(true);
      input.focus(function() {
        placeholder.hide();
      });
      input.blur(function() {
        placeholder.show(false);
      });

      if ($.browser.msie) {
        $(window).load(function() {
          if(input.val()) {
            input.removeClass("placeholder");
          }
          placeholder.show(true);
        });
        input.focus(function() {
          if(this.value == "") {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveStart('character', 0);
            range.select();
          }
        });
      }
    });
  }
  
});
