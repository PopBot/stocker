var refresh_int;

$(document).ready(function() {

    $("#submit").click(function(e) {
        
        e.preventDefault();
        clearInterval(refresh_int);
        var stock = $('#get_stock').val();
        // $(".sk-folding-cube").css("display", "block");
        $.getJSON('/api/get_stock/' + stock, function(data) {
            if (data[0] == "failure") {
                console.log('failure');
                $('#fail').html("<strong> ALERT: </strong>" + stock + " is not a valid ticker");
                $('#fail').css("display", 'block');
            } else {
                $('#stock_data').css("display", 'block');
                $('#name').html(data.name);
                $('#day_change').html(data.day_change);
                $('#pe').html("PE Ratio: " + data.pe);
                console.log(data.pe);
                $('#fail').css("display", 'none');
                $('#data').empty();
                $('#current').html(data.current_price);
                var hist_data = data.historical_data;
                var keys = Object.keys(hist_data);
                keys.sort(function(a, b){
                    return new Date(b) - new Date(a);
                });
                for (var i = 0; i < keys.length - 1; i++) {
                    var last = hist_data[keys[i + 1]]['Close'];
                    var data = hist_data[keys[i]];
                    var change = get_percent(last, data['Close']);
                    var report = '<div id="bar"><div id="slide' + i + '" class="slider"><span class="tooltiptext">' + keys[i] + ': <br>' + data['Close'] + '</span></div></div>';
                    var temap  = $(report);
                    $("#data").append(temap);
                    if (change < 0) {
                        $("#slide" + i).css({"background-color": "#ff4d4d", "width": percent_change(change) + "%", "left": 50 - percent_change(change) + "%"});
                        $("#slide" + i).addClass("red");
                        
                    } else {
                        $("#slide" + i).css({"background-color": "#47d147", "width": percent_change(change) + "%", "left": "50%"});
                        $("#slide" + i).addClass("green");

                    }
                }
                $('html, body').animate({
                    scrollTop: $('#info').offset().top
                }, 1933);
            }
        });
        refresh_int = setInterval(update_price, 4000, stock);
    });
});

function update_price(stock) {
    $.getJSON('/api/get_stock/' + stock, function(data) {
        var current = $('#current').html();
        var day_change = $('#day_change').html();
        console.log("test" + current + " " + day_change);
        $('#current').html(data.current_price);
        $('#day_change').html(data.day_change);
        console.log(data.current_price + ' ' + data.day_change);
        console.log("HEY");
        var diff = data.current_price - current;

        if (diff > 0) {
            flash_color('#47d147');
        } else if (diff < 0) {
            flash_color('#ff4d4d');
        }
    });
}

function flash_color(color) {
    $('#current').css("background-color", color);
    setTimeout(flash_color, 500, '');
}

function get_percent(old, cur) {
    return ((cur - old) / old) * 100
}

function percent_change(percent) {
    // -5 (-50) to 5 (50)
    return Math.abs(percent * 10);


}


