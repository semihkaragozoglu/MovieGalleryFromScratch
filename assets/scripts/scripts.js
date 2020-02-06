var clientHelper = apiClientHelper("http://www.omdbapi.com/?apikey=c4f93612&");

const sliderQueryArray = [{
    "s": "Harry Potter",
    "type": "movie"
}, {
    "s": "Lord of the rings",
    "type": "movie"
}, {
    "s": "Batman",
    "type": "movie"
}, {
    "s": "x-men",
    "type": "movie"
}, {
    "s": "Marvel",
    "type": "movie"
}, {
    "s": "Matrix",
    "type": "movie"
}]


var sliderItemFactory = (function () {
    function getSkeletonItem() {
        var element = document.createElement("div");
        element.classList.add("slider__item");
        element.classList.add("skeleton-box");
        return element;
    }

    function getItem(item) {
        var element = document.createElement("a");
        element.setAttribute("data-id", item.imdbID);
        element.setAttribute("data-title", item.Title);
        element.href = "javascript::void(0)";
        element.classList.add("slider__item");
        var img = document.createElement("img");
        img.src = item.Poster;
        img.alt = item.Title;
        element.append(img);
        var title = document.createElement("div");
        title.className = "title";
        var span = document.createElement("span");
        span.innerText = item.Title;
        title.append(span);
        element.append(title);
        element.onclick = function () {
            showcaseHelper.deliver(this);
            return false;
        };
        return element;
    }
    return {
        getSkeletonItem,
        getItem
    }
})();


var sliderHelper = (function () {
    var slidersSnapshot;
    slidersSnapshot = document.getElementsByClassName("slider");
    for (let i = 0; i < slidersSnapshot.length; i++) {
        slidersSnapshot[i].innerHTML = ""; //TODO: clear metodu değişecek
        for (let j = 0; j < 10; j++) {
            slidersSnapshot[i].append(sliderItemFactory.getSkeletonItem());
        }

        clientHelper.get(sliderQueryArray[i]).then(res => {
            slidersSnapshot[i].innerHTML = "";
            for (count = 0; count < res.Search.length; count++) {
                slidersSnapshot[i].append(sliderItemFactory.getItem(res.Search[count]));
            }
            slidersSnapshot[i].style.width = (res.Search.length * 270) + "px"; 
            return res;
        });
    }
})();


var showcaseHelper = (function () {
    var mainView = document.getElementsByClassName("main-view")[0];
    var header = document.getElementsByTagName("header")[0];
    mainView.getElementsByClassName("close")[0].onclick = function () {
        showcaseHelper.initState();
        return false;
    };

    slidersSnapshot = document.getElementsByClassName("slider");

    function initState() {
        mainView.classList.remove("showcase"); 
        mainView.classList.remove("selected");
        mainView.setAttribute('data-after', "");
        header.classList.remove("closed");
        mainView.style.backgroundImage = "";
        historyAPI.initState();
        for (i = 0; i < slidersSnapshot.length; i++) {
            slidersSnapshot[i].classList.remove("active");
        }
    }

    function deliver(item) {
        // set loading;   
        if(item)
        {
            var id = item.getAttribute("data-id");
            clientHelper.post(id).then(res => {
                console.log(res);
                res.Poster = res.Poster.slice(0, -6) + "1920.jpg"; 
                mainView.style.backgroundImage = "url(" + res.Poster + ")"; 
                mainView.classList.add("showcase");
                mainView.classList.add("selected");
                header.classList.add("closed"); 
                mainView.setAttribute('data-after', res.Plot);
                item.parentElement.classList.add("active"); 
                historyAPI.pushState(item);
            }); 
        }
        else{
            mainView.classList.add("showcase");
            mainView.setAttribute('data-after', "");
            header.classList.add("closed");  
        } 
    }
    return {
        deliver,
        initState
    }
})();


var historyAPI = (function (item) {
    var state = {};
    var url = "index.html?";

    function pushState(item) {
        var title = item.getAttribute("data-title");
        history.pushState(state, title, url + title);
    }

    function initState() {
        history.pushState(state, "Demo Project", url);
    }
    return {
        pushState,
        initState
    }
})();

var keyboardAccessibilityHelper = (function (item) {
    const arrows = {
        LEFT: 'left',
        TOP: 'top',
        RIGHT: 'right',
        BOTTOM: 'bottom'
    }
    function getElIndex(el) {
        for (var i = 0; el = el.previousElementSibling; i++);
        return i;
    }
    function setFocus(e,arrow) {
        e.preventDefault();
        var nav =  document.getElementsByTagName("nav")[0];
        var previousFocus = document.activeElement;
        if (previousFocus.tagName === "A") { // inside my slider || navigatior
            if(previousFocus.parentElement.tagName === "NAV"){
                if(arrow === arrows.RIGHT || arrow == arrows.LEFT)
                {
                    document.getElementsByClassName("mrow")[0].firstElementChild.firstElementChild.focus();
                }
                else{ 
                    if(arrow === arrows.TOP && previousFocus.previousElementSibling){
                        previousFocus.previousElementSibling.focus();
                    }  
                    if(arrow === arrows.BOTTOM && previousFocus.nextElementSibling){
                        previousFocus.nextElementSibling.focus();
                    }
                }
            }
            else{
                switch(arrow){
                    case arrows.LEFT:{
                        if(previousFocus.previousElementSibling){
                            previousFocus.previousElementSibling.focus();
                        }
                        else{
                            if(previousFocus.parentElement.parentElement.previousElementSibling && previousFocus.parentElement.parentElement.previousElementSibling.tagName !== "BUTTON"){
                                previousFocus.parentElement.parentElement.previousElementSibling.firstElementChild.lastElementChild.focus();
                            }
                            else{
                                document.getElementsByTagName("nav")[0].firstElementChild.focus();
                            }
                        }
                        break;
                    }
                    case arrows.TOP:{
                        if(previousFocus.parentElement.parentElement.previousElementSibling && previousFocus.parentElement.parentElement.previousElementSibling.tagName !== "BUTTON"){
                            previousFocus.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.focus();
                        }
                        else{
                            document.getElementsByTagName("nav")[0].firstElementChild.focus();
                        }
                        break;
                    }
                    case arrows.RIGHT:{
                        if(previousFocus.nextElementSibling){
                            previousFocus.nextElementSibling.focus();
                        }
                        else{
                            if(previousFocus.parentElement.parentElement.nextElementSibling){
                                previousFocus.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.focus();
                            }
                            else{
                                // liste bitti
                            }
                        }
                        break;
                    }
                    case arrows.BOTTOM:{
                        if(previousFocus.parentElement.parentElement.nextElementSibling){
                            previousFocus.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.focus();
                        }
                        else{
                            // liste bitti
                        }
                        break;
                    }

                } 
            } 
        } else { // init
            document.getElementsByTagName("nav")[0].firstElementChild.focus();
        } 
    }  

    document.onkeydown = function (e) {
        e = e || window.event;

        switch (e.keyCode) {
            case 27: //esc
            {
                showcaseHelper.initState();
                break;
            }
            case 37: { //left
                setFocus(e,arrows.LEFT);
                break;
            }
            case 38: { //up
                setFocus(e,arrows.TOP);
                break;
            }
            case 39: { //right
                setFocus(e,arrows.RIGHT);
                break;
            }
            case 40: { //down
                setFocus(e,arrows.BOTTOM);
                break;
            }

            default:
                break;
        }
    };
})();