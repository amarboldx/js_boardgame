const rows = 11
const cols = 11
let scriptUrl = document.currentScript.src;
let rootPath = scriptUrl.split('/').slice(0, -1).join('/');
let basePath = `${rootPath}/assets/tiles/`;
//Tile Paths

const default_tile = `${basePath}base_tile.png`;
const forest_tile = `${basePath}forest_tile.png`;
const mountain_tile = `${basePath}mountain_tile.png`;
const plains_tile = `${basePath}plains_tile.png`;
const village_tile = `${basePath}village_tile.png`;
const water_tile = `${basePath}water_tile.png`;
//MissionPaths

const baseMissionPath = `${rootPath}/assets/missions_eng/`;
//basic missions
const edge_of_the_forst_path = `${baseMissionPath}group%2069.png`;
const sleepy_valley_path = `${baseMissionPath}group%2074.png`;
const watering_potatoes_path = `${baseMissionPath}group%2070.png`;
const borderlands_path = `${baseMissionPath}group%2078.png`;
//extra missions
const tree_line_path = `${baseMissionPath}group%2068.png`
const wealthy_town_path = `${baseMissionPath}group%2071.png`;
const row_of_houses_path = `${baseMissionPath}group%2072.png`;
const odd_numbered_silos_path = `${baseMissionPath}group%2073.png`;
const watering_canal_path = `${baseMissionPath}group%2075.png`;
const magician_valley_path = `${baseMissionPath}group%2076.png`;
const empty_site_path = `${baseMissionPath}group%2077.png`;
const rich_countryside_path = `${baseMissionPath}group%2079.png`;


function init(){
    getCurrentElement(); 
    selectRandomMission();
    createTable();
    addMountainTiles();
    createShapeTable();
    updateShape();
    updateTimer();
    updateScore();
    update_missions_image();
    loadGame();
}
function createTable() {
    let div = document.getElementById("board");   
    let table = document.createElement("table");
    for (let i = 0; i < rows; i++) {
        let row = document.createElement("tr");
      for (let j = 0; j < cols; j++) {
        let cell = document.createElement("td");
        let img = document.createElement("img");
        img.src = default_tile;
        cell.addEventListener("click", function() {
            placePiece();
        });

        cell.appendChild(img);
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    div.appendChild(table);
}
function newGame(){
        clearBoard();
        addMountainTiles();
        usedElements = [];
        currentSeason = 'spring';
        currentElement = null;
        score=0;
        spring_points = 0;
        summer_points = 0;
        autumn_points = 0;
        winter_points = 0;
        mission1Score = 0;
        mission2Score = 0;
        mission3Score = 0;
        mission4Score = 0;
        borderlands_score = 0;
        getCurrentElement();
        totalTime = 28;
        updateTimer();
        updateScore(); 
        setAllElemDefualt();
        updateShape();
        highlight_mission();

}
function createShapeTable() {
    let div = document.getElementById("shape_table");
    let table = document.createElement("table");
    for (let i = 0; i < 3; i++) {
        let row = document.createElement("tr");
      for (let j = 0; j < 3; j++) {
        let cell = document.createElement("td");
        let img = document.createElement("img");
        img.src = default_tile
        cell.appendChild(img);
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    div.appendChild(table);
}
function addMountainTiles() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let mountainTiles = [
        { row: 1, col: 1 },
        { row: 3, col: 8 },
        { row: 5, col: 3 },
        { row: 8, col: 9 },
        { row: 9, col: 5 }
    ];
    for (let i = 0; i < mountainTiles.length; i++) {
        let rowIndex = mountainTiles[i].row;
        let cellIndex = mountainTiles[i].col;

        let cell = boardTable.rows[rowIndex].cells[cellIndex];
        let img = cell.querySelector("img");
        img.src = mountain_tile;
    }
}

function selectTile(element) {
    switch (element.type) {
        case "water":
            return water_tile;
        case "forest":
            return forest_tile;
        case "town":
            return village_tile;
        case "farm":
            return plains_tile;
        default:
            return default_tile;
    }
}

function getRandomElement(elements) {
    let remainingElements = elements.filter(element => !usedElements.includes(element));
    if (remainingElements.length === 0) {
        usedElements = [];
        remainingElements = elements;
    }
    let randomIndex = Math.floor(Math.random() * remainingElements.length);
    let selectedElement = remainingElements[randomIndex];
    usedElements.push(selectedElement);
    return selectedElement;
}
function getCurrentElement() {
    if (!currentElement) {
        currentElement = getRandomElement(elements);
    }
    return currentElement;
}
function setAllElemDefualt(){
    let table = document.querySelector("#shape_table table");
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        let cell = table.rows[i].cells[j];  
        let img = cell.querySelector("img");
        img.src = default_tile;
        }
      }
}
function updateShape(){
    let table = document.querySelector("#shape_table table");
    let element = currentElement
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        let cell = table.rows[i].cells[j];  
        if(element.shape[i][j] == 1){
            let img = cell.querySelector("img");
            img.src = selectTile((element));
        }
      }
    }
    return element
}
function mirrorShapes(element) {
    let mirroredElement = {
        ...element,
        mirrored: true,
        shape: element.shape.map(row => row.slice().reverse())
    };
    return mirroredElement;
}
function rotateShapes(element){
    let rotatedElement = {
        ...element,
        rotation: (element.rotation + 1) % 4,
        shape: element.shape[0].map((val, index) => element.shape.map(row => row[index]).reverse())
    };
    return rotatedElement;
}

