var MickmanAppLogin = MickmanAppLogin || {};

var dbShell; //database name variable
var settings; //whether the db is loaded ie on or off
var product;
var cart;
var order;

// Begin boilerplate code generated with Cordova project.

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready'); 
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

app.initialize();

// End boilerplate code.

$(document).on("mobileinit", function (event, ui) {
    $.mobile.defaultPageTransition = "slide";
});

app.signInController = new MickmanAppLogin.SignInController(); //call the signin controller
app.catalogController = new MickmanAppLogin.CatalogController(); //call the catalog controller 
app.cartController = new MickmanAppLogin.CartController(); //call the cart controller 

$(document).on("pagecontainerbeforeshow", function (event, ui) {
    if (typeof ui.toPage == "object") {
        switch (ui.toPage.attr("id")) {
            case "page-signin":
                // Reset signin form.
                app.signInController.resetSignInForm();
                break;
        }
    }
});

//Check for Sign-in
$(document).on("pagecontainerbeforechange", function (event, ui) {
    if (typeof ui.toPage !== "object") return;
    switch (ui.toPage.attr("id")) {
        case "page-signin":
            if (!ui.prevPage) {
                // Check session.keepSignedIn and redirect to main menu.
                var session = MickmanAppLogin.Session.getInstance().get(),
                    today = new Date();
                if (session && session.keepSignedIn && new Date(session.expirationDate).getTime() > today.getTime()) {
                    ui.toPage = $("#page-main-menu");  
                    console.log("Redirect");              
                }else{
	                console.log("Not Logged in" + session.keepSignedIn + new Date(session.expirationDate).getTime() > today.getTime());
                }
            }
    }
});

//Login Button
$(document).delegate("#page-signin", "pagebeforecreate", function () {

    app.signInController.init();
    
    app.signInController.$btnSubmit.off("tap").on("tap", function () {
        app.signInController.onSignInCommand();
    });
    
});

//Catalog Loaded
$(document).delegate("#page-main-menu", "pageshow", function () {
	app.catalogController.init();
    app.catalogController.getSavedData();
});


//Add to Cart Button
$(document).delegate("#page-main-menu", "pagebeforecreate", function () {
    app.cartController.init();
    app.cartController.$btnAdd.off("tap").on("tap", function () {
        app.cartController.addpricetoPopup($(this).data("num"));
        console.log("activated");
    });
});

localforage.config({
    driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
    name        : 'mickApp',
    version     : 1.0,
    size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'keyvalue_pairs', // Should be alphanumeric, with underscores.
    description : 'products'
});
