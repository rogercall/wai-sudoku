function fillGrid()
            {
                loadNextBoard();
                gridnum=board;
                
                var i=0,j=0;
                var row;
                var col;
                var idobject;
                while(i<9)
                {
                    j=0;
                    row=getRowCharacter(i);
                    while(j<9)
                    {
                        col=getColCharacter(j);
                        idobject=row + col;
                        //console.log("row: "+row+"col: "+col);
                        if(gridnum[i][j]==0)//if grid==0, then put blank
                        {
                            document.getElementById(idobject).innerHTML = "&nbsp;";
                        }
                        else
                        {
                            var cellNode = document.getElementById(idobject);
                            cellNode.innerHTML = gridnum[i][j];
                            $(cellNode).addClass('filled');


//							document.getElementById(cell).style.color = 'black';
                        }
                        j=j+1;
                    }
                    i=i+1;
                }
                
                color(cell,1);

		$("#inputbox").focus();
            }