document.getElementById("mirrorButton").addEventListener("click", function () {
    setAllElemDefualt()
    currentElement = mirrorShapes(currentElement);
    updateShape();
});
document.getElementById("flipButton").addEventListener("click", function () {
    setAllElemDefualt()
    currentElement = rotateShapes(currentElement);
    updateShape();
});
function checkPlacementValidity(startRowIndex, startCellIndex) {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    if (
        startRowIndex + 2 >= 11 ||
        startCellIndex + 2 >= 11 ||
        startRowIndex < 0 ||
        startCellIndex < 0
    ) {
        return false;
    }
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            let boardCell = boardTable.rows[startRowIndex + k].cells[startCellIndex + l].querySelector("img");
            let currentElementCell = currentElement.shape[k][l];
    
            if (currentElementCell === 1) {
                if (boardCell.src !== default_tile) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece() {
    let placecnt = 0;
    let board = document.getElementById("board").querySelector("table");
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let cellImg = board.rows[i].cells[j].querySelector("img");
            if(cellImg.style.border === "1px solid green"){
                current_tile = selectTile(currentElement)
                cellImg.src = current_tile;
                placecnt++;
            }
        }
    }
    if(placecnt !== 0){
        removeHighlights();  
        setAllElemDefualt();
        totalTime = totalTime - currentElement.time;
        updateTimer();
        usedElements.push(currentElement);
        currentElement = null;
        getCurrentElement();
        updateShape();
        saveGame();
        checkEnd();
    }
}
function updateTimer() {
    getSeason();
    let timer = document.getElementById("timer");
    let elemTimer = document.getElementById("current_elem_timer");
    elemTimer.innerHTML = "Element season cost: " + currentElement.time + "⌛";
    timer.innerHTML = "Total seasons left: " + totalTime + "⌛";
    if (newSeason !== currentSeason) {
        switch (currentSeason) {
            case 'spring':
                spring_points += selectedMissions[0].function();
                mission1Score += selectedMissions[0].function();
                spring_points += selectedMissions[1].function();
                mission2Score += selectedMissions[1].function();
                score += spring_points;
                for(let i = 0; i <= 1; i++){
                    if(selectedMissions[i].path === borderlands_path){
                        borderlands_score += selectedMissions[i].function()
                    }
                }
                break;
            case 'summer':
                summer_points += selectedMissions[1].function();
                mission2Score += selectedMissions[1].function();
                summer_points += selectedMissions[2].function();
                mission3Score += selectedMissions[2].function();
                score += summer_points;
                for(let i = 1; i <= 2; i++){
                    if(selectedMissions[i].path === borderlands_path){
                        borderlands_score += selectedMissions[i].function()
                    }
                }
                break;
            case 'autumn':
                autumn_points += selectedMissions[2].function();
                mission3Score += selectedMissions[2].function();
                autumn_points += selectedMissions[3].function();
                mission4Score += selectedMissions[3].function();
                score += autumn_points;
                for(let i = 2; i <= 3; i++){
                    if(selectedMissions[i].path === borderlands_path){
                        borderlands_score += selectedMissions[i].function()
                    }
                }
                break;
            case 'winter':
                winter_points += selectedMissions[3].function();
                mission4Score += selectedMissions[3].function();
                winter_points += selectedMissions[0].function();
                mission1Score += selectedMissions[0].function();
                score += winter_points;
                    if(selectedMissions[3].path === borderlands_path){
                        borderlands_score += selectedMissions[i].function()
                    }
                    if(selectedMissions[0].path === borderlands_path){
                        borderlands_score += selectedMissions[i].function()
                    }
                break;
            default:
                console.log('something went wrong');
                return '';
        }
        currentSeason = newSeason;
    }
    highlight_mission();
    updateScore();
}

