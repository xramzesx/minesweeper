const body = document.querySelector('body')
      body.setAttribute('oncontextmenu','event.preventDefault()')
const container = document.createElement('div')
      container.id = 'container'

const form = document.createElement('div')
      form.id = 'form'

const infoDiv = document.createElement('div')
      infoDiv.id = 'infoDiv'

const recordDiv = document.createElement('div')
      recordDiv.id = 'recordDiv'

let board = {
    height: 0,
    width: 0,
    mines: 0,
    time: 0,
    nick: '',
    start: false,
    remainedMines: 0,

    remainedFields: function(){
        let tmpRemainedFields = 0;
        for (let i = 0; i < this.height; i++)
            for (let j = 0; j < this.width; j++){
                let field = document.getElementById(`x${i}y${j}`)
                if (field.classList.contains('field'))
                    tmpRemainedFields++
            }
        return tmpRemainedFields
    },
    
    zeroFieldArr    : [],
    questionArr     : [],
    flagsArr        : [],
    arr             : []
}

function checkValuesFromInput(input, interval, condition){

    input.addEventListener('focus', function () {
        clearInterval(interval)
        interval = setInterval(function () {
            if (condition)
                input.value = ''
            console.log(input)
        }, 1500)
    })

}

const setBoardHeight = document.createElement('label')
      setBoardHeight.innerHTML = 'Height: '
const inputBoardHeight = document.createElement('input')
      inputBoardHeight.id = 'boardHeight'

let checkHeightInp 

inputBoardHeight.addEventListener('focus', function() {
    clearInterval(checkHeightInp)
    checkHeightInp = setInterval( () => {
        if (isNaN(inputBoardHeight.value))
            inputBoardHeight.value = ''
    }, 1500)
    
})

const setBoardWidth = document.createElement('label')
      setBoardWidth.innerHTML = 'Width: '
const inputBoardWidth = document.createElement('input')
      inputBoardWidth.id = 'boardWidth'

let checkWidthInp 

inputBoardWidth.addEventListener('focus', function() {
    clearInterval(checkWidthInp)
    checkWidthInp = setInterval( () => {
        if (isNaN(inputBoardWidth.value))
            inputBoardWidth.value = ''
    }, 1500);
})

const setMinesCount = document.createElement('label')
      setMinesCount.innerHTML = 'Miny: '
const inputMinesCount = document.createElement('input')
      inputMinesCount.id = 'minesCount'

let checkMinesInp

inputMinesCount.addEventListener('focus', function() {
    clearInterval(checkMinesInp)
    checkMinesInp = setInterval( () => {
        if (isNaN(inputMinesCount.value) || parseInt(inputBoardHeight.value) * parseInt(inputBoardWidth.value) - 1 < parseInt(inputMinesCount.value))
            inputMinesCount.value = ''
    }, 1500);
})

function checkInputValue() {
    if (isNaN(inputBoardHeight.value))
        inputBoardHeight.value = ''
    if (isNaN(inputBoardWidth.value))
        inputBoardWidth.value = ''
    if (isNaN(inputMinesCount.value) || parseInt(inputBoardHeight.value) * parseInt(inputBoardWidth.value) - 1 < parseInt(inputMinesCount.value))
        inputMinesCount.value = ''
    // console.log(parseInt(inputBoardHeight.value) * parseInt(inputBoardWidth.value) - 1)
}

const timeBanner = document.createElement('div')

const boardDiv = document.createElement('div')
      boardDiv.id = 'board'

let timeInterval

