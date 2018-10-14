$(window).on("load",function(){
    $('.astronaut').css('display','table');
});


function getCurrentPage(scrollPos,upperBounds){//return the current page (which is the id of the respective progress-option) ie. #projects for projects page
        if(scrollPos>=upperBounds[4]){
            return '#contact';
        }else if(scrollPos>=upperBounds[3]){
            return '#coursework';
        }else if(scrollPos>=upperBounds[2]){
            return '#projects';
        }else if(scrollPos>=upperBounds[1]){
            return '#experience';
        }else if(scrollPos >= upperBounds[0]){
            return '#skills';
        }else{
            return '#home';// current page is the 'home' page, though it has no progress option
        }
}
//toggle between mobile and wide versions of header menu based on screen size
function headerMenuToggle(){
    var width = parseInt($(window).width());
    if(width > 1000){
        $('.header-menu-wide').css('display','table');
        $('.mobile').css('display','none');
    }else{
        $('.header-menu-wide').css('display','none');
        $('.mobile-page-title').css('display','table');
        $('#menu-open').css('display','block');
        
    }
}

//display header menu if current 'page' (section) is not the home page, hide otherwise. Additionally change background img based on current section and highlight the current page
function headerMenu(prevScrollPage,currentPage){
    if(!prevScrollPage || prevScrollPage!=currentPage){//if there is a page change or webpage just loaded
        if(currentPage!='#home'){
            $(".header-menu").css("display","block");
            $(".progress-option").children('img').attr('src','resources/nothing.png');
            $(".progress-option").css('color','#d6d6d6');   
            $(currentPage).css("color","white");
            $(currentPage).children('img').attr('src','resources/menu-hover.png');
            $(".mobile-page-title").html(currentPage.substr(1));
        
            if(currentPage=='#contact'){
                $(".progress-option").css('color','white'); 
                $('.header-menu').css("background-image","url('resources/background5.png')");
                $('.header-menu-mobile').css("background-image","url('resources/background5.png')");
                
                //IF SCORE IS AVAILABLE, CONGRATULATE PLAYER
                var score = $(".score").html();
                var congratulations = score.substring(0,15);
                if($(".score").css('display')!='none' && congratulations!='congratulations'){
                    $(".score").html("congratulations! " + score);
                    setInterval(function(){
                        $('.score').css('color','yellow');
                        setTimeout(function(){$('.score').css('color','white');},100);
                    },200);
                }
                
            }else if(currentPage=='#coursework'){
                $(".header-menu").css("background-image","url('resources/background4.png')");
                $('.header-menu-mobile').css("background-image","url('resources/background4.png')");
            }else if(currentPage=='#projects'){
                $(".header-menu").css("background-image","url('resources/background3.png')");
                $('.header-menu-mobile').css("background-image","url('resources/background3.png')");
            }else if(currentPage=='#experience'){
                $(".header-menu").css("background-image","url('resources/background3.png')");
                $('.header-menu-mobile').css("background-image","url('resources/background3.png')");
            }else{ // scrollPos=='#skills'
                $(".header-menu").css("background-image","url('resources/background2.png')");
                $('.header-menu-mobile').css("background-image","url('resources/background2.png')");
            }
            //for mobile, change title
            
        }else{
            $(".header-menu").css("display","none");
            $('.header-menu-mobile').css("display","none");
        }
    }
}

//display the skills and animate the skillbar, with the category of skills indicated by the html content of categoryHolder
function displaySkills(categoryHolder){
    //a dictionary of skills for each category, key is the name of the category and value is a dictionary with skills and respective proficencies
    var skills = {'Languages':{'C++':'85%','Python':'75%','HTML':'90%','Javascript':'75%','CSS':'75%','PostgreSQL':'50%'},
              'Frameworks':{'React':'80%','Redux':'50%','Node.js':'50%','jQuery':'70%','Bootstrap':'50%','Flask':'50%'},
              'Software':{'Git':'80%','Heroku':'60%','pgAdmin':'80%','Adobe Illustrator':'50%'}};
    
        var category= categoryHolder.html(); //get the hovered category
        $('.stats-skills-category').css('color','black');//change other options back to black
        categoryHolder.css('color','purple');//change hovered option to purple
        $('.skills-category-label').html(category);
        
        //animate skills
        categoryClass= '.' + category;
        $('.skills-category').css('display','none');//hide other skills sections 
        $(categoryClass).css('display','block');//display hovered one
        $(categoryClass).children('li').each(function(){
            var skillName= $(this).children('div').first().html();
            var proficiency = skills[category][skillName];
            var skillbar = $(this).children('.skillbar').children('.skillbar-filled');
            skillbar.css('width','0%');
            skillbar.animate({'width':proficiency},500);
        });
    
}