function getSeason() {
    let winter_score = document.querySelector(".winter_score");
    let autumn_score = document.querySelector(".autumn_score");
    let summer_score = document.querySelector(".summer_score");
    let spring_score = document.querySelector(".spring_score");
    winter_score.style.border = ''
    autumn_score.style.border = ''
    summer_score.style.border = ''
    spring_score.style.border = ''
    switch (true) {
        case totalTime <= 7:
            winter_score.style.border = "2px solid black"
            newSeason =  'winter';
            break;
        case totalTime > 7 && totalTime <= 14:
            autumn_score.style.border = "2px solid black"
            newSeason = 'autumn';
            break;
        case totalTime > 14 && totalTime <= 21:
            summer_score.style.border = "2px solid black"
            newSeason = 'summer';
            break;
        case totalTime > 21 && totalTime <= 28:
            spring_score.style.border = "2px solid black"
            newSeason = 'spring';
            break;
        default:
            console.log('something went wrong');
            return '';
            break;
    }
}

function highlight_mission(){
    let missions = document.querySelectorAll(".grid-image");
    missions.forEach(mission => {
        mission.style.border = "none";
    });
    switch(true) {
        case currentSeason === 'spring':
            missions[0].style.border = "4px solid green"
            missions[0].style.borderRadius = "16px";
            missions[1].style.border = "4px solid green"
            missions[1].style.borderRadius = "16px";
            break;
        case currentSeason === 'summer':
            missions[1].style.border = "4px solid green"
            missions[1].style.borderRadius = "16px";
            missions[2].style.border = "4px solid green"
            missions[2].style.borderRadius = "16px";
            break;
        case currentSeason === 'autumn':
            missions[2].style.border = "4px solid green"
            missions[2].style.borderRadius = "16px";
            missions[3].style.border = "4px solid green"
            missions[3].style.borderRadius = "16px";
            break;
        case currentSeason === 'winter':
            missions[3].style.border = "4px solid green"
            missions[3].style.borderRadius = "16px";
            missions[0].style.border = "4px solid green"
            missions[0].style.borderRadius = "16px";
            break;
        default:
            console.log('something went wrong')
          break;
    }
}



function updateScore() {
    let winter_score = document.querySelector(".winter_score");
    let autumn_score = document.querySelector(".autumn_score");
    let summer_score = document.querySelector(".summer_score");
    let spring_score = document.querySelector(".spring_score");

    spring_score.innerHTML = 'Spring: ' + spring_points + ' point';
    summer_score.innerHTML = 'Summer: ' + summer_points + ' point';
    autumn_score.innerHTML = 'Autumn: ' + autumn_points + ' point';
    winter_score.innerHTML = 'Winter: ' + winter_points + ' point';

    let scorediv = document.querySelector(".total_score");
    scorediv.innerHTML = "Score: " + score;
}
const boardTable = document.getElementById("board");

document.getElementById("board").addEventListener("mousemove", function (event) {
    
    let rect = boardTable.getBoundingClientRect();
    let cursorRowIndex = Math.floor((event.clientY - rect.top) / (rect.height / rows));
    let cursorCellIndex = Math.floor((event.clientX - rect.left) / (rect.width / cols));
    removeHighlights();
    if((cursorRowIndex-1)>= 0 && (cursorCellIndex-1)>= 0 && (cursorRowIndex+1) <= rows && (cursorCellIndex+1) <= cols){
        highlightPlacement(cursorRowIndex-1, cursorCellIndex-1);
    }
});

