var spaceInvaders = (function(){
    
    /** 
        Sergio Ruiz. Contact: serginator at gmail dot com
                    
        Credits: 
        I've read some spaceinvaders games, but mostly, Canvas Invaders
        from Jason Brown and RGB invaders from Egor Balishev, who helped
        me a few pointing to a good way to learn javascript, even if I 
        started with other resources. Thanks to both of them. Also Carlos
		Benítez from www.etnassoft.com helped me fixing several things.
    */ 

    /******************************************************************
                                    VARs
    ******************************************************************/
    var buffer; //Buffer
    var bufferctx; //The context of the buffer
    var canvas; //Canvas
    var ctx; //The context of the canvas
    var WIDTH; //The width of the buffer
    var HEIGHT; //The height of the buffer
    var shipX; //X position of the ship. The ship is 60x32
    var canvasMinX; //The limit of the buffer
    var canvasMinY;
    var canvasMaxX;
    var intervalId = 0; //The interval for redrawing
    var backcolor = "#000000"; //Background color
    var playerLives = 3; //Counter of lives
    var enemyCount = 0; //Counter of enemies
    var enemies = {}; //Array of enemies
    var shotCount = 0; //Counter of shots
    var shotId = 0; //Shot id
    var shots = {}; // Array of shots
    var invadersChangeDir = false; //To change the direction of invaders
    var invadersDir = 1; //The direction of the invaders
    var invadersMovDown = 0; //To move them one row down
    var invadersSpeed = 5; //The speed of the invaders
    var wave = 1; //The wave
    var showWave = false; //To show a text for a new wave
    var showWaveY = 220; //I have to keep this one instead of just showMessageY
    var showLivePlus = false; //To show a text for +1 live
    var gameOver = true; //Because I want first to load the newGame screen
    var score = 0; //Score
    var yDown = false; //To check whether retry
    var nDown = false; //or not
    var newGame = true; //To load a presentation screen.
    var starCount = 0; //Counter for random stars
    var stars = {}; //Stars array
    var starSpeedMod = 0; //To modify their speed while moving the ship
    var eriTramposilla = false; //For my girlfriend, who like games easiers
    var showMessageY = 220; //To make the animation of all the messages
    var eriShowMessage = false; //To show the message
    var showOvni = false; //To show the ovni
    var ovnis = {}; //Array of ovnis, to add and delete
    var ovniCount = 0; //There could be some :S
    //var brickCount = 0; //Counter for the bricks
    //var bricks = {};
    //var brickcolors = ["#e1d3d3", "#bebebe", "#778899", "#696969"]; //For the bricks
    var pause = false; //To control if game is paused or not
    var penguin = false; //To control if activate mode penguin
    var originalMode = false; //To draw normal ship
    var showPenguinMessage = false; //To show the message
    var points = {}; //To show the points of the enemies when they die
    var pointsCount = 0; //The counter of the points
    var bossFight = false; //To start the fight
    var boss = null; //The boss
    var showBoss = false; //To show the boss
    var bossShowMessage = false; //To show a message
    var bossKilled = false; //To fix waves
 
    /******************************************************************
                                  IMAGES
    ******************************************************************/
    var enemy1A = new Image(); enemy1A.src = "data:image/gif;base64,R0lGODlhKAAgAOeIAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAPwALAAAAAAoACAAAAj+APkJHMhv17+DuwgqXGgQ4cKHAoMd/OcL4kNfE4NZZDgx4UaCDf95/DiQ1y9eu0zysqgy5UmSEEOOBNkR5sZcNTkezGXTosyHP3sS5EXU2kRrvHIRTcrL6EGkRIWGnEi1qlWHNqde3Up15ketXLl6fbjU6T+ktppeRav26dKYV0eCFTlw7tiCV20NtJV3b1ygfwXarRtYYNm1vNKapcp28dG3YSNLtjr3YL+r/iZmtnp5K8bJoCOHbBx6K2mEOfGWpkwY9c6BOFdX5SkwtsjUlUPL7Yj7sdKlwJcqNbvbNV3BqUkGVX37YEWBn//Rhmn7Ob/o0Ysfh7lcJq9gK4cknnQZnux4lQq/l/eZvPV2oQSja1wo0Tl8ne/d34WvniV4mAEBADs%3D";//40x32
    var enemy1B = new Image(); enemy1B.src = "data:image/gif;base64,R0lGODlhKAAgAOdtAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAPcALAAAAAAoACAAAAj+AO8JHEiwoMGDCBMO5BVsl8KDDB0+JMjr379+uiYO9GVxXy6NAoVZ/NcL5L1gI32Z5OXvYkaQHP95RMhLGK+Cu3rp2sXr102aPnft8vVyYC9hDkdKLFjxn7+iBHtZ7PfR4K+OuFIezDWyakGpFm0dRGlRl0V/S6NOhWrUIj+vBK/KzOo0LS9evbCdtcZL111eufKerYb3p0C5++iiXTiysePHjd8ORKzYa1PImB9bxnp26WV//UK3fAxadEevlEde64VLsFNqumrpsva4H7Vcsq9NJdw6G+fMGBk7liwQLObEmS/WGkg38qyBXJPr6ndxdOPgxR8TvxfTMeh/+XCo5RpfjfTqwL69W+uVy1f669Ny6YK7K7n9zIkhOqZOeqT1647hctAu/PzDz3/3QeZPgeEhNF4u5SWIWT/xjTfRZRI6NhNI0WWooVggXdYPPySWaOKJ/G2oUVP+xGfLgzDC+CJtMsH1UFNUmQSWiheOxJZCcv1jo0K87POPPkMm1At1+CRJECvFKFOML/I5mVCVv0RJDE0tYWeSQTs62QsxJX2JkC9kFhQQADs%3D";
    var enemy2A = new Image(); enemy2A.src = "data:image/gif;base64,R0lGODlhKAAgAOdtAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAPsALAAAAAAoACAAAAj+APcJHEiwoMGDCBMq3Pct3LeHDhdKTPjtn8WL/75N3EiwIkaLGjly9PgxpEiFD7+x+2iRXcqTB8GxnGkRHMyCJC36u7gTo8mb+2TSZGnzJrijK4d+ZHe06EahSqM6lZjzY89/V1n+XAjVn79+Xmd6BXt1KsKmSf+t88bN27qZa9u+bdn07EyTVUEOzPvPrMBwM7sN7BZ48MxwB/k6hYpx8d3EM9uB8wauXeTJlR8b5Bu1c8aDgDH2E8tz5miMiDePBsuzn+usrV+3/tdv60BvuOeq9bbNLVzevi2uxU31Il7NDI1zhOrt9szmAr1d9EtxNd7Vrmlf1y6ym7duDcVFOexGvjz4cOK/eRd8k6Tt5HqBCiSZumDoz/IZ8vvH7/23/f3dhE0555QTznoJrRcOgeVgM9JO/ryH0DcQSjihOBZeaGFAADs%3D";
    var enemy2B = new Image(); enemy2B.src = "data:image/gif;base64,R0lGODlhKAAgAOdZAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAPwALAAAAAAoACAAAAj+APkJHEiwoMGDCBMqXMiwYcFQoU4Rq6ZOXjmHGAeGYqbvn8d/8jJmxPbx4zuRDpfFK+kxnjaUCcvJewevI0t98d5ZhFlQXkl//jwCLRmS58B3P4P+G2rSqEBtK1lKbfkSpcx38WxOvZlzJ0afU5kylVrUIdKwSseyPOkQqkec7dpllQpXrk2XC6/O/YeXn1uWff/i1HnxINiS7Qi2k5p44GKWZQvCY6yYsmOp8BCeLRk4Kueqf0uyNbj5Y929JU9rbXpw8ke1QtMqTVoys+Gf/aSKnf2xH+/IBPXaVE03Xty9g70m/NtZanO+VRsi9TeaX2mP1c9WZxjVHcHDHyNKg42HEds5efTGBZcH7x1N5fzK0ZN3Dlve+fWdmkdf2CA9j8DBBBY9CP0HklMCDYiQfPTZZ9R+9PSHEITRZMRgfg6tpA8qGY2HUEAAOw%3D%3D";
    var ship = new Image(); ship.src = "data:image/gif;base64,R0lGODlhPAAgAOcaAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH5BAEKAPsALAAAAAA8ACAAAAj+APcJHEiwoMF99P4pXMiQIb2DECNKlJiQIcGGDydq3Hiw4sKLDjmK5IjOXkOQC+2hG8lS4Lt79WLSo2eP38mBDfnZmxmz3r13LSXea7jQnz+iDI0i/XcvaMR6S5Uu/SeVaD2nB0tO3cpVJVaXMGsqFLiV7FKc/3T6BBp0aFGUN83GFXh0YdOgUN+iJQr3I8G6Cq+21Gpx71ykBRt65fiyntjCcvnum2pYodqfGt0SlVq1aN3OCjkDbnhXYt7Nn0eHTo169VLBEQnrnPmY4WyaNnPuxE309uPFB93l66dwMWGGxk0qXrnveErmhPvlcwdR87+MAj0uxI6QKHftCr+mMyxd8PR1guDPD0wvHiN6hrAJOk9OlP5ygc6LQ1euv6Bw4gv5lpttu9UWYIEDHkhbgtJRNxA+SalGlYRcTQXahAzhQxCEnrVW4YcXdqbhQI0Z2NtuPaWo4ooLbnUZWwXldx9WMiLH3FMRwveVQOZ1Fl91Odq14z7WdUYeRCXm9uKQSVpmz1oiEQbckANJeeNIFXFH5XrhOZXllgZ9iVdgYJZHZkQBAQA7"; //60x32
    var shot = new Image(); shot.src = "data:image/gif;base64,R0lGODlhAgAGAAABACH+EkNyZWF0ZWQgd2l0aCBHSU1QAAAsAAAAAAIABgCHAAAAAAAzAABmAACZAADMAAD/ACsAACszACtmACuZACvMACv/AFUAAFUzAFVmAFWZAFXMAFX/AIAAAIAzAIBmAICZAIDMAID/AKoAAKozAKpmAKqZAKrMAKr/ANUAANUzANVmANWZANXMANX/AP8AAP8zAP9mAP+ZAP/MAP//MwAAMwAzMwBmMwCZMwDMMwD/MysAMyszMytmMyuZMyvMMyv/M1UAM1UzM1VmM1WZM1XMM1X/M4AAM4AzM4BmM4CZM4DMM4D/M6oAM6ozM6pmM6qZM6rMM6r/M9UAM9UzM9VmM9WZM9XMM9X/M/8AM/8zM/9mM/+ZM//MM///ZgAAZgAzZgBmZgCZZgDMZgD/ZisAZiszZitmZiuZZivMZiv/ZlUAZlUzZlVmZlWZZlXMZlX/ZoAAZoAzZoBmZoCZZoDMZoD/ZqoAZqozZqpmZqqZZqrMZqr/ZtUAZtUzZtVmZtWZZtXMZtX/Zv8AZv8zZv9mZv+ZZv/MZv//mQAAmQAzmQBmmQCZmQDMmQD/mSsAmSszmStmmSuZmSvMmSv/mVUAmVUzmVVmmVWZmVXMmVX/mYAAmYAzmYBmmYCZmYDMmYD/maoAmaozmapmmaqZmarMmar/mdUAmdUzmdVmmdWZmdXMmdX/mf8Amf8zmf9mmf+Zmf/Mmf//zAAAzAAzzABmzACZzADMzAD/zCsAzCszzCtmzCuZzCvMzCv/zFUAzFUzzFVmzFWZzFXMzFX/zIAAzIAzzIBmzICZzIDMzID/zKoAzKozzKpmzKqZzKrMzKr/zNUAzNUzzNVmzNWZzNXMzNX/zP8AzP8zzP9mzP+ZzP/MzP///wAA/wAz/wBm/wCZ/wDM/wD//ysA/ysz/ytm/yuZ/yvM/yv//1UA/1Uz/1Vm/1WZ/1XM/1X//4AA/4Az/4Bm/4CZ/4DM/4D//6oA/6oz/6pm/6qZ/6rM/6r//9UA/9Uz/9Vm/9WZ/9XM/9X///8A//8z//9m//+Z///M////AAAAAAAAAAAAAAAACA4ApUkjR04dPG8HvSEMCAA7"; //2x6
    var enemyProyectil1 = new Image(); 
        enemyProyectil1.src = "data:image/gif;base64,R0lGODlhBgAOAIABAP8AAP///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAEALAAAAAAGAA4AAAIQTABmuKmsWoTTyWPx3S/DAgA7"; //6x14
    var enemyProyectil2 = new Image(); 
        enemyProyectil2.src = "data:image/gif;base64,R0lGODlhBgAOAIABAP8AAP///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAEALAAAAAAGAA4AAAIRTABmqMqeTlzx0XYhlu1ZHhQAOw%3D%3D";
    var ovni = new Image(); ovni.src = "data:image/gif;base64,R0lGODlhPAAgAOeYACD+AiH+AyL+BCD/AiP+BSH/AyH/BCT+BiL/BCX+ByP/BST/BiT/ByX/Byj+Cyb/CCb/CSn+DCf/Cin/DCr/DS3+EC3+ETD9FC/+EzT8GS/+FC3/EC3/ES7/EjH+FS//EzL+FzH/FTL/FjX+Gjj9HTP/GDf+HDv9ITf/HDz9Ijj/HTz+Ijv/ID7/JEL+KUX9LEL/KET/K0X/LEj/L1H8OUv/M1P8PUz/NFT8PU7/NmX2Ulf8QFH/Olv7RlT/PVX/Plb/P2D7TFf/QFf/QWH7TV3+SHj0Z3r0aWD/S2r7V2H/TGL/TWT/T3D7XWz/WH36bHH/XnT+YXT/Yov6fIH/cIT/dK7upov/fJH9g4//gJ75kbDzp5b/iJn/i6v5oJ3/j5//krP3qqb9mrX3rKb/mtvp2cjywqr/nqv/oMH2uefo57H/pujo6LL/qMn2w7X/q8z2x9b10sf8wML/usX/vcj+wdr31tv31+/v79j51OD23eH23+r06Or06dD/ytT+ztL/zNP/zdX/z9n/1PT09PD28PX19d3/2fb29uH/3ff39+j/5e3+6+3/6/D+7u7/7PH/7/f99/r8+vT/8/z8/Pj++Pn/+f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAP8ALAAAAAA8ACAAAAj+AP8JHEiwoMF/hDApXMiQIaGDECNKlJiQIcGGDydq3Hiw4sKLDjmK5MgGUUOQCxGVGclS4AABEYhoicMHEaWTAxlCkpNEA4ABQIG2lBgUqAokZwAxqtTQ0iNAa6oUMdGgaNGhEa0GXVBhxQ8hTHLkkKC1rFCsBs2qXVsWrUutb83GhTs3KFa6de0ObEsQL0u/cvf6/Wd1x1C+ec8mLhg0BBU7akSamZIiAODAagU3GLKmkSREhhTh0agI0yI0M8iyXV2WgIssiSw1VKTR0MJFdKDEYM1bAYsodSA1VGhoYkmFlBAR6rNHzBIKCHiX5eDjih/hyQkRsmnai46IW/L+RFKIiI3AkpAEfXECY8OBAYkHRLgg8IgXQI9kkzf/j02hQU5Y8BNEIwDRxiSYZCSQR5g45QZBL0zAAFAGlNADQQwqpOA/Ydxw1UFAoUDGJBtmmCBBJ2hFAIbDbeiBVSAGJQIYhfB3XEPlCWSEWRmcZ1JDd1gRH2NWNYCFHtpx11B2cIBglgA9bHeTJYe8IQUPDiTAVl9aFeDDHMJhcsklw2ESyFo1KGTJIF3I0IF0XJr1gRJd/OFImWeqVcOaXLQAgXSKEcbaAyCQgAMNTTwxRhpBmIVBDzYACmNarLnF20SruRXfh0RtqWmmmHpqqagaDaZpXofpdSqlgY7E6aoMccKXaquwCkorQQEBADs%3D"; //60x32
    var boss1 = new Image(); boss1.src = "data:image/gif;base64,R0lGODlhPAAgAOeYACD+AiH+AyL+BCD/AiP+BSH/AyH/BCT+BiL/BCX+ByP/BST/BiT/ByX/Byj+Cyb/CCb/CSn+DCf/Cin/DCr/DS3+EC3+ETD9FC/+EzT8GS/+FC3/EC3/ES7/EjH+FS//EzL+FzH/FTL/FjX+Gjj9HTP/GDf+HDv9ITf/HDz9Ijj/HTz+Ijv/ID7/JEL+KUX9LEL/KET/K0X/LEj/L1H8OUv/M1P8PUz/NFT8PU7/NmX2Ulf8QFH/Olv7RlT/PVX/Plb/P2D7TFf/QFf/QWH7TV3+SHj0Z3r0aWD/S2r7V2H/TGL/TWT/T3D7XWz/WH36bHH/XnT+YXT/Yov6fIH/cIT/dK7upov/fJH9g4//gJ75kbDzp5b/iJn/i6v5oJ3/j5//krP3qqb9mrX3rKb/mtvp2cjywqr/nqv/oMH2uefo57H/pujo6LL/qMn2w7X/q8z2x9b10sf8wML/usX/vcj+wdr31tv31+/v79j51OD23eH23+r06Or06dD/ytT+ztL/zNP/zdX/z9n/1PT09PD28PX19d3/2fb29uH/3ff39+j/5e3+6+3/6/D+7u7/7PH/7/f99/r8+vT/8/z8/Pj++Pn/+f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAP8ALAAAAAA8ACAAAAj+AP8JHEiwoMF/hDApXMiQIaGDECNKlJiQIcGGDydq3Hiw4sKLDjmK5MgGUUOQCxGVGclS4AABEYhoicMHEaWTAxlCkpNEA4ABQIG2lBgUqAokZwAxqtTQ0iNAa6oUMdGgaNGhEa0GXVBhxQ8hTHLkkKC1rFCsBs2qXVsWrUutb83GhTs3KFa6de0ObEsQL0u/cvf6/Wd1x1C+ec8mLhg0BBU7akSamZIiAODAagU3GLKmkSREhhTh0agI0yI0M8iyXV2WgIssiSw1VKTR0MJFdKDEYM1bAYsodSA1VGhoYkmFlBAR6rNHzBIKCHiX5eDjih/hyQkRsmnai46IW/L+RFKIiI3AkpAEfXECY8OBAYkHRLgg8IgXQI9kkzf/j02hQU5Y8BNEIwDRxiSYZCSQR5g45QZBL0zAAFAGlNADQQwqpOA/Ydxw1UFAoUDGJBtmmCBBJ2hFAIbDbeiBVSAGJQIYhfB3XEPlCWSEWRmcZ1JDd1gRH2NWNYCFHtpx11B2cIBglgA9bHeTJYe8IQUPDiTAVl9aFeDDHMJhcsklw2ESyFo1KGTJIF3I0IF0XJr1gRJd/OFImWeqVcOaXLQAgXSKEcbaAyCQgAMNTTwxRhpBmIVBDzYACmNarLnF20SruRXfh0RtqWmmmHpqqagaDaZpXofpdSqlgY7E6aoMccKXaquwCkorQQEBADs%3D";
    var boss2 = new Image(); boss2.src = "data:image/gif;base64,R0lGODlhPAAgAOeAAP8AAOMiAsdDBcdEBatlCKxlCJGHC5GIC3aqDlvLEkDuFjT8GTX+Gjj9HTf+HDv9ITf/HDz9Ijj/HTz+Ijv/ID7/JEL+KUX9LEL/KET/K0X/LEj/L1H8OUv/M1P8PUz/NFT8PU7/NmX2Ulf8QFH/Olv7RlT/PVX/Plb/P2D7TFf/QFf/QWH7TV3+SHj0Z3r0aWD/S2r7V2H/TGL/TWT/T3D7XWz/WH36bHH/XnT+YXT/Yov6fIH/cIT/dK7upov/fJH9g4//gJ75kbDzp5b/iJn/i6v5oJ3/j5//krP3qqb9mrX3rKb/mtvp2cjywqr/nqv/oMH2uefo57H/pujo6LL/qMn2w7X/q8z2x9b10sf8wML/usX/vcj+wdr31tv31+/v79j51OD23eH23+r06Or06dD/ytT+ztL/zNP/zdX/z9n/1PT09PD28PX19d3/2fb29uH/3ff39+j/5e3+6+3/6/D+7u7/7PH/7/f99/r8+vT/8/z8/Pj++Pn/+f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAA8ACAAAAj+AP8JHEiwoMF/bAApXMiQIZuDECNKlJiQIcGGDydq3Hiw4sKLDjmK5EgFTkOQC+E0GclSIICXLIRkIQOHz8mBDPFoiUHgpU8ALSX+BCABxhM0dPo09HMHzZQeLRwM/Rk04tSfE06ooBEixNWvQKsaBEu2LFWx/666BLtWbduzLacS/DpXbl24LO2+xet24NARQfumFSx4MIADPLxIEelkRwTCdA3r9bliSh09cNzIAaNRDqA5UDaYHf3VQpA4fhrK0ehm4RwuODKQJk0hRxc8DRW6mVhSIR84bMqMUTJjNlgTP8zg/s2GTc3PRkREHBImj0I4VASWxKPmiA0MPvfk/iwg8IURNHdSX8/+j0qbNTbCH2SAosoeQBkFegTE1ArBC0MpUAJB+ymU3z9JfIBXXRAwsceBBeJH0AOCRXigAUMd9BMCSLTBXm8NYSeQC18toJ1JDX3hg3gvFXQVEGI091xDzGGRAFglOGeTH29coQMJo901lAlb4AbIH3/kBkgaZHWgkB9rFKFBALMJOdUAMhRxhh1KMglWB1ASUYFxLfpFWgINgMBBDTcsEUUKXwlQggdkLshiYXkFKVRZaN1p51h89mmWRoMKGuhGevVpZVh5lqkooI42yuijQlb156OXChQQADs%3D";
    var starImg = new Image();
        starImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAhSURBVHjaYvz///9kBgYGBhYGBgYuBgaG/wAAAAD//wMAOVMEn9OyO14AAAAASUVORK5CYII%3D';
    
    /******************************************************************
                                FUNCTIONS
    ******************************************************************/
    function circle(x, y, r){ //Paint a circle
        bufferctx.beginPath();
        bufferctx.arc(x, y, r, 0, Math.PI*2, true);
        bufferctx.closePath();
        bufferctx.fill();
    } //I could use this as shots instead of GIFs
    
    function rect(x, y, w, h){ //Paint a rectangle
        bufferctx.beginPath();
        bufferctx.rect(x, y, w, h);
        bufferctx.closePath();
        bufferctx.fill();
    }
    
	function clear(){ //Clear the buffer
		bufferctx.clearRect(0, 0, WIDTH, HEIGHT);
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		//rect(0,0,WIDTH,HEIGHT);
		//because clearRect takes the bg of the buffer,if the back is black
		//it clears it to black.
	}
    
    // This KeyboardController is from Carlos Benitez
    // from www.etnassoft.com
    function KeyboardController(keys, repeat) {
        // Lookup of key codes to timer ID, or null for no repeat
        var timers = {};
        // When key is pressed and we don't already think it's pressed, call the
        // key action callback and set a timer to generate
        // another one after a delay
        document.onkeydown = function(event){
            var key = (event || window.event).keyCode;
            if(!(key in keys)) return true;
            if(!(key in timers)){
                timers[key] = null;
                keys[key]();
                //console.log(key);
                if(repeat !== 0) 
                    if (key == 37 || key == 39){ //To move faster
                        timers[key] = setInterval(keys[key],10);
                    }
		    else if (key == 78 || key == 89 || key == 69 || 
                            key == 80 || key == 190){
			timers[key] = setInterval(keys[key],1000);
		    }
                    else if(eriTramposilla){
                        timers[key] = setInterval(keys[key], 0);
                    }
                    else timers[key] = setInterval(keys[key], repeat);
            }
            return false;
        };
        // Cancel timeout and mark key as released on keyup
        document.onkeyup = function(event){
            var key = (event || window.event).keyCode;
            if(key == 37 || key == 39) starSpeedMod = 0;
            if(key in timers){
                if(timers[key] !== null) clearInterval(timers[key]);
                delete timers[key];
            }
        };
        // When window is unfocused we may not get key events. To prevent this
        // causing a key to 'get stuck down', cancel all held keys
        window.onblur = function(){
            for(var key in timers)
                if(timers[key] !== null) clearInterval(timers[key]);
            timers = {};
        };
    } 
        
    KeyboardController({
        32: function() { //Spacebar
	    if(newGame === true) //To skip the first screen
            {
                newGame = false;
                gameOver = false;
            }
            var shipShot = new Shot(shipX + 30, 450, shot, shot, 5, 1);
            addShot(shipShot);
            //soundManager.play('shot1');
            //console.log('Shot');
        },
        39: function(){ //Move right
            if(shipX <= canvasMaxX-75){
                shipX += 5;
                starSpeedMod = -8; //Create spatial sensation
            }
        },
        37: function(){ //Move left
            if(shipX >= canvasMinX){            
                shipX -=5;
                starSpeedMod = 8; //Create spatial sensation
            }
        },
        89: function(){ //"y" key
            yDown = true;
        },
        78: function(){ //"n" key
            nDown = true;
        },
        69: function(){ //"e" key, an Easter Egg to have turboshots
            if(!eriTramposilla) eriTramposilla = true;
            else eriTramposilla = false;
	    eriShowMessage = true;
        },
        80: function(){ //"p" key, to pause the game
            if(!pause) pause = true;
            else pause = false;
        },
        190: function(){ //"." key, to activate mode penguin
            if(!penguin){
                penguin = true;
                originalMode = false;
            }
            else{
                penguin = false;
                originalMode = true;
            }
			showPenguinMessage = true;
        }
    }, 200);
    
    function initInvaders(){ //Init the array of the invaders
        for(var i = 0; i < 13; i++){ //12 columns
            for(var j = 0; j < 7; j++){ //7 rows
                var enemy = {};
                enemy.id = enemyCount++; //To move on the array
                enemy.x = 10 + (i*34); //position
                enemy.y = 40 + (j*25);
                enemy._time = 0;
                enemy.frame = 1; //to set which image show
                enemy.delay = 760; 
                enemy._width = 20;
                enemy._height = 16;
                enemy._fire = false; //if true, it can shoot
                if (j%2 === 0){
                    enemy.imgSrc1 = enemy2A;
                    enemy.imgSrc2 = enemy2B;
                }
                else{
                    enemy.imgSrc1 = enemy1A;
                    enemy.imgSrc2 = enemy1B;
                }
                enemies[enemy.id] = enemy; //add it to the array
            }
        }
    }
    
    function addEnemy(enemy){ //to add enemies simply
        enemies[enemy.id] = enemy;
    }
    
    function removeEnemy(enemy){ //to remove them
        delete enemies[enemy.id];
        enemyCount--;
    }
    
    function Shot(_x, _y, _imgSrc1, _imgSrc2, _speed, _type){ //Shots
        this.id = shotId++;
        this.x = _x; //position of the shot
        this.y = _y;
        this.imgSrc1 = _imgSrc1;
        this.imgSrc2 = _imgSrc2;
        this._width = 30; //to check collisions
        this.speed = _speed;
        this.delay = 500; //delay of movement
        this.frame = 1; //same as enemies
        this._time = 0;
        this.type = _type; //because it can be enemy or ship type.
    }
    
    function addShot(shot){ //to add shots easely
        shots[shot.id] = shot;
    }
    
    function removeShot(shot){ //to remove them
        delete shots[shot.id];
        shotCount--;
    }
    
    function Star(_x, _y){ //constructor for Stars
        this.id = starCount++; //to move through the array of stars
        this.x = _x; //star pos
        this.y = _y;
        this.d = Math.floor(Math.random() * 2 + 1);
        if(this.d == 1) this.speed = 2;
        else this.speed = 1.5;
    }
    
    function addStar(star){ //To add a star simply
        stars[star.id] = star;
    }
    
    function removeStar(star){ //To remove a star simply
        delete stars[star.id];
        starCount--;
    }
    
    function initStars(){ //To init the stars with random values
        for(var i = 0; i < 50; i++){
            var posX = Math.floor(Math.random() * WIDTH);
            var posY = Math.floor(Math.random() * HEIGHT);
            var star = new Star(posX, posY);
            addStar(star); //Add it to the array
        }
    }
    
    function drawStars(){ //Draw stars
        for(var id in stars){
            var star = stars[id];
            //If the ship is moving then starSpeedMod makes star move
            //and make a great sensation of movement, i've watched it in 
            //rgb invaders and i liked it
            star.x += star.speed * starSpeedMod * 0.1;
            star.y += star.speed;
            if(star.y >= HEIGHT){ //if it reaches the bottom, randomize it x
                star.x = Math.floor(Math.random() * WIDTH + 100);
                star.y = 0;
            }
            bufferctx.save();
            bufferctx.fillStyle = "white";
            if(star.d === 1){
                ctx.drawImage(starImg, star.x, star.y, 1, 1);
            }
            else{
                ctx.drawImage(starImg, star.x, star.y);
            }
            //circle(star.x, star.y, star.d); //draw the little dots
            bufferctx.restore(); //restore the buffer
        }
    }
    
    function Ovni(_x, _y){ //The constructor of the ovni
        this.id = ovniCount++;
        this.x = _x; //Its position
        this.y = _y;
        this.speed = 3; //ovni speed
        this.width = 60;
        this.height = 32;
        this.points = 1500 * wave; //The points it gives
        this.imgScr = ovni; //Its image
    }
    
    function addOvni(ufo){ //To add it to the array
        ovnis[ufo.id] = ufo;
    }
    
    function removeOvni(ufo){ //To remove it
        delete ovnis[ufo.id];
        ovniCount--;
        showOvni = false;
    }
    
    function drawOvni(){ //To draw the ovni
        var ufo;
        if(enemyCount == 30 && ovniCount != 1){
            showOvni = true; //to run the next if
            ufo = new Ovni(30, 40); //Draw ovni
            addOvni(ufo);
        }
        if(showOvni){
            for(var id in ovnis){
                ufo = ovnis[id];
                bufferctx.drawImage(ovni, ufo.x, ufo.y);
                ufo.x += ufo.speed; //movement
                if(ufo.x > WIDTH){ //if it reaches the right side
                    removeOvni(ufo);
                    showOvni = false;
                }
            }
        }
    }
    
    function Point(_x, _y, _p){
	this.id = pointsCount++;
	this.x = _x;
	this.y = _y;
	this.p = _p; //points to show
        this.t = 20;
    }

    function addPoint(point){
	points[point.id] = point;
    }

    function removePoint(point){
	delete points[point.id];
	pointsCount--;
    }

    function drawPoints(){ //Draw points
        for(var id in points){
            var point = points[id];
            point.t--;
            bufferctx.save();
            bufferctx.fillStyle = "white";
            bufferctx.font = "italic 400 10px/2 Unknown Font, sans-serif";
            bufferctx.fillText(point.p, point.x, point.y); //Draw the points
            if(point.t === 0){
                removePoint(point);
            }
            bufferctx.restore();
        }
    }
    
    function Boss(_x, _y){
        this.x = _x;
        this.y = _y;
        this.lives = 80;
        this.points = wave * 100000;
        this.time = 0;
        this.frame = 1; //to set which image show
        this.speed = 3;
        this._width = 120;
        this._height = 64;
        this._fire = false; //if true, it can shoot
    }
    
    function drawBoss(){
        //console.log("draw");
        if(!showBoss){
            console.log("Boss Created");
            boss = new Boss((WIDTH/2) + (120/2), 100);
            bossShowMessage = true;
            showBoss = true;
        }
        else{
            //console.log("Drawing boss");
            if(boss.frame === 1){
                //console.log("frame 1");
                bufferctx.drawImage(boss1, boss.x, boss.y, 120, 64);
            } //Draw the src1 of the boss
            else{
                //console.log("frame 2");
                bufferctx.drawImage(boss2, boss.x, boss.y, 120, 64);
            } //Draw the src2 of the boss
            
            //Now a red rectangle with the boss' life.
            //It will decrease deppending on the lives.
            bufferctx.fillStyle = "red";
            rect(boss.x + 20, boss.y + 70, 80 - (80 - boss.lives), 5);
            
            boss.x += boss.speed; //movement
            if(boss.x > (WIDTH - boss._width - 20)){ //if it reaches the right side
                boss.speed = -boss.speed;
                boss.frame = -boss.frame;
            }
            else if(boss.x <= 20){
                boss.speed = -boss.speed;
                boss.frame = -boss.frame;
            }
            var testShot = Math.floor(Math.random() * 500 + 1);
            if((testShot - wave*0.4) < 20 - ((80 - boss.lives)/20)){
                boss._fire = true;
            }
            if(boss._fire === true){ //If they can shoot,create the shot
                boss._fire = false;
                var shotBoss = new Shot(boss.x+(boss._width/2),boss.y+10,
                               enemyProyectil1, enemyProyectil2, -5, 2);
                addShot(shotBoss); //And add it to the array
            }
            if(boss.lives === 0){
                //console.log("0 vidas");
                wave++;
                var points = new Point(shot.x, shot.y, boss.points);
                addPoint(points);
                score += boss.points;
                delete boss;
                bossFight = false;
                showBoss = false;
                bossKilled = true;
                playerLives = 3;
            }
        }
    }
    
    /*function Brick(_x, _y){
        this.id = brickCount++;
        this.x = _x;
        this.y = _y;
        this.width = 10;
        this.heigth = 10;
        this.lives = 4;
        this.color = ["#e1d3d3", "#bebebe", "#778899", "#696969"];
    }
    
    function addBrick(brick){
        bricks[brick.id] = brick;
    }
    
    function removeBrick(brick){
        delete bricks[brick.id];
        brickCount--;
    }
    
    function drawBlockOfBricks(_x, _y){
        for(i = 0; i < 3; i++){
            for(j = 0; j < 3; j++){
                if(i == 2 && j == 1) null;
                else{
                    for(var bid in bricks){
                        
                    }
                }
            }
        }
    }
    
    function drawBricks(){
        
    }*/
    
    function setScore(){ //Set the score at the bottom left
        bufferctx.fillStyle = "#8b8989";
        rect(0,485,WIDTH,15); //Create a rectangle at the bottom
        bufferctx.fillStyle = "#000000";
        bufferctx.font = "italic 400 12px/2 Unknown Font, sans-serif";
        bufferctx.fillText("Score: " + score, 10, 495);
        //And some credits
        bufferctx.fillText("6-3-2011", 585, 495);
        bufferctx.fillStyle = "#FF0000";
        bufferctx.fillText("Sergio Ruiz", 292, 495);
    }
    
    function showWaveLives(){ //Show the wave and if you have gained +1 live
        if(showWave){
            bufferctx.save();
            bufferctx.fillStyle = "red";
            bufferctx.font = "400 15px/2 Unknown Font, sans-serif";
            bufferctx.fillText("Wave " + wave, 300, showWaveY);
	    if(showLivePlus && !bossKilled){ //if bossKilled, restore all lives
		bufferctx.fillText("+1 ", 300, showWaveY + 20);
		bufferctx.drawImage(ship, 330, showWaveY + 10, 15, 8);
                bufferctx.restore();
            }
            showWaveY += 1; //To create the animation
            if(showWaveY == 450){
                showWaveY = 220;
                showWave = false;
		if (showLivePlus) showLivePlus = false;
            }
        }
    }
    var setSources = true;
    function penguinMode(){ //To activate penguin mode
        if(penguin){
			if (setSources){
            ship.src = "data:image/gif;base64,R0lGODlhPAAgAKU9AAAAAAEBAQICAgMDAwQEBAYGBggICAoKCg0NDRAQEBQUFBUVFRgYGBkZGRoaGiAgICcnJykpKSoqKi0tLTExMTIyMjMzMzQ0NDw8PEBAQGZmZmdnZ39/f4CAgP+WAP+YBqWlpf+aC/+bDP+bDv+eFf+fFv+jIf+lJv+rM/+wQP+zSP+3Ub+/v/+9X8fHx8rKyszMzM3Nzf/Jfv/Lgf/LgtPT0//drv/fs//kv//v2v/05vn5+f/58v///////////yH5BAEKAD8ALAAAAAA8ACAAAAb+wJ9wSCwaj72k8shsOp/N5FAKrVqr1F/vyu0Ws1pv0UMWM8Fb849cVn+/aS+77RaCtXHunF6/5697fG5+f1A5J4FWZR5IhUqPkGg5KB97ViZCJY2NjpFJPDcyK3NWIkIkRkuDdkktbFFEjD8hcFyFjTpOjzomsh5xqkSew5DCd1Ngi2SRxsRJMT0dnsabeD2vr5w9CgMCCJ4NANI9MTU7wWGpaUk6gbLNMQAADQkLDj0sLEoVABZJBwMYRHg0BYkRd3CUOBCwLwYLAhdixEDwgByABBI4QEPn6GAiZJAAQNuAAJoDAw02FMjQg18HicUKUrO2xlKzRxcfKGiQRCSggQAFYnQAwLKCAQAEZVLbssVmQiVDC2hQkjLDxR5WlcTIwBKNOo/vniaBgRQny3hYK2KVByPYsaRXIBkAgVPaBp5WERzgGjOdumNPHjXgqQQChSQTXPTAwIBuX8Ag0UFJ8sLZsIRYmFmxLNmODRU0xEDWNQ0JjhHZbN3C3CVJClKtVzeLPcNp5tHW4EZ5VAn27d1JOXv6GLhzbtmTpQQKAgA7"; //60x32
            shot.src = "data:image/gif;base64,R0lGODlhAgAGALMAAEO8HnfNW6fflLLioL3mrdPux9TuyOHz2P/9+////wAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAkALAAAAAACAAYAAAQJMAlDUEJhFHAiADs%3D"; //2x6
            ovni.src = "data:image/gif;base64,R0lGODlhPAAgAOYAACAQABAIAAoFAAQCAOO/nO3Wv/Hfzfrz7Pny6/37+b9cAL5cALhZALdYALdZALFVAH49AHM4AGUxAL9dAbtbAblaAbhZAbhaAcBdArhbAsNmEMRoE8RqFr5nFcVsGcdvHsdwH8d5L8x8MjwlD82AOM6BOs+EPtGJR8+IRtGKSNKNTdCMTM6MT9SRU9KSVdGSV9CSWdaXXdSaZNqga9qibdehb9ymc+Cwg96yiOK1i+O3juS7lebBnujFpOjIqejJq+vNsOzSue7VvfDaxfHdy/Ti0vXl1vTl1/Xn2vz38wEAAP/+/v////7+/v39/fn5+dnZ2cbGxqCgoG5ubl1dXUNDQwEBAQAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFgALAAAAAA8ACAAAAf/gFiCg4SFhoeIiYqLjIIXj5CPjZOUig2XmJcOFhaVnpWSmZkOF5+mi6WDopcWqaevjKKtsJUODpqruLmujpGSr7a5ubacnYKXvoeRnpenv1jPWMINs5O2tLyqzTDKhA2HzYW5tEzl3YK339rqx+Pk5UyC8NCE6e3s0pi0hfBQU/JOpNDz9k0TwX2IykWpIu+JFSoD1WFyIA4hvHlYyi1BICgBkyZOBuZjhbARkyQ/XKgYoWRAhBUsahwpYG7QtZKLMoTocWOCACVXJCjYQQSHjHaOcC4i8MIEByMbIAQA8EBBCQ0UeOFTOugiEwM8egixoaCs2Rg6UHD9VJbECbNmhT3MCHJgbaUUOYDEgGt2QYWM2uwmHEIDBN8PRUT8lZdP8KF4gvgqwNDCh+NE7CAjYnABiWZvjpvFs0ARnSjGhrbiDNfhQoN0qwh9lpZaNbNwF25N+mx7pOreBNmF232skLF103qzcw08YUV7iPRRsjCcEu/GBl/pah5LondqxaJFz0SbViAAOw%3D%3D"; //60x32
            boss1.src = "data:image/gif;base64,R0lGODlhPAAgAOYAACAQABAIAAoFAAQCAOO/nO3Wv/Hfzfrz7Pny6/37+b9cAL5cALhZALdYALdZALFVAH49AHM4AGUxAL9dAbtbAblaAbhZAbhaAcBdArhbAsNmEMRoE8RqFr5nFcVsGcdvHsdwH8d5L8x8MjwlD82AOM6BOs+EPtGJR8+IRtGKSNKNTdCMTM6MT9SRU9KSVdGSV9CSWdaXXdSaZNqga9qibdehb9ymc+Cwg96yiOK1i+O3juS7lebBnujFpOjIqejJq+vNsOzSue7VvfDaxfHdy/Ti0vXl1vTl1/Xn2vz38wEAAP/+/v////7+/v39/fn5+dnZ2cbGxqCgoG5ubl1dXUNDQwEBAQAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFgALAAAAAA8ACAAAAf/gFiCg4SFhoeIiYqLjIIXj5CPjZOUig2XmJcOFhaVnpWSmZkOF5+mi6WDopcWqaevjKKtsJUODpqruLmujpGSr7a5ubacnYKXvoeRnpenv1jPWMINs5O2tLyqzTDKhA2HzYW5tEzl3YK339rqx+Pk5UyC8NCE6e3s0pi0hfBQU/JOpNDz9k0TwX2IykWpIu+JFSoD1WFyIA4hvHlYyi1BICgBkyZOBuZjhbARkyQ/XKgYoWRAhBUsahwpYG7QtZKLMoTocWOCACVXJCjYQQSHjHaOcC4i8MIEByMbIAQA8EBBCQ0UeOFTOugiEwM8egixoaCs2Rg6UHD9VJbECbNmhT3MCHJgbaUUOYDEgGt2QYWM2uwmHEIDBN8PRUT8lZdP8KF4gvgqwNDCh+NE7CAjYnABiWZvjpvFs0ARnSjGhrbiDNfhQoN0qwh9lpZaNbNwF25N+mx7pOreBNmF232skLF103qzcw08YUV7iPRRsjCcEu/GBl/pah5LondqxaJFz0SbViAAOw%3D%3D";
            boss2.src = "data:image/gif;base64,R0lGODlhPAAgAMZMACAQABAIAAoFAAQCAOO/nO3Wv/Hfzfrz7Pny6/37+b9cAL5cALhZALdYALdZALFVAH49AHM4AGUxAL9dAbtbAblaAbhZAbhaAcBdArhbAsNmEMRoE8RqFr5nFcVsGcdvHsdwH8d5L8x8MjwlD82AOM6BOs+EPtGJR8+IRtGKSNKNTdCMTM6MT9SRU9KSVdGSV9CSWdaXXdSaZNqga9qibdehb9ymc+Cwg96yiOK1i+O3juS7lebBnujFpOjIqejJq+vNsOzSue7VvfDaxfHdy/Ti0vXl1vTl1/Xn2vz38wEAAP/+/v////7+/v39/fn5+dnZ2cbGxqCgoG5ubl1dXUNDQwEBAQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAH8ALAAAAAA8ACAAAAf+gH+Cg4SFhoeIiYqLjI1/F5CRkI6UlYQWFg4Nm5yblp+MF5qdnI8XoKiGFxaknoOnqbGrpLGfkpGFF62bo62jDg6pkoe3rn+Ymb27ncCWs8uEk4LSn8ahhzB/paq1zdeGTOG1u4bWgw2vf+FMguvs4+Tn1rzpUk7vU1DrtYWdhNv0pv2hYuXJuypRxPE7ZG2UNnTpnDRhkkAQgiUK3SkcV6iXoAbhChypwWJFhAFKRqhw8SPJu4WLWG37IwMHkR0KJFxRImDCjR4hMsBk5C0aBQ0lFDwAEADCBiMcTLwgMHQRLGModMRQwLWrDSE9eBjQWJUhoQNBZnjo2vUECa6EZSuxq7CAbdcYQHKkiOvoZQURRT7YBUFjyEu+/SAW8tECg10Fgw4jlleICZILDBS9VDy58kdmgxxYUPdwMud2/3ZputDhM+LTpBs1cHDVXDXYnCUvMjYzEe7e/yJb2gRLG6JltC71Qz28wWhKwFMHgw2Kk8NUDj1Rr/4wuqpVyABC3BQIADs%3D";
            setSources = false;
			}
        }
	    else if(originalMode){
			ship.src = "data:image/gif;base64,R0lGODlhPAAgAOcaAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysvLy8zMzM3Nzc7Ozs/Pz9DQ0NHR0dLS0tPT09TU1NXV1dbW1tfX19jY2NnZ2dra2tvb29zc3N3d3d7e3t/f3+Dg4OHh4eLi4uPj4+Tk5OXl5ebm5ufn5+jo6Onp6erq6uvr6+zs7O3t7e7u7u/v7/Dw8PHx8fLy8vPz8/T09PX19fb29vf39/j4+Pn5+fr6+vv7+/z8/P39/f7+/v///yH5BAEKAPsALAAAAAA8ACAAAAj+APcJHEiwoMF99P4pXMiQIb2DECNKlJiQIcGGDydq3Hiw4sKLDjmK5IjOXkOQC+2hG8lS4Lt79WLSo2eP38mBDfnZmxmz3r13LSXea7jQnz+iDI0i/XcvaMR6S5Uu/SeVaD2nB0tO3cpVJVaXMGsqFLiV7FKc/3T6BBp0aFGUN83GFXh0YdOgUN+iJQr3I8G6Cq+21Gpx71ykBRt65fiyntjCcvnum2pYodqfGt0SlVq1aN3OCjkDbnhXYt7Nn0eHTo169VLBEQnrnPmY4WyaNnPuxE309uPFB93l66dwMWGGxk0qXrnveErmhPvlcwdR87+MAj0uxI6QKHftCr+mMyxd8PR1guDPD0wvHiN6hrAJOk9OlP5ygc6LQ1euv6Bw4gv5lpttu9UWYIEDHkhbgtJRNxA+SalGlYRcTQXahAzhQxCEnrVW4YcXdqbhQI0Z2NtuPaWo4ooLbnUZWwXldx9WMiLH3FMRwveVQOZ1Fl91Odq14z7WdUYeRCXm9uKQSVpmz1oiEQbckANJeeNIFXFH5XrhOZXllgZ9iVdgYJZHZkQBAQA7"; //60x32
			shot.src = "data:image/gif;base64,R0lGODlhAgAGAAABACH+EkNyZWF0ZWQgd2l0aCBHSU1QAAAsAAAAAAIABgCHAAAAAAAzAABmAACZAADMAAD/ACsAACszACtmACuZACvMACv/AFUAAFUzAFVmAFWZAFXMAFX/AIAAAIAzAIBmAICZAIDMAID/AKoAAKozAKpmAKqZAKrMAKr/ANUAANUzANVmANWZANXMANX/AP8AAP8zAP9mAP+ZAP/MAP//MwAAMwAzMwBmMwCZMwDMMwD/MysAMyszMytmMyuZMyvMMyv/M1UAM1UzM1VmM1WZM1XMM1X/M4AAM4AzM4BmM4CZM4DMM4D/M6oAM6ozM6pmM6qZM6rMM6r/M9UAM9UzM9VmM9WZM9XMM9X/M/8AM/8zM/9mM/+ZM//MM///ZgAAZgAzZgBmZgCZZgDMZgD/ZisAZiszZitmZiuZZivMZiv/ZlUAZlUzZlVmZlWZZlXMZlX/ZoAAZoAzZoBmZoCZZoDMZoD/ZqoAZqozZqpmZqqZZqrMZqr/ZtUAZtUzZtVmZtWZZtXMZtX/Zv8AZv8zZv9mZv+ZZv/MZv//mQAAmQAzmQBmmQCZmQDMmQD/mSsAmSszmStmmSuZmSvMmSv/mVUAmVUzmVVmmVWZmVXMmVX/mYAAmYAzmYBmmYCZmYDMmYD/maoAmaozmapmmaqZmarMmar/mdUAmdUzmdVmmdWZmdXMmdX/mf8Amf8zmf9mmf+Zmf/Mmf//zAAAzAAzzABmzACZzADMzAD/zCsAzCszzCtmzCuZzCvMzCv/zFUAzFUzzFVmzFWZzFXMzFX/zIAAzIAzzIBmzICZzIDMzID/zKoAzKozzKpmzKqZzKrMzKr/zNUAzNUzzNVmzNWZzNXMzNX/zP8AzP8zzP9mzP+ZzP/MzP///wAA/wAz/wBm/wCZ/wDM/wD//ysA/ysz/ytm/yuZ/yvM/yv//1UA/1Uz/1Vm/1WZ/1XM/1X//4AA/4Az/4Bm/4CZ/4DM/4D//6oA/6oz/6pm/6qZ/6rM/6r//9UA/9Uz/9Vm/9WZ/9XM/9X///8A//8z//9m//+Z///M////AAAAAAAAAAAAAAAACA4ApUkjR04dPG8HvSEMCAA7"; //2x6
			ovni.src = "data:image/gif;base64,R0lGODlhPAAgAOeYACD+AiH+AyL+BCD/AiP+BSH/AyH/BCT+BiL/BCX+ByP/BST/BiT/ByX/Byj+Cyb/CCb/CSn+DCf/Cin/DCr/DS3+EC3+ETD9FC/+EzT8GS/+FC3/EC3/ES7/EjH+FS//EzL+FzH/FTL/FjX+Gjj9HTP/GDf+HDv9ITf/HDz9Ijj/HTz+Ijv/ID7/JEL+KUX9LEL/KET/K0X/LEj/L1H8OUv/M1P8PUz/NFT8PU7/NmX2Ulf8QFH/Olv7RlT/PVX/Plb/P2D7TFf/QFf/QWH7TV3+SHj0Z3r0aWD/S2r7V2H/TGL/TWT/T3D7XWz/WH36bHH/XnT+YXT/Yov6fIH/cIT/dK7upov/fJH9g4//gJ75kbDzp5b/iJn/i6v5oJ3/j5//krP3qqb9mrX3rKb/mtvp2cjywqr/nqv/oMH2uefo57H/pujo6LL/qMn2w7X/q8z2x9b10sf8wML/usX/vcj+wdr31tv31+/v79j51OD23eH23+r06Or06dD/ytT+ztL/zNP/zdX/z9n/1PT09PD28PX19d3/2fb29uH/3ff39+j/5e3+6+3/6/D+7u7/7PH/7/f99/r8+vT/8/z8/Pj++Pn/+f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAP8ALAAAAAA8ACAAAAj+AP8JHEiwoMF/hDApXMiQIaGDECNKlJiQIcGGDydq3Hiw4sKLDjmK5MgGUUOQCxGVGclS4AABEYhoicMHEaWTAxlCkpNEA4ABQIG2lBgUqAokZwAxqtTQ0iNAa6oUMdGgaNGhEa0GXVBhxQ8hTHLkkKC1rFCsBs2qXVsWrUutb83GhTs3KFa6de0ObEsQL0u/cvf6/Wd1x1C+ec8mLhg0BBU7akSamZIiAODAagU3GLKmkSREhhTh0agI0yI0M8iyXV2WgIssiSw1VKTR0MJFdKDEYM1bAYsodSA1VGhoYkmFlBAR6rNHzBIKCHiX5eDjih/hyQkRsmnai46IW/L+RFKIiI3AkpAEfXECY8OBAYkHRLgg8IgXQI9kkzf/j02hQU5Y8BNEIwDRxiSYZCSQR5g45QZBL0zAAFAGlNADQQwqpOA/Ydxw1UFAoUDGJBtmmCBBJ2hFAIbDbeiBVSAGJQIYhfB3XEPlCWSEWRmcZ1JDd1gRH2NWNYCFHtpx11B2cIBglgA9bHeTJYe8IQUPDiTAVl9aFeDDHMJhcsklw2ESyFo1KGTJIF3I0IF0XJr1gRJd/OFImWeqVcOaXLQAgXSKEcbaAyCQgAMNTTwxRhpBmIVBDzYACmNarLnF20SruRXfh0RtqWmmmHpqqagaDaZpXofpdSqlgY7E6aoMccKXaquwCkorQQEBADs%3D"; //60x32
			boss1.src = "data:image/gif;base64,R0lGODlhPAAgAOeYACD+AiH+AyL+BCD/AiP+BSH/AyH/BCT+BiL/BCX+ByP/BST/BiT/ByX/Byj+Cyb/CCb/CSn+DCf/Cin/DCr/DS3+EC3+ETD9FC/+EzT8GS/+FC3/EC3/ES7/EjH+FS//EzL+FzH/FTL/FjX+Gjj9HTP/GDf+HDv9ITf/HDz9Ijj/HTz+Ijv/ID7/JEL+KUX9LEL/KET/K0X/LEj/L1H8OUv/M1P8PUz/NFT8PU7/NmX2Ulf8QFH/Olv7RlT/PVX/Plb/P2D7TFf/QFf/QWH7TV3+SHj0Z3r0aWD/S2r7V2H/TGL/TWT/T3D7XWz/WH36bHH/XnT+YXT/Yov6fIH/cIT/dK7upov/fJH9g4//gJ75kbDzp5b/iJn/i6v5oJ3/j5//krP3qqb9mrX3rKb/mtvp2cjywqr/nqv/oMH2uefo57H/pujo6LL/qMn2w7X/q8z2x9b10sf8wML/usX/vcj+wdr31tv31+/v79j51OD23eH23+r06Or06dD/ytT+ztL/zNP/zdX/z9n/1PT09PD28PX19d3/2fb29uH/3ff39+j/5e3+6+3/6/D+7u7/7PH/7/f99/r8+vT/8/z8/Pj++Pn/+f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAP8ALAAAAAA8ACAAAAj+AP8JHEiwoMF/hDApXMiQIaGDECNKlJiQIcGGDydq3Hiw4sKLDjmK5MgGUUOQCxGVGclS4AABEYhoicMHEaWTAxlCkpNEA4ABQIG2lBgUqAokZwAxqtTQ0iNAa6oUMdGgaNGhEa0GXVBhxQ8hTHLkkKC1rFCsBs2qXVsWrUutb83GhTs3KFa6de0ObEsQL0u/cvf6/Wd1x1C+ec8mLhg0BBU7akSamZIiAODAagU3GLKmkSREhhTh0agI0yI0M8iyXV2WgIssiSw1VKTR0MJFdKDEYM1bAYsodSA1VGhoYkmFlBAR6rNHzBIKCHiX5eDjih/hyQkRsmnai46IW/L+RFKIiI3AkpAEfXECY8OBAYkHRLgg8IgXQI9kkzf/j02hQU5Y8BNEIwDRxiSYZCSQR5g45QZBL0zAAFAGlNADQQwqpOA/Ydxw1UFAoUDGJBtmmCBBJ2hFAIbDbeiBVSAGJQIYhfB3XEPlCWSEWRmcZ1JDd1gRH2NWNYCFHtpx11B2cIBglgA9bHeTJYe8IQUPDiTAVl9aFeDDHMJhcsklw2ESyFo1KGTJIF3I0IF0XJr1gRJd/OFImWeqVcOaXLQAgXSKEcbaAyCQgAMNTTwxRhpBmIVBDzYACmNarLnF20SruRXfh0RtqWmmmHpqqagaDaZpXofpdSqlgY7E6aoMccKXaquwCkorQQEBADs%3D";
			boss2.src = "data:image/gif;base64,R0lGODlhPAAgAOeAAP8AAOMiAsdDBcdEBatlCKxlCJGHC5GIC3aqDlvLEkDuFjT8GTX+Gjj9HTf+HDv9ITf/HDz9Ijj/HTz+Ijv/ID7/JEL+KUX9LEL/KET/K0X/LEj/L1H8OUv/M1P8PUz/NFT8PU7/NmX2Ulf8QFH/Olv7RlT/PVX/Plb/P2D7TFf/QFf/QWH7TV3+SHj0Z3r0aWD/S2r7V2H/TGL/TWT/T3D7XWz/WH36bHH/XnT+YXT/Yov6fIH/cIT/dK7upov/fJH9g4//gJ75kbDzp5b/iJn/i6v5oJ3/j5//krP3qqb9mrX3rKb/mtvp2cjywqr/nqv/oMH2uefo57H/pujo6LL/qMn2w7X/q8z2x9b10sf8wML/usX/vcj+wdr31tv31+/v79j51OD23eH23+r06Or06dD/ytT+ztL/zNP/zdX/z9n/1PT09PD28PX19d3/2fb29uH/3ff39+j/5e3+6+3/6/D+7u7/7PH/7/f99/r8+vT/8/z8/Pj++Pn/+f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAA8ACAAAAj+AP8JHEiwoMF/bAApXMiQIZuDECNKlJiQIcGGDydq3Hiw4sKLDjmK5EgFTkOQC+E0GclSIICXLIRkIQOHz8mBDPFoiUHgpU8ALSX+BCABxhM0dPo09HMHzZQeLRwM/Rk04tSfE06ooBEixNWvQKsaBEu2LFWx/666BLtWbduzLacS/DpXbl24LO2+xet24NARQfumFSx4MIADPLxIEelkRwTCdA3r9bliSh09cNzIAaNRDqA5UDaYHf3VQpA4fhrK0ehm4RwuODKQJk0hRxc8DRW6mVhSIR84bMqMUTJjNlgTP8zg/s2GTc3PRkREHBImj0I4VASWxKPmiA0MPvfk/iwg8IURNHdSX8/+j0qbNTbCH2SAosoeQBkFegTE1ArBC0MpUAJB+ymU3z9JfIBXXRAwsceBBeJH0AOCRXigAUMd9BMCSLTBXm8NYSeQC18toJ1JDX3hg3gvFXQVEGI091xDzGGRAFglOGeTH29coQMJo901lAlb4AbIH3/kBkgaZHWgkB9rFKFBALMJOdUAMhRxhh1KMglWB1ASUYFxLfpFWgINgMBBDTcsEUUKXwlQggdkLshiYXkFKVRZaN1p51h89mmWRoMKGuhGevVpZVh5lqkooI42yuijQlb156OXChQQADs%3D";
			originalmode = false;
			setSources = true;
	    }
    }
	
    function penguinMessage(){
        if(showPenguinMessage){
            bufferctx.save();
            bufferctx.fillStyle = "red";
            bufferctx.font = "400 20px/2 Unknown Font, sans-serif";
            if(penguin){
                bufferctx.fillText("Penguin Mode Activated", 220, showMessageY);
            }
            else{
                bufferctx.fillText("Penguin Mode Deactivated", 220, showMessageY);
            }
            bufferctx.restore();
            showMessageY += 5; //To create the animation
            if(showMessageY == 450){
                showMessageY = 220;
                showPenguinMessage = false;
            }
        }
    }
    
    function eriMessage(){
        if(eriShowMessage){
            bufferctx.save();
            bufferctx.fillStyle = "red";
            bufferctx.font = "400 20px/2 Unknown Font, sans-serif";
            if(eriTramposilla){
                bufferctx.fillText("Turboshooting mode ON", 220, showMessageY);
            }
            else{
                bufferctx.fillText("Turboshooting mode OFF", 220, showMessageY);
            }
            bufferctx.restore();
            showMessageY += 5; //To create the animation
            if(showMessageY == 450){
                showMessageY = 220;
                eriShowMessage = false;
            }
        }
    }
    
    function bossMessage(){
        if(bossShowMessage){
            bufferctx.save();
            bufferctx.fillStyle = "red";
            bufferctx.font = "400 20px/2 Unknown Font, sans-serif";
            if(bossFight){
                bufferctx.fillText("Wave " + wave, 280, showMessageY);
                bufferctx.fillText("Boss Fight!", 280, showMessageY + 20);
            }
            bufferctx.restore();
            showMessageY += 1; //To create the animation
            if(showMessageY == 450){
                showMessageY = 220;
                bossShowMessage = false;
            }
        }
    }
    
    function collisions(){ //Check collisions
        var enemy;
        for(var id in shots){ //check ship's shots
            var shot = shots[id];
            if(shot.type == 1){ //Ship
                for(var eid in enemies){
                    enemy = enemies[eid];
                    if(shot.x >= enemy.x && shot.x <= (enemy.x + enemy._width)){
                    if(shot.y >= enemy.y && shot.y <= (enemy.y +enemy._height)){
                        var point = new Point(shot.x, shot.y, 50*wave);
                        addPoint(point);
                        removeEnemy(enemy);
                        removeShot(shot);
                        score += 50 * wave;
                        setScore(); //Draw and set the score
                        //soundManager.play('explosion1');
                    }
                    }
                }
                for(var oid in ovnis){ //Ovni
                    var ufo = ovnis[oid];
                    if(shot.x >= ufo.x && shot.x <= (ufo.x + ufo.width)){
                        if(shot.y >= ufo.y && shot.y <= (ufo.y + ufo.height)){
                            var points = new Point(shot.x, shot.y, ufo.points);
                            addPoint(points);
                            score += ufo.points;
                            setScore(); //Draw and set the score
                            removeOvni(ufo);
                            removeShot(shot);
                            //soundManager.play('explosion2');
                        }
                    }
                }
                if(bossFight){
                    if(shot.x >= boss.x && shot.x <= (boss.x + boss._width)){
                        if(shot.y >= boss.y && shot.y <= (boss.y + boss._height)){
                            removeShot(shot);
                            boss.lives--;
                            //soundManager.play('explosion2');
                            //console.log(boss.lives);
                        }
                    }
                }
            }
            else{//check enemies and boss' shots
                if(shot.x >= shipX && shot.x <= (shipX + 60)){
                    if(shot.y >= 435 && shot.y <= (32 + 435)){
                        removeShot(shot);
                        playerLives--;
                        //soundManager.play('explosion2');
                    }
                }
            }
            //missed shots
            if(shot.y <= 0 || shot.y > HEIGHT) removeShot(shot);
        }
        for(var eid2 in enemies){ //Check enemies
            enemy = enemies[eid2];
            //Check if they touch the ship
            if(enemy.x < (shipX + 60) && (enemy.x + enemy._width) > shipX){
                if((enemy.y + enemy._height)>= (HEIGHT - 32)){
                    removeEnemy(enemy);
                    playerLives--;
                }
            }
            //Check if they reach the end
            if((enemy.y + enemy._height) >= HEIGHT){
                removeEnemy(enemy);
                playerLives = 0;
            }
        }
        //check boss
    }
    
    function init(){ //Draw every 10ms
        //Get the buffer
        buffer = document.createElement("canvas");
        //Get the reference to the buffer
        bufferctx = buffer.getContext("2d");
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        buffer.width = canvas.width;
        buffer.height = canvas.height;
        //Load WIDTH
        WIDTH = buffer.width;
        //Load HEIGHT
        HEIGHT = buffer.height - 15; //because of the bottom bar with Score
        //Put ship in the middle of the screen
        shipX = (WIDTH / 2) - 30; //because ship's width is 60
        //Set the left limit of the buffer for the mouse
        //canvasMinX = $("#buffer").offset().left - 350;
        canvasMinX = 8;
        //Now set the right edge for the mouse
        canvasMaxX = canvasMinX + WIDTH;
        //Create enemy array
        initInvaders();
        //Create star arrays
        initStars();
        setScore(); //Draw and set the score
        //Draw every 10ms to create movement illusion
        intervalId = setInterval(draw, 10);
        return intervalId;
    }
    
    function draw(){ //Draw the canvas
        //First clean the screen
        bufferctx.fillStyle = backcolor; 
        clear();
        
        if(!gameOver){ //If the game isn't over
            if(!pause){
                if(playerLives === 0){ //Check if you've lost or not the game
                    gameOver = true;
                }
                
                if(wave%10 === 0) bossFight = true;
                
                if(yDown) yDown = false;
                
                penguinMode();
				penguinMessage();
				
				eriMessage();
                
                bossMessage();
                
                //Draw and move the ship if left or right is pressed
                bufferctx.drawImage(ship, shipX, 450);//Draw the ship
                
                if(!bossFight){ //Normal game
                    //console.log("wave" + wave +", normal game");
                    if(invadersChangeDir === true){ //Change direction of invaders
                        invadersChangeDir = false;
                        invadersDir = -invadersDir;
                        invadersSpeed = -invadersSpeed; //Inverse the speed
                        invadersMovDown = 10; //Move them one row down
                    }
                
                    //Draw enemies
                    for(var id in enemies){
                        var enemy = enemies[id];
                        //Change the delay
                        enemy.delay = (enemyCount * 20) - (wave * 10);
                        if(enemy.delay <= 300) enemy.delay = 300;
                        enemy._time += 100;
                        if(enemy._time >= enemy.delay){
                            //Test if they shoot or not
                            var testShot = Math.floor(Math.random() *enemy.delay+1);
                            if((testShot - wave*0.4) < (enemy.delay / 200)){
                                enemy._fire = true;
                            }
                            if(enemy.x + (enemy._width + 15) >= (WIDTH - wave*10)
                               && invadersDir == 1){ //Right border
                                invadersChangeDir = true;
                            }
                            else if(enemy.x - 15 <= (0+wave*2) && invadersDir != 1){
                                invadersChangeDir = true;
                            }
                            
                            enemy.frame = -enemy.frame; //Draw the other image
                            enemy.x += invadersSpeed; //Move them on the x axis
                            enemy._time = 0;
                        }
                        enemy.y += invadersMovDown; //move down a row or not
                        if(enemy._fire === true){ //If they can shoot,create the shot
                            enemy._fire = false;
                            var shotEnemy = new Shot(enemy.x+(enemy._width/2),enemy.y+10,
                                           enemyProyectil1, enemyProyectil2, -5, 2);
                            addShot(shotEnemy); //And add it to the array
                            //soundManager.play('shot2');
                        }
                        bufferctx.save();
                        if(enemy.frame == 1){
                            bufferctx.drawImage(enemy.imgSrc1, enemy.x, enemy.y, 20, 16);
                        } //Draw the src1 of an enemy
                        else{
                            bufferctx.drawImage(enemy.imgSrc2, enemy.x, enemy.y, 20, 16);
                        } //Draw the src2 of an enemy
                        bufferctx.restore(); //restore the buffer
                    }
                    invadersMovDown = 0; //Reset the movement on the y axis
                    
                    drawOvni(); //Draw the ovni
                    
                    //New wave and +1 live bonus
                    if(enemyCount === 0){
                        wave++;
                        if(wave%10 != 0){
                            //console.log("Oleada " + wave);
                            if(bossKilled){
                                wave--;
                                bossKilled = false;
                            }
                            showWave = true; //To show the new wave in showWaveLives()
                            if(playerLives < 3){
                                playerLives++; //Increase a live
                                showLivePlus = true; //Show it in showWaveLives()
                            }
                            //Can I delete shots like that?Or should I do for sid in shots
                            //var shot = shots[sid]; removeShot(shot.id); ?
                            shots = {};
                            initInvaders(); //Restart the enemy array
                            //invadersSpeed = invadersSpeed + 0.2*wave;
                        }
                    }
                    showWaveLives(); //Show the info
                }
                else{ //Boss Fight!
                    //console.log("wave" + wave +", boss fight");
                    drawBoss();
                }
                
                //Draw proyectiles
                for(var sid in shots){
                    var shot = shots[sid]; 
                    shot._time += 100;
                    shot.y -= shot.speed;
                    if(shot._time >= shot.delay){
                        shot._time = 0;
                        shot.frame = -shot.frame;
                    }
                    removeShot(shot);
                    addShot(shot);
                    bufferctx.save();
                    if(shots.frame == 1){
                        bufferctx.drawImage(shot.imgSrc1, shot.x, shot.y);
                    } //Draw the src1 of a shot
                    else{
                        bufferctx.drawImage(shot.imgSrc2, shot.x, shot.y);
                    } //Draw the src2 of a shot
                    bufferctx.restore(); //restore the buffer
                }
                
                drawStars(); //Draw the stars
                
                drawPoints(); //To show the points of the enemies down
                
                collisions(); //Check for collisions of shots
                
                for(var i = 0; i < playerLives; i++){ //Draw lives
                    bufferctx.save();
                    bufferctx.fillStyle = "green";
                    bufferctx.font = "400 15px/2 Unknown Font, sans-serif";
                    bufferctx.fillText("Lives: ", 480, 25);
                    bufferctx.drawImage(ship, (WIDTH/2) + 200 + (i * 40), 10, 30, 16);
                    bufferctx.restore();
                }
                
                
                
            } //pause true
            else{
                bufferctx.fillStyle = "red";
                bufferctx.font = "italic 400 100px/2 Unknown Font, sans-serif";
                bufferctx.fillText("Pause", 185, 250);
                bufferctx.font = "italic 400 40px/2 Unknown Font, sans-serif";
                bufferctx.fillText("push P to continue", 170, 300);
            }
        }
        else{ //gameOver true
            if(newGame){ //Just at the beginning of the game
                bufferctx.drawImage(enemy1A, 125, 40, 400, 320);
                bufferctx.font = "italic 400 50px/2 Unknown Font, sans-serif";
                bufferctx.fillStyle = "white";
                bufferctx.fillText("Space Invaders", 140, 400); 
                bufferctx.font = "italic 400 20px/2 Unknown Font, sans-serif";
                bufferctx.fillText("by Sergio Ruiz. 2011", 305, 450);
                bufferctx.fillStyle = "red";
                bufferctx.fillText("Move: Left, Right", 240, 220);
                bufferctx.fillText("Shoot: Space", 255, 240);
                bufferctx.fillText("Pause: P", 270, 260);
				bufferctx.font = "italic 400 10px/2 Unknown Font, sans-serif";
				bufferctx.fillText("Penguin: .", 290, 270);
				bufferctx.font = "italic 400 20px/2 Unknown Font, sans-serif";
                bufferctx.fillText("Press space", 270, 300);
            }
            else{ //If you lose
                bufferctx.fillStyle = "red";
                bufferctx.font = "italic 400 100px/2 Unknown Font, sans-serif";
                bufferctx.fillText("You lose!", 100, 250);
                bufferctx.font = "italic 400 50px/2 Unknown Font, sans-serif";
                bufferctx.fillText("Score: " + score, 100, 350);
                bufferctx.font = "italic 400 30px/2 Unknown Font, sans-serif";
                bufferctx.fillText("retry? (y, n)", 100, 400);
                if(yDown){ //Restart the init vars
                    playerLives = 3;
                    wave = 1;
                    bossFight = false;
                    showBoss = false;
                    shots = {};
                    enemyCount = 0;
                    score = 0;
					penguin = false;
                    initInvaders();
                    gameOver = false;
                }
                else if(nDown){ //Say good bye and end the drawing
                    bufferctx.fillStyle = backcolor; 
                    clear();
                    bufferctx.fillStyle = "red";
                    bufferctx.font = "italic 400 100px/2 Unknown Font,sans-serif";
                    bufferctx.fillText("Good bye!", 100, 250);
                    bufferctx.font = "italic 400 50px/2 Unknown Font, sans-serif";
                    bufferctx.fillText("Thanks for playing", 100, 350);
                    clearInterval(intervalId);
                    nDown = false;
                }
            }
        }
        ctx.drawImage(buffer, 0, 0);
    }
    
    /******************************************************************
                               MAIN PROGRAM
    ******************************************************************/
    
    init();
    
})();
