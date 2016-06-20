$(document).ready(function() {
    console.log('it works');
    $.getJSON('/api/get_stock/AAPL', function(data) {
        $('#name').html(data.name);
        $('#current').html(data.current_price);
        var hist_data = data.historical_data;
        var keys = Object.keys(hist_data);
        for (var i = 0; i < keys.length; i++) {
            var report = '<p>' + keys[i] + ': ' + hist_data[keys[i]]['Open'] + ': ' + hist_data[keys[i]]['Close'] + '</p>';
            var temp  = $(report);
            $("#data").append(temp);

        }
    });


});
