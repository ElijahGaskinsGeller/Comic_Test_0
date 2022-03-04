function GetPageHeight() {
    return Math.max(document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight);
}

function WindowScrollNormalPosition() {
    return window.scrollY / (GetPageHeight() - window.innerHeight);
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

function RectNormalPositionOnScreen(rectY, rectHeight, screenHeight){
    let start = screenHeight;
    let end = -rectHeight;

    //NOTE: (x-min)/(max-min)
    let result = (rectY-start)/(end-start);

    return result;

}


function RunTheThing(_this, lib, stage) {
    function scrollEvent() {
        destination = lerp(start, end, WindowScrollNormalPosition());
    }

    // let page = new lib.page(0, 0);
    // _this.addChild(page);
    let page = _this.page;
    let infoText = _this.info_text;

    console.log(_this);
    console.log(infoText);
    console.log(lib);
    console.log(stage);
    console.log(page);

    let destination = page.y;
    let smoothScroll = false;

    console.log(page.nominalBounds);
    let start = page.y;
    let end = page.y - page.nominalBounds.height + stage.canvas.height;

    page.panel_3.gotoAndStop(0);

    scrollEvent();

    //NOTE: localToGlobal(0,0) gets the absolute position of a panel.
    //NOTE: having the border as a movieclip and getting its bounds solves the problem of bounds not accounting for masking
    document.addEventListener("scroll", function (e) {
        // console.log(page);
        scrollEvent();
        let normPos = RectNormalPositionOnScreen(page.panel_3.localToGlobal(0,0).y, page.panel_3.panel_3_border.nominalBounds.height, stage.canvas.clientHeight)
        infoText.text = "info: \n\t"+
                        "y: "+page.panel_3.localToGlobal(0,0).y+
                        "\n\tbounds: "+page.panel_3.panel_3_border.nominalBounds+
                        "\n\tnorm: "+normPos;

        let total = page.panel_3.totalFrames;


        let currentFrame = page.panel_3.currentFrame;
        let nextFrame = total * normPos;

        if(nextFrame != currentFrame && nextFrame >= 0 && nextFrame <= total){
            page.panel_3.gotoAndStop(nextFrame);
        }

    });


    let oldTime = 0;

    function render(time) {
        time *= .001;
        let deltaTime = time - oldTime;
        oldTime = time;

        let scrollSpeed = 1000 * deltaTime;

        if (smoothScroll) {

            if (destination < page.y) {
                console.log("before:" + page.y);
                page.y -= scrollSpeed;
                console.log("after:" + page.y);
                if (destination > page.y) {
                    console.log("lock:" + page.y);
                    destination = page.y;
                }
            } else if (destination > page.y) {
                console.log("before:" + page.y);
                page.y += scrollSpeed;
                console.log("after:" + page.y);
                if (destination < page.y) {
                    console.log("lock:" + page.y);
                    destination = page.y;
                }
            }
        } else {
            page.y = destination;
        }

        // page.mask.x = stage.mouseX;
        // page.mask.y = stage.mouseY;

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