function highlightPlacement(startRowIndex, startCellIndex) {
        if (checkPlacementValidity(startRowIndex, startCellIndex) === true) {
            let board = document.getElementById("board").querySelector("table");
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    let boardCell = board.rows[startRowIndex + k].cells[startCellIndex + l];
                    let cellimg = boardCell.querySelector("img");
                    let currentElementCell = currentElement.shape[k][l];
                    if(currentElementCell === 1){
                        cellimg.style.border = "1px solid green";
                        cellimg.style.borderRadius = "6px";
                    }
                    
                }
            }
        } else {
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    if(startRowIndex + 2 >= 11 || startCellIndex + 2 >= 11){
                        break
                    }else{
                        let boardTable = document.getElementById("board").querySelector("table");
                        let boardCell = boardTable.rows[startRowIndex + k].cells[startCellIndex + l];
                        let cellImg = boardCell.querySelector("img");
                        let currentElementCell = currentElement.shape[k][l];
            
                        if (currentElementCell === 1) {
                            cellImg.style.border = "1px solid red";
                            cellImg.style.borderRadius = "6px";
                        }
                    }
                    
                }
            }
        } 
    }
    
function clearBoard() {
        let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cell = boardTable.rows[i].cells[j];
                let img = cell.querySelector("img");
                img.src = default_tile;
            }
        }
    }