function pageChange(prevScrollPage,currentScrollPage){ //returns true if oldScrollPos and scrollPos are in different pages, false otherwise
    if(prevScrollPage) //if there is a previous scroll page (webpage not just loaded)
        return prevScrollPage != currentScrollPage;
    return false;//otherwise return false by default
}
//returns true if scroll position is on stats page, false otherwise
function onStatsPage(prevScrollPage,currentScrollPage){
    return  (!prevScrollPage || pageChange(prevScrollPage,currentScrollPage)) && (currentScrollPage=='#skills');
}

function getSectionBounds(){
    var heights=[]; //array of the heights of each section
    sectionClassNames=['.home','.intro','.experience','.projects','.coursework','.contact'];//class name for each section
    for(s in sectionClassNames){
        heights.push(parseInt($(sectionClassNames[s]).css('height')));
    }
    var homePageHeight= heights[0];
    var statsPageHeight= heights[1];
    
    var sectionBounds=[homePageHeight/2];//an array of the upperbounds for position within each 'section' (starting from skills,projects,etc)
    for(var i=0; i< heights.length-1; i++){//build sectionbounds by iteratively adding the next page height
        sectionBounds.push(sectionBounds[i]+heights[i+1]);
    }
    return sectionBounds;
    
}

function fullPageHeight(){
    var totalHeight=0;
    sectionClassNames=['.home','.intro','.experience','.projects','.coursework','.contact'];//class name for each section
    for(s in sectionClassNames){
        totalHeight+= parseInt($(sectionClassNames[s]).css('height'));
    }
    return totalHeight-25;
    
}

function positionBasedEvents(scrollPos,prevScrollPage){//handle events based on scroll position, to be called on initialization and scrolling, returns current page/section
    sectionBounds= getSectionBounds();
    currentPage = getCurrentPage(scrollPos,sectionBounds);
    headerMenu(prevScrollPage,currentPage);//toggle header menu
    if(onStatsPage(prevScrollPage,currentPage)){//check if on stats page, if so display skills starting with languages
        displaySkills($('.stats-skills-category-languages'));
    }
    return currentPage;
}

function openCourseDescription(description,time){ //expands/modifies height of given course description, takes string selector of course description and time for animation 
        var textHeight = $(description).children('div').css('height');
        textHeight = (parseInt(textHeight) + 6) + 'px'; //account for border + padding
        $(description).animate({'height':textHeight},time);
        
}


