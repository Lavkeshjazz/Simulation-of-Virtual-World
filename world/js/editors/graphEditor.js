class GraphEditor{
    constructor(viewport,graph){
        this.viewport=viewport;
        this.canvas=viewport.canvas;
        this.graph=graph;

        this.ctx=this.canvas.getContext("2d");

        this.selected=null;
        this.hovered=null;
        this.dragging=false;
        this.mouse=null;  
    }

    enable(){
        this.#addEventListeners();
    }

    disable(){
        this.#removeEventListeners();
        this.selected=false;
        this.hovered=false;
    }

    #addEventListeners(){
        this.boundMouseDown= this.#handleMouseDown.bind(this);
        this.boundMouseMove= this.#handleMouseMove.bind(this);
        this.boundMouseUp= () => this.dragging = false;
        this.boundContextMenu = (evt) => evt.preventDefault();
        this.canvas.addEventListener("mousedown",this.#handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.boundMouseMove );
        this.canvas.addEventListener("mouseup",this.boundMouseUp);
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
    }

    #removeEventListeners(){
        this.canvas.removeEventListener("mousedown",this.boundMouseDown);
        this.canvas.removeEventListener("mousemove",this.boundMouseMove);
        //Getting rid of right click menue
        this.canvas.removeEventListener("contextmenu",(evt)=> evt.preventDefault());
        this.canvas.removeEventListener("mouseup", this.boundMouseUp);
    }


    #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
        if (this.dragging == true) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
     }

    #handleMouseDown(evt){
        //On right click, points should be removed
        if(evt.button==2){ //Right click
            if(this.selected){
               this.selected=null;
            } else if (this.hovered){
               this.removePoint(this.hovered);
            }
           }
           if(evt.button==0){  //Left click
          
           //These codes are added because when we are trying to select any point then instead of selecting it. It create new point around it
          
           if(this.hovered){
               this.#select(this.hovered);
               this.dragging=true; //Mouse dragging to draw points
               return;
           }
           this.graph.addPoint(this.mouse); //On clicks points will be added
           this.#select(this.mouse);
           this.hovered=this.mouse;
       }

    }

    #handleMouseUp(evt){
        this.mouse=this.viewport.getMouse(evt,true);
            this.hovered=getNearestPoint(this.mouse,this.graph.points,10*this.viewport.zoom); //this.viewport.zoom is multiplied to 10 because when we zoom out then it is really difficult us to select points as they get shrunk
            if(this.dragging==true){
                this.selected.x=this.mouse.x;
                this.selected.y=this.mouse.y;
            }
    }
    #select(point){
        if(this.selected){  //On creating new points, those points will be connected by the segment
            this.graph.tryAddSegment(new Segments(this.selected,point));
        }
        this.selected=point;
    }

    //We have to make a private removePoint function whereas a removePoint function is already present in graph.js
    //because on right clicking the segment is also removed because of this.hovered
    #removePoint(point){
        this.graph.removePoint(point);
        this.hovered=null;
        if(this.selected==point){
        this.selected=null;
        }
    }

    dispose(){
        this.graph.dispose();
        this.selected=null;
        this.hovered=null;
    }
    display(){
        this.graph.draw(this.ctx);
        if(this.hovered){
            this.hovered.draw(this.ctx,{fill:true});
        }
        if(this.selected){
            const intent=this.hovered ? this.hovered : this.mouse;
            new Segments(this.selected,intent).draw(ctx,{ dash:[3,3]});//3,3 means here 3 pixels of line with 3 pixel distance
            this.selected.draw(this.ctx,{outline:true});
        }
    }
}