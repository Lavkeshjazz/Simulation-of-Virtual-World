//We will be using Spatial/Gemoetric Graphs
//because in this graph, nodes are not just abstract thing
//whereas they represent road intersection
//or the places where the road geometery have curves

//All the points or nodes will be connected to each other by the help of segments

class Graph{
    constructor(points=[],segments=[]){
        this.points=points;
        this.segments=segments;
    }

    static load(info){
        const points=info.points.map((i)=>new Point(i.x,i.y));
        const segments=info.segments.map((i)=> new Segments(
            points.find((p) => p.equals(i.p1)),
            points.find((p) => p.equals(i.p2))
        ));  
        return new Graph(points,segments);
    }

    hash(){
        return JSON.stringify(this);
    }

    addPoint(point){
        this.points.push(point);
    }

    //Function to check that no two same points are there
    containsPoint(point){
        return this.points.find((p)=>p.equals(point));
    }
    //The find method will run loop for each and check the array p for points


    tryAddPoint(point){
        if(!this.containsPoint(point)){ //If this point is not a part of the graph at the moment then add that point 
            this.addPoint(point);
            return true;
        }
        else{
            return false;
        }
    }

    addSegment(seg){
        this.segments.push(seg);
    }

    containsSegment(seg){
        return this.segments.find((s)=>s.equals(seg));
         //The find method will run loop for each and check the array s for segment
    }

    //Function to check that no two same segments are there or drawn
    tryAddSegment(seg){
        if(!this.containsSegment(seg) && !seg.p1.equals(seg.p2)){
            this.addSegment(seg);
            return true;
        }
        else{
            return false;
        }
    }

    removeSegment(seg){
    //Splice removes elements from a give array at a given index
    this.segments.splice(this.segments.indexOf(seg),1);
    }

    removePoint(point){
        //This functionality is just added because when we are removing the points then the segment containing those point are still present on the canvas and that doesn't make any sense
        //So this functionality will remove those segments parallely those contain that points that have been recently removed
        const segs=this.getSegmentsWithPoint(point);
        for(const seg of segs){
            this.removeSegment(seg);
        }
    this.points.splice(this.points.indexOf(point),1);
    }


    getSegmentsWithPoint(point){
        const segs=[];
        for(const seg of this.segments){
            if(seg.includes(point)){
                segs.push(seg);
            }
        }
        return segs;
    }

    //This function will clear the canvas
    dispose(){
        this.points.length=0;
        this.segments.length=0;
    }


    //Drawing the nodes and the segments
    draw(ctx){
        for(const seg of this.segments){
            seg.draw(ctx);
        }

        for(const point of this.points){
            point.draw(ctx);
        }
    }
}