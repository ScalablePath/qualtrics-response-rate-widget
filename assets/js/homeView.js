function homeView(scope){
    var _scope = scope;
    var _needsAuth = true;

    var _load = function(){
        _scope.api.filters(function(data){
            _scope.el('#cmbSurvey').innerHTML = 
            "<option value='' selected='true' disabled='true'>Survey...</option>" + 
            data.surveys.map(function(ch){
                return '<option value="' + ch.id + '">' + ch.name + "</option>";
            }).join();
             _scope.el('#cmbCountry').innerHTML = 
            "<option value='' selected='true' disabled='true'>Country...</option>" + 
            data.countries.map(function(ch){
                return '<option value="' + ch.id + '">' + ch.name + "</option>";
            }).join();
             _scope.el('#cmbPartner').innerHTML = 
            "<option value='' selected='true' disabled='true'>Partner...</option>" + 
            data.partners.map(function(ch){
                return '<option value="' + ch.id + '">' + ch.name + "</option>";
            }).join();
             _scope.el('#cmbChannel').innerHTML = 
            "<option value='' selected='true' disabled='true'>Channel...</option>" + 
            data.channels.map(function(ch){
                return '<option value="' + ch.id + '">' + ch.name + "</option>";
            }).join();
        }, _scope.error);
    };

    var _filter = function(){
        var model = {
            survey:_scope.el('#cmbSurvey').value,
            country:_scope.el('#cmbCountry').value,
            partner:_scope.el('#cmbPartner').value,
            channel:_scope.el('#cmbChannel').value,
            startDate:_scope.el('#dtStartDate').value,
            endDate:_scope.el('#dtEndDate').value
        };
        
        console.log(JSON.stringify(model));

        _scope.api.graph(model, function(data){
            var chart = c3.generate({
                bindto: '#chart',
                data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25],
                    ['data3', 230, 190, 300, 500, 300, 400],
                    ['data4', 130, 150, 200, 300, 200, 100]
                ]
                }
            });
        }, _scope.error);
        _scope.api.rates(model, function(data){
            _scope.el('#ratePercentage').innerHTML = data.rate + '%';
            _scope.el('#rateInvites').innerHTML = data.invites;
            _scope.el('#ratePartials').innerHTML = data.partials;
            _scope.el('#rateFinished').innerHTML = data.finished;
        }, _scope.error);
    };
    (function(){
         if(_needsAuth && !_scope.security.isAuth){
            _scope.error({status:401});
            return;
        }
        _scope.render('home.html', function(){
            _scope.el('#btnFilter').addEventListener('click', _filter);
            _load();
            _filter();
        });
    })();
}