function removeHighlights() {
    let board = document.getElementById("board").getElementsByTagName("table")[0];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let boardCell = board.rows[i].cells[j];
            let cellimg = boardCell.querySelector("img");
            cellimg.style.border = "none";
        }
    }
}
function checkEnd() {
    let content = document.querySelector(".content");
    let gameOver_screen = document.querySelector(".gameoverScreen");
    let gameOver_spring = document.querySelector(".spring_score_gameov");
    let gameOver_summer = document.querySelector(".summer_score_gameov");
    let gameOver_autumn = document.querySelector(".autumn_score_gameov");
    let gameOver_winter = document.querySelector(".winter_score_gameov");
    let mission1 = document.querySelector(".mission1");
    let mission2 = document.querySelector(".mission2");
    let mission3 = document.querySelector(".mission3");
    let mission4 = document.querySelector(".mission4");
    mission1.innerHTML = ""
    mission2.innerHTML = ""
    mission3.innerHTML = ""
    mission4.innerHTML = ""
    let missionImg1 = document.createElement("img");
    let missionImg2 = document.createElement("img");
    let missionImg3 = document.createElement("img");
    let missionImg4 = document.createElement("img");
    let missionText1 = document.createElement("p");
    let missionText2 = document.createElement("p");
    let missionText3 = document.createElement("p");
    let missionText4 = document.createElement("p");
    let scores_div = document.querySelector(".total_score_end");
    let borderlands_score_div = document.querySelector(".borderlands_score");
    let encircle_mountain_div = document.querySelector(".encircle_mountain");
    let counter = 0;

    for (let i = 0; i <= rows - 3; i++) {
        for (let j = 0; j <= cols - 3; j++) {
            for (let rotate = 0; rotate < 4; rotate++) {
                currentElement = rotateShapes(currentElement);
                for (let mirror = 0; mirror < 2; mirror++) {
                    currentElement = mirrorShapes(currentElement);
                    if (checkPlacementValidity(i, j)) {
                        counter++;
                    }
                }
            }
        }
    }

    if (counter === 0 || totalTime < currentElement.time) {
        deleteSavedGameState();
        content.style.display = "none";
        gameOver_screen.style.display = "block";
        let totalScore = score + encirlce_mountain();
        gameOver_spring.innerHTML = "Spring Score: " + spring_points;
        gameOver_summer.innerHTML = "Summer Score: " + summer_points;
        gameOver_autumn.innerHTML = "Autumn Score: " + autumn_points;
        gameOver_winter.innerHTML = "Winter Score: " + winter_points;
        missionImg1.src = selectedMissions[0].path;
        missionImg2.src = selectedMissions[1].path;
        missionImg3.src = selectedMissions[2].path;
        missionImg4.src = selectedMissions[3].path;
        missionText1.textContent = "Mission 1 Score: " + mission1Score;
        missionText2.textContent = "Mission 2 Score: " + mission2Score;
        missionText3.textContent = "Mission 3 Score: " + mission3Score;
        missionText4.textContent = "Mission 4 Score: " + mission4Score;
        mission1.appendChild(missionImg1);
        mission1.appendChild(missionText1);
        mission2.appendChild(missionImg2);
        mission2.appendChild(missionText2);
        mission3.appendChild(missionImg3);
        mission3.appendChild(missionText3);
        mission4.appendChild(missionImg4);
        mission4.appendChild(missionText4);
        
        borderlands_score_div.innerHTML = "Points earned for basic Mission Borderlands: " + borderlands_score;
        encircle_mountain_div.innerHTML = "Points earned Secret Mission Encircle Mountain: " + encirlce_mountain();
        scores_div.innerHTML = "Total score: " + totalScore;
    }
    
}
document.querySelector(".accept_gameover").addEventListener("click", function () {
    let content = document.querySelector(".content");
    let gameOver_screen = document.querySelector(".gameoverScreen");
    content.style.display = "flex";
    gameOver_screen.style.display = "none";
    newGame();
});
function deleteSavedGameState() {
    localStorage.removeItem('gameState');
}
//Variables and constants
  const elements = [
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false        
    },
    {
        time: 1,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,1],
                [0,0,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'town',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'farm',
        shape: [[1,1,1],
                [0,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,0],
                [1,0,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'town',
        shape: [[1,1,1],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'farm',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 1,
        type: 'farm',
        shape: [[0,1,0],
                [1,1,1],
                [0,1,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,1],
                [1,0,0],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,0,0],
                [1,1,1],
                [1,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,1]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'forest',
        shape: [[1,1,0],
                [0,1,1],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
    {
        time: 2,
        type: 'water',
        shape: [[1,1,0],
                [1,1,0],
                [0,0,0]],
        rotation: 0,
        mirrored: false  
    },
]
const mission_obj = [
    { path: edge_of_the_forst_path, function: edge_of_the_forest },
    { path: sleepy_valley_path, function: sleepy_valley },
    { path: watering_potatoes_path, function: watering_potatoes },
    { path: borderlands_path, function: borderlands },
    { path: tree_line_path, function: tree_line },
    { path: wealthy_town_path, function: wealthy_town },
    { path: row_of_houses_path, function: row_of_houses },
    { path: odd_numbered_silos_path, function: odd_numbered_silos },
    { path: watering_canal_path, function: watering_canal },
    { path: magician_valley_path, function: magician_valley },
    { path: empty_site_path, function: empty_site },
    { path: rich_countryside_path, function: rich_countryside }
];
function selectRandomMission(){
    const shuffledArray = [...mission_obj].sort(() => Math.random() - 0.5);
    selectedMissions = shuffledArray.slice(0, 4);
}
    let selectedMissions = [];
    let usedElements = [];
    let currentSeason = 'spring';
    let newSeason = '';
    let currentElement = null;
    let totalTime = 28;
    let score = 0;
    let spring_points = 0;
    let summer_points = 0;
    let autumn_points = 0;
    let winter_points = 0;
    let borderlands_score = 0;
    let mission1Score = 0;
    let mission2Score = 0;
    let mission3Score = 0;
    let mission4Score = 0;

function mapPathsToFunctions(selectedMissions, missionObjList) {
        return selectedMissions.map(selectedMission => {
            const correspondingMission = missionObjList.find(mission => mission.path === selectedMission.path);
            if (correspondingMission) {
                return {
                    path: selectedMission.path,
                    function: correspondingMission.function
                };
            }
            return null;
        }).filter(Boolean);
    }
function saveGame() {
    const gameState = {
        selectedMissions,
        usedElements,
        currentSeason,
        newSeason,
        currentElement,
        totalTime,
        score,
        mission1Score,
        mission2Score,
        mission3Score,
        mission4Score,
        spring_points: spring_points,
        summer_points: summer_points,
        autumn_points: autumn_points,
        winter_points: winter_points,
        borderlands_score: borderlands_score,
        tableState: getTableState()
        };
    
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
function loadGame() {
    let count = 0;
    let tileList = [
        default_tile,
        forest_tile,
        mountain_tile,
        plains_tile,
        village_tile,
        water_tile
    ];
    const savedGameState = localStorage.getItem('gameState');
    if(savedGameState){
        const gameState = JSON.parse(savedGameState);
        for (let row = 0; row < gameState.tableState.length; row++) {
            for (let col = 0; col < gameState.tableState[row].length; col++) {
                if (!tileList.includes(gameState.tableState[row][col])) {
                    count++;
                }
            }
        }
    }
    
    if (savedGameState && count === 0) {
        const gameState = JSON.parse(savedGameState);
        selectedMissions = gameState.selectedMissions;
        usedElements = gameState.usedElements;
        currentSeason = gameState.currentSeason;
        newSeason = gameState.newSeason;
        currentElement = gameState.currentElement;
        totalTime = gameState.totalTime;
        score = gameState.score;
        mission1Score = gameState.mission1Score;
        mission2Score = gameState.mission2Score;
        mission3Score = gameState.mission3Score;
        mission4Score = gameState.mission4Score;
        spring_points = gameState.spring_points;
        summer_points = gameState.summer_points;
        autumn_points = gameState.autumn_points;
        winter_points = gameState.winter_points;
        borderlands_score = gameState.borderlands_score;
        selectedMissions = mapPathsToFunctions(selectedMissions, mission_obj);
        setTableState(gameState.tableState);
        update_missions_image();
        setAllElemDefualt();
        updateShape();
        updateTimer();
        updateScore();
        update_missions_image();
    
        alert('Game loaded successfully!');
    } else {
        alert('No saved game found.');
    }
}
function getTableState() {
    const tableState = [];
    const boardTable = document.getElementById("board").getElementsByTagName("table")[0];

    for (let i = 0; i < rows; i++) {
        const rowState = [];
        for (let j = 0; j < cols; j++) {
            const cellImg = boardTable.rows[i].cells[j].querySelector("img").src;
            rowState.push(cellImg);
        }
        tableState.push(rowState);
    }

    return tableState;
}
function setTableState(tableState) {
    
    const boardTable = document.getElementById("board").getElementsByTagName("table")[0];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cellImg = tableState[i][j];
            boardTable.rows[i].cells[j].querySelector("img").src = cellImg;
        }
    }
}
//Missions

function update_missions_image() {
    const images = document.querySelectorAll('.grid-item .grid-image');
    for (let i = 0; i < selectedMissions.length; i++) {
        images[i].src = selectedMissions[i].path;
    }
}


//Basic Missions
function edge_of_the_forest() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let forestCount = 0;
    for (let i = 0; i < cols; i++) {
        if (boardTable.rows[0].cells[i].querySelector("img").src === forest_tile) {
            forestCount++;
        }
        if (boardTable.rows[rows - 1].cells[i].querySelector("img").src === forest_tile) {
            forestCount++;
        }
    }
    for (let i = 0; i < rows; i++) {
        if (boardTable.rows[i].cells[0].querySelector("img").src === forest_tile) {
            forestCount++;
        }
        if (boardTable.rows[i].cells[cols - 1].querySelector("img").src === forest_tile) {
            forestCount++;
        }
    }
    return forestCount;
}
function sleepy_valley() {
    let tempscore = 0;
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    for (let i = 0; i < rows; i++) {
        let forestCount = 0;

        for (let j = 0; j < cols; j++) {
            if (boardTable.rows[i].cells[j].querySelector("img").src === forest_tile) {
                forestCount += 1;
            }
        }
        if(forestCount >= 3){
            tempscore += 4;
        }
    }
    return tempscore;
}
function watering_potatoes() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let wateringPotatoesPoints = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cellImg = boardTable.rows[i].cells[j].querySelector("img");
            if (cellImg.src === plains_tile) {
                let adjacentWaterCount = watering_potatoes_helper(i, j);
                wateringPotatoesPoints += adjacentWaterCount * 2;
            }
        }
    }
    return wateringPotatoesPoints;
}
function watering_potatoes_helper(row, col) {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let count = 0;
    const isValidIndex = (i, j) => i >= 0 && i < rows && j >= 0 && j < cols;
    if (isValidIndex(row - 1, col) && boardTable.rows[row - 1].cells[col].querySelector("img").src === water_tile) {
        count++;
    }
    if (isValidIndex(row + 1, col) && boardTable.rows[row + 1].cells[col].querySelector("img").src === water_tile) {
        count++;
    }
    if (isValidIndex(row, col - 1) && boardTable.rows[row].cells[col - 1].querySelector("img").src === water_tile) {
        count++;
    }
    if (isValidIndex(row, col + 1) && boardTable.rows[row].cells[col + 1].querySelector("img").src === water_tile) {
        count++;
    }
    return count;
}


