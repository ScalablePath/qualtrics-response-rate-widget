function apiSvc(apiUrl){
    var _apiUrl = apiUrl;
    var _token = "";

    var _call = function(method, path, model, succFn, errFn){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) { 
            if (xhr.readyState !== 4){return;}
            if(xhr.status === 200) {
                if(successFn){
                    successFn(xhr.responseText);
                }
            }else{
                if(errorFn){
                    errorFn( { status:xhr.status, msg:xhr.responseText } );
                }
            }
        };

        if(_token){
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        }
        if(method !== 'GET'){
            xhr.open(method, _apiUrl + "/" + path, true);
            xhr.setRequestHeader('Content-type', 'text/html');
            xhr.send(JSON.stringify(data));
        }else{
            var params = "?";
            if(model){
                for (var p in model) {
                    if (model.hasOwnProperty(p)) {
                        params += p + "=" + model[p] + "&";
                    }
                }
            }
            xhr.open(method, _apiUrl + "/" + path + params, true);
            xhr.send();
        }        
    };

    this.setToken = function(token){
        _token = token;
    };
    this.auth = function(model, succ, err){
        if(model.userName === 'hernan.bazzino@gmail.com' && model.password === '123456'){
            succ({accessToken:"***test_token***"});
        }else{
            err({status:401, msg:"Invalid credentials"});
        }
        /*_call('POST', 'auth', model, succ, err);*/
    };
    this.filters = function(succ, err){
        succ({
            surveys:[{id:1, name:'Survey 1'}, {id:2, name:'Survey 2'}],
            countries:[{id:2, name:'Agrnetina'}, {id:3, name:'Switzerland'}, {id:1, name:'United States'}],
            channels:[{id:1, name:'Channel 1'}, {id:2, name:'Channel 2'}],
            partners:[{id:1, name:'Partner 1'},{id:2, name:'Partner 2'}]
        });
        /*_call('GET', 'filters', null, succ, err);*/
    };
    this.graph = function(model, succ, err){
        succ({});
        /*_call('GET', 'graph', model, succ, err);*/
    };
    this.rates = function(model, succ, err){
        succ({ rate:66.4, invites:1500, partials:53, finished: 250});
        /*_call('GET', 'graph', model, succ, err);*/
    };
}