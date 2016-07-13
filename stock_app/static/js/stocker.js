var refresh_int;
var stock_name;
var stock_ticker;
var first_stock;
var dates;


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
                stock_name = data.name;
                stock_ticker = stock.toUpperCase();
                $('#day_change').html(data.day_change);
                $('#pe').html("PE Ratio: " + data.pe);
                $('#eps').html("EPS: " + data.eps);
                console.log(data.pe);
                $('#fail').css("display", 'none');
                $('#data').empty();
                $('#current').html(data.current_price);
                var hist_data = data.historical_data;
                var keys = Object.keys(hist_data);
                keys.sort(function(a, b){
                    return new Date(b) - new Date(a);
                });
                first_stock = hist_data;
                dates = keys;
                for (var i = 0; i < keys.length - 1; i++) {
                    var last = hist_data[keys[i + 1]]['Close'];
                    var data = hist_data[keys[i]];
                    var change = get_percent(last, data['Close']);
                    var report = '<div class="bar" id="bar' + i + '"><div id="slide' + i + '" class="slider"><span class="tooltiptext">' + keys[i] + ': <br>' + data['Close'] + '</span></div></div>';
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

    $("#compare_listen").click(function(e) {
        console.log("yo");
        e.preventDefault();
        var stock_2 = $("#get_compare").val();
        $.getJSON('/api/get_stock/' + stock_2, function(data) {
            if (data[0] == "failure") {
             $('#success').css("display", "none");
                $('#fail_2').html("<strong> ALERT: </strong>" + stock_2 + " is not a valid ticker");
                $('#fail_2').css("display", 'block');
            } else {
                console.log("what");
                $('#fail_2').css("display", "none");
                $('#success').html("Comparing <strong>" + stock_name + " (" + stock_ticker + ")</strong> and <strong>" + data.name + " (" + stock_2.toUpperCase() + ")</strong>!");
                $('#success').css("display", 'block');
                var second_stock = data.historical_data;
                for (var i = 0; i < dates.length - 1; i++) {
                    var change_1_y = first_stock[dates[i + 1]]['Close'];
                    var change_1_t = first_stock[dates[i]]['Close'];
                    var change_1 = get_percent(change_1_y, change_1_t);

                    var change_2_y = second_stock[dates[i + 1]]['Close'];
                    var change_2_t = second_stock[dates[i]]['Close'];
                    var change_2 = get_percent(change_2_y, change_2_t);
                    $("#slide" + i + " .tooltiptext").html(dates[i] + ': <br>' + stock_ticker + ': ' + round_hund(change_1) +
                        "<br> vs. <br>" + stock_2.toUpperCase() + ": " + round_hund(change_2));
                    var diff = change_2 - change_1;
                    if (diff < 0) {
                        $("#slide" + i).css({"background-color": "#ff4d4d", "width": percent_change(diff) + "%", "left": 50 - percent_change(diff) + "%"});

                    } else {
                        $("#slide" + i).css({"background-color": "#47d147", "width": percent_change(diff) + "%", "left": "50%"});
                    }
                }
            }
        });
    });

    var links = jQuery('a[href^="#"]').add('a[href^="."]');
    $(links).on('click', function(event) {
        event.preventDefault();
        var dest = $(this).attr('href');
        $(dest).slideToggle("slow");

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

// returns a % rounded to the hund and with the appropriate +/- sign
function round_hund(num) {
    var num2 = (Math.round(num * 100.0) / 100.0).toFixed(2);
    if (num2 > 0) {
        var num2 = "+" + num2;
    }
    return num2 + "%";
}