function borderlands() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let points = 0;
    for (let i = 0; i < rows; i++) {
        let isFullRow = true;
        for (let j = 0; j < cols; j++) {
            let cellImg = boardTable.rows[i].cells[j].querySelector("img");
            if (cellImg.src === default_tile) {
                isFullRow = false;
                break;
            }
        }
        if (isFullRow) {
            points += 6;
        }
    }
    for (let j = 0; j < cols; j++) {
        let isFullColumn = true;
        for (let i = 0; i < rows; i++) {
            let cellImg = boardTable.rows[i].cells[j].querySelector("img");
            if (cellImg.src === default_tile) {
                isFullColumn = false;
                break;
            }
        }
        if (isFullColumn) {
            points += 6;
        }
    }
    return points;
}
//Extra missions (for extra points)

function tree_line() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let points = 0;
    let longestTreeLineLength = 0;
    for (let j = 0; j < cols; j++) {
        let currentTreeLineLength = 0;

        for (let i = 0; i < rows; i++) {
            let cellImg = boardTable.rows[i].cells[j].querySelector("img");
            if (cellImg.src === forest_tile) {
                currentTreeLineLength++;
            } else {
                if (currentTreeLineLength > longestTreeLineLength) {
                    longestTreeLineLength = currentTreeLineLength;
                }
                currentTreeLineLength = 0;
            }
        }
        if (currentTreeLineLength > longestTreeLineLength) {
            longestTreeLineLength = currentTreeLineLength;
        }
    }
    points += 2 * longestTreeLineLength;

    return points;
}