function getRandom(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function isAllSet(){
    checkInputValue()
    let allSet = true
    let inpHeight = inputBoardHeight.value,
        inpWidth  = inputBoardWidth.value,
        inpMines  = inputMinesCount.value

    if (inpWidth == '' || isNaN(inpWidth))
        allSet = false
    if (inpHeight == '' || isNaN(inpHeight))
        allSet = false
    if (inpMines == '' || isNaN(inpMines))
        allSet = false

    return allSet

}

function isInBoardArr(i,j){
    if (i >= board.height || i < 0)
        return false
    if (j >= board.width || j < 0)
        return false
    
    return true
}

function countBombsAround(i, j){
    let bombsCounter = 0

    //dla każdego z 8 pól naokoło 

    if (isInBoardArr(i, j) && board.arr[i][j] != 1){
        if (isInBoardArr(i + 1, j))
            if (board.arr[i + 1][j] == 1)
                bombsCounter++
        if (isInBoardArr(i + 1, j + 1))
            if (board.arr[i + 1][j + 1] == 1)
                bombsCounter++
        if (isInBoardArr(i, j + 1))
            if (board.arr[i][j + 1] == 1)
                bombsCounter++
        if (isInBoardArr(i - 1, j + 1))
            if (board.arr[i - 1][j + 1] == 1)
                bombsCounter++
        if (isInBoardArr(i - 1, j))
            if (board.arr[i - 1][j] == 1)
                bombsCounter++
        if (isInBoardArr(i - 1, j - 1))
            if (board.arr[i - 1][j - 1] == 1)
                bombsCounter++
        if (isInBoardArr(i, j - 1))
            if (board.arr[i][j - 1] == 1)
                bombsCounter++
        if (isInBoardArr(i + 1, j - 1))
            if (board.arr[i + 1][j - 1] == 1)
                bombsCounter++
    }else{
        return -1
    }

    return bombsCounter
}

function makeTimeValue(time){
    let date = new Date(60 * 60 * 1000 * 23)
        // date.setTime(60 * 60 * 1000 * 23)
        date.setSeconds(time)
    return date.toLocaleTimeString()
    // return date.getHours() > 0 ? `$minutes` : ;//strTime.reverse().join(':')
    
    // let seconds = time % 60,
    //     minutes = time - seconds,
    //     hours = time - (minutes + seconds) % 3600
    
    // let strTime = [
    //     seconds > 9 ? seconds : `0${seconds}`,
    //     minutes /60 > 9 ? minutes/60 : `0${minutes /60}`
    // ]
    // // console.log(">>>godzinka: " + hours)
    // if (hours > 0){
    //     console.log(strTime, "XS")
    //     strTime.push( hours/60*60 > 9 ? hours/60*60 : `0${hours/60*60}`)
    // }
}

function displayRecords(sortedCookies){
    for (let j in sortedCookies){
        const record = document.createElement('div')
        const recordValue = document.createElement('div')
        const nickSpan = document.createElement('span')
        const timeSpan = document.createElement('span')

        const recordBar = document.createElement('div')

        recordBar.innerHTML = `Miejsce ${+j+1}.`
        nickSpan.innerHTML = sortedCookies[j].nick
        timeSpan.innerHTML = makeTimeValue(sortedCookies[j].time) 
        
        record.setAttribute('place',+j+1)

        record.className = 'record'
        recordBar.className = 'recordBar'
        recordValue.className = 'recordValue'
        nickSpan.className = 'nick'
        timeSpan.className = 'time'


        record.appendChild(recordBar)
        record.appendChild(recordValue)
        recordValue.appendChild(nickSpan)
        // recordValue.innerHTML += ' - '
        recordValue.appendChild(timeSpan)

        console.log(sortedCookies[j].time + "~~" + sortedCookies[j].nick)
        
        recordDiv.appendChild(record)
        if (j == 9) break   //do wyswietlania tylko Top 10
    }
}

function generateRecordsDiv(){
    recordDiv.innerHTML = ''
    recordDiv.classList.add('recordDiv')
    recordDiv.classList.remove('Top10Records')
    
    let cookieName = `h${board.height}w${board.width}b${board.mines}`
    // console.log(cookieName)
    let cookieList = document.cookie.split('; ')

    console.log(cookieList)
    let isAnyRecordInstead = false
    for (let i in cookieList){
        if (cookieList[i].indexOf(cookieName) != -1){
            const modeDiv = document.createElement('div')
                  modeDiv.innerHTML = cookieName.replace('h','').replace('w','x').replace('b',' bomb: ')
                  modeDiv.className = 'mode'
            recordDiv.appendChild(modeDiv)      
            let actualCookie = cookieList[i].split('|')
                actualCookie[0] = actualCookie[0].split('=').pop()
            // console.log(actualCookie)

            let sortedCookies = []

            for (let j in actualCookie){
                let strTmpCookie = actualCookie[j].split('-')
                let tmpCookie = { time:'', nick:'' }

                if (strTmpCookie.length == 2){
                    tmpCookie.time = strTmpCookie[1]
                    tmpCookie.nick = strTmpCookie[0]
                }else{
                    tmpCookie.time = strTmpCookie[strTmpCookie.length - 1]
                    tmpCookie.nick = strTmpCookie[0]
                    for (let l = 1; l < strTmpCookie.length - 2; l++)
                        tmpCookie.nick += `-${strTmpCookie[l]}`
                }
                console.log(strTmpCookie)

                sortedCookies.push(tmpCookie)
            }

            sortedCookies.sort( (a,b)=>{
                return a.time - b.time
            })

            displayRecords(sortedCookies)

            isAnyRecordInstead = !isAnyRecordInstead
            break;
        }
    }

    if (!isAnyRecordInstead)
        if (cookieName == 'h0w0b0'){
            console.log('hwb')
            recordDiv.classList.add('Top10Records')
            recordDiv.classList.remove('recordDiv')
            let sortedCookies = []
    
            for (let i in cookieList){
                // if (cookieList[i][0] != 'h')
                //     continue                
                let actualCookie = cookieList[i].split('|')
                if ( actualCookie[0][0] != 'h'){
                    console.log(actualCookie[0])
                    continue    
                }
                let cookieName = actualCookie[0].split('=')[0]
                actualCookie[0] = actualCookie[0].split('=').pop()

                for (let j in actualCookie){
                    let cookieNameSpan = document.createElement('span')
                        cookieNameSpan.className = 'mode'

                    let strTmpCookie = actualCookie[j].split('-')
                    let tmpCookie = { time:'', nick: '' }

                    let tmpNick = ''
                    if (strTmpCookie.length == 2){
                        tmpCookie.time = strTmpCookie[1]
                        tmpNick += strTmpCookie[0]
                    }else{
                        tmpCookie.time = strTmpCookie[strTmpCookie.length - 1]
                        tmpNick += strTmpCookie[0]
                        for (let l = 1; l < strTmpCookie.length - 2; l++)
                            tmpNick += `-${strTmpCookie[l]}`
                    }
                    console.log(strTmpCookie)
                    cookieNameSpan.innerHTML = `${cookieName.replace('h','').replace('w','x').replace('b','<br>bomb:')}`
                    tmpCookie.nick = cookieNameSpan.outerHTML +' '+tmpNick                    
                    sortedCookies.push(tmpCookie)
                }

            }
    
            sortedCookies.sort( (a,b)=>{
                return a.time - b.time
            })
            
            displayRecords(sortedCookies)
            console.log(sortedCookies)
        } else
            recordDiv.innerHTML = 'Aktualnie brak rekordów do wypisania'
    
}
generateRecordsDiv()
function selectField(i, j){
    const field = document.getElementById(`x${i}y${j}`)
    
    if (!field.classList.contains('flag')){
        field.innerHTML = getBombsAroundCount(i,j)
        
        // console.log(field)
        
        field.classList.remove('query')
        field.classList.remove('field')
        
        field.classList.add('selected')
    }
}

function flagField(i,j){
    if (board.remainedMines > 0){
        // const field = document.getElementById(`x${i}y${j}`)
        board.flagsArr[i][j] = 1
        return true
    }else{
        return false;
    }
}

function isInArr(arr, element){
    for (let i in arr)
        if (arr[i] == element)
            return true
    return false
}

function isActualySelected(i,j){
    const field = document.getElementById(`x${i}y${j}`)
    return field.getAttribute('class') == 'selected'
}

function isInBothArrs(i, j){
    const field = document.getElementById(`x${i}y${j}`)
    return !isInArr(board.zeroFieldArr, field) && isInBoardArr(i, j)
}

function isZeroInstead(i, j){
    return isInBoardArr(i,j) && countBombsAround(i,j) == 0
}

function checkValueAround(i, j){

    const field = document.getElementById(`x${i}y${j}`)

    if (isInBothArrs(i, j)){
        board.zeroFieldArr.push(field)

        for (let index = 0; index < 8; index ++ ){
            let x, y
            switch (index){
                case 0:
                    x = i - 1
                    y = j
                    break
                case 1:
                    x = i
                    y = j - 1
                    break
                case 2:
                    x = i + 1
                    y = j
                    break
                case 3:
                    x = i
                    y = j + 1
                    break
                case 4:
                    x = i - 1
                    y = j - 1
                    break
                case 5:
                    x = i + 1
                    y = j - 1
                    break
                case 6:
                    x = i - 1
                    y = j + 1
                    break
                case 7:
                    x = i + 1
                    y = j + 1
                    break;    
            }
            if (isZeroInstead(x, y)){
                if (!isActualySelected(x, y ))
                    selectField(x, y)
                checkValueAround(x, y)
            }else if (isInBothArrs(x,y) && countBombsAround(x,y) != 0)
                selectField(x,y)
        }
    }
}

function getBombsAroundCount(i, j){
    
    let bombsCounter = countBombsAround(i, j)
    
    let spanBombsCounter = document.createElement('span')
        spanBombsCounter.innerHTML = bombsCounter

    switch(bombsCounter){
        case 0:
            spanBombsCounter.style.fontSize = '7.5px'
            break
        case 1:
            spanBombsCounter.style.color = 'blue'
            break
        case 2:
            spanBombsCounter.style.color = 'green'
            break
        case 3:
            spanBombsCounter.style.color = 'red'
            break
        case 4:
            spanBombsCounter.style.color = 'orange'
            break
        case 5:
            spanBombsCounter.style.color = '#800020'
            break
        case 6:
            spanBombsCounter.style.color = '#500010'
            break
        case 7:
            spanBombsCounter.style.color = '#200000'
            break
        case 8:
            spanBombsCounter.style.color = 'black'
            break
        default:
            console.log("Wystąpił błąd\nJAK TO ZROBIŁEŚ!???")
            break
    }

    return spanBombsCounter.outerHTML
}

function isEqualFlags(){
    for (let i = 0; i < board.height ; i++)
        for (let j = 0; j < board.width; j++)
            if (board.arr[i][j] != board.flagsArr[i][j])
                return false
    return true
}

function gameOver_win(timeInterval){
    clearInterval(timeInterval)

    // let isEqualFlags = true

    // for (let i = 0; i < board.height ; i++)
    //     for (let j = 0; j < board.width; j++)
    //         if (board.arr[i][j] != board.flagsArr[i][j])
    //             isEqualFlags = false
    
    console.log("U WIN!")
    for (let i = 0; i < board.arr.length; i++)
        for (let j in board.arr[i])
            if (board.arr[i][j] == 1){
                const field = document.getElementById(`x${i}y${j}`)
                field.classList.add('pbomb')
            }

    if (isEqualFlags()){      //isEqualFlags
        board.start = false
        infoDiv.innerHTML = `Gratulacje! Wygrałeś w sapera`
        
        const nickDiv = document.createElement('div')
        const inpNick = document.createElement('input')
        const submitNick = document.createElement('button')
        
        inpNick.setAttribute('type', 'text')
        inpNick.setAttribute('id', 'nick')
        inpNick.setAttribute('placeholder', 'zwariowanaaga123')
        
        submitNick.innerText = 'Zapisz'

        infoDiv.appendChild(nickDiv)
        nickDiv.innerHTML = `Podaj swój nick:<br>`
        nickDiv.appendChild(inpNick)
        nickDiv.appendChild(document.createElement('br'))
        nickDiv.appendChild(submitNick)

        submitNick.addEventListener('click', function(){
            board.nick = inpNick.value
            
            if (board.nick == ''){
                window.alert('Podaj swój nick!')
            }else{
                let cookieName = `h${board.height}w${board.width}b${board.mines}`
                let cookieValue = `${board.nick}-${board.time}`

                let timeNow = new Date()
                    timeNow.setTime(timeNow.getTime() + 1000 * 60 * 60 * 24 * 365)

                let defaultExpires = `expires=${timeNow.toUTCString()};` 

                if (document.cookie.indexOf(`${cookieName}=`) < 0)
                {
                    console.log('njeIstnieje');
                    document.cookie = `${cookieName}=${cookieValue};${defaultExpires}`
                }
                else
                {
                    console.log(document.cookie)
                    
                    let actualCookie = document.cookie.split(';')
                    
                    console.log(actualCookie)
                    
                    for (let i in actualCookie){
                        if (actualCookie[i].indexOf(cookieName) != -1){
                            let tmpCookie = `${actualCookie[i]}|${cookieValue}`

                            actualCookie[i] = tmpCookie;

                            document.cookie = `${actualCookie[i]};${defaultExpires}`
                        }
                    }
                }
                generateRecordsDiv()
                nickDiv.remove()
            }
        })
    }else{
        //aktualnie ten warunek już nie jest wykonywalny, aczkolwiek zostawiam go na wszelki wypadek :v
        gameOver_lose()
        infoDiv.innerHTML = `No nie oflagowałeś :v`
    }

}

function gameOver_lose(timeInterval){
    clearInterval(timeInterval)
    for (let i = 0; i < board.arr.length; i++)
        for (let j in board.arr[i])
            if (board.arr[i][j] == 1){
                const field = document.getElementById(`x${i}y${j}`)
                setTimeout(function () {
                    field.classList.add('bomb')
                },1000)
            }
    
    infoDiv.style.color = 'red'
    infoDiv.innerHTML = `No nie tym razem :v`
    board.start = false
}

const remainedBombs = document.createElement('div')
      remainedBombs.id = 'remainedBombs'

const generateBtn = document.createElement("button")
      generateBtn.innerText = 'Generuj'
      generateBtn.addEventListener('click', function(){
        if (isAllSet()){
            board.time = 0;
            board.nick = '';

            timeBanner.innerHTML = `Grasz: ${board.time}[s]`
            boardDiv.innerHTML = ''
            infoDiv.innerHTML = ''
            infoDiv.style = ''

            clearInterval(timeInterval)
            
            board.height = parseInt(inputBoardHeight.value)
            board.width = parseInt(inputBoardWidth.value)
            board.mines = parseInt(inputMinesCount.value)
            // board.remainedFields = board.height * board.width
            board.remainedMines = board.mines
            board.start = true

            remainedBombs.innerHTML = `Pozostałe miny: ${board.remainedMines}`

            generateRecordsDiv()

            let columns = ''
            
            for (let i = 0; i < board.width; i++ )
                columns += '32px '

            boardDiv.style.gridTemplateColumns = columns

            board.arr =         []
            board.flagsArr =    []

            for (let i = 0; i < board.height; i++){
                let tmpArr = [],
                    tmpFlagArr = []
                for (let j = 0; j < board.width; j++){
                    tmpArr.push(0)
                    tmpFlagArr.push(0)
                }
                board.arr.push(tmpArr)
                board.flagsArr.push(tmpFlagArr)
            }

            // console.table(board.flagsArr)

            function generateRandomBombs(x,y){
                let restOfMines = board.mines

                while (restOfMines > 0){
                    let i = getRandom(0, board.height),
                        j = getRandom(0, board.width)
                    
                    while (board.arr[i][j] != 0 || x == i && y == j){
                        i = getRandom(0, board.height)
                        j = getRandom(0, board.width)
                    }

                    board.arr[i][j] = 1
                    
                    restOfMines--
                }
            }

            let firstClick = true

            for (let i = 0; i < board.height; i++)
                for (let j = 0; j < board.width; j++){
                    let field = document.createElement('div')

                    field.classList.add('field') 
                    field.setAttribute('x', i)      // aktualnie te atrybuty służą głównie poglądowo
                    field.setAttribute('y', j)
                    field.id = `x${i}y${j}`
                    field
                        .addEventListener("click", function () {
                            if (!this.classList.contains('flag'))
                            if (board.start){
                                if (firstClick){
                                    generateRandomBombs(i,j)
                                    firstClick = false
                                    console.table(board.arr)
                                }
                                
                                // console.log(i,j)
                                // console.log(countBombsAround(i, j))
                                field.classList.remove('field')
                                if (board.arr[i][j] == 1){

                                    remainedBombs.innerHTML = `Pozostałe miny: ${--board.remainedMines}`
                                    field.classList.remove('query')
                                    field.classList.add('pbomb')
                                    gameOver_lose(timeInterval)
                                    field.removeEventListener('click', this)

                                }else{
                                    field.classList.remove('query')
                                    field.classList.add('selected')
                                    field.innerHTML = getBombsAroundCount(i,j)
                                    if (countBombsAround(i,j) == 0)
                                        checkValueAround(i, j)
                                    if (board.remainedFields() == board.mines && board.remainedMines == 0)
                                        gameOver_win(timeInterval)
                                }
                            }
                        })
                    
                    let rightClickCounter = 1;
                    let addMine = true

                    field
                        .addEventListener("contextmenu", function () {
                            if (board.start){
                                if (!isActualySelected(i,j)){

                                    function setQuerry(field){
                                        field.classList.remove(`flag`)
                                        field.classList.add('query')
                                            
                                        board.flagsArr[i][j] = 0
                                        rightClickCounter = 0
                                        if (addMine){
                                            ++board.remainedMines
                                        }
                                        remainedBombs.innerHTML = `Pozostałe miny: ${board.remainedMines}`
                                    }

                                    switch(rightClickCounter){
                                        case 0:
                                            // default
                                            this.className = `field`

                                            board.flagsArr[i][j] = 0

                                            if (board.remainedMines <= 0){
                                                addMine = false
                                                rightClickCounter = 2
                                            }
                                            else
                                                rightClickCounter++
                                            break;
                                        case 1:
                                            // flag
                                            if (flagField(i,j)){
                                                this.classList.remove(`query`)
                                                this.classList.add(`flag`)
                                                remainedBombs.innerHTML = `Pozostałe miny: ${--board.remainedMines}`
                                                addMine = true;
                                                if (board.remainedFields() == board.mines && board.remainedMines == 0 || isEqualFlags())
                                                    gameOver_win(timeInterval)
                                                rightClickCounter++
                                            }else{
                                                addMine = false
                                                setQuerry(this)
                                            }
                                            break;
                                        case 2:
                                            // question mark
                                            setQuerry(this)
                                            break;
                                    }
                                }
                                // console.log(this)
                                console.log(rightClickCounter)
                            }
                        })
                    boardDiv
                        .appendChild(field)
                }

            timeInterval = setInterval(function () {
                board.time++
                timeBanner.innerHTML = `Grasz: ${board.time}[s]`
                // console.log(time)
                // console.log(isAllSet())
            }, 1000)

        }else{
            clearInterval(timeInterval)
            timeBanner.innerHTML = `Podaj wszystkie wartości`
            window.alert("Nie podałeś wszystkich wartości")
        }
      })

//creating main html body
body
    .appendChild(container)
container
    .appendChild(form)
    // .appendChild(generateBtn)
form
    .appendChild(setBoardHeight)
        .appendChild(inputBoardHeight)
form
    .appendChild(setBoardWidth)
        .appendChild(inputBoardWidth)
form
    .appendChild(setMinesCount)
        .appendChild(inputMinesCount)
form
    .appendChild(generateBtn)
form
    .appendChild(remainedBombs)
form 
    .appendChild(timeBanner)
container
    .appendChild(boardDiv)
container
    .appendChild(infoDiv)
container
    .appendChild(recordDiv)
