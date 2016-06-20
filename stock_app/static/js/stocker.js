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
                var data = hist_data[keys[i]]
                var diff = data['Diff'];
                var report = '<p id="item' + i + '">' + keys[i] + ': ' + diff + ": " + data['Change'] +  '</p>';
                var temp  = $(report);
                $("#data").append(temp);
                if (parseFloat(data['Change']) < 0) {
                    $("#item" + i).css("background-color", "#ff4d4d");
                    $("#item" + i).css("width", '50%');
                } else {
                    $("#item" + i).css("background-color", "#47d147");
                }


            }
        });
    });


});