function wealthy_town() {
    let tempScore = 0;
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let currentCell = boardTable.rows[i].cells[j];
            let imgSrc = currentCell.querySelector("img").src;
            if (imgSrc === village_tile) {
                tempScore += wealthy_town_helper(i,j);
            }
        }
    }
    return tempScore;
}
function wealthy_town_helper(row, col) {
    returnScore = 0;
    let adjacentTerrains = new Set();
    adjacentTerrains.clear();
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    const isValidIndex = (i, j) => i >= 0 && i < rows && j >= 0 && j < cols;
    if (isValidIndex(row - 1, col) && boardTable.rows[row - 1].cells[col].querySelector("img").src !== default_tile && boardTable.rows[row - 1].cells[col].querySelector("img").src !== village_tile) {
        adjacentTerrains.add(boardTable.rows[row - 1].cells[col].querySelector("img").src)
    }
    if (isValidIndex(row + 1, col) && boardTable.rows[row + 1].cells[col].querySelector("img").src !== default_tile && boardTable.rows[row + 1].cells[col].querySelector("img").src !== village_tile) {
        adjacentTerrains.add(boardTable.rows[row + 1].cells[col].querySelector("img").src)
    }
    if (isValidIndex(row, col - 1) && boardTable.rows[row].cells[col - 1].querySelector("img").src !== default_tile && boardTable.rows[row].cells[col - 1].querySelector("img").src !== village_tile) {
        adjacentTerrains.add(boardTable.rows[row].cells[col - 1].querySelector("img").src)
    }
    if (isValidIndex(row, col + 1) && boardTable.rows[row].cells[col + 1].querySelector("img").src !== default_tile && boardTable.rows[row].cells[col + 1].querySelector("img").src !== village_tile) {
        adjacentTerrains.add(boardTable.rows[row].cells[col + 1].querySelector("img").src)
    }
    if(adjacentTerrains.size >= 3){
        returnScore = 3;
    }
    return returnScore;
}


function watering_canal() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let points = 0;
    for (let j = 0; j < cols; j++) {
        let farmCount = 0;
        let waterCount = 0;
        for (let i = 0; i < rows; i++) {
            let currentCell = boardTable.rows[i].cells[j];
            let imgSrc = currentCell.querySelector("img").src;
            if (imgSrc === plains_tile) {
                farmCount++;
            } else if (imgSrc === water_tile) {
                waterCount++;
            }
        }
        if (farmCount > 0 && waterCount > 0 && farmCount === waterCount) {
            points += 4;
        }
    }

    return points;
}


function magician_valley() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let points = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let currentCell = boardTable.rows[i].cells[j];
            let imgSrc = currentCell.querySelector("img").src;
            if (imgSrc === water_tile) {
                if(magician_valley_helper(i,j)){
                    points += 3;
                }
            }
        }
    }
    return points;
}
function magician_valley_helper(row, col) {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    const isValidIndex = (i, j) => i >= 0 && i < rows && j >= 0 && j < cols;
    if (isValidIndex(row - 1, col) && boardTable.rows[row - 1].cells[col].querySelector("img").src === mountain_tile) {
        return true;
    }
    if (isValidIndex(row + 1, col) && boardTable.rows[row + 1].cells[col].querySelector("img").src === mountain_tile) {
        return true;
    }
    if (isValidIndex(row, col - 1) && boardTable.rows[row].cells[col - 1].querySelector("img").src === mountain_tile) {
        return true;
    }
    if (isValidIndex(row, col + 1) && boardTable.rows[row].cells[col + 1].querySelector("img").src === mountain_tile) {
        return true;
    }else{
        return false;
    }
}

