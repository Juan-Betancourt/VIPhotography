// Nav Bar
$("document").ready(function() {

    //Slide out nav bar
    $("#click-toggle-circle").click(function() {
        //Slide menu out on click
        $("#slide-out").toggle("slide", 600);

        //Close arrow on click
        $("#click-toggle-circle").fadeOut(300);
        $("#click-toggle-arrow").fadeOut(300);

        //Show other arrow on click
        setTimeout(function() {
            $("#arrow").fadeIn(800);
            $("#circle").fadeIn(800);
        }, 500);

        /* Delay fade in nav items */
        setTimeout(function() {
            $("#slide-out a").fadeIn(800);
        }, 1000);

        return false;
    });


    //Slide out nav bar
    $("#slide-out").click(function() {
        $("#slide-down").toggle("slide", 800, { direction: "up" });
        return false;
    });


    //Slide nav bar back in
    $("#circle").click(function() {
        //Hide button on click
        $("#circle").fadeOut(200);
        $("#arrow").fadeOut(200);

        /* Fade out nav items */
        $("#slide-out a").fadeOut(0);


        //Slide nav menu back in
        $("#slide-out").toggle("slide", { direction: "left" }, 400);

        //Reveal nav button again
        $("#click-toggle-arrow").fadeIn(900);
        $("#click-toggle-circle").fadeIn(900);
        return false;
    });
});