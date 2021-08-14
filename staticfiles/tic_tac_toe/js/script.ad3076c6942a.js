const board = document.querySelectorAll("td");
const btn = document.querySelector("button");
const ai = 'X';
const human = 'O';

function restart()
{
  for(let i=0;i<9;i++)
  {
    board[i].innerText = "";
    board[i].style.backgroundColor="#ffffff";
  }
}

btn.addEventListener('click',restart);

function isMovesLeft()
{
  for(let i=0;i<9;i++)
  {
    if(board[i].innerText=="") return true;
  }
  return false;
}

function evaluate()
{
  for(let i=0;i<3;i++)
  {
    if(board[i].innerText == board[i+3].innerText && board[i].innerText == board[i+6].innerText)
    {
      if(board[i].innerText=='O') return {val:-10, indexes:[i,i+3,i+6]};
      if(board[i].innerText=='X') return {val:10, indexes:[i,i+3,i+6]};
    }
  }

  for(let i=0;i<3;i++)
  {
    let j = 3*i;
    if(board[j].innerText == board[j+1].innerText && board[j].innerText == board[j+2].innerText)
    {
      if(board[j].innerText == 'O') return {val:-10, indexes:[j,j+1,j+2]};
      if(board[j].innerText=='X') return {val:10, indexes:[j,j+1,j+2]};
    }
    
  }

  if(board[0].innerText==board[4].innerText && board[0].innerText==board[8].innerText)
  {
    if(board[0].innerText == "O") return {val:-10, indexes:[1,4,8]};
    if(board[0].innerText == "X") return {val:10, indexes:[1,4,8]}; 
  }

  if(board[2].innerText == board[4].innerText && board[4].innerText == board[6].innerText)
  {
    if(board[2].innerText == 'O') return {val:-10, indexes:[2,4,6]};
    if(board[2].innerText == 'X') return {val:10, indexes:[2,4,6]};
  }

  return {val:0, indexes:[-1,-1,-1]};
}

function changeColor(indexes)
{
  const color = "#34eb7d";
  for(let i=0;i<indexes.length;i++) board[indexes[i]].style.backgroundColor = color;
}

function minimax(player,depth,alpha, beta)
{
  const score = evaluate().val;

  if(score==10) return score-depth;
  if(score == -10) return score+depth;
  if(!isMovesLeft()) return 0;

  if(player == ai)
  {
    let best = -1000;
    for(let i=0;i<9;i++)
    {
      if(board[i].innerText=="")
      {
        board[i].innerText = player;
        best = Math.max(best, minimax(human,depth+1));
        board[i].innerText = "";

        alpha = Math.max(best,alpha);
        if(beta<=alpha) break;
      }
    }
    return best;
  }
  else
  {
    let best = 1000;
    for(let i=0;i<9;i++)
    {
      if(board[i].innerText == "")
      {
        board[i].innerText = player;
        best = Math.min(best,minimax(ai,depth+1));
        board[i].innerText = "";

        beta = Math.min(best,beta);
        if(beta<=alpha) break;
      } 
    }
    return best;
  }
}

function findBestMove()
{
  let bestVal = -1000;
  let bestMove = -1;
  let alpha = -1000, beta = 1000;

  for(let i=0;i<9;i++)
  {
    if(board[i].innerText == "")
    {
      board[i].innerText = ai;
      let moveVal = minimax(human,0,alpha,beta);
      board[i].innerText = "";

      if(moveVal > bestVal)
      {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  
  }
  return bestMove;
}

function changeMarker()
{
  if(this.innerText != "") return;
  let score = evaluate().val;
  if(score == 10 || score == -10) return;

  this.innerText = human;
  score = evaluate().val;
  if(score==-10)
  {
    const indexes = evaluate().indexes;
    changeColor(indexes);
  }

  const nextMove = findBestMove();
  if(nextMove == -1) return;
  board[nextMove].innerText = ai;
  score = evaluate().val;
  if(score == 10)
  {
    const indexes = evaluate().indexes;
    changeColor(indexes);
  }
}

for(let i=0;i<9;i++)
{
  board[i].addEventListener('click', changeMarker);
}
