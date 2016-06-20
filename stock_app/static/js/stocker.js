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
                var report = '<div id="bar"><div id="slide' + i + '" class="slider"><p>&nbsp;</p></div></div>';
                var temp  = $(report);
                $("#data").append(temp);
                if (parseFloat(data['Change']) < 0) {
                    $("#slide" + i).css({"background-color": "#ff4d4d", "width": percent_change(data['Change']) + "%", "left": 50 - percent_change(data['Change']) + "%"});
                    
                } else {
                    $("#slide" + i).css({"background-color": "#47d147", "width": percent_change(data['Change']) + "%", "left": "50%"});
                }
           }
        });
    });


});
function percent_change(percent) {
    // -5 (-50) to 5 (50)
    return Math.abs(percent * 10);


}

