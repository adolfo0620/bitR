// populate chans list on page load
$(document).ready(function(){
    localDB.getAllChanSubscriptions().done(function(data){
        if (data.length > 0){
            data.chans.forEach(function(value) {
                $.scope.chans.push(value);
                $.scope.post_chan_list.push(value);
                addressLookup.push({
                    alias: value.chan_label,
                    address: value.chan_address
                });
            });
        }
    })


    // creates a chan
    $("#chan-form").submit(function(e){
        e.preventDefault();
        var info = {};
        info.form = $("#chan_name").val();
        $( '#chan-form' ).trigger('reset');
        util.apiCall({
            url: 'create_chan',
            data: info,
            callBack: function(data){
                $.scope.chans.push(data);
                $.scope.post_chan_list.push(data);
                $('#create_chan').modal('toggle');
                localDB.addChanSubscription(data)
            }
        });            
    });
})

// join chan
$( '#sub_chan_btn' ).click(function() { // why not submit
    var info = {} ;
    info.label = $( '#chan_label' ).val();
    info.address = $( '#chan_addy' ).val();
    util.apiCall({
        url: 'joinchan',
        data: info,
        callBack: function (data){
            if ( 'error' in data ){
            } else {
                $.scope.chans.push(data);
                $.scope.post_chan_list.push(data);
                localDB.addChanSubscription(data)
            }
        }
    });
});

// post message to chan, DRY out with above
$( '#post_chan_form' ).on("submit", function(event) {
    event.preventDefault();
    var form_data = $(this).serializeObject();
    form_data.send_addy = 'chan_post';
    $( '#post_chan_form' ).trigger('reset');
    util.apiCall({
        url: 'send',
        data: form_data
    });
});

// select chans to display 
$('#chan_ul').on( 'click', 'li.jq-repeat-chans > label', function(){
    var selected_chans = $('#chan_tab').text();
    var val = '.' + $( this ).parent().attr('data-chan-add');
    $( val ).toggle();
});

// show the chan tab
$('#secondary').on( 'click', function(){
    $('#identityDrop').hide()
    $('.inbox-bucket').children().hide();
    $( '#primary' ).removeClass( 'btn-material-blue-grey-100' );
    $( this ).addClass( 'btn-material-blue-grey-100' );
    $('#chan_tab').show()
    $('#chan_mess').show();
    // this next line is not working.  whyyyyyyyyyy
    $( '.id_checks' ).prop('checked', false)
});