$(document).ready(function() {
    console.log('it works');
    $("#submit").click(function(e) {

        e.preventDefault();
        var stock = $('#get_stock').val();
    
        $.getJSON('/api/get_stock/' + stock, function(data) {
            $('#name').html(data.name);
            $('#data').empty();
            $('#current').html(data.current_price);
            var hist_data = data.historical_data;
            var keys = Object.keys(hist_data);
            keys.sort(function(a, b){
                return new Date(b) - new Date(a);

            });
            console.log(keys);
            for (var i = 0; i < keys.length; i++) {
                var report = '<p>' + keys[i] + ': ' + hist_data[keys[i]]['Open'] + ': ' + hist_data[keys[i]]['Close'] + '</p>';
                var temp  = $(report);
                $("#data").append(temp);

            }
        });
    });


});


