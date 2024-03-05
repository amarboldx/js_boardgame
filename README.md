![image](https://github.com/amarboldx/js_boardgame/assets/136521600/f66dc270-8a99-4272-bbc0-df659b6b95fd)# js_boardgame
#Javascript-based board game

##Description of the game
###Brief overview
In this single-player game, you have to place map elements of different shapes and terrain types on an 11x11 square grid map. Each element is assigned a time value (1 or 2) and the game consists of 28 time units. At the end (or during) of the game, a number of checks (missions) are performed against the current state of the grid, and the final score is calculated.

##Initial state of the map
The map is an 11x11 square grid, initially filled with empty cells. The map contains mountain fields in 5 fixed cells
![image](https://github.com/amarboldx/js_boardgame/assets/136521600/542250b2-679b-4bad-a492-1fb169d904dc)


##Placing map elements
The types of terrain of map elements that can be placed are: forest, village, farm and water.
![image](https://github.com/amarboldx/js_boardgame/assets/136521600/facd3603-e1fa-4ca6-9063-b57f043bd8d2)


The possible elements are shuffled randomly and then you need to place them on the map one by one in sequence. Each map element can be rotated and mirrored, and the map element cannot cover an already reserved field (a mountain is a reserved field), or have any part of it hanging off the map.
![image](https://github.com/amarboldx/js_boardgame/assets/136521600/fa45bd85-68c1-488e-be07-78c53f374aac)
![image](https://github.com/amarboldx/js_boardgame/assets/136521600/cc912a75-9dcb-4b7c-9c7d-c9121104d447)



##End of the game
The game lasts up to 28 time units. Each map element is assigned a time unit, which determines how long it takes to explore it. You can draw new map elements until you reach 28 time units. When the total time value reaches or exceeds 28 time units, the game ends. For example, if we have 1 time unit left and we get a map element with two time units, we can still place the map element and then the game ends.


##Calculating the score
At the beginning of each game, 4 random mission cards (A,B,C,D) must be selected to score points. An example of a mission card is this:

'You get three points for each of your water fields adjacent to your mountain fields.'
![image](https://github.com/amarboldx/js_boardgame/assets/136521600/c58bb1e7-df6b-4dbb-9bf3-4df3c582ce0f)

##Seasons
The 28 time units represent one year. It can be divided into 4 seasons, each season lasting up to 7 units of time. If the total time value reaches or exceeds a multiple of 7 while placing the map elements, the season ends.

At the end of each season, you can score for 2 missions. At the end of spring, you can score points for mission A-B, at the end of summer for mission B-C, at the end of autumn for mission C-D and at the end of winter for mission D-A. For each of the four missions, you need to indicate per season how many points you have earned for each mission!

At the end of the game, the points you have earned over the four seasons will be added together to give you your final score.

##Missions
![image](https://github.com/amarboldx/js_boardgame/assets/136521600/56de6f79-aa8d-430a-87d2-adc8215dc06f)
![image](https://github.com/amarboldx/js_boardgame/assets/136521600/f3b4add3-87f2-4959-82c7-cbeee8f0c248)


