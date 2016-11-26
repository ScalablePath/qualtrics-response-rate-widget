function test1View(scope){
    var _scope = scope;
    var _needsAuth = true;
    
    (function(){
        if(_needsAuth && !_scope.security.isAuth){
            _scope.error({status:401});
            return;
        }
        _scope.render('company.html', function(){
            console.log('Company view rendered!');
        });
    })();
}