function empty_site() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let visitedCells = new Set();

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let currentCell = boardTable.rows[i].cells[j];
            let imgSrc = currentCell.querySelector("img").src;

            if (imgSrc === village_tile && !visitedCells.has(`${i}-${j}`)) {
                empty_site_helper(i, j, visitedCells);
            }
        }
    }

    return visitedCells.size * 2;
}

function empty_site_helper(row, col, visitedCells) {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    const isValidIndex = (i, j) => i >= 0 && i < rows && j >= 0 && j < cols;

    const visitCell = (i, j) => {
        visitedCells.add(`${i}-${j}`);
    };

    if (isValidIndex(row - 1, col) && boardTable.rows[row - 1].cells[col].querySelector("img").src === default_tile) {
        visitCell(row - 1, col);
    }
    if (isValidIndex(row + 1, col) && boardTable.rows[row + 1].cells[col].querySelector("img").src === default_tile) {
        visitCell(row + 1, col);
    }
    if (isValidIndex(row, col - 1) && boardTable.rows[row].cells[col - 1].querySelector("img").src === default_tile) {
        visitCell(row, col - 1);
    }
    if (isValidIndex(row, col + 1) && boardTable.rows[row].cells[col + 1].querySelector("img").src === default_tile) {
        visitCell(row, col + 1);
    }
}


function row_of_houses() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let points = 0;

    for (let i = 0; i < rows; i++) {
        let currentHouseLine = 0;
        let longestHouseLine = 0;

        for (let j = 0; j < cols; j++) {
            let cellImg = boardTable.rows[i].cells[j].querySelector("img");

            if (cellImg.src.includes(village_tile)) {
                currentHouseLine++;
            } else {
                if (currentHouseLine > longestHouseLine) {
                    longestHouseLine = currentHouseLine;
                }
                currentHouseLine = 0;
            }
        }

        if (currentHouseLine > longestHouseLine) {
            longestHouseLine = currentHouseLine;
        }
        if(longestHouseLine > 1){
            points += longestHouseLine * 2;
        }
        
    }

    return points;
}

function odd_numbered_silos() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let points = 0;

    for (let j = 0; j < cols; j += 2) {    
            let isFullColumn = true;
            for (let i = 0; i < rows; i++) {
                let cellImg = boardTable.rows[i].cells[j].querySelector("img");

                if (cellImg.src === default_tile) {
                    isFullColumn = false;
                    break;
                }
            }
            if (isFullColumn) {
                points += 10;
            }
    }

    return points;
}

function rich_countryside() {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let points = 0;
    for (let i = 0; i < rows; i++) {
        let terrainTypes = new Set();
        terrainTypes.clear();
        for (let j = 0; j < cols; j++) {
            let imgSrc = boardTable.rows[i].cells[j].querySelector("img").src;
            if (imgSrc !== default_tile) {
                terrainTypes.add(imgSrc);
            }
        }
        if (terrainTypes.size >= 5) {
            points += 4;
        }
    }
    return points;
}

function encirlce_mountain(){
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let points = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let currentCell = boardTable.rows[i].cells[j];
            let imgSrc = currentCell.querySelector("img").src;
            if (imgSrc === mountain_tile) {
                if(encirlce_mountain_helper(i,j)){
                    points += 1;
                }
            }
        }
    }
    return points;
}
function encirlce_mountain_helper(row, col) {
    let boardTable = document.getElementById("board").getElementsByTagName("table")[0];
    let cnt = 0;
    const isValidIndex = (i, j) => i >= 0 && i < rows && j >= 0 && j < cols;
    for(let i = row - 1; i < row + 1; i++ ){
        for(let j = col - 1; j < col + 1; j++){
            if(isValidIndex(i,j)){
                let currentCell = boardTable.rows[i].cells[j];
                let imgSrc = currentCell.querySelector("img").src;
                if (imgSrc === default_tile) {
                    cnt++;
                }
            }
            
        }
    }
    if(cnt === 0){
        return true;
    }else {
        return false;
    }
}
  



