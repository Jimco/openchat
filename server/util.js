(function(exports){

  exports.getTime = function(){
      var date = new Date();
      return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }

  exports.randomColor = function(){
      var colors = ['#F39C12', '#1ABC9C', '#3498DB', '#E74C3C', '#2ECC71', '##F1C40F', '#34495E',
                    '#9B59B6', '#D35400', '#E74C3C', '#2980B9', '#27AE60', '#16A085'];
      return colors[ Math.round(Math.random() * 10000 % colors.length) ];
    }

  exports.mix = function( target, source, override, whitelist ){
      if( !target || !source ) return;
      if( override === undefined ){
        override = true;
      }

      var prop, len, i,
        _mix = function( prop ){
          if( override === true || !(prop in target) ){
            target[ prop ] = source[ prop ];
          }
        };
      
      if( whitelist && (len = whitelist.length) ){
        for( i = len; i; ){
          prop = whitelist[--i];
          if( prop in source ){
            _mix( prop );
          }
        }
      }else{
        for( prop in source ){
          _mix( prop );
        }
      }
      
      return target;
    };

})( (function(){

  if(typeof exports === 'undefined'){
    window.util = {};
    return window.util;
  }
  else{
    return exports;
  }

})() );