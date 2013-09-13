function check_emit(scope, event) {
  var done = false;
  scope.$on(event, function(){ done = true; });
  waitsFor(function(){ return done; },'emit ' + event, 100);
}

function spy_and_return(object, call, resolveTo) {
  spyOn(object, call, resolveTo).andCallFake(function(){
    promise = new jQuery.Deferred();
    promise.resolve(resolveTo);
    return promise.promise();
  });
}
