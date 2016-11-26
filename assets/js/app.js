function axa(window, document, apiUrl){
    var that = this;
    
    var _doc = document;
    var _win = window;

    var _view = null;
    var _scope = {
        security: {
            token:null,
             email:null,
              isAuth:false
        },
        container: null,
        el: function(selector){
            if(selector.indexOf('#') > -1){
                return _doc.getElementById(selector.substr(1, selector.length - 1));
            }else{
                return _doc.querySelectorAll(selector);
            }
        },
        createEl: function(tag, clsName){
           var e = _doc.createElement(tag);
            e.className = clsName;
            return e;
        },
        render: function(view, cbFunc){
            var that = this;

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (e) {
                if(xhr.readyState !== 4){return;} 
                if (xhr.status == 200) {
                    that.container.innerHTML = xhr.responseText;
                    if(cbFunc && typeof(cbFunc) === 'function'){
                        cbFunc();
                    }
                }else{
                    that.error({status:xhr.status, msg:xhr.responseText});
                }
            };
            xhr.open("GET", "/assets/views/" + view, true);
            xhr.setRequestHeader('Content-type', 'text/html');
            xhr.send();
        },
        error: function(err){
            var txt = "An unhandled exception has ocurred!";
            if(err){
                if(typeof(err) === 'object'){
                    if(err.status === 401){
                        txt = "You must Log In to continue!";
                        that.logOff();
                    }else{
                        txt = err.msg;
                    }
                }else{
                    txt = err;
                }
            }
            var a = this.createEl("DIV", "alert alert-danger");
            a.setAttribute("role", "alert");
            a.innerHTML = txt; 
            this.el('#siteContainer').insertBefore(a, this.container);
            setTimeout(function(){a.parentNode.removeChild(a);}, 3500);
        },
        load: function(vwName){
            try
            {
                if(_view){_view = null;}
                console.log("Loading view " + vwName);
                _view = new _win[vwName](this);
            }catch(e){
                this.error(e.message);
            }
        },
        api: new apiSvc(apiUrl)   
    };

    that.logIn = function(){
        try
        {
            var model = {
                userName:_scope.el('#loginEmail').value, 
                password:_scope.el('#loginPassword').value, 
                rememberMe:_scope.el('#loginRemember').checked
            };
            var err = [];
            if(model.userName.length === 0){
                err.push("You must enter your email address.");
            }
            else if(model.userName.indexOf('@') === -1 || model.userName.indexOf('.') === -1){
                err.push("The email address is not valid");
            }
            if(model.password.length === 0){
                err.push("You must enter your password.");
            }else if(model.password.length < 4){
                err.push("You're password should have 4+ characters.");
            }
            if(err.length){
                _scope.el("#loginError").innerHTML = err.join("<br>");
                return;
            }
            _scope.api.auth(model, function(r){
                _scope.security.email = model.userName;
                _scope.security.token = r.accessToken;
                _scope.security.isAuth = true;

                _scope.api.setToken(r.accessToken);

                _scope.el('#loginCancelBtn').click();
                _scope.el('#logInNav').style.display = 'none';
                _scope.el('#logOutNav').style.display = '';
                _scope.el('#userNameNav').childNodes[0].nodeValue = model.userName;
                
                _scope.load('homeView');

                _scope.el('#loginEmail').value = _scope.el('#loginPassword').value = "";
                _scope.el('#loginRemember').checked = false;
            }, function(err){
                if(err && err.msg){_scope.el("#loginError").innerHTML = err.msg;}
                else{_scope.el("#loginError").innerHTML = "An unhandled exception has ocurred.";}
            });
        }
        catch(e){
            _scope.error(e.message);
        }
    };
    
    that.logOff = function(){
        if(_view){ _view = null; }

        _scope.security.token = null;
        _scope.security.userName = null;
        _scope.security.isAuth = false;

        _scope.el('#logInNav').style.display = '';
        _scope.el('#logOutNav').style.display = 'none';
        _scope.el('#userNameNav').childNodes[0].nodeValue = '';
        _scope.container.innerHTML = '';        
    };

    (function(){
        try
        {
            _scope.container = _scope.el('#viewsContainer'); 
            _scope.el('#logInBtn').addEventListener('click', that.logIn);
            _scope.el('#logOffBtn').addEventListener('click', that.logOff);
            _scope.el('#companyNav').addEventListener('click', function(){
                _scope.load('test1View');
            });
        }
        catch(e)
        {
            _scope.error(e.message);
        }
    })();
}