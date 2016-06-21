$(document).ready(function() {
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
            for (var i = 0; i < keys.length - 1; i++) {
                var last = hist_data[keys[i + 1]]['Close'];
                var data = hist_data[keys[i]];
                var change = get_percent(last, data['Close']);
                console.log(last + " " + data['Close']);
                var report = '<div id="bar"><div id="slide' + i + '" class="slider"><span class="tooltiptext">' + keys[i] + ': ' + data['Close'] + '</span></div></div>';
                var temp  = $(report);
                $("#data").append(temp);
                if (change < 0) {
                    $("#slide" + i).css({"background-color": "#ff4d4d", "width": percent_change(change) + "%", "left": 50 - percent_change(change) + "%"});
                    $("#slide" + i).addClass("red");
                    
                } else {
                    $("#slide" + i).css({"background-color": "#47d147", "width": percent_change(change) + "%", "left": "50%"});
                    $("#slide" + i).addClass("green");

                }
           }
        });
    });
    

});
function get_percent(old, cur) {
    return ((cur - old) / old) * 100
}
function percent_change(percent) {
    // -5 (-50) to 5 (50)
    return Math.abs(percent * 10);


}

