$('#hello-button').on('click', showHello);
$('#name-button').on('click', showName);
var helloTemplate = Handlebars.compile($('#hello-template').html());
var nameTemplate = Handlebars.compile($('#name-template').html());

function showHello() {
    var data = { name: 'world' };
    var html = helloTemplate( data );
    $('#main').html( html );
}

function showName() {
  var data = { name: { first: 'George',
                       last: 'Washington'
                     }
             };
  var html = nameTemplate(data);
  $('#main').html( html );
}