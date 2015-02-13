// after indexedDB is complete, replace this array with database lookups
var addressLookup = [];

var stringShorter = function( string, len ){
    len = ( len || 15 ) - 3;

    if ( (string).length >= len ){
        string = (string.slice(0,15) + "...");
    }

    return string;
};

var addressCheck = function(string2check){
    var matcher = /BM-[a-zA-Z0-9]+/ ;
    if(typeof(string2check) == 'string' && string2check.match(matcher) ){
        return true;
    }
};

var processAddy = function( address, len ){
    var index = $.scope.addressBook.indexOf.call( addressLookup, 'address', address );
    if( index !== -1 ){
        address = addressLookup[index].alias;
    }
    
    return address ;
};

var insertAddresses = function(){
    var convertAddress = function( $element ){
        var address = processAddy( $element.html() );
        address = stringShorter( address );
        $element.html( address );
    };
    $(document).on('DOMNodeInserted', function(event) {
        if ( $( event.target ).is('.addyBook') ){
            convertAddress( $( this ) );
        }else{
            $( event.target ).find( '.addyBook' )
                .each(function( key, value ){
                    convertAddress( $( value ) );
                });
        }
    });
};

var addressesBook = function(){
    localDB.getAddresses().done(function(book){
        $.scope.addressBook.push.apply( $.scope.addressBook, book );
        addressLookup.push.apply( addressLookup, book );
    })
    insertAddresses()
};

// add new address book entry
$('[alias="addAddressEntry"]').on( 'submit', function( event ){
    event.preventDefault();
    var formData = $( this ).serializeObject();

    if( !addressCheck( formData.address ) ){
        alert("Malformed address.");
        return false;
    }

    if( $.scope.addressBook.indexOf.call( addressLookup, 'address', formData.address ) !== -1 ){
        alert("Address already in use.");
        return false;
    }
    localDB.createAddress(formData)
    $.scope.addressBook.push( formData );
    $('[alias="addAddressEntry"]')[0].reset();

});

// delete address book entry
$('#addressBookModal').on( 'click', 'button.delete', function(){
    var alias = $( this ).parents( '[jq-repeat-index]' ).attr( 'data-alias' );
    console.log(alias)
    db.remove('addressbook', alias).done(function(){
        var index = $.scope.addressBook.indexOf( 'alias', alias );
        $.scope.addressBook.splice( index, 1 );
    })
});