$(document).ready(function(){
    var scrollPos = parseInt($(window).scrollTop());
    var prevScrollPage;
    headerMenuToggle();
    positionBasedEvents(scrollPos,prevScrollPage);//initialize page based on scroll position
    var currentMouseX;
    var currentMouseY;
    var window_width = parseInt($(window).width());
    
    $(window).scroll(function (event) { // when user scrolls
        var scrollPos = parseInt($(window).scrollTop()); //check position
        prevScrollPage= positionBasedEvents(scrollPos,prevScrollPage);
    });
    
    var prevWindowWidth=parseInt($(window).width());
    $(window).resize(function(){
        if((prevWindowWidth-window_width)>50){//if someone resizes the window really fast, push rocket out of the way immediately
            $("#rocket").stop();
            $("#rocket").css('left','100px');
        }
        window_width = parseInt($(window).width());
        pushRocket(window_width);//push the rocket if its at the edge so that it doesnt go out of bounds
        headerMenuToggle();//toggle between mobile and non-mobile header based on window width
        var scrollPos = parseInt($(window).scrollTop()); //check position
        prevScrollPage= positionBasedEvents(scrollPos,prevScrollPage); //rehandle any position based events
        $('.course-description').each(function(){
            var expanded = parseInt($(this).css('height'))>6;
            if(expanded){
                openCourseDescription(this,100);   
            }
        });
        prevWindowWidth=window_width;
    });
    
    //floating astronaut
    function astronautFloat(){
            $('.astronaut').animate({top:'+=25px'},1000,function(){
                    $('.astronaut').animate({top:'-=25px'},1000);
            });
    }
    function astronautInterval(){
        astronautFloat();
        return setInterval(function(){
                astronautFloat();
            },2100);
    }
    var floatingInterval= astronautInterval();
    $(window).focus(function() {
        if (!floatingInterval)
            floatingInterval = astronautInterval();
    });

    $(window).blur(function() {
        $('.astronaut').stop(true);
        $('.astronaut').css('top','0px');
        clearInterval(floatingInterval);
        floatingInterval=0;
    });


    /*OPTIONAL GAME CODE*/
    var canvas = document.getElementById("rocket");
    var ctx = canvas.getContext("2d");
    var img;
    var lastAngle=0;
    var score=0; // the score of the player
    function mouseMoveHandler(event){
        //record mouse position in variable outside this scope, for use of game loop
        currentMouseX= event.pageX;
        currentMouseY= event.pageY;
        
        //calculate angle in radian
        var diffX= event.pageX - parseInt($("#rocket").css('left'));
        var diffY= parseInt($("#rocket").css("top")) - event.pageY;
        var ratio;
        if(diffY!=0)
            ratio= diffX/diffY;
        else
            ratio=0;
        var angle;
        if(diffY<0){
            angle=Math.PI + Math.atan(ratio);
        }else{
            angle=Math.atan(ratio);
        }
        //rotate rocket
        ctx.clearRect(0, 0,100,100);//clear previous drawing
        ctx.translate(50,50);
        ctx.rotate(-lastAngle);//reset angle
        ctx.rotate(angle);//change to new angle
        ctx.translate(-50,-50);
        ctx.drawImage(img,12.5,12.5);//draw rotated rocket;
        lastAngle=angle;
    }
    function OutOfBorder(newX,newY,changeX,changeY){//returns true if new position (newX,newY) is out of bounds
        return ((newX<50 && changeX<0) || (newX>window_width && changeX>0)  || (newY>fullPageHeight() && changeY<0));
    }
    //COLLISION FUNCTIONS
    function getPositions(elem){//return position in this format [[left X, right X],[top Y, bottom Y]]
            var pos,width,height;
            pos = $(elem).position();
            width= $(elem).width();
            height= $(elem).height();
            return [[pos.left,pos.left+width],[pos.top,pos.top+height]];
    }
    function comparePositions(p1,p2){//each of p1 and p2 is an array with the x or y positions of an element
            //return whether x or y ranges of p1 and p2 overlap
            /* comments assume x ranges, left/right sides ... applies the same way to y ranges with top/bottom sides*/
            var r1 = p1[0] < p2[0] ? p1:p2;//set r1 to the element with left side farthest left
            var r2 = p1[0] < p2[0] ? p2:p1;//set r2 to the element with left side farthest right
            return r1[1] > r2[0] || r1[0] === r2[0];//true if the element to the left's right side overlaps other element's left
            //or if both elements left sides overlap
    }
    function collision(elem1,elem2){//determines if two elements are colliding (elem1 and elem2 are the selectors)    
        var elem1pos = getPositions(elem1);
        var elem2pos = getPositions(elem2);
        return comparePositions(elem1pos[0],elem2pos[0]) && comparePositions(elem1pos[1],elem2pos[1]);
    }
    function starCollision(rocket,star,starPath){//detects collision with star
        var topOffset = parseInt($(starPath).css('top'));
        var leftOffset = parseInt($(starPath).css('left'));
        var rocketPos = getPositions(rocket);
        var starPos = getPositions(star);
        for(pos in starPos[0])
            starPos[0][pos] += leftOffset;
        for(pos in starPos[1])
            starPos[1][pos] += topOffset;
        return comparePositions(starPos[0],rocketPos[0]) && comparePositions(starPos[1],rocketPos[1]);
            
    }
    
    function reachedCursor(rocket){//detects collision with cursor
        var rocketPos = getPositions(rocket);
        return currentMouseX >= rocketPos[0][0] && currentMouseX<= rocketPos[0][1] && currentMouseY >= rocketPos[1][0] && currentMouseY <= rocketPos[1][1];
    }
    var divider=25.0;
    function rocketMove(){
        let correctlastAngle = -lastAngle+Math.PI/2;//the angle (lastAngle) we calculated in mouseMoveHandler does not follow the definitions of sin/cos/etc. since we will use those functions here to lessen confusion we will simply convert the angle
        let rocketX= parseInt($("#rocket").css('left')); // x-position of rocket
        let rocketY= parseInt($("#rocket").css('top')); //y-position of rocket
        let diffX= currentMouseX- rocketX; //x-distance between rocket and cursor
        let diffY= currentMouseY- rocketY; //y-distance between rocket and cursor
        radius = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
        //if(radius>500)
          //  radius=500;
        changeX = Math.cos(correctlastAngle)*radius/divider;
        changeY = Math.sin(correctlastAngle)*radius/divider;

        let newX= rocketX+changeX+50;
        let newY = rocketY+changeY+100;
        if(!OutOfBorder(newX,newY,changeX,changeY) && !reachedCursor('#rocket')){
            $('#rocket').animate({'top':'-=' + changeY, 'left':'+=' + changeX},90);
            $('.starPath').each(function(){
                var starPath = this;
                if(collision('#rocket',this)){
                    $(starPath).children('.star:visible').each(function(){
                    if(starCollision('#rocket',this,starPath)){
                        $(this).css('visibility','hidden').removeClass("star");
                        score+=5;
                        divider--;
                        if(divider<5)
                            divider=5;
                        var congratulations = $('.score').html().substring(0,15);
                        if(congratulations !='congratulations'){
                            $('.score').html("score: " + score);
                            $('.score').css('color','yellow');
                            setTimeout(function(){$('.score').css('color','white');},100);
                        }
                    }
                        
                });   
                }  
            });
        }else{
            $("#rocket").stop(true);
        }
    }
    function pushRocket(window_width){ //pushes rocket so that it doesn't go out of bounds
        $("#rocket").stop();//stop if rocket is moving
        let rocketX= parseInt($("#rocket").css('left')); // x-position of rocket
        let rocketY= parseInt($("#rocket").css('top'));
        let borderDistanceX=Math.abs(window_width-rocketX);
        pageHeight= fullPageHeight();
        let borderDistanceY=Math.abs(pageHeight-rocketY);
        if(borderDistanceX<=100){
            $("#rocket").css("left",(window_width-100)+'px');
        }
        if(borderDistanceY<=100){
            $("#rocket").css("top",(pageHeight-100)+'px');
        }
    }
    
    $('.start').bind('click.gameActivate',function(){
                //hide stats/skills
        $('.stats').css('display','none');
        $('.skills').css('display','none');
        //change text
        $('.intro-header').html("Welcome to my universe! I'm the character in this game, and while navigating this website my rocket will try to follow you. First, check out my stats!");
        //display and draw rocket
        $('#rocket').css("display","block");
        canvas = document.getElementById("rocket");
        ctx = canvas.getContext("2d");
        img=document.getElementById('rocket-img');
        ctx.drawImage(img,12.5,12.5);
        //display stars
        $('.starPath').css('display','block');
            $('.hidden-star').css('display','none');
        $('.filler').css('display','block');
        $('.score').css('display','inline');
        $("#openStats").css("display","table");
        //activate mouse-move events and "game loop"
        $('body').mousemove(mouseMoveHandler);
        setTimeout(function(){
            setInterval(rocketMove,100);
        },500);
        $('.start').unbind('.gameActivate');
        
    });
    $('.start').click(function(){ // ACTIVATE GAME

        
    });  
    
    $('#openStats').hover(function(){
       $('#openStats').animate({height:'+=10px',width:'+=10px'},250); 
    
    },function(){
        if($("#openStats").css("display")!='none')
            $('#openStats').animate({height:'-=10px',width:'-=10px'},250); 
    });
    
    $('#openStats').click(function(){
        //$('.stats').css('display','table');
        $('.skills').slideDown();
        $('.stats').slideDown();
        $('.starPath1').css('display','none');
        $('.filler').css('display','none');
        $("#openStats").css("display","none");
        
    });
    
    /*END OF OPTIONAL GAME CODE*/
    
    $('.stats-skills-category').hover(function(){
        displaySkills($(this));
    },function(){
        //do nothing on unhover
    });
    
    $('#menu-open').click(function(){
       $('.header-menu-mobile').toggle();
    });
    
    $('.mobile-menu-option').click(function(){
       $('.header-menu-mobile').hide();
    });
    
    $('.menu-option').hover(function(){
        $('.menu-option').css('list-style','none'); //remove list style on all other menu options
        $(this).css('list-style-image',"url('resources/menu-hover.png')");//add image to hovered
    },function(){//remove when unhovered
        $('.menu-option').css('list-style','none'); //remove list style on all menu options
    });
    
    $(".menu-option").click(function(){
        sectionName ='.' +  $(this).attr('value');
        $("#rocket").stop(true);
       $('html,body').animate({scrollTop:$(sectionName).offset().top},500);
    });
    
    $(".progress-option").hover(function(){
       $(this).children('img').attr('src','resources/menu-hover.png'); 
       $(this).css('color','white');
    },function(){//on unhover, restore header menu back to only its correct option based on current page
        let scrollPos = parseInt($(window).scrollTop()); //check position
        let currentPage= getCurrentPage(scrollPos,getSectionBounds());
        headerMenu(null,currentPage);
    });
    
    $('.arrow').hover(function(){
        var courseName= $(this).attr('id');
        var courseClass= '.' + courseName;
        openCourseDescription(courseClass,500);
        //also reveal hidden stars (only show if star paths are already activated)
        $(courseClass).children('img').slideDown();
    });
    
});