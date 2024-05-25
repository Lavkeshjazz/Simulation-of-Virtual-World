class Point{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }


    equals(point){
        return this.x==point.x && this.y==point.y;
    }
    //Only be true when point and x,y are same


    draw(ctx,{size=18,color="black",outline=false,fill=false}={}){       //Added everything under {} because it is created now as object, otherwise earlier it was parameters and if there was many parameters then it was a tough job to remember the exact manner in which parameter is present. But in object the sequence in which parameters are arranged doesn't matter at all
        const rad=size/2;
        ctx.beginPath();
        ctx.fillStyle=color;
        ctx.arc(this.x,this.y,rad,0,Math.PI*2 ); //Giving a round shape to points
        ctx.fill();
        //This will create a stroke around selected point
        if(outline){
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.arc(this.x,this.y,rad*0.6,0,Math.PI*2);
            ctx.stroke();
        }
        if(fill){
            ctx.beginPath();
            ctx.arc(this.x,this.y,rad*0.4,0,Math.PI*2);
            ctx.fillStyle="yellow";
            ctx.fill();
        }
    }